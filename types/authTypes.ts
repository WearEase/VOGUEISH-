import { z } from "zod";
import { buyerSignInSchema, buyerSignUpSchema, sellerStep1Schema, sellerStep2Schema } from "@/schemas/authSchema";

export type FormType = "buyer-sign-in" | "buyer-sign-up" | "seller-sign-in" | "seller-sign-up";

export type BuyerSignInFormData = z.infer<typeof buyerSignInSchema>;
export type BuyerSignUpFormData = z.infer<typeof buyerSignUpSchema>;
export type SellerStep1FormData = z.infer<typeof sellerStep1Schema>;
export type SellerStep2FormData = z.infer<typeof sellerStep2Schema>;

// Extended NextAuth types
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "buyer" | "seller";
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "buyer" | "seller";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "buyer" | "seller";
  }
}