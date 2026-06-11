const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

async function testScrape() {
  console.log("Scraping Men's collection markdown...");
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://www.lashkaraa.in/collections/men',
        formats: ["markdown"],
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
    if (data.success && data.data && data.data.markdown) {
      fs.writeFileSync(path.join(__dirname, '../scratch/test_men.md'), data.data.markdown, 'utf-8');
      console.log("Successfully wrote markdown to scratch/test_men.md!");
    } else {
      console.log("Response structure:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

testScrape();
