import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { HomeTrialModel } from '@/models/HomeTrial';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, vendorStatus, otpVerified, itemsBought } = body;

    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (vendorStatus !== undefined) updateData.vendorStatus = vendorStatus;
    if (otpVerified !== undefined) updateData.otpVerified = otpVerified;
    if (itemsBought !== undefined) updateData.itemsBought = itemsBought;

    const updatedTrial = await HomeTrialModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedTrial) {
      return NextResponse.json({ error: 'Home Trial not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTrial);
  } catch (error) {
    console.error("API error updating Home Trial:", error);
    return NextResponse.json({ error: 'Failed to update Home Trial' }, { status: 500 });
  }
}
