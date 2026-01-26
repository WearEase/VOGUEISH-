"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignUpSchema, BuyerSignUpData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

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
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input 
            {...register("firstName")}
            placeholder="First Name" 
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Input 
            {...register("lastName")}
            placeholder="Last Name" 
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <Input 
            {...register("email")}
            type="email"
            placeholder="Email" 
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input 
            {...register("phone")}
            placeholder="Phone Number (Optional)" 
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Input 
            {...register("password")}
            type="password" 
            placeholder="Password" 
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="Confirm Password" 
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing up...
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </div>
  );
};

export default BuyerSignUp;