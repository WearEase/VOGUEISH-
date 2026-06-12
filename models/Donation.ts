import mongoose, { model, models, Schema } from 'mongoose';

export interface IDonation {
  id: string; // e.g. VOG-DON-XXXX
  userEmail: string;
  ngoName: string;
  pickupDate: string;
  timeSlot: string;
  itemType: string;
  status: string; // e.g. 'Pickup Scheduled'
  linkedTrialId: string;
}

const donationSchema = new Schema<IDonation>({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  ngoName: { type: String, required: true },
  pickupDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  itemType: { type: String, required: true },
  status: { type: String, default: 'Pickup Scheduled' },
  linkedTrialId: { type: String, required: true },
}, { timestamps: true });

export const DonationModel = models.Donation || model<IDonation>('Donation', donationSchema, 'donations');
