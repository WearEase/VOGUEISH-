import { model, models, Schema } from "mongoose";

export interface INGO {
  name: string;
  area: string;
  address?: string;
  pincode?: string; // Option B: exact pincode match
  lat?: number;
  lon?: number;
}

const ngoSchema = new Schema<INGO>({
  name: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String },
  pincode: { type: String, index: true }, // indexed for fast lookup
  lat: { type: Number },
  lon: { type: Number },
}, { timestamps: true });

export const NGO = models.NGO || model<INGO>('NGO', ngoSchema, 'ngos');
