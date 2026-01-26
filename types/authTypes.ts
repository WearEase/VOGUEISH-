import { z } from "zod";
import { buyerSignInSchema, buyerSignUpSchema, sellerStep1Schema, sellerStep2Schema } from "@/schemas/authSchema";

export type FormType = "buyer-sign-in" | "buyer-sign-up" | "seller-sign-in" | "seller-sign-up";

export type BuyerSignInFormData = z.infer<typeof buyerSignInSchema>;
export type BuyerSignUpFormData = z.infer<typeof buyerSignUpSchema>;
export type SellerStep1FormData = z.infer<typeof sellerStep1Schema>;
export type SellerStep2FormData = z.infer<typeof sellerStep2Schema>;

// Extended NextAuth types
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}