const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  firstName: String,
  lastName: String,
  businessName: String,
  gst: String,
  phone: String,
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const rawPassword = 'Password123!';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Seed Demo Buyer
    const buyerEmail = 'buyer@demo.com';
    await User.findOneAndUpdate(
      { email: buyerEmail },
      {
        email: buyerEmail,
        name: 'Demo Buyer',
        firstName: 'Demo',
        lastName: 'Buyer',
        password: hashedPassword,
        role: 'buyer',
        phone: '9999999999',
        isVerified: true,
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Demo Buyer Seeded: ${buyerEmail} / ${rawPassword}`);

    // Seed Demo Seller
    const sellerEmail = 'seller@demo.com';
    await User.findOneAndUpdate(
      { email: sellerEmail },
      {
        email: sellerEmail,
        name: 'Demo Seller',
        businessName: 'Demo Store Pvt Ltd',
        gst: '22AAAAA0000A1Z5',
        password: hashedPassword,
        role: 'seller',
        phone: '8888888888',
        isVerified: true,
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Demo Seller Seeded: ${sellerEmail} / ${rawPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedUsers();
