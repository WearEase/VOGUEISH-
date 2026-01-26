// app/api/auth/buyer/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";
import bcrypt from "bcryptjs";
import { buyerSignUpSchema } from "@/schemas/authSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received signup data:", body);
    
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
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone || undefined, // Only include if provided
      role: "buyer",
      isVerified: true, // Set to false if you want email verification
    });
    
    await user.save();
    
    console.log("User created successfully:", user._id);
    
    return NextResponse.json(
      { 
        message: "Account created successfully",
        userId: user._id.toString()
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Buyer signup error:", error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: "Invalid input data", 
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
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