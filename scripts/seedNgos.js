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

// Predefined coordinates for Delhi areas
const AREA_COORDINATES = {
  "yusuf sarai": { lat: 28.5604, lon: 77.2057 },
  "mahipalpur": { lat: 28.5482, lon: 77.1232 },
  "hauz khas": { lat: 28.5494, lon: 77.2001 },
  "gautam nagar": { lat: 28.5644, lon: 77.2110 },
  "panchsheel park": { lat: 28.5422, lon: 77.2140 },
  "east of kailash": { lat: 28.5583, lon: 77.2514 },
  "kailash colony": { lat: 28.5517, lon: 77.2435 },
  "rk puram": { lat: 28.5663, lon: 77.1764 },
  "laxmi nagar": { lat: 28.6304, lon: 77.2777 },
  "paharganj": { lat: 28.6433, lon: 77.2155 },
  "subzi mandi": { lat: 28.6675, lon: 77.2023 },
  "model town": { lat: 28.7027, lon: 77.1938 },
  "moti nagar": { lat: 28.6579, lon: 77.1424 },
  "vishnu garden": { lat: 28.6477, lon: 77.1009 },
  "new ashok nagar": { lat: 28.5910, lon: 77.3023 },
  "sarvodaya enclave": { lat: 28.5392, lon: 77.2033 },
  "mayur vihar": { lat: 28.6181, lon: 77.2995 },
  "patparganj": { lat: 28.6181, lon: 77.2995 },
  "jnu": { lat: 28.5397, lon: 77.1663 },
  "malviya nagar": { lat: 28.5284, lon: 77.2062 },
  "sangam vihar": { lat: 28.5034, lon: 77.2289 },
  "devli": { lat: 28.5034, lon: 77.2289 },
  "civil lines": { lat: 28.6829, lon: 77.2238 },
  "pitampura": { lat: 28.6990, lon: 77.1384 },
  "punjabi bagh": { lat: 28.6702, lon: 77.1264 },
  "kirti nagar": { lat: 28.6493, lon: 77.1437 },
  "nawada": { lat: 28.6214, lon: 77.0427 },
  "kalkaji": { lat: 28.5402, lon: 77.2588 },
  "dwarka": { lat: 28.5921, lon: 77.0460 },
  "uttam nagar": { lat: 28.6219, lon: 77.0601 },
  "mehrauli": { lat: 28.5173, lon: 77.1821 },
  "jahangirpuri": { lat: 28.7303, lon: 77.1705 },
  "jasola vihar": { lat: 28.5458, lon: 77.2882 },
  "green park": { lat: 28.5584, lon: 77.2039 },
  "rohini": { lat: 28.7083, lon: 77.1179 },
  "narela": { lat: 28.8527, lon: 77.0945 },
  "bawana": { lat: 28.8020, lon: 77.0371 },
  "burari": { lat: 28.7516, lon: 77.2015 },
  "alipur": { lat: 28.7997, lon: 77.1332 },
  "nangloi": { lat: 28.6836, lon: 77.0673 },
  "sultanpuri": { lat: 28.6974, lon: 77.0805 },
  "kirari": { lat: 28.7008, lon: 77.0560 },
  "mundka": { lat: 28.6766, lon: 77.0266 },
  "karala": { lat: 28.7346, lon: 77.0422 },
  "budh vihar": { lat: 28.7089, lon: 77.0924 },
  "paschim vihar": { lat: 28.6750, lon: 77.0950 },
  "rani khera": { lat: 28.7533, lon: 77.0471 },
  "adarsh nagar": { lat: 28.7160, lon: 77.1706 },
  "azadpur": { lat: 28.7071, lon: 77.1755 },
  "mukherjee nagar": { lat: 28.6946, lon: 77.2144 },
  "gtb nagar": { lat: 28.6934, lon: 77.2057 },
  "shalimar bagh": { lat: 28.7126, lon: 77.1585 },
  "ashok vihar": { lat: 28.6925, lon: 77.1724 },
  "shakurpur": { lat: 28.6883, lon: 77.1328 },
  "tri nagar": { lat: 28.6830, lon: 77.1558 },
  "ramesh nagar": { lat: 28.6479, lon: 77.1309 },
  "neb sarai": { lat: 28.5085, lon: 77.1996 },
  "badarpur": { lat: 28.5042, lon: 77.3009 },
  "shahdara": { lat: 28.6738, lon: 77.2885 },
  "krishna nagar": { lat: 28.6521, lon: 77.2829 },
  "preet vihar": { lat: 28.6418, lon: 77.2917 },
  "geeta colony": { lat: 28.6482, lon: 77.2721 },
  "mandawali": { lat: 28.6256, lon: 77.2968 },
  "janakpuri": { lat: 28.6226, lon: 77.0782 },
  "najafgarh": { lat: 28.6090, lon: 76.9859 },
  "karol bagh": { lat: 28.6514, lon: 77.1903 },
  "patel nagar": { lat: 28.6542, lon: 77.1610 },
  "daryaganj": { lat: 28.6418, lon: 77.2407 },
  "connaught place": { lat: 28.6304, lon: 77.2177 },
  "university area": { lat: 28.6889, lon: 77.2104 },
  "shakarpur": { lat: 28.6304, lon: 77.2777 },
  "delhi university": { lat: 28.6889, lon: 77.2104 },
  "rani bagh": { lat: 28.6990, lon: 77.1384 },
  "netaji subhash place": { lat: 28.6990, lon: 77.1384 }
};

function getCoordinatesForArea(area) {
  const clean = area.toLowerCase().trim();
  for (const [key, coords] of Object.entries(AREA_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }
  return null;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Define NGO schema and model for script execution
const NgoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String },
  lat: { type: Number },
  lon: { type: Number },
}, { timestamps: true });

const NGO = mongoose.models.NGO || mongoose.model('NGO', NgoSchema, 'ngos');

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    const csvPath = path.join(__dirname, '../public/VOGUEISH NGOs Sheet - Sheet1.csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    console.log("Reading CSV file...");
    const csvText = fs.readFileSync(csvPath, 'utf8');
    const lines = csvText.split(/\r?\n/);
    const parsedNGOs = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      const cols = parseCSVLine(line);
      if (cols.length < 2) continue;
      
      let [name, area, address] = cols;
      if (!area || !name) continue;
      
      const nameLower = name.toLowerCase();
      const areaLower = area.toLowerCase();
      if (
        nameLower === 'ngo name' || 
        nameLower === 'ngo' || 
        nameLower === 'area' || 
        areaLower === 'area' || 
        areaLower === 'ngo' ||
        nameLower.includes("belt") ||
        (nameLower.includes("delhi") && area === "" && address === "")
      ) {
        continue;
      }
      
      name = name.replace(/^"|"$/g, '').trim();
      area = area.replace(/^"|"$/g, '').trim();
      address = (address || "").replace(/^"|"$/g, '').trim();
      
      const coords = getCoordinatesForArea(area);
      const lat = coords ? coords.lat : 28.6139;
      const lon = coords ? coords.lon : 77.2090;
      
      parsedNGOs.push({ name, area, address, lat, lon });
    }

    console.log(`Parsed ${parsedNGOs.length} NGOs. Clearing existing collection...`);
    await NGO.deleteMany({});
    console.log("Existing collection cleared.");

    console.log("Inserting NGOs into database...");
    const result = await NGO.insertMany(parsedNGOs);
    console.log(`Successfully seeded ${result.length} NGOs to MongoDB collection 'ngos'!`);

  } catch (err) {
    console.error("Execution error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

main();
