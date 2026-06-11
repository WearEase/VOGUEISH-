import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import { hashToken } from "@/lib/authTokens";

const verifyUserEmail = async (email: string, token: string) => {
  await connectDB();

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    email,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    return { success: false, message: "Invalid or expired verification link" };
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { success: true, message: "Email verified successfully", role: user.role };
};

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 });
    }

    const result = await verifyUserEmail(email, token);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.redirect(
        new URL("/buyer-sign-in?error=verification_failed&message=Email and token are required", req.url)
      );
    }

    const result = await verifyUserEmail(email, token);
    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/buyer-sign-in?error=verification_failed&message=${encodeURIComponent(result.message)}`, req.url)
      );
    }

    const redirectPath = result.role === "seller" ? "/seller-sign-in" : "/buyer-sign-in";
    return NextResponse.redirect(
      new URL(`${redirectPath}?verified=true`, req.url)
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(
      new URL("/buyer-sign-in?error=verification_failed&message=Failed to verify email due to internal server error", req.url)
    );
  }
}
