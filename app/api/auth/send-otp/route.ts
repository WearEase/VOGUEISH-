// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OTP } from '@/models/OTPSchema';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    
    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store OTP in database with expiry
    await OTP.findOneAndUpdate(
      { phone },
      { 
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      },
      { upsert: true, new: true }
    );
    
    // In production, send OTP via SMS here
    console.log(`OTP for ${phone}: ${otp}`); // For development only
    
    return NextResponse.json(
      { success: true, message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}