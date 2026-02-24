// schemas/authSchema.ts
import { z } from 'zod';

export const buyerSignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type BuyerSignInData = z.infer<typeof buyerSignInSchema>;

export const sellerStep1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gst: z.string().min(15, 'GST number must be 15 characters').max(15),
  otp: z.string().min(4, 'OTP must be 4 digits'),
});

export const sellerStep2Schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const buyerSignUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 10, {
      message: 'Phone number must be at least 10 digits',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type BuyerSignUpData = z.infer<typeof buyerSignUpSchema>;

export type FormType = 'buyer-sign-in' | 'buyer-sign-up' | 'seller-sign-in' | 'seller-sign-up';

// Define type for OTP Response
export interface OTPResponse {
  success: boolean;
  message: string;
}