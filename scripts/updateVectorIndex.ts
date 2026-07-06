import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { Product } from '../models/Product';

async function updateIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to DB.");

    console.log("Fetching existing search indexes...");
    const indexes = await Product.collection.listSearchIndexes().toArray();
    console.log("Current indexes:", indexes.map(i => i.name));

    if (indexes.find(i => i.name === 'vector_index')) {
      console.log("Dropping existing 'vector_index'...");
      await Product.collection.dropSearchIndex('vector_index');
      console.log("Waiting for drop to propagate...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log("Creating new 'vector_index' with 768 dimensions...");
    
    // Using the raw MongoDB Node driver syntax for Atlas Vector Search index creation
    await Product.collection.createSearchIndex({
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "imageEmbedding",
            numDimensions: 768,
            similarity: "cosine" // Or dotProduct / euclidean depending on Jina
          }
        ]
      }
    });

    console.log("Vector index created successfully! Note: It may take a few minutes for Atlas to fully build the index in the background.");
  } catch (error) {
    console.error("Failed to update index:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB.");
  }
}

updateIndex();
