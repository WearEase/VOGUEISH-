import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tailor from '@/models/Tailor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    let filter = {};
    
    // If area is provided, do a case-insensitive regex search
    if (area) {
      filter = {
        $or: [
          { area: { $regex: area, $options: 'i' } },
          { address: { $regex: area, $options: 'i' } },
          { shopName: { $regex: area, $options: 'i' } },
          { services: { $regex: area, $options: 'i' } },
          { pincode: { $regex: area, $options: 'i' } },
          { contact: { $regex: area, $options: 'i' } }
        ]
      };
    }

    const tailors = await Tailor.find(filter).limit(50); // Limit to 50 for performance

    return NextResponse.json({ success: true, tailors });
  } catch (error: any) {
    console.error("Error fetching tailors:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
