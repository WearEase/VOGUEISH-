"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const SellerSignIn = () => { 
  const { sellerSignIn, sellerGoogleSignIn, sendVerificationLink, sendPasswordResetLink, isLoading, error, clearError } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
    watch,
  } = useForm<z.infer<typeof buyerSignInSchema>>({
    resolver: zodResolver(buyerSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof buyerSignInSchema>) => {
    clearError();
    clearErrors();
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
    const email = watch("email") || "";
    if (!email) {
      setFormError("email", { type: "manual", message: "Enter your email first" });
      return;
    }

    const response = await sendVerificationLink(email, "seller");
    if (response.success) {
      setAuthMessage(response.message || "Verification link sent");
      setAuthError(null);
    }
  };

  const handleForgotPassword = async () => {
    const email = watch("email") || "";
    if (!email) {
      setFormError("email", { type: "manual", message: "Enter your email first" });
      return;
    }

    const response = await sendPasswordResetLink(email);
    if (response.success) {
      setAuthMessage(response.message || "Password reset link sent");
      setAuthError(null);
    }
  };

  const message = authError || error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : "bg-neutral-50"}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          {...register("password")}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className={errors.password ? "border-destructive focus-visible:ring-destructive" : "bg-neutral-50"}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      
      {message && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{message}</p>
        </div>
      )}

      {authMessage && (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-700">{authMessage}</p>
        </div>
      )}
      
      <Button type="submit" className="h-12 w-full bg-neutral-950 text-white hover:bg-neutral-800" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            Signing in
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      <Button type="button" variant="outline" className="h-12 w-full flex items-center justify-center" onClick={handleGoogleSellerSignIn} disabled={isLoading}>
        <Image src="/icons/google.svg" alt="Google" width={18} height={18} className="mr-2 shrink-0" />
        Continue with Google (Seller)
      </Button>

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
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