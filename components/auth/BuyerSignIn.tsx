"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema, BuyerSignInData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Demo credentials
const DEMO_CREDENTIALS = {
  email: "himanshikathuria64@gmail.com",
  password: "vogueish05"
};

const BuyerSignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const {
    register, 
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm<BuyerSignInData>({
    resolver: zodResolver(buyerSignInSchema),
  });

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/shop");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: BuyerSignInData) => {
    console.log("Buyer Sign In", data);
    setIsSubmitting(true);
    setError("");
    clearErrors();

    // Simulate loading
    setTimeout(() => {
      // Check credentials
      if (data.email === DEMO_CREDENTIALS.email && data.password === DEMO_CREDENTIALS.password) {
        setIsAuthenticated(true); // Set authentication state
      } else {
        if (data.email !== DEMO_CREDENTIALS.email) {
          setFormError("email", { 
            type: "manual", 
            message: "No account found with this email" 
          });
        } else if (data.password !== DEMO_CREDENTIALS.password) {
          setFormError("password", { 
            type: "manual", 
            message: "Incorrect password" 
          });
        }
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {...register("password")}
            type="password" 
            placeholder="Password" 
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/buyer/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default BuyerSignIn;