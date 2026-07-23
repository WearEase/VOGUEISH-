import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel as Order } from '@/models/Order';

export const revalidate = 60; // Cache this route for 60 seconds to prevent DB hammering

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const orderId = (await params).id;
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching single order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
