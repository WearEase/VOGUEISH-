import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SellerSidebar from "@/components/seller/SellerSidebar";
import DashboardTransition from "@/components/seller/DashboardTransition";

export default async function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "seller") {
    redirect("/seller-sign-in");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <SellerSidebar />

      <main className="flex-1 overflow-y-auto">
        <DashboardTransition>
          {children}
        </DashboardTransition>
      </main>
    </div>
  );
}
