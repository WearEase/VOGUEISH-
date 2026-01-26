'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Home } from 'lucide-react';
import { useHomeTrial } from '@/context/HomeTrialContext';

// We can pass auth state as prop if needed, or use AuthContext if available
// For now, mirroring existing Navbar structure but observing contexts

export default function NavbarIcons() {
    const { itemCount: trialCount } = useHomeTrial();
    const [cartCount, setCartCount] = useState(0);

    // Load cart count akin to logic in Navbar
    useEffect(() => {
        const loadCart = () => {
            try {
                const cart = localStorage.getItem('ecommerce-cart');
                if (cart) {
                    const cartItems = JSON.parse(cart);
                    setCartCount(cartItems.length);
                } else {
                    setCartCount(0);
                }
            } catch (error) {
                console.error('Failed to parse cart', error);
            }
        };

        loadCart();

        const onStorageChange = (e: StorageEvent) => {
            if (e.key === 'ecommerce-cart') loadCart();
        };
        window.addEventListener('storage', onStorageChange);
        return () => window.removeEventListener('storage', onStorageChange);
    }, []);

    return (
        <div className="flex space-x-6 items-center">
            {/* Home Trial Bag */}
            <Link href="/service-fees" className="relative p-2 text-black rounded-full hover:bg-gray-100 transition-colors group" title="Home Trial Bag">
                <div className="relative">
                    <Home size={24} className="text-gray-700 group-hover:text-black" />
                    {trialCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium animate-in zoom-in">
                            {trialCount}
                        </span>
                    )}
                </div>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative p-2 text-black rounded-full hover:bg-gray-100 transition-colors group">
                <div className="relative">
                    <ShoppingBag size={24} className="text-gray-700 group-hover:text-black" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                            {cartCount}
                        </span>
                    )}
                </div>
            </Link>

            {/* User */}
            <Link href="/login" className="p-2 text-black rounded-full hover:bg-gray-100 transition-colors">
                <User size={24} className="text-gray-700 hover:text-black" />
            </Link>
        </div>
    );
}
