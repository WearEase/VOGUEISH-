import mongoose, { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true,
  },
  
  // Buyer fields (conditional)
  firstName: { type: String, required: function() { return this.role === 'buyer'; } },
  lastName: { type: String, required: function() { return this.role === 'buyer'; } },
  
  // Seller fields (conditional)
  businessName: { type: String, required: function() { return this.role === 'seller'; } },
  gst: { type: String, required: function() { return this.role === 'seller'; } },
  
  // Shared optional fields
  phone: String,
  isVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  
  // Buyer-specific arrays
  addresses: [{
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: Boolean,
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  
  // Seller-specific fields
  companyName: String,
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  onboardingComplete: { type: Boolean, default: false },
  
}, { timestamps: true });

export const User = models.User || model('User', userSchema);