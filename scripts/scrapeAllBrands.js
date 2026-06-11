const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env.local.");
  process.exit(1);
}

// Define Product schema and model for script execution
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  realPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  mainImage: { type: String, required: true },
  extraImage1: { type: String },
  extraImage2: { type: String },
  extraImage3: { type: String },
  extraImage4: { type: String },
  brand: { type: String, required: true },
  slug: { type: String, required: true },
  sizesAvailable: { type: [String], default: [] },
  popularityRank: { type: Number },
  rating: { type: Number },
  arrivalDate: { type: String },
  gender: { type: String },
  collectionType: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');

const targets = [
  // WOMEN
  {
    brand: "Shree",
    gender: "Women",
    collectionType: "Kurtis & Kurtas",
    url: "https://byshree.com/collections/kurtis-and-kurtas/products.json?limit=30"
  },
  {
    brand: "Shree",
    gender: "Women",
    collectionType: "Ethnic Sets",
    url: "https://byshree.com/collections/ethnic-sets-with-dupatta/products.json?limit=30"
  },
  {
    brand: "Nishorama",
    gender: "Women",
    collectionType: "Most Wanted",
    url: "https://www.nishorama.com/collections/most-wanted/products.json?limit=30"
  },
  {
    brand: "Shopapara",
    gender: "Women",
    collectionType: "Sale",
    url: "https://shopapara.net/collections/the-archive-edit-sale/products.json?limit=30"
  },
  {
    brand: "Lazo Store",
    gender: "Women",
    collectionType: "Shirts",
    url: "https://lazostore.in/collections/shirts-1/products.json?limit=30"
  },
  {
    brand: "Lazo Store",
    gender: "Women",
    collectionType: "Pants",
    url: "https://lazostore.in/collections/pants-2-0/products.json?limit=30"
  },
  {
    brand: "Six Four Six",
    gender: "Women",
    collectionType: "Womenswear",
    url: "https://sixfoursix.in/collections/womens/products.json?limit=30"
  },
  {
    brand: "Syuti Kalaa",
    gender: "Women",
    collectionType: "Coord Sets",
    url: "https://syutikalaa.myshopify.com/collections/coord-sets/products.json?limit=30"
  },
  {
    brand: "Torr",
    gender: "Women",
    collectionType: "Ethnic Wear",
    url: "https://torr.com.bd/collections/ethnic/products.json?limit=30"
  },
  {
    brand: "Urbano",
    gender: "Women",
    collectionType: "Korean Trousers",
    url: "https://www.urbanofashion.com/collections/womens-korean-trousers/products.json?limit=30"
  },
  {
    brand: "Bliss Club",
    gender: "Women",
    collectionType: "All Day Wear",
    url: "https://blissclub.com/collections/all-day-wear-1/products.json?limit=30"
  },
  {
    brand: "Bliss Club",
    gender: "Women",
    collectionType: "Travelwear",
    url: "https://blissclub.com/collections/travelwear-collection/products.json?limit=30"
  },

  // MEN
  {
    brand: "Bliss Club",
    gender: "Men",
    collectionType: "Menswear",
    url: "https://blissclub.com/collections/menswear-collection/products.json?limit=30"
  },
  {
    brand: "Urbano",
    gender: "Men",
    collectionType: "T-shirts",
    url: "https://www.urbanofashion.com/collections/mens-t-shirts/products.json?limit=30"
  },
  {
    brand: "Six Four Six",
    gender: "Men",
    collectionType: "Menswear",
    url: "https://sixfoursix.in/collections/mens/products.json?limit=30"
  },
  {
    brand: "Torr",
    gender: "Men",
    collectionType: "Menswear",
    url: "https://torr.com.bd/collections/mens-collection/products.json?limit=30"
  },
  {
    brand: "Clazep",
    gender: "Men",
    collectionType: "Summer Collection",
    url: "https://clazep.in/collections/summer-collection/products.json?limit=30"
  }
];

function cleanHtmlDescription(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, ' ') // replace tags with spaces
    .replace(/\s+/g, ' ')     // collapse multiple spaces
    .trim();
}

