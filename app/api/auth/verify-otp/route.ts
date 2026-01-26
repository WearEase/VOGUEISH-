// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = body;
    
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Look up the stored OTP for this phone number from your database
    // 2. Verify that the OTP hasn't expired
    // 3. Check if the provided OTP matches the stored OTP
    
    // For this example, we'll simulate verification
    // In development mode, we'll accept any 4-digit OTP for testing purposes
    const isValid = process.env.NODE_ENV === "development" 
      ? otp.length === 4 && /^\d{4}$/.test(otp)
      : false; // In production, this would check against your database
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    
    // If verification is successful, you might want to:
    // 1. Mark the OTP as used in your database
    // 2. Generate a temporary token for the next step
    
    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}