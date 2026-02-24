"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignUpSchema, BuyerSignUpData } from "@/schemas/authSchema";
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
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";

const BuyerSignUp = () => {
  const { buyerSignUp, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<BuyerSignUpData>({
    resolver: zodResolver(buyerSignUpSchema),
  });

  const onSubmit = async (data: BuyerSignUpData) => {
    console.log("Buyer Sign Up", data);
    setIsSubmitting(true);
    clearError();
    clearErrors();

    try {
      const result = await buyerSignUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
      });

      if (!result.success && result.error) {
        // Handle specific field errors if needed
        if (result.error.includes("email already exists")) {
          setError("email", { 
            type: "manual", 
            message: "An account with this email already exists" 
          });
        } else {
          // Generic error will be shown from useAuth hook
        }
      }
      // Success case is handled in useAuth hook (redirect to /shop)
    } catch (err) {
      console.error("Sign up error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-4 py-10">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Sign up to continue shopping on Vogueish.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  aria-invalid={!!errors.firstName}
                  className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  {...register("lastName")}
                  placeholder="Enter last name"
                  aria-invalid={!!errors.lastName}
                  className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                placeholder="name@example.com"
                aria-invalid={!!errors.email}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                autoComplete="tel"
                inputMode="tel"
                {...register("phone")}
                placeholder="10-digit phone number"
                aria-invalid={!!errors.phone}
                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                placeholder="Create a password"
                aria-invalid={!!errors.password}
                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
                className={
                  errors.confirmPassword
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                  Signing up
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/buyer/login">Sign in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BuyerSignUp;