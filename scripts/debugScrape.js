const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

async function debugScrape() {
  console.log("Scraping Men's category raw JSON...");
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://www.lashkaraa.in/collections/men',
        formats: ["json"],
        jsonOptions: {
          schema: {
            type: "object",
            properties: {
              products: {
                type: "array",
                description: "Array of clothes/outfits/products visible on the collection page",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    realPrice: { type: "string" },
                    discountedPrice: { type: "string" },
                    mainImage: { type: "string" },
                    extraImage1: { type: "string" },
                    extraImage2: { type: "string" },
                    brand: { type: "string" },
                    sizesAvailable: { 
                      type: "array", 
                      items: { type: "string" } 
                    }
                  },
                  required: ["name", "discountedPrice", "mainImage"]
                }
              }
            },
            required: ["products"]
          }
        },
        waitFor: 5000,
        timeout: 90000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firecrawl error: ${response.status} - ${errorText}`);
      return;
    }

    const data = await response.json();
    fs.writeFileSync(path.join(__dirname, '../scratch/raw_men.json'), JSON.stringify(data, null, 2), 'utf-8');
    console.log("Successfully wrote raw JSON to scratch/raw_men.json!");
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

debugScrape();