function parsePriceVal(priceStr) {
  if (!priceStr) return 0;
  const cleanStr = String(priceStr).replace(/,/g, '');
  const match = cleanStr.match(/\d+(\.\d+)?/);
  if (match) {
    const num = Math.round(parseFloat(match[0]));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

// Convert BDT to INR approximately (multiply by 0.75) for Torr brand
function convertCurrencyIfNeeded(price, brand) {
  if (brand.toLowerCase() === 'torr') {
    return Math.round(price * 0.75);
  }
  return price;
}

function extractSizes(shopifyProduct) {
  // Try options first
  const sizeOption = shopifyProduct.options?.find(o => o.name?.toLowerCase() === 'size');
  if (sizeOption && sizeOption.values?.length > 0) {
    return sizeOption.values.map(val => {
      // Clean values like "XS/36" -> "XS", or keep standard like "XL"
      const match = val.match(/^(XXS|XS|S|M|L|XL|XXL|XXXL|3XL|4XL|5XL)/i);
      return match ? match[0].toUpperCase() : val;
    });
  }
  
  // Try variants option1 values
  const sizes = new Set();
  shopifyProduct.variants?.forEach(v => {
    if (v.option1) {
      const match = v.option1.match(/^(XXS|XS|S|M|L|XL|XXL|XXXL|3XL|4XL|5XL)/i);
      sizes.add(match ? match[0].toUpperCase() : v.option1);
    }
  });
  
  if (sizes.size > 0) {
    return Array.from(sizes);
  }
  
  return ["S", "M", "L", "XL"];
}

async function scrapeCollection(target, idx) {
  console.log(`[${idx + 1}/${targets.length}] Fetching ${target.brand} (${target.gender} - ${target.collectionType}) from: ${target.url}`);
  try {
    const res = await fetch(target.url);
    if (!res.ok) {
      console.warn(`Failed to fetch from ${target.url}, status code: ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (!data.products || data.products.length === 0) {
      console.warn(`No products found for ${target.brand} (${target.collectionType})`);
      return [];
    }

    // Slice first 15 products as requested
    const rawProducts = data.products.slice(0, 15);
    const mapped = rawProducts.map((p, pIdx) => {
      const discountedRaw = parsePriceVal(p.variants?.[0]?.price);
      const realRaw = parsePriceVal(p.variants?.[0]?.compare_at_price) || discountedRaw;

      const discountedPrice = convertCurrencyIfNeeded(discountedRaw, target.brand);
      const realPrice = convertCurrencyIfNeeded(realRaw, target.brand);

      // Generate sizes
      const sizes = extractSizes(p);

      // Construct images
      const mainImage = p.images?.[0]?.src || "";
      const extraImage1 = p.images?.[1]?.src || "";
      const extraImage2 = p.images?.[2]?.src || "";
      const extraImage3 = p.images?.[3]?.src || "";
      const extraImage4 = p.images?.[4]?.src || "";

      return {
        id: `${target.gender.toLowerCase()}-${target.brand.replace(/\s+/g, '-').toLowerCase()}-${p.id}`,
        name: p.title,
        description: cleanHtmlDescription(p.body_html) || `${p.title} - premium designer wear from ${target.brand}.`,
        realPrice,
        discountedPrice,
        mainImage,
        extraImage1,
        extraImage2,
        extraImage3,
        extraImage4,
        brand: target.brand,
        slug: p.handle,
        sizesAvailable: sizes,
        popularityRank: pIdx + 1,
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
        arrivalDate: new Date().toISOString().split('T')[0],
        gender: target.gender,
        collectionType: target.collectionType
      };
    });

    console.log(`Successfully mapped ${mapped.length} products for ${target.brand}.`);
    return mapped;
  } catch (err) {
    console.error(`Error fetching collection from ${target.url}:`, err.message);
    return [];
  }
}

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    let allScraped = [];

    // Scrape all brand URLs
    for (let i = 0; i < targets.length; i++) {
      const products = await scrapeCollection(targets[i], i);
      allScraped = allScraped.concat(products);
      // Wait 1 second to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Total scraped products: ${allScraped.length}`);

    // Load local existing products from data/products.ts
    console.log("Loading local products from data/products.ts...");
    let localProducts = [];
    const productsFilePath = path.join(__dirname, '../data/products.ts');
    if (fs.existsSync(productsFilePath)) {
      const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
      const startIdx = fileContent.indexOf('[');
      const endIdx = fileContent.lastIndexOf(']') + 1;
      if (startIdx > -1 && endIdx > -1) {
        const arrayStr = fileContent.substring(startIdx, endIdx);
        try {
          localProducts = eval(arrayStr);
          console.log(`Loaded ${localProducts.length} local products.`);
        } catch (evalErr) {
          console.error("Error parsing data/products.ts using eval:", evalErr.message);
        }
      }
    }

    // Standardize local products if missing collectionType (fallback to gender + Brand name)
    const processedLocal = localProducts.map(p => {
      if (!p.collectionType) {
        p.collectionType = p.gender === 'Women' ? 'Lehengas & Sarees' : 'Sherwanis & Kurtas';
      }
      return p;
    });

    // Merge and upsert all products into MongoDB
    const combinedProducts = [...processedLocal, ...allScraped];
    console.log(`Starting upsert of ${combinedProducts.length} combined products into MongoDB...`);

    let upsertCount = 0;
    for (const prod of combinedProducts) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, new: true }
      );
      upsertCount++;
      if (upsertCount % 20 === 0) {
        console.log(`Upserted ${upsertCount}/${combinedProducts.length} products...`);
      }
    }

    console.log(`Successfully seeded/upserted ${combinedProducts.length} products to MongoDB collection 'products'!`);
  } catch (err) {
    console.error("Execution error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

main();
