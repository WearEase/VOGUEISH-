"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const SellerSignIn = () => { 
  const { sellerSignIn, sellerGoogleSignIn, sendVerificationLink, sendPasswordResetLink, isLoading, error, clearError } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof buyerSignInSchema>>({
    resolver: zodResolver(buyerSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof buyerSignInSchema>) => {
    clearError();
    setAuthError(null);
    setAuthMessage(null);

    const result = await sellerSignIn(data.email, data.password);
    if (!result.success) {
      setAuthError(result.error || "Sign in failed");
    }
  };

  const handleGoogleSellerSignIn = async () => {
    clearError();
    setAuthError(null);
    setAuthMessage(null);
    await sellerGoogleSignIn();
  };

  const handleResendVerification = async () => {
    const email = form.watch("email") || "";
    if (!email) {
      form.setError("email", { type: "manual", message: "Enter your email first" });
      return;
    }

    const response = await sendVerificationLink(email, "seller");
    if (response.success) {
      setAuthMessage(response.message || "Verification link sent");
    }
  };

  const handleForgotPassword = async () => {
    const email = form.watch("email") || "";
    if (!email) {
      form.setError("email", { type: "manual", message: "Enter your email first" });
      return;
    }

    const response = await sendPasswordResetLink(email);
    if (response.success) {
      setAuthMessage(response.message || "Password reset link sent");
    }
  };

  const message = authError || error;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("email")} placeholder="Email" />
      {form.formState.errors.email && (
        <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
      )}
      
      <Input {...form.register("password")} placeholder="Password" type="password" />
      {form.formState.errors.password && (
        <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
      )}
      
      {message && (
        <p className="text-red-500 text-sm">{message}</p>
      )}

      {authMessage && (
        <p className="text-emerald-600 text-sm">{authMessage}</p>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSellerSignIn} disabled={isLoading}>
        Continue with Google (Seller)
      </Button>

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <button type="button" onClick={handleResendVerification} className="hover:text-neutral-900">
          Resend verification link
        </button>
        <button type="button" onClick={handleForgotPassword} className="hover:text-neutral-900">
          Forgot password?
        </button>
      </div>
    </form>
  );
};

export default SellerSignIn;