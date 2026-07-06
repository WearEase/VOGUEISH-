import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { NGO } from '@/models/NGO';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const ngos = await NGO.find({}).lean();
    return NextResponse.json(ngos);
  } catch (error) {
    console.error("API error fetching NGOs:", error);
    return NextResponse.json({ error: 'Failed to fetch NGOs' }, { status: 500 });
  }
}
