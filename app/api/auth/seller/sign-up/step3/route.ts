import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/UserSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, confirmPassword, step3Token } = body;

    if (!password || !confirmPassword || !step3Token) {
      return NextResponse.json(
        { error: "Password, confirmPassword and registration token are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    let step2Data;
    try {
      step2Data = JSON.parse(Buffer.from(step3Token, "base64").toString());
      if (Date.now() > step2Data.expires) {
        return NextResponse.json(
          { error: "Registration session expired. Please start over from step 1." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Invalid registration token" }, { status: 400 });
    }

    const { email, phone, gst, businessName, address, city, state, pincode } = step2Data;

    await connectDB();

    const existingUser = await User.findOne({
      $or: [
        { email, role: "seller" },
        { phone, role: "seller" },
      ],
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email or phone already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      role: "seller",
      phone,
      businessName,
      companyName: businessName,
      gst,
      isVerified: true,
      onboardingComplete: true,
      name: businessName,
      addresses: [
        {
          street: address,
          city,
          state,
          postalCode: pincode,
          country: "India",
          isDefault: true,
        },
      ],
    });

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Seller account created successfully",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in seller step 3:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
