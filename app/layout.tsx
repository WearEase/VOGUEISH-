import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./Providers";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vogueish",
  description: "A Luxury Fashion apparel with Home Trial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <AuthProvider>
          {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
