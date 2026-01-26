"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { sellerStep2Schema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const StepTwo = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { sellerStep2, isLoading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof sellerStep2Schema>>({
    resolver: zodResolver(sellerStep2Schema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof sellerStep2Schema>) => {
    setAuthError(null);
    const result = await sellerStep2(data);
    
    if (result) {
      onNext();
    } else if (error) {
      setAuthError(error);
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
      {form.formState.errors.password && (
        <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
      )}
      
      <Input 
        {...form.register("confirmPassword")} 
        placeholder="Confirm Password" 
        type="password" 
        className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      {form.formState.errors.confirmPassword && (
        <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</p>
      )}
      
      {authError && (
        <p className="text-red-500 text-sm">{authError}</p>
      )}
      
      <div className="flex gap-4">
        <Button 
          type="button" 
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 bg-white text-black border border-black py-3 rounded-md text-sm hover:bg-gray-100 transition-all"
        >
          Back
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-black text-white py-3 rounded-md text-sm hover:bg-gray-800 transition-all"
        >
          {isLoading ? "Processing..." : "CONTINUE"}
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;
