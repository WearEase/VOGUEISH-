import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoice extends Document {
  invoiceId: string;
  orderId: string;
  userEmail: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  status: string;
  issuedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    userEmail: { type: String, required: true },
    billingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    items: [
      {
        productId: { type: String },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      }
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpaySignature: { type: String },
    status: { type: String, default: "Paid" },
    issuedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
