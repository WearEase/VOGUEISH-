"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerStep1Schema } from "@/schemas/authSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const StepOne = ({ onNext }: { onNext: () => void }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const { sendOTP, sellerStep1, isLoading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof sellerStep1Schema>>({
    resolver: zodResolver(sellerStep1Schema),
    defaultValues: {
      email: "",
      phone: "",
      gst: "",
      otp: ""
    }
  });

  const handleSendOtp = async () => {
    setAuthError(null);
    const phone = form.getValues("phone");
    
    if (!phone || phone.length < 10) {
      form.setError("phone", { message: "Enter a valid phone number" });
      return;
    }

    const result = await sendOTP(phone);
    
    if (result) {
      setOtpSent(true);
    } else if (error) {
      setAuthError(error);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only allow digits

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    // Automatically move to next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Update the hidden OTP field in form
    form.setValue("otp", updated.join(""));
  };

  const onSubmit = async (values: z.infer<typeof sellerStep1Schema>) => {
    setAuthError(null);
    const result = await sellerStep1(values);
    
    if (result) {
      onNext();
    } else if (error) {
      setAuthError(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      {/* Email Field */}
      <Input
        {...form.register("email")}
        placeholder="Company Email ID"
        className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      {form.formState.errors.email && (
        <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
      )}

      {/* Phone & Send OTP */}
      <div className="flex space-x-2">
        <Input
          {...form.register("phone")}
          placeholder="Contact Number"
          className="flex-1 px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <Button
          type="button"
          onClick={handleSendOtp}
          disabled={isLoading}
          className="px-4 py-3 border border-black text-white rounded-md text-sm"
        >
          {isLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
        </Button>
      </div>
      {form.formState.errors.phone && (
        <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
      )}

      {/* OTP Boxes */}
      <div className="flex justify-between space-x-2">
        {otpDigits.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            className="w-12 h-12 text-center border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        ))}
      </div>
      {form.formState.errors.otp && (
        <p className="text-red-500 text-sm">{form.formState.errors.otp.message}</p>
      )}

      {/* GST Number */}
      <Input
        {...form.register("gst")}
        placeholder="GST Number"
        className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      {form.formState.errors.gst && (
        <p className="text-red-500 text-sm">{form.formState.errors.gst.message}</p>
      )}

      {/* Error message */}
      {authError && (
        <p className="text-red-500 text-sm">{authError}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-3 rounded-md text-sm hover:bg-gray-800 transition-all"
      >
        {isLoading ? "Processing..." : "CONTINUE"}
      </Button>

      {/* Redirect */}
      <p className="text-center text-sm text-gray-600">
        Already Have An Account?{" "}
        <Link href="/seller-sign-in" className="font-semibold text-black">
          SignIn
        </Link>
      </p>
    </form>
  );
};

export default StepOne;