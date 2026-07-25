import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Invoice from '@/models/Invoice';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    const { orderId } = await params;
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const invoice = await Invoice.findOne({ orderId }).lean();

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found for this order' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("API error fetching Invoice:", error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}
