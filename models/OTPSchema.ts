import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  phone: string;
  email?: string;
  code: string;
  verified: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    phone: { type: String, required: true, index: true },
    email: { type: String, sparse: true, lowercase: true },
    code: { type: String, required: true },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);