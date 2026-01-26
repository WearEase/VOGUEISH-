// app/api/auth/seller/sign-in/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/models/UserSchema';
import { buyerSignInSchema } from '@/schemas/authSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = buyerSignInSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    await connectDB();
    
    const user = await User.findOne({ email, role: 'seller' });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email, role: 'seller' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Login successful',
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in seller sign-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}