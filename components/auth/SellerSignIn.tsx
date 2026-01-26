"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSignInSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Demo credentials
const DEMO_CREDENTIALS = {
  email: "himanshikathuria64@gmail.com",
  password: "vogueish05"
};

const SellerSignIn = () => { 
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof buyerSignInSchema>>({
    resolver: zodResolver(buyerSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/seller-dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: z.infer<typeof buyerSignInSchema>) => {
    setAuthError(null);
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      // Check credentials
      if (data.email === DEMO_CREDENTIALS.email && data.password === DEMO_CREDENTIALS.password) {
        setIsAuthenticated(true); // Set authentication state
      } else {
        setAuthError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

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
      
      {authError && (
        <p className="text-red-500 text-sm">{authError}</p>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SellerSignIn;