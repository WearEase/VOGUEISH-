"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema, BuyerSignInData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, Sparkles, Truck, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";

const buyerHighlights = [
  {
    icon: Sparkles,
    title: "Curated drops",
    description: "Pick up right where you left off with your latest saved styles.",
  },
  {
    icon: Truck,
    title: "Order tracking",
    description: "Keep an eye on every purchase and delivery in one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure access",
    description: "Your buyer account stays ready whenever you return to Vogueish.",
  },
];

const BuyerSignIn = () => {
  const { buyerSignIn, buyerGoogleSignIn, sendVerificationLink, sendPasswordResetLink, isLoading, error, clearError } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");

    if (verified === "true") {
      setAuthMessage("Email verified successfully! You can now sign in.");
      setAuthError(null);
    } else if (errorParam) {
      setAuthError(messageParam || "Email verification failed.");
      setAuthMessage(null);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
    watch,
  } = useForm<BuyerSignInData>({
    resolver: zodResolver(buyerSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: BuyerSignInData) => {
    clearError();
    clearErrors();
    setAuthError(null);
    setAuthMessage(null);

    const result = await buyerSignIn(data.email, data.password);

    if (!result.success && result.error) {
      const normalizedError = result.error.toLowerCase();

      if (normalizedError.includes("email")) {
        setFormError("email", {
          type: "manual",
          message: result.error,
        });
      } else if (normalizedError.includes("password")) {
        setFormError("password", {
          type: "manual",
          message: result.error,
        });
      } else {
        setAuthError(result.error);
      }
    }
  };

  const message = authError || error;

  const handleGoogleBuyerSignIn = async () => {
    clearError();
    setAuthError(null);
    setAuthMessage(null);
    await buyerGoogleSignIn();
  };

  const handleResendVerification = async () => {
    const email = watch("email") || "";
    if (!email) {
      setFormError("email", { type: "manual", message: "Enter your email first" });
      return;
    }

    const response = await sendVerificationLink(email, "buyer");
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

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="overflow-hidden border-neutral-200/70 bg-white/95 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.45)] backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-neutral-600">
            <UserRound className="h-3.5 w-3.5" />
            Buyer portal
          </div>
          <CardTitle className="text-3xl font-semibold tracking-tight text-neutral-950">
            Welcome back
          </CardTitle>
          <CardDescription className="max-w-md text-sm leading-6 text-neutral-600">
            Sign in to continue shopping, manage orders, and keep your buyer details ready.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <Link href="/buyer-sign-up" className="text-xs font-medium text-neutral-500 hover:text-neutral-950">
                  Need an account?
                </Link>
              </div>
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

            <Button type="button" variant="outline" className="h-12 w-full flex items-center justify-center" onClick={handleGoogleBuyerSignIn} disabled={isLoading}>
              <Image src="/icons/google.svg" alt="Google" width={18} height={18} className="mr-2 shrink-0" />
              Continue with Google
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
              <button type="button" className="hover:text-neutral-900" onClick={handleResendVerification}>
                Resend verification link
              </button>
              <button type="button" className="hover:text-neutral-900" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>

            {authMessage && (
              <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3">
                <p className="text-sm text-emerald-700">{authMessage}</p>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="grid w-full gap-3 sm:grid-cols-3">
            {buyerHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <Icon className="h-5 w-5 text-neutral-950" />
                  <p className="mt-3 text-sm font-medium text-neutral-950">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-600">{item.description}</p>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-neutral-600">
            New here?{" "}
            <Button asChild variant="link" className="h-auto p-0 font-medium text-neutral-950">
              <Link href="/buyer-sign-up">Create a buyer account</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BuyerSignIn;