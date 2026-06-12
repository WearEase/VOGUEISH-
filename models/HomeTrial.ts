import mongoose, { model, models, Schema } from 'mongoose';

export interface IHomeTrialItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  selectedSize: string;
  mainImage: string;
  discountedPrice?: number;
}

export interface IHomeTrial {
  id: string; // e.g. HT-XXXX
  userEmail: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  pincode: string;
  date: string;
  timeSlot: string;
  serviceType: string; // Male/Female
  status: 'Pending' | 'Completed';
  vendorStatus: string;
  otpVerified: boolean;
  items: IHomeTrialItem[];
  itemsBought: string[]; // names or slugs of products that are selected to buy
}

const homeTrialSchema = new Schema<IHomeTrial>({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  pincode: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  serviceType: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  vendorStatus: { type: String, default: 'Stylist is on the way' },
  otpVerified: { type: Boolean, default: false },
  items: [{
    id: String,
    name: String,
    brand: String,
    price: Number,
    selectedSize: String,
    mainImage: String,
  }],
  itemsBought: { type: [String], default: [] },
}, { timestamps: true });

export const HomeTrialModel = models.HomeTrial || model<IHomeTrial>('HomeTrial', homeTrialSchema, 'hometrials');
