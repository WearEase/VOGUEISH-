'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';
import { useHomeTrial } from '@/context/HomeTrialContext';

// We can pass auth state as prop if needed, or use AuthContext if available
// For now, mirroring existing Navbar structure but observing contexts

export default function NavbarIcons() {
    const { itemCount: trialCount } = useHomeTrial();
    const [cartCount, setCartCount] = useState(0);

    const getQuantity = (item: unknown): number => {
        if (typeof item !== 'object' || item === null) return 1;
        const record = item as Record<string, unknown>;
        const quantity = record.quantity;
        return typeof quantity === 'number' && Number.isFinite(quantity) ? quantity : 1;
    };

    // Load cart count akin to logic in Navbar
    useEffect(() => {
        const loadCart = () => {
            try {
                const cart = localStorage.getItem('ecommerce-cart');
                if (cart) {
                    const cartItems = JSON.parse(cart);
                    const count = Array.isArray(cartItems)
                        ? cartItems.reduce((acc: number, item: unknown) => acc + getQuantity(item), 0)
                        : 0;
                    setCartCount(count);
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
            {/* Shopping Cart */}
            <Link href="/cart" className="relative p-2 text-black rounded-full hover:bg-gray-100 transition-colors group">
                <div className="relative">
                    <ShoppingBag size={24} className="text-gray-700 group-hover:text-black" />
                    {(cartCount + trialCount) > 0 && (
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                            {cartCount + trialCount}
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
