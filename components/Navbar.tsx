'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import NavbarIcons from './NavbarIcons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();



  // Pages where navbar should always be white, including shop slug pages
  const isForceWhite =
    pathname === '/shop' ||
    pathname === '/cart' ||
    pathname.startsWith('/shop/');  // Handles slug pages like /shop/blue-dress

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <nav
      className={clsx(
        'top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out',
        isForceWhite
          ? 'bg-white shadow-md fixed'
          : isScrolled
            ? 'bg-white shadow-md fixed'
            : 'bg-transparent shadow-none fixed'
      )}
    >
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
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
        <div className="hidden lg:flex space-x-12 text-gray-700 text-lg">
          <Link
            href="/shop"
            className={clsx(
              "hover:text-black",
              pathname === "/shop" || pathname.startsWith("/shop/") ? "text-black" : ""
            )}
          >
            Shop
          </Link>
          <Link
            href="/ai-bot"
            className={clsx("hover:text-black", pathname === "/ai-bot" ? "text-black" : "")}
          >
            AI Bot
          </Link>
          <Link
            href="/custom-tailoring"
            className={clsx(
              "hover:text-black",
              pathname === "/custom-tailoring" ? "text-black" : ""
            )}
          >
            Custom Tailoring
          </Link>
          <Link
            href="/home-trials"
            className={clsx("hover:text-black", pathname === "/home-trials" ? "text-black" : "")}
          >
            Home Trials
          </Link>
          <Link
            href="/donation"
            className={clsx(
              "hover:text-black",
              pathname === "/donation" ? "text-black" : ""
            )}
          >
            Donation
          </Link>
        </div>

        {/* Icons */}
        <NavbarIcons />
      </div>


      {/* Mobile Sidebar */}
      {
        isOpen && (
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-5 flex flex-col z-50">
            <button onClick={() => setIsOpen(false)} className="self-end p-2">
              <X size={24} />
            </button>
            <nav className="mt-6 space-y-4 text-lg text-gray-700">
              <Link href="/shop" className="block" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link href="/ai-bot" className="block" onClick={() => setIsOpen(false)}>AI Bot</Link>
              <Link href="/custom-tailoring" className="block" onClick={() => setIsOpen(false)}>Custom Tailoring</Link>
              <Link href="/home-trials" className="block" onClick={() => setIsOpen(false)}>Home Trials</Link>
              <Link href="/donation" className="block" onClick={() => setIsOpen(false)}>Donation</Link>
            </nav>
          </div>
        )
      }
    </nav >
  );
};

export default Navbar;
