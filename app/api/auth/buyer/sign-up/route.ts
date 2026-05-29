// app/api/auth/buyer/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import bcrypt from "bcryptjs";
import { buyerSignUpSchema } from "@/schemas/authSchema";
import { ZodError } from "zod";
import { createTokenPair, tokenExpiryFromNow } from "@/lib/authTokens";
import { sendVerificationEmail } from "@/lib/authEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = buyerSignUpSchema.parse(body);
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: validatedData.email 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Create user
    const user = new User({
      email: validatedData.email,
      password: hashedPassword,
      name: `${validatedData.firstName} ${validatedData.lastName}`.trim(),
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone || undefined, // Only include if provided
      role: "buyer",
      isVerified: false,
    });

    const { rawToken, hashedToken } = createTokenPair();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiryFromNow(30);
    
    await user.save();
    
    console.log("User created successfully:", user._id);
    
    const emailResult = await sendVerificationEmail(user.email, rawToken);

    return NextResponse.json(
      {
        message: emailResult.sent
          ? "Account created. Please verify your email before signing in."
          : "Account created, but the verification email could not be sent automatically.",
        userId: user._id.toString(),
        requiresEmailVerification: true,
        emailSent: emailResult.sent,
        emailSendReason: emailResult.sent ? undefined : emailResult.reason,
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error("Buyer signup error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid input data", 
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      // MongoDB duplicate key error
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}