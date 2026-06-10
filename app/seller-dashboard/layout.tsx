import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "seller") {
    redirect("/seller-sign-in");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-6 border-r">
        <div className="text-2xl font-bold mb-10 text-purple-600">VOGUEISH</div>
        <nav className="space-y-4">
          <SidebarLink href="/seller-dashboard" label="Overview" />
          <SidebarLink href="/seller-dashboard/products" label="Products" />
          <SidebarLink href="/seller-dashboard/customers" label="Customer" />
          <SidebarLink href="/seller-dashboard/orders" label="Orders" />
          <SidebarLink href="/seller-dashboard/shipment" label="Shipment" />
          <SidebarLink href="/seller-dashboard/feedback" label="Feedback" />
          <SidebarLink href="/seller-dashboard/support" label="Help & Support" />
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition"
    >
      {label}
    </Link>
  );
}
