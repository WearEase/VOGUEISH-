"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerStep3Schema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const StepThree = ({ step3Token }: { step3Token: string }) => {
  const { sellerStep3, isLoading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof sellerStep3Schema>>({
    resolver: zodResolver(sellerStep3Schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      step3Token,
    },
  });

  const onSubmit = async (data: z.infer<typeof sellerStep3Schema>) => {
    setAuthError(null);
    const result = await sellerStep3({ ...data, step3Token });

    if (!result.success) {
      setAuthError(result.error || error || "Registration failed");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...form.register("password")}
        placeholder="Password"
        type="password"
        className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      {form.formState.errors.password && <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>}

      <Input
        {...form.register("confirmPassword")}
        placeholder="Confirm Password"
        type="password"
        className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      {form.formState.errors.confirmPassword && <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</p>}

      <input type="hidden" {...form.register("step3Token")} />

      {authError && <p className="text-red-500 text-sm">{authError}</p>}

      <Button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 rounded-md text-sm hover:bg-gray-800 transition-all">
        {isLoading ? "Processing..." : "CREATE ACCOUNT"}
      </Button>
    </form>
  );
};

export default StepThree;
