import mongoose, { model, models, Schema } from "mongoose";

export interface INGO {
  name: string;
  area: string;
  address?: string;
  lat?: number;
  lon?: number;
}

const ngoSchema = new Schema<INGO>({
  name: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String },
  lat: { type: Number },
  lon: { type: Number },
}, { timestamps: true });

export const NGO = models.NGO || model<INGO>('NGO', ngoSchema, 'ngos');
