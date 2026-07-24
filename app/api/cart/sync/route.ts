import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/UserSchema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ cartData: '[]' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ cartData: '[]' }, { status: 404 });
    }

    return NextResponse.json({ cartData: user.cartData || '[]' });
  } catch (error) {
    console.error("Cart Sync GET error:", error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartData } = await request.json();

    if (typeof cartData !== 'string') {
      return NextResponse.json({ error: 'Invalid cart payload' }, { status: 400 });
    }

    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      { cartData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart Sync POST error:", error);
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}
