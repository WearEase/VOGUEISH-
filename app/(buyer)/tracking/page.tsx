'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, User } from 'lucide-react';

function TrackingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') === 'order' ? 'order' : 'trial';
    const [showOtp, setShowOtp] = useState(false);
    const [otp] = useState(Math.floor(1000 + Math.random() * 9000)); // Random 4-digit OTP

    const handleCompleteService = () => {
        // Simulate next step
        if (variant === 'trial') {
            router.push('/otp?next=/billing');
        } else {
            router.push('/otp?next=/shop');
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Map Placeholder */}
                    <div className="bg-blue-50 h-48 relative flex items-center justify-center border-b border-gray-100">
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse"></div>
                        <div className="relative z-10 bg-white px-4 py-2 rounded-full shadow-sm text-xs font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {variant === 'trial' ? 'Stylist is on the way' : 'Courier is on the way'}
                        </div>
                    </div>

                    <div className="p-6">
                        <h1 className="text-xl font-serif font-bold text-center mb-1">
                            {variant === 'trial' ? 'Tracking Visit #TRK-8821' : 'Tracking Order #ORD-8821'}
                        </h1>
                        <p className="text-center text-sm text-gray-500 mb-8">
                            {variant === 'trial' ? 'Arriving in approx. 25 mins' : 'Estimated delivery: 2–3 days'}
                        </p>

                        {/* Agent Info */}
                        <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                <User className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">{variant === 'trial' ? 'Sarah Jenkins' : 'Delivery Partner'}</h3>
                                <p className="text-xs text-gray-500">{variant === 'trial' ? 'Expert Stylist • 4.9 ★' : 'On the way • Live updates'}</p>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <Phone className="w-4 h-4 text-black" />
                            </button>
                        </div>

                        {/* Steps */}
                        <div className="space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2 mb-8">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                                <h4 className="text-sm font-semibold">{variant === 'trial' ? 'Booking Confirmed' : 'Order Confirmed'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">10:30 AM</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm animate-pulse"></div>
                                <h4 className="text-sm font-semibold text-blue-600">{variant === 'trial' ? 'Stylist Assigned' : 'Shipped'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">10:45 AM</p>
                            </div>
                            <div className="relative opacity-50">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
                                <h4 className="text-sm font-semibold">{variant === 'trial' ? 'Service Started' : 'Out for Delivery'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Pending</p>
                            </div>
                        </div>

                        {/* OTP Section */}
                        <div className="mb-6">
                            {!showOtp ? (
                                <button
                                    onClick={() => setShowOtp(true)}
                                    className="w-full py-3 border-2 border-dashed border-black rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Show Security OTP
                                </button>
                            ) : (
                                <div className="bg-neutral-900 text-white p-4 rounded-lg text-center">
                                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Share with Stylist</p>
                                    <div className="text-3xl font-mono spacing-widest font-bold tracking-[0.5em]">{otp}</div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Simulation Button (For Demo Flow) */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                        <button
                            onClick={handleCompleteService}
                            className="text-xs text-blue-600 underline hover:text-blue-800"
                        >
                            {variant === 'trial'
                                ? 'Next: Verify OTP & Proceed'
                                : 'Next: Verify OTP & Continue'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function TrackingPage() {
    return (
        <Suspense>
            <TrackingContent />
        </Suspense>
    );
}
