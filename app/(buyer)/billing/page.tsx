'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHomeTrial } from '@/context/HomeTrialContext';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPage() {
    const router = useRouter();
    const { trialItems, clearHomeTrial } = useHomeTrial();
    const [isProcessing, setIsProcessing] = useState(false);

    // In a real app, you'd select which items were actually bought during the trial.
    // For simplicity, we assume the user kept 2 random items or pays the service fee + selected items.
    // Let's assume they are paying the Service Fee + buying 1 item for the demo.

    const SERVICE_FEE = 499;

    const handlePayment = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Clear context
        clearHomeTrial();

        toast.success('Payment successful!');
        router.push('/thank-you');
    };

    return (
        <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-serif text-center mb-8">Final Billing</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            Service Completed
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Thank you for trying Vogueish Home Trial.</p>
                    </div>

                    <div className="p-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Home Trial Service Fee</span>
                                <span className="font-medium">₹{SERVICE_FEE}</span>
                            </div>
                            {/* Mocking a purchase for the demo */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Item: {trialItems[0]?.name || 'Fashion Item'} (Kept)</span>
                                <span className="font-medium">{trialItems[0]?.discountedPrice || '₹2,500'}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span className="">Security Deposit Adjustment</span>
                                <span className="font-medium">- ₹1,000</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-between text-lg font-bold">
                                <span>Total Due</span>
                                <span>₹{Math.max(0, SERVICE_FEE + (parseInt(trialItems[0]?.discountedPrice?.replace(/[^\d]/g, '') || '2500')) - 1000).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 ml-1">Payment Method</h3>
                <div className="space-y-3 mb-8">
                    {['Credit / Debit Card', 'UPI / Wallet', 'Cash on Delivery'].map((method, i) => (
                        <label key={i} className="flex items-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-black transition-all">
                            <input type="radio" name="payment" className="w-4 h-4 text-black focus:ring-black" defaultChecked={i === 0} />
                            <span className="ml-3 font-medium text-gray-700">{method}</span>
                        </label>
                    ))}
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium tracking-wide hover:bg-neutral-800 transition-all shadow-lg disabled:opacity-70 disabled:cursor-wait"
                >
                    {isProcessing ? 'Processing Payment...' : 'Pay Now'}
                </button>

            </div>
        </div>
    );
}
