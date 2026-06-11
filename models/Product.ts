import mongoose, { model, models, Schema } from "mongoose";

const productSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  realPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  mainImage: { type: String, required: true },
  extraImage1: { type: String },
  extraImage2: { type: String },
  extraImage3: { type: String },
  extraImage4: { type: String },
  brand: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sizesAvailable: { type: [String], default: [] },
  popularityRank: { type: Number },
  rating: { type: Number },
  arrivalDate: { type: String },
  gender: { type: String },
  collectionType: { type: String },
}, { timestamps: true });

export const Product = models.Product || model('Product', productSchema, 'products');
