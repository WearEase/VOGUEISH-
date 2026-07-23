import mongoose, { model, models, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface IOrder {
  id: string; // e.g. ORD-XXXX
  userEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingHref: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
}

const orderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: String,
    image: String,
  }],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  trackingHref: { type: String, default: '/tracking' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
}, { timestamps: true });

export const OrderModel = models.Order || model<IOrder>('Order', orderSchema, 'orders');
