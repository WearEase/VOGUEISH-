import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { HomeTrialModel } from '@/models/HomeTrial';
import { User } from '@/models/UserSchema';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    await connectDB();
    const trials = await HomeTrialModel.find({ userEmail: email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(trials);
  } catch (error) {
    console.error("API error fetching Home Trials:", error);
    return NextResponse.json({ error: 'Failed to fetch Home Trials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      userEmail,
      fullName,
      phone,
      addressLine1,
      pincode,
      date,
      timeSlot,
      serviceType,
      items,
    } = body;

    if (!id || !userEmail || !fullName || !phone || !addressLine1 || !pincode || !date || !timeSlot || !serviceType || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newTrial = await HomeTrialModel.create({
      id,
      userEmail,
      fullName,
      phone,
      addressLine1,
      pincode,
      date,
      timeSlot,
      serviceType,
      items,
      status: 'Pending',
      vendorStatus: 'Stylist is on the way',
      otpVerified: false,
      itemsBought: [],
    });

    // Push this trial's _id into the user's homeTrials array
    await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { homeTrials: newTrial._id } }
    );

    return NextResponse.json(newTrial, { status: 201 });
  } catch (error) {
    console.error("API error creating Home Trial:", error);
    return NextResponse.json({ error: 'Failed to create Home Trial' }, { status: 500 });
  }
}
