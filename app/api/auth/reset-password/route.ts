import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import { hashToken } from "@/lib/authTokens";

const getUserByResetToken = async (email: string, token: string) => {
  await connectDB();

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    email,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  return user;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 });
    }

    const user = await getUserByResetToken(email, token);
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Reset link is valid" });
  } catch (error) {
    console.error("Error validating reset token:", error);
    return NextResponse.json({ error: "Failed to validate reset token" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, token, password, confirmPassword } = await req.json();

    if (!email || !token || !password || !confirmPassword) {
      return NextResponse.json({ error: "Email, token, password and confirmPassword are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const user = await getUserByResetToken(email, token);
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
