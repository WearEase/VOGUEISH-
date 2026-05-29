import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import { createTokenPair, tokenExpiryFromNow } from "@/lib/authTokens";
import { sendVerificationEmail } from "@/lib/authEmail";

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const query: { email: string; role?: string } = { email };
    if (role) {
      query.role = role;
    }

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: true, message: "Email is already verified" });
    }

    const { rawToken, hashedToken } = createTokenPair();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiryFromNow(30);
    await user.save();

    const emailResult = await sendVerificationEmail(user.email, rawToken);

    return NextResponse.json({
      success: true,
      message: emailResult.sent
        ? "Verification link sent"
        : "Verification link created, but email delivery failed",
      emailSent: emailResult.sent,
      emailSendReason: emailResult.sent ? undefined : emailResult.reason,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
