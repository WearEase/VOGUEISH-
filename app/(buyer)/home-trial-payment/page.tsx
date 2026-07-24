"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const parseNumericPrice = (val: any): number => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 2500 : parsed;
  }
  return 2500;
};
import Link from 'next/link';
import Image from 'next/image';
import { useHomeTrial } from '@/context/HomeTrialContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function HomeTrialPaymentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { trialItems, itemCount, clearHomeTrial } = useHomeTrial();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [localUserEmail, setLocalUserEmail] = useState('');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.email) {
        setLocalUserEmail(user.email);
      }
    } catch {
      // ignore
    }
  }, []);

  const SERVICE_FEE = 499;
  const DEPOSIT_PER_ITEM = 100;
  const totalDeposit = itemCount * DEPOSIT_PER_ITEM;
  const totalPayable = SERVICE_FEE + totalDeposit;

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#f9f8f6] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">Your Home Trial Bag is Empty</h1>
          <p className="text-gray-600 mb-8">Select items to experience them at home.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const email = session?.user?.email || localUserEmail || "buyer@vogueish.com";
    const trialId = `HT-${Math.floor(1000 + Math.random() * 9000)}`;

    // Get address details from state/localStorage if available, else mock
    let fullName = "Jane Doe";
    let phone = "9876543210";
    let addressLine1 = "Flat 4B, Signature Crest, Indiranagar";
    let pincode = "560038";
    let date = new Date().toISOString().split('T')[0];
    let timeSlot = "12:00 PM - 02:00 PM";
    let serviceType = "Female";

    try {
      // Try to read address values entered in the previous step
      const savedAddress = localStorage.getItem('lastEnteredAddress');
      if (savedAddress) {
        const parsed = JSON.parse(savedAddress);
        fullName = parsed.fullName || fullName;
        phone = parsed.phone || phone;
        addressLine1 = parsed.addressLine1 || addressLine1;
        pincode = parsed.pincode || pincode;
        date = parsed.date || date;
        timeSlot = parsed.timeSlot || timeSlot;
        serviceType = parsed.serviceType || serviceType;
      }
    } catch {
      // ignore
    }

    const trialPayload = {
      id: trialId,
      userEmail: email,
      fullName,
      phone,
      addressLine1,
      pincode,
      date,
      timeSlot,
      serviceType,
      items: trialItems.map((item) => ({
        id: String(item.id || (item as any)._id || Math.random().toString()),
        name: String(item.name || (item as any).title || 'Unknown Product'),
        brand: String(item.brand || 'Vogueish'),
        price: parseNumericPrice(item.discountedPrice || (item as any).price || item.realPrice),
        selectedSize: String(item.selectedSize || 'M'),
        mainImage: String(item.mainImage || (item as any).image || ''),
      })),
    };

    try {
      const res = await fetch('/api/home-trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trialPayload),
      });

      if (!res.ok) {
        throw new Error('API failed to save Home Trial');
      }

      // Save active trial details to localStorage
      localStorage.setItem('activeHomeTrialId', trialId);
      localStorage.setItem('activeHomeTrialOtp', '1234'); // Demo booking confirmation code

      // Save duplicate copy of the booked trial to local storage array profileHomeTrials
      try {
        const existingTrialsRaw = localStorage.getItem('profileHomeTrials') || '[]';
        const existingTrials = JSON.parse(existingTrialsRaw);
        const newLocalTrial = {
          id: trialId,
          placedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Pending',
          vendorStatus: 'Stylist is on the way',
          otpVerified: false,
          items: trialItems.map((item) => ({
            name: item.name,
            brand: item.brand,
            size: item.selectedSize || 'M',
            price: typeof item.discountedPrice === 'number' ? item.discountedPrice : 2500,
          })),
          date,
        };
        localStorage.setItem('profileHomeTrials', JSON.stringify([newLocalTrial, ...existingTrials]));
      } catch (err) {
        console.error("Failed to backup trial to localStorage:", err);
      }

      // Clear the trial bag items
      clearHomeTrial();

      toast.success('Service charge payment successful!');
      router.push(`/otp?next=/tracking&trialId=${trialId}&type=home-trial-booking&otp=1234`);
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/address-details" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Address
        </Link>

        <h1 className="text-3xl font-serif text-center mb-8">Ship Out</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Service Charge & Security Deposits
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Home Trial Service Fee</span>
                  <span className="font-semibold text-gray-900">₹{SERVICE_FEE}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit ({itemCount} items @ ₹100/each)</span>
                  <span className="font-semibold text-gray-900">₹{totalDeposit}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Booking Amount</span>
                  <span>₹{totalPayable}</span>
                </div>
              </div>

              <div className="mt-4 bg-emerald-50 p-3 rounded-lg text-xs text-emerald-800 leading-relaxed">
                * The security deposit is fully refunded or adjusted back to you after the trial completion.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'card', label: 'Credit / Debit Card' },
                  { value: 'upi', label: 'UPI / Wallet' },
                  { value: 'cod', label: 'Cash on Delivery (Pay to Stylist)' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === method.value ? 'border-black bg-neutral-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={selectedMethod === method.value}
                      onChange={() => setSelectedMethod(method.value)}
                      className="w-4 h-4 text-black focus:ring-black"
                    />
                    <span className="ml-3 font-medium text-gray-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Checkout Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Selected Outfits</h3>
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-2 mb-6">
                {trialItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex gap-3">
                    <div className="w-12 h-16 relative rounded overflow-hidden shrink-0">
                      <Image src={item.mainImage} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-500">{item.brand}</p>
                      <p className="text-[10px] text-gray-700 font-medium mt-1">Size: {item.selectedSize}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-neutral-800 transition-all shadow-md disabled:opacity-70 disabled:cursor-wait uppercase tracking-widest text-xs"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${totalPayable}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
