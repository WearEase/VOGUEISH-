"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X, Sun, Moon } from "lucide-react";
import { useHomeTrial } from "@/context/HomeTrialContext";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

// We can pass auth state as prop if needed, or use AuthContext if available
// For now, mirroring existing Navbar structure but observing contexts

export default function NavbarIcons() {
  const { itemCount: trialCount } = useHomeTrial();
  const [cartCount, setCartCount] = useState(0);
  const { status } = useSession();
  const [hasLocalUser, setHasLocalUser] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getQuantity = (item: unknown): number => {
    if (typeof item !== "object" || item === null) return 1;
    const record = item as Record<string, unknown>;
    const quantity = record.quantity;
    return typeof quantity === "number" && Number.isFinite(quantity)
      ? quantity
      : 1;
  };

  // Load cart count akin to logic in Navbar
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = localStorage.getItem("ecommerce-cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          const count = Array.isArray(cartItems)
            ? cartItems.reduce(
                (acc: number, item: unknown) => acc + getQuantity(item),
                0,
              )
            : 0;
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Failed to parse cart", error);
      }
    };

    loadCart();

    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "ecommerce-cart") loadCart();
    };

    const onCartUpdated = () => loadCart();

    window.addEventListener("storage", onStorageChange);
    window.addEventListener("ecommerce-cart-updated", onCartUpdated);
    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("ecommerce-cart-updated", onCartUpdated);
    };
  }, []);

  useEffect(() => {
    try {
      setHasLocalUser(!!localStorage.getItem("user"));
    } catch {
      setHasLocalUser(false);
    }
  }, []);

  const isAuthed = status === "authenticated" || hasLocalUser;

  return (
    <div className="flex space-x-6 items-center">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
        aria-label="Toggle Theme"
      >
        {mounted && theme === "dark" ? (
          <Sun size={22} className="text-yellow-400" />
        ) : (
          <Moon size={22} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" />
        )}
      </button>

      {/* Shopping Cart */}
      <Link
        href="/cart"
        className="relative p-2 text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group"
      >
        <div className="relative">
          <ShoppingBag
            size={24}
            className="text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white"
          />
          {cartCount + trialCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {cartCount + trialCount}
            </span>
          )}
        </div>
      </Link>

      {/* User */}
      <Link
        href={isAuthed ? "/my-account" : "/login"}
        className="p-2 text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label={isAuthed ? "My account" : "Login"}
      >
        <User size={24} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" />
      </Link>

      {/* Hamburger / Quick Links Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
          aria-label="Toggle quick links menu"
        >
          {isMenuOpen ? (
            <X size={24} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu size={24} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 text-sm">
            <Link
              href={isAuthed ? "/my-account#my-orders" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition"
            >
              📦 My Orders
            </Link>
            <Link
              href={isAuthed ? "/my-account#home-trials" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition"
            >
              🏠 My Home Trials
            </Link>
            <Link
              href={isAuthed ? "/my-account#my-donations" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition"
            >
              🎁 My Donations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
