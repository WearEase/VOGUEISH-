"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ListOrdered, 
  Truck, 
  MessageSquare, 
  HelpCircle, 
  Sun, 
  Moon 
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SellerSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const links: SidebarLinkProps[] = [
    { href: "/seller-dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/seller-dashboard/products", label: "Products", icon: ShoppingBag },
    { href: "/seller-dashboard/customers", label: "Customer", icon: Users },
    { href: "/seller-dashboard/orders", label: "Orders", icon: ListOrdered },
    { href: "/seller-dashboard/shipment", label: "Shipment", icon: Truck },
    { href: "/seller-dashboard/feedback", label: "Feedback", icon: MessageSquare },
    { href: "/seller-dashboard/support", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm min-h-screen">
      <div>
        <div className="text-2xl font-bold mb-10 text-purple-600 dark:text-purple-400 tracking-wide font-serif">
          VOGUEISH
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-marker"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-purple-600 dark:bg-purple-400 rounded-r"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer - Theme Toggle */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
          aria-label="Toggle theme"
        >
          <span className="flex items-center gap-3">
            {mounted && theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-yellow-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>Dark Mode</span>
              </>
            )}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-400 dark:text-gray-500">
            {mounted ? (theme === "dark" ? "Dark" : "Light") : "Light"}
          </span>
        </button>
      </div>
    </aside>
  );
}
