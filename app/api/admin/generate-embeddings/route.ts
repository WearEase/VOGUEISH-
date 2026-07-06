import { NextResponse } from "next/server";
import { Product } from "@/models/Product";
import { connectDB } from "@/lib/db";
import { encodeImage } from "@/lib/embeddings/openclip";

export async function POST() {
  try {
    await connectDB();
    
    // Find products without image embeddings
    const products = await Product.find({ 
      imageEmbedding: { $exists: false } 
    }).limit(50); // Process in batches of 50
    
    if (products.length === 0) {
      return NextResponse.json({ message: "No products need embeddings" });
    }

    let successCount = 0;
    let failedCount = 0;

    for (const product of products) {
      try {
        if (product.mainImage) {
          const embedding = await encodeImage(product.mainImage);
          product.imageEmbedding = embedding;
          await product.save();
          successCount++;
        } else {
          failedCount++;
        }
      } catch (err) {
        console.error(`Failed to encode image for product ${product._id}`, err);
        failedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: products.length,
      successCount,
      failedCount
    });

  } catch (error) {
    console.error("Bulk Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 });
  }
}
