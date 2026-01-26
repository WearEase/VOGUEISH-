// app/seller-dashboard/layout.tsx
import React from 'react';
import Link from 'next/link';
import { Providers } from '../Providers';

export default function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
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
        <Providers>
        {children}
        </Providers>
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
