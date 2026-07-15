/**
 * Fused embedding = 0.6 × imageEmbedding + 0.4 × textEmbedding
 * This runs during product indexing, not at query time.
 * Both vectors are L2-normalised before fusion so neither dominates by magnitude.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { encodeImage, encodeText } from '../lib/embeddings/openclip';

// ── Helpers ──────────────────────────────────────────────────────────────────

function l2Normalise(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm === 0 ? v : v.map(x => x / norm);
}

/**
 * Fuse image + text embeddings.
 * Both are unit-normalised first so the blend is purely directional.
 * 60% image (visual appearance) + 40% text (semantic category/name).
 */
function fuseEmbeddings(imgEmb: number[], textEmb: number[]): number[] {
  const normImg  = l2Normalise(imgEmb);
  const normText = l2Normalise(textEmb);
  const fused    = normImg.map((v, i) => 0.6 * v + 0.4 * normText[i]);
  return l2Normalise(fused); // normalise final vector too
}

/**
 * Build a rich text description for a product to embed as the text side.
 * More descriptive = better semantic alignment.
 */
function buildProductText(p: {
  name: string;
  brand: string;
  collectionType?: string;
  gender?: string;
  metadata?: { category?: string; color?: string; occasion?: string };
  description?: string;
}): string {
  const parts: string[] = [];
  if (p.name)               parts.push(p.name);
  if (p.brand)              parts.push(`by ${p.brand}`);
  if (p.collectionType)     parts.push(p.collectionType);
  if (p.gender)             parts.push(`for ${p.gender}`);
  if (p.metadata?.category) parts.push(p.metadata.category);
  if (p.metadata?.color)    parts.push(p.metadata.color);
  if (p.metadata?.occasion) parts.push(`occasion: ${p.metadata.occasion}`);
  // Include first 120 chars of description for additional semantic richness
  if (p.description)        parts.push(p.description.slice(0, 120));
  return parts.join(', ');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.\n");

    const batchSize = 10; // smaller batches = easier to restart
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalFailed = 0;

    while (true) {
      // Fetch products that still have no imageEmbedding
      const products = await Product.find({
        imageEmbedding: { $exists: false },
        mainImage: { $exists: true, $ne: "" },
      }).limit(batchSize).lean();

      if (products.length === 0) {
        console.log("✅ All products have been embedded.");
        break;
      }

      console.log(`\nProcessing ${products.length} products (${totalProcessed} done so far)...`);

      for (const product of products) {
        const productText = buildProductText(product as any);
        console.log(`  → [${product.name}]`);
        console.log(`     Text: "${productText.slice(0, 80)}..."`);

        try {
          // 1. Image embedding (visual appearance)
          console.log(`     Encoding image...`);
          const imgEmb = await encodeImage(product.mainImage);
          await new Promise(r => setTimeout(r, 35000)); // 35s pause to prevent rate limit

          // 2. Text embedding (semantic category/name)
          console.log(`     Encoding text...`);
          const txtEmb = await encodeText(productText);
          await new Promise(r => setTimeout(r, 35000)); // 35s pause to prevent rate limit

          // 3. Fuse: 60% image + 40% text, both L2-normalised
          const fused = fuseEmbeddings(imgEmb, txtEmb);

          // 4. Save fused vector as imageEmbedding
          await Product.updateOne(
            { _id: product._id },
            { $set: { imageEmbedding: fused } }
          );

          console.log(`     ✅ Saved (${fused.length}-dim fused embedding)`);
          totalSuccess++;

        } catch (err: any) {
          console.error(`     ❌ Failed: ${err.message}`);
          totalFailed++;

          if (err.message?.includes('429')) {
            console.log("     Rate limit hit — waiting 60s...");
            await new Promise(r => setTimeout(r, 60000));
          } else if (err.message?.includes('402') || err.message?.includes('balance')) {
            console.error("     ⛔ Jina AI out of credits. Stopping.");
            break;
          } else {
            await new Promise(r => setTimeout(r, 5000));
          }
        }
      }

      totalProcessed += products.length;
      console.log(`\nBatch done. ✅ ${totalSuccess} success, ❌ ${totalFailed} failed. Total: ${totalProcessed}`);
    }

    // Final count
    const withEmb = await Product.countDocuments({ imageEmbedding: { $exists: true } });
    const total   = await Product.countDocuments();
    console.log(`\nFinal: ${withEmb}/${total} products embedded.`);

  } catch (error) {
    console.error("Fatal error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB.");
  }
}

run();
