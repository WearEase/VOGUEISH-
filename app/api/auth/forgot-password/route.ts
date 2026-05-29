import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import { createTokenPair, tokenExpiryFromNow } from "@/lib/authTokens";
import { sendPasswordResetEmail } from "@/lib/authEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: true, message: "If this email exists, a reset link has been sent" });
    }

    const { rawToken, hashedToken } = createTokenPair();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = tokenExpiryFromNow(30);
    await user.save();

    await sendPasswordResetEmail(user.email, rawToken);

    return NextResponse.json({ success: true, message: "If this email exists, a reset link has been sent" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 500 });
  }
}
