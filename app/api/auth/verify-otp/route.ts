// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { OTP } from "@/models/OTPSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = body;
    const normalizedPhone = String(phone || "").trim();
    const normalizedOtp = String(otp || "").trim();
    
    if (!normalizedPhone || !normalizedOtp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const otpRecord = await OTP.findOne({
      phone: normalizedPhone,
      code: normalizedOtp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    otpRecord.verified = true;
    await otpRecord.save();

    await OTP.deleteMany({ phone: normalizedPhone, _id: { $ne: otpRecord._id } });
    
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