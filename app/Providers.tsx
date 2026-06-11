"use client";
import { SessionProvider } from "next-auth/react";
import { HomeTrialProvider } from "@/context/HomeTrialContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
}
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <HomeTrialProvider>
          {children}
          <Toaster position="top-center" richColors />
        </HomeTrialProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}