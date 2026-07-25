import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { User } from '@/models/UserSchema';
import Invoice from '@/models/Invoice';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    await connectDB();
    const orders = await OrderModel.find({ userEmail: email }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("API error fetching Orders:", error);
    return NextResponse.json({ error: 'Failed to fetch Orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      userEmail,
      firstName,
      lastName,
      phone,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      tax,
      discount,
      totalAmount,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus,
    } = body;

    if (!id || !userEmail || !firstName || !lastName || !phone || !shippingAddress || !items || totalAmount === undefined || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newOrder = await OrderModel.create({
      id,
      userEmail,
      firstName,
      lastName,
      phone,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      tax,
      discount: discount || 0,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'Pending' : 'Paid'),
      razorpayOrderId,
      razorpayPaymentId,
      status: 'Processing',
      trackingHref: `/tracking?orderId=${id}`
    });

    try {
      await User.findOneAndUpdate(
        { email: userEmail },
        { $push: { orders: newOrder._id } }
      );
    } catch (updateErr) {
      console.warn("Failed to push order to user profile (guest checkout or DB error):", updateErr);
    }

    if (razorpayPaymentId) {
      try {
        await Invoice.create({
          invoiceId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          orderId: id,
          userEmail,
          billingAddress: shippingAddress, // Assuming same for now
          items: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal,
          tax,
          shippingFee,
          total: totalAmount,
          razorpayPaymentId,
          razorpayOrderId,
          status: 'Paid',
        });
      } catch (invoiceErr) {
        console.error("Failed to create invoice:", invoiceErr);
      }
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("API error creating Order:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Order with this ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create Order' }, { status: 500 });
  }
}
