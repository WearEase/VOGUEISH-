import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getUserPreferences } from "@/lib/preference/repo";
import { encodeImages, encodeText } from "@/lib/embeddings/openclip";
import { searchVectors } from "@/lib/vectorStore";
import { extractPreferences } from "@/lib/preference/parser";

// ── Helpers ──────────────────────────────────────────────────────────────────

function l2Normalise(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm === 0 ? v : v.map(x => x / norm);
}

/**
 * Query Fusion: blend the uploaded-image vector with the user's text/style vector.
 * α controls how much the image dominates (0.7 = strong image intent).
 * Both inputs are normalised so neither skews by magnitude.
 */
function fuseQueryVectors(
  imageEmb: number[],
  textEmb: number[],
  imageWeight = 0.7
): number[] {
  const normImg  = l2Normalise(imageEmb);
  const normText = l2Normalise(textEmb);
  const fused    = normImg.map((v, i) => imageWeight * v + (1 - imageWeight) * normText[i]);
  return l2Normalise(fused);
}

/** Average a set of embeddings (for multi-image queries). */
function averageEmbeddings(embs: number[][]): number[] {
  const dim = embs[0].length;
  const avg = new Array(dim).fill(0);
  for (const emb of embs) {
    for (let i = 0; i < dim; i++) avg[i] += emb[i];
  }
  return avg.map(v => v / embs.length);
}

/** Build a rich text query from extracted preferences. */
function buildTextQuery(pref: {
  styles?: string[];
  occasions?: string[];
  colors?: string[];
  gender?: string;
}, rawText?: string): string {
  const parts: string[] = [];
  if (pref.styles?.length)    parts.push(pref.styles.join(" "));
  if (pref.occasions?.length) parts.push(pref.occasions.join(" "));
  if (pref.colors?.length)    parts.push(pref.colors.join(" "));
  if (pref.gender)            parts.push(`for ${pref.gender}`);
  if (rawText)                parts.push(rawText);
  return parts.filter(Boolean).join(", ");
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const session = await getServerSession();

  try {
    const { text, imageUrl, imageUrls } = await req.json();

    // 1. Get stored user preferences
    // @ts-expect-error Session user type does not include id or _id by default in next-auth
    const userId = session?.user?.id || session?.user?._id;
    const storedPref = userId ? await getUserPreferences(userId) : null;
    const pref = storedPref || extractPreferences(text || "");

    // 2. Build embeddings
    let queryEmb: number[] | null = null;

    const imagesToEncode = imageUrls || (imageUrl ? [imageUrl] : []);
    const textQuery = buildTextQuery(pref, text);

    try {
      if (imagesToEncode.length > 0) {
        // --- Path A: Image upload (with optional query fusion) ---
        const imageEmbeddings = await encodeImages(imagesToEncode);
        const avgImageEmb = averageEmbeddings(imageEmbeddings);

        if (textQuery) {
          // Query fusion: 70% visual (what the user is showing) + 30% preferences (style/occasion/color)
          const textEmb = await encodeText(textQuery);
          queryEmb = fuseQueryVectors(avgImageEmb, textEmb, 0.7);
          console.log("[Recommendations] Mode: IMAGE + QUERY FUSION (70% img / 30% text)");
        } else {
          // Pure image search — no text prefs to blend
          queryEmb = l2Normalise(avgImageEmb);
          console.log("[Recommendations] Mode: PURE IMAGE SEARCH");
        }

      } else if (textQuery) {
        // --- Path B: Text-only search ---
        queryEmb = await encodeText(textQuery);
        console.log("[Recommendations] Mode: TEXT ONLY");
      }

    } catch (embeddingError) {
      console.warn("[Recommendations] Embedding failed:", embeddingError instanceof Error ? embeddingError.message : String(embeddingError));
    }

    if (!queryEmb) {
      return NextResponse.json({ recommendations: [] });
    }

    // 3. Vector search in Atlas
    const filter: Record<string, unknown> = {};
    if (pref.gender) filter["gender"] = pref.gender;

    // Fetch more candidates to ensure we have enough left after JS filtering
    let candidates = await searchVectors(queryEmb, filter, 30);

    // Apply strict keyword/category filtering if specified
    if (pref.categories && pref.categories.length > 0) {
      candidates = candidates.filter((p: { name?: string; description?: string; metadata?: { category?: string } }) => {
        const pName = (p.name || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const pCat = (p.metadata?.category || "").toLowerCase();
        
        return pref.categories!.some((c: string) => 
          pName.includes(c) || pDesc.includes(c) || pCat.includes(c)
        );
      });
    }

    // 4. Hybrid re-scoring
    // Vector search already ranks by cosine similarity.
    // We add a small preference-alignment bonus on top.
    const scored = candidates.map((p: { discountedPrice: number; name?: string; metadata?: { color?: string; occasion?: string } }, idx: number) => {
      // Base: position from vector search (best = 1.0, #20 = 0.0)
      const vectorScore = 1 - idx / candidates.length;

      // Preference bonus
      let prefBonus = 0;
      if (pref.budget?.max && p.discountedPrice <= pref.budget.max) prefBonus += 0.3;
      if (pref.budget?.min && p.discountedPrice >= pref.budget.min) prefBonus += 0.1;
      if (pref.colors?.some((c: string) =>
        p.name?.toLowerCase().includes(c.toLowerCase()) ||
        p.metadata?.color?.toLowerCase().includes(c.toLowerCase())
      )) prefBonus += 0.3;
      if (pref.occasions?.some((o: string) =>
        p.metadata?.occasion?.toLowerCase().includes(o.toLowerCase())
      )) prefBonus += 0.2;

      // Final score: 80% vector similarity + 20% preference match
      const finalScore = 0.8 * vectorScore + 0.2 * Math.min(prefBonus, 1);
      return { product: p, score: finalScore };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 4).map(s => s.product); // cap at top 4 most relevant

    return NextResponse.json({ recommendations: top });

  } catch (error) {
    console.error("[Recommendations] Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
