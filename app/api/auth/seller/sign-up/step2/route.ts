// app/api/auth/seller/signup/step2/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/UserSchema';
import { sellerStep2Schema } from '@/schemas/authSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate business info
    const validationResult = sellerStep2Schema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { businessName, address, city, state, pincode, tempToken } = body;
    
    // Verify and decode tempToken from step 1
    if (!tempToken) {
      return NextResponse.json(
        { error: 'Missing registration token. Please complete step 1 first.' },
        { status: 400 }
      );
    }
    
    let step1Data;
    try {
      step1Data = JSON.parse(Buffer.from(tempToken, 'base64').toString());
      
      // Check if token is expired
      if (Date.now() > step1Data.expires) {
        return NextResponse.json(
          { error: 'Registration session expired. Please start over from step 1.' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid registration token' },
        { status: 400 }
      );
    }
    
    const { email, phone, gst } = step1Data;
    
    await connectDB();
    
    // Check again if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email, role: 'seller' },
        { phone, role: 'seller' }
      ]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or phone already in use' },
        { status: 409 }
      );
    }
    
    // Create new temp token for step 3 with all data
    const step3Token = Buffer.from(JSON.stringify({
      email,
      phone,
      gst,
      businessName,
      address,
      city,
      state,
      pincode,
      timestamp: Date.now(),
      expires: Date.now() + (10 * 60 * 1000) // 10 minutes
    })).toString('base64');
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Step 2 completed successfully',
        step3Token,
        businessInfo: { businessName, address, city, state, pincode }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in seller step 2:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}