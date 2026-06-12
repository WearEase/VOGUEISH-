"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import NavbarIcons from "./NavbarIcons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Pages where navbar should always be white, including shop slug pages
  const isForceWhite =
    pathname === "/shop" ||
    pathname === "/cart" ||
    pathname.startsWith("/shop/"); // Handles slug pages like /shop/blue-dress

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out",
        isForceWhite
          ? "bg-white shadow-md fixed"
          : isScrolled
            ? "bg-white shadow-md fixed"
            : "bg-transparent shadow-none fixed",
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 md:p-6 max-w-7xl mx-auto">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-700 dark:text-gray-300">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="ml-2">
            <Image
              src="/Nav-logo.png"
              alt="Vogueish Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 xl:space-x-12 text-gray-700 dark:text-gray-300 text-base xl:text-lg font-medium">
          <Link
            href="/shop"
            className={clsx(
              "hover:text-black dark:hover:text-white transition",
              pathname === "/shop" || pathname.startsWith("/shop/") ? "text-black dark:text-white" : ""
            )}
          >
            Shop
          </Link>
          <Link
            href="/ai-bot"
            className={clsx(
              "hover:text-black dark:hover:text-white transition", 
              pathname === "/ai-bot" ? "text-black dark:text-white" : ""
            )}
          >
            AI Bot
          </Link>
          <Link
            href="/custom-tailoring"
            className={clsx(
              "hover:text-black dark:hover:text-white transition",
              pathname === "/custom-tailoring" ? "text-black dark:text-white" : ""
            )}
          >
            Custom Tailoring
          </Link>
          <Link
            href="/home-trials"
            className={clsx(
              "hover:text-black dark:hover:text-white transition",
              pathname === "/home-trials" ? "text-black dark:text-white" : ""
            )}
          >
            Home Trials
          </Link>
          <Link
            href="/donation"
            className={clsx(
              "hover:text-black dark:hover:text-white transition",
              pathname === "/donation" ? "text-black dark:text-white" : ""
            )}
          >
            Donation
          </Link>
        </div>

        {/* Icons */}
        <NavbarIcons />
      </div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Sliding Drawer */}
      <div
        className={clsx(
          "fixed top-0 left-0 w-64 h-full bg-white dark:bg-zinc-900 shadow-2xl p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button onClick={() => setIsOpen(false)} className="self-end p-2 text-gray-500 hover:text-black dark:hover:text-white transition">
          <X size={24} />
        </button>
        <nav className="mt-6 space-y-6 text-lg font-medium text-gray-700 dark:text-gray-300">
          <Link href="/shop" className="block hover:text-black dark:hover:text-white transition" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link href="/ai-bot" className="block hover:text-black dark:hover:text-white transition" onClick={() => setIsOpen(false)}>AI Bot</Link>
          <Link href="/custom-tailoring" className="block hover:text-black dark:hover:text-white transition" onClick={() => setIsOpen(false)}>Custom Tailoring</Link>
          <Link href="/home-trials" className="block hover:text-black dark:hover:text-white transition" onClick={() => setIsOpen(false)}>Home Trials</Link>
          <Link href="/donation" className="block hover:text-black dark:hover:text-white transition" onClick={() => setIsOpen(false)}>Donation</Link>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
