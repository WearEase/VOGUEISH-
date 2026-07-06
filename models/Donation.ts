import mongoose, { model, models, Schema } from 'mongoose';

export interface IDonation {
  id: string; // e.g. VOG-DON-XXXX
  userEmail: string;
  ngoName: string;
  ngoId?: mongoose.Types.ObjectId; // ref to NGO document
  pickupDate: string;
  timeSlot: string;
  itemType: string;
  status: string; // e.g. 'Pickup Scheduled'
  linkedTrialId: string; // HomeTrial.id string (e.g. "HT-8912")
  // Pickup address pre-filled from the linked home trial
  addressLine1?: string;
  pincode?: string;
  phone?: string;
}

const donationSchema = new Schema<IDonation>({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  ngoName: { type: String, required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  pickupDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  itemType: { type: String, required: true },
  status: { type: String, default: 'Pickup Scheduled' },
  linkedTrialId: { type: String, required: true },
  addressLine1: { type: String },
  pincode: { type: String },
  phone: { type: String },
}, { timestamps: true });

export const DonationModel = models.Donation || model<IDonation>('Donation', donationSchema, 'donations');
