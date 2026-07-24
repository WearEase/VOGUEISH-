/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { User } from '@/models/UserSchema';

// Connect to DB helper
async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// GET: Fetch all saved addresses for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).lean() as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new address to the user's profile
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newAddress = await req.json();

    // Basic validation
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    await connectDB();
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { addresses: newAddress } },
      { new: true }
    ) as any;

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the newly added address (the last one in the array)
    const addedAddress = updatedUser.addresses[updatedUser.addresses.length - 1];

    return NextResponse.json({ address: addedAddress }, { status: 201 });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

