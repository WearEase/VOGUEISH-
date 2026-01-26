'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useHomeTrial } from '@/context/HomeTrialContext';
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ServiceFeesPage() {
    const { trialItems, isValidTrial, itemCount } = useHomeTrial();
    const router = useRouter();

    const SERVICE_FEE = 499; // Example fixed fee
    const DEPOSIT_PER_ITEM = 100; // Example deposit

    const totalDeposit = itemCount * DEPOSIT_PER_ITEM;
    const totalPayable = SERVICE_FEE + totalDeposit;

    if (trialItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#f9f8f6] py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-3xl font-serif mb-4">Your Home Trial Bag is Empty</h1>
                    <p className="text-gray-600 mb-8">Select 5-10 items to experience them at home.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-serif mb-8 text-center">Service Fees & Order Summary</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Validation Alert */}
                        {!isValidTrial && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-700">Invalid Selection Limit</h3>
                                    <p className="text-sm text-red-600 mt-1">
                                        Please select between 5 and 10 items for a Home Trial.
                                        Current count: <strong>{itemCount}</strong>
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h2 className="font-medium text-gray-900">Selected Items ({itemCount})</h2>
                                <Link href="/shop" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Add More
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {trialItems.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="p-4 flex gap-4">
                                        <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                            <Image
                                                src={item.mainImage}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.brand}</p>
                                            <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize}</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">{item.discountedPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Action */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">Fee Breakdown</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Fee</span>
                                    <span className="font-medium">₹{SERVICE_FEE}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Security Deposit ({itemCount} items)</span>
                                    <span className="font-medium">₹{totalDeposit}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-semibold">
                                    <span>Total Payable</span>
                                    <span>₹{totalPayable}</span>
                                </div>
                            </div>

                            <div className="mt-4 bg-blue-50 p-3 rounded-lg text-xs text-blue-700 leading-relaxed">
                                <p className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    Fully refundable security deposit after trial completion.
                                </p>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => router.push('/address-details')}
                                    disabled={!isValidTrial}
                                    className={`w-full py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${isValidTrial
                                            ? 'bg-black text-white hover:bg-neutral-800 shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Proceed to Address
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                {!isValidTrial && (
                                    <p className="text-xs text-center text-red-500 mt-2">
                                        {itemCount < 5 ? `Add ${5 - itemCount} more item(s)` : `Remove ${itemCount - 10} item(s)`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
