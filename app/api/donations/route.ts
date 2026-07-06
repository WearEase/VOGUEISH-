import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DonationModel } from '@/models/Donation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    await connectDB();
    const donations = await DonationModel.find({ userEmail: email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(donations);
  } catch (error) {
    console.error("API error fetching Donations:", error);
    return NextResponse.json({ error: 'Failed to fetch Donations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      userEmail,
      ngoName,
      pickupDate,
      timeSlot,
      itemType,
      linkedTrialId,
    } = body;

    if (!id || !userEmail || !ngoName || !pickupDate || !timeSlot || !itemType || !linkedTrialId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newDonation = await DonationModel.create({
      id,
      userEmail,
      ngoName,
      pickupDate,
      timeSlot,
      itemType,
      linkedTrialId,
      status: 'Pickup Scheduled',
    });

    return NextResponse.json(newDonation, { status: 201 });
  } catch (error) {
    console.error("API error creating Donation:", error);
    return NextResponse.json({ error: 'Failed to create Donation' }, { status: 500 });
  }
}
