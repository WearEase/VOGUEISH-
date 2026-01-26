"use client";
import { SessionProvider } from "next-auth/react";
import { HomeTrialProvider } from "@/context/HomeTrialContext";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <HomeTrialProvider>
        {children}
        <Toaster position="top-center" richColors />
      </HomeTrialProvider>
    </SessionProvider>
  );
}