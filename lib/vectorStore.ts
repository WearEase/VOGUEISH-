import { Product } from "@/models/Product";
import { connectDB } from "./db";

export async function searchVectors(
  queryEmbedding: number[],
  filter: Record<string, unknown> = {},
  k = 10
) {
  await connectDB();
  
  // Need to use the native aggregate for $vectorSearch
  // Make sure the index name matches what is created in Atlas Vector Search
  const products = await Product.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "imageEmbedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: k,
        filter: filter
      }
    }
  ]);
  
  return products;
}
