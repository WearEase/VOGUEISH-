"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, User } from 'lucide-react';
import { demoOrders } from '@/data/orders';

function TrackingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') === 'order' ? 'order' : 'trial';
    const orderId = searchParams.get('orderId') ?? 'ORD-8821';
    const order = demoOrders.find((item) => item.id === orderId) ?? demoOrders[0];
    const [showOtp, setShowOtp] = useState(false);
    const [otp] = useState(4321); // Set expected stylist arrival OTP as 4321
    const [trialId, setTrialId] = useState('HT-8402');
    const [realOrder, setRealOrder] = useState<any>(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const activeId = localStorage.getItem('activeHomeTrialId');
            if (activeId) {
                setTrialId(activeId);
            }
        }
    }, []);

    React.useEffect(() => {
        if (variant === 'order' && orderId) {
            fetch(`/api/orders/${orderId}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setRealOrder(data);
                })
                .catch(console.error);

            try {
                const tracked = JSON.parse(localStorage.getItem('trackedOrders') || '[]');
                if (!tracked.includes(orderId)) {
                    localStorage.setItem('trackedOrders', JSON.stringify([...tracked, orderId]));
                }
            } catch {
                // ignore
            }
        }
    }, [variant, orderId]);

    const orderData = realOrder || order;
    
    // Dynamic Timings
    const placedDate = new Date(orderData.createdAt || new Date());
    const confirmedTime = new Date(placedDate.getTime() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const shippedTime = new Date(placedDate.getTime() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const displayPlacedAt = orderData.createdAt 
        ? placedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : orderData.placedAt;

    const displayTotalItems = orderData.items ? orderData.items.length : orderData.totalItems;

    const handleCompleteService = () => {
        // Simulate next step
        if (variant === 'trial') {
            router.push(`/otp?next=/my-account&trialId=${trialId}&type=stylist_arrival&otp=4321`);
        } else {
            router.push('/otp?next=/shop');
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Map */}
                    <div className="h-48 relative overflow-hidden">
                        <iframe
                            src="https://www.openstreetmap.org/export/embed.html?bbox=77.1967%2C28.6215%2C77.2367%2C28.6415&layer=mapnik&marker=28.6315%2C77.2167"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Order tracking map"
                        />
                        {/* Cover OSM attribution bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white pointer-events-none"></div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-xs font-semibold flex items-center gap-2 pointer-events-none">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {variant === 'trial' ? 'Stylist is on the way' : 'Courier is on the way'}
                        </div>
                    </div>

                    <div className="p-6">
                        <h1 className="text-xl font-serif font-bold text-center mb-1">
                            {variant === 'trial' ? 'Tracking Visit #TRK-8821' : 'Tracking Order #ORD-8821'}
                        </h1>
                        <p className="text-center text-sm text-gray-500 mb-8">
                            {variant === 'trial' ? 'Arriving in approx. 25 mins' : `${orderData.status} • Estimated delivery: 2–3 days`}
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
                                <p className="text-xs text-gray-500 mt-0.5">{variant === 'trial' ? '10:30 AM' : confirmedTime}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm animate-pulse"></div>
                                <h4 className="text-sm font-semibold text-blue-600">{variant === 'trial' ? 'Stylist Assigned' : 'Shipped'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{variant === 'trial' ? '10:45 AM' : shippedTime}</p>
                            </div>
                            <div className="relative opacity-50">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
                                <h4 className="text-sm font-semibold">{variant === 'trial' ? 'Service Started' : 'Out for Delivery'}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Pending</p>
                            </div>
                        </div>

                        {variant === 'order' && (
                            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500">Order Details</p>
                                        <h4 className="mt-1 font-semibold text-gray-900">{orderData.id}</h4>
                                        <p className="text-sm text-gray-600">Placed on {displayPlacedAt}</p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {displayTotalItems} item{displayTotalItems > 1 ? 's' : ''} • ₹{orderData.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}

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

                        {variant === 'order' && (
                            <div className="mb-2 rounded-xl border border-black/10 bg-black text-white p-4">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Need a better fit?</p>
                                        <h4 className="mt-1 text-base font-semibold">Apply custom tailoring after tracking your order</h4>
                                        <p className="mt-1 text-sm text-white/70">You can open tailoring for this order whenever you need adjustments.</p>
                                    </div>
                                    <Link
                                        href="/custom-tailoring"
                                        className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
                                    >
                                        Open tailoring
                                    </Link>
                                </div>
                            </div>
                        )}

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
