import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // Amount must be in paise for INR
    const amountInPaise = Math.round(Number(amount) * 100);

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString()}`,
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({ orderId: order.id, amount: orderOptions.amount });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json({ error: 'Failed to create Razorpay order', details: error.message }, { status: 500 });
  }
}
