// app/api/auth/seller/signup/step1/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/UserSchema';
import { OTP } from '@/models/OTPSchema';
import { sellerStep1Schema } from '@/schemas/authSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = sellerStep1Schema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { email, phone, gst, otp } = validationResult.data;
    
    await connectDB();
    
    // Check if user already exists
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
    
    // Verify OTP
    const otpRecord = await OTP.findOne({ phone, code: otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }
    
    // Mark OTP as verified and delete it
    await OTP.deleteOne({ phone, code: otp });
    
    // Generate a temporary token for step 2 (valid for 10 minutes)
    const tempToken = Buffer.from(JSON.stringify({
      email,
      phone,
      gst,
      timestamp: Date.now(),
      expires: Date.now() + (10 * 60 * 1000) // 10 minutes
    })).toString('base64');
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Step 1 completed successfully',
        tempToken,
        validatedData: { email, phone, gst }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in seller step 1:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}