import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { NGO } from '@/models/NGO';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');
    const area = searchParams.get('area');

    await connectDB();

    // Option B: exact pincode match (highest priority)
    if (pincode) {
      const byPincode = await NGO.find({ pincode }).lean();
      if (byPincode.length > 0) {
        return NextResponse.json(byPincode);
      }
    }

    // Option A: fuzzy area match (fallback — matches area field against the query string)
    if (area) {
      const escaped = area.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // First try exact area match
      let byArea = await NGO.find({ area: { $regex: `^${escaped}$`, $options: 'i' } }).lean();
      // Then try partial match if no results
      if (byArea.length === 0) {
        byArea = await NGO.find({ area: { $regex: escaped, $options: 'i' } }).lean();
      }
      if (byArea.length > 0) {
        return NextResponse.json(byArea);
      }
    }

    // No filter — return all NGOs
    const ngos = await NGO.find({}).lean();
    return NextResponse.json(ngos);
  } catch (error) {
    console.error("API error fetching NGOs:", error);
    return NextResponse.json({ error: 'Failed to fetch NGOs' }, { status: 500 });
  }
}
