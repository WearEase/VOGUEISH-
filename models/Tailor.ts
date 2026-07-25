import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITailor extends Document {
  shopName: string;
  area: string;
  address?: string;
  services?: string;
  contact?: string;
  pincode: string;
}

const TailorSchema: Schema = new Schema(
  {
    shopName: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String },
    services: { type: String },
    contact: { type: String },
    pincode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating multiple models in development
const Tailor: Model<ITailor> = mongoose.models.Tailor || mongoose.model<ITailor>("Tailor", TailorSchema);

export default Tailor;
