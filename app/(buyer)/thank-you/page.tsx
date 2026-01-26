'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center p-6">
            <div className="bg-white max-w-lg w-full p-12 rounded-2xl shadow-xl text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-4xl font-serif mb-4 text-neutral-900">Thank You!</h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Your payment has been processed successfully.<br />
                    We hope you loved your Vogueish experience.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/shop"
                        className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-neutral-800 transition-all"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-4 text-gray-500 font-medium hover:text-black transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
