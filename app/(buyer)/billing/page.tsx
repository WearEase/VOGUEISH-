"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface KeptItem {
  name: string;
  brand: string;
  price: number;
}

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trialId = searchParams.get('trialId');
  const itemsParam = searchParams.get('items'); // Comma-separated names of kept items
  const source = searchParams.get('source');
  const { data: session } = useSession();

  const [keptItems, setKeptItems] = useState<KeptItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('online');
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

  useEffect(() => {
    interface DBTrialItem {
      name: string;
      brand: string;
      price: number;
    }
    interface DBTrial {
      id: string;
      items?: DBTrialItem[];
    }

    if (source === 'home-trial-buy' && trialId && itemsParam) {
      const selectedNames = decodeURIComponent(itemsParam).split(',');
      const email = session?.user?.email ?? localUserEmail ?? "buyer@vogueish.com";
      
      // Attempt to fetch from DB first
      async function loadTrial() {
        try {
          const res = await fetch(`/api/home-trials?email=${encodeURIComponent(email)}`); // fetching all to find ours
          if (res.ok) {
            const data = await res.json();
            const activeTrial = data.find((t: DBTrial) => t.id === trialId);
            if (activeTrial && activeTrial.items) {
              const matched = activeTrial.items.filter((item: DBTrialItem) => selectedNames.includes(item.name));
              if (matched.length > 0) {
                setKeptItems(matched.map((item: DBTrialItem) => ({
                  name: item.name,
                  brand: item.brand,
                  price: typeof item.price === 'number' ? item.price : 2500
                })));
                return;
              }
            }
          }
        } catch (err) {
          console.error(err);
        }

        // Fallback to local storage
        try {
          const stored = JSON.parse(localStorage.getItem('profileHomeTrials') || '[]');
          const activeTrial = stored.find((t: DBTrial) => t.id === trialId);
          if (activeTrial && activeTrial.items) {
            const matched = activeTrial.items.filter((item: DBTrialItem) => selectedNames.includes(item.name));
            if (matched.length > 0) {
              setKeptItems(matched.map((item: DBTrialItem) => ({
                name: item.name,
                brand: item.brand,
                price: typeof item.price === 'number' ? item.price : 2500
              })));
              return;
            }
          }
        } catch (err) {
          console.error(err);
        }

        // fallback mock if it fails to find in DB or localStorage
        setKeptItems(selectedNames.map(name => ({
          name,
          brand: "Lashkaraa",
          price: 2500
        })));
      }

      loadTrial();
    } else {
      // Mock standard products if no home trial items passed
      setKeptItems([
        { name: "Classic Cotton Kurta", brand: "Vogueish Premium", price: 1899 }
      ]);
    }
  }, [source, trialId, itemsParam, session, localUserEmail]);

  const subtotal = keptItems.reduce((acc, item) => acc + item.price, 0);
  const DEPOSIT_CREDIT_PER_ITEM = 100;
  const totalDepositCredit = source === 'home-trial-buy' ? keptItems.length * DEPOSIT_CREDIT_PER_ITEM : 0;
  const totalPayable = Math.max(0, subtotal - totalDepositCredit);

  const handlePayment = async () => {
    setIsProcessing(true);

    if (selectedMethod === 'online' && totalPayable > 0) {
      // Load Razorpay SDK
      const res = await new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!res) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        setIsProcessing(false);
        return;
      }

      // Create Razorpay Order
      try {
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalPayable }),
        });
        const orderData = await createRes.json();
        if (!createRes.ok || !orderData.orderId) {
          toast.error(orderData.error || 'Failed to initialize payment');
          setIsProcessing(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: "INR",
          name: "Vogueish",
          description: source === 'home-trial-buy' ? "Home Trial Purchase" : "Order Payment",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (source === 'home-trial-buy') {
                localStorage.removeItem('activeHomeTrialId');
                localStorage.removeItem('activeHomeTrialOtp');
              }
              toast.success('Payment successful!');
              router.push('/thank-you');
            } else {
              toast.error('Payment verification failed.');
              setIsProcessing(false);
            }
          },
          prefill: { email: session?.user?.email || localUserEmail || "buyer@vogueish.com" },
          theme: { color: "#000000" },
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function () {
          toast.error('Payment failed or cancelled.');
          setIsProcessing(false);
        });
        rzp.open();
      } catch (err) {
        console.error(err);
        toast.error("Failed to start Razorpay payment.");
        setIsProcessing(false);
      }
    } else {
      // Cash on delivery or zero amount
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (source === 'home-trial-buy') {
        localStorage.removeItem('activeHomeTrialId');
        localStorage.removeItem('activeHomeTrialOtp');
      }
      toast.success('Order confirmed!');
      router.push('/thank-you');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/my-account')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <h1 className="text-3xl font-serif text-center mb-8">
          {source === 'home-trial-buy' ? 'Final Payment (Home Trial Outfits)' : 'Direct Order Invoice'}
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 bg-neutral-900 text-white">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {source === 'home-trial-buy' ? 'Home Trial Selection Check' : 'Order Payment'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {source === 'home-trial-buy'
                ? `Invoice generated for active trial ID: ${trialId}`
                : 'Direct purchase from store catalog.'
              }
            </p>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Garment Breakdown</h3>
            <div className="divide-y divide-gray-100">
              {keptItems.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <p className="text-[10px] text-gray-400">{item.brand}</p>
                  </div>
                  <span className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              
              {source === 'home-trial-buy' && (
                <div className="flex justify-between text-emerald-600">
                  <span>Refundable Security Deposit Credit ({keptItems.length} items)</span>
                  <span className="font-semibold">-₹{totalDepositCredit.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-between text-lg font-bold text-gray-900">
                <span>Total Payable</span>
                <span>₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">Payment Method</h3>
        <div className="space-y-3 mb-8">
          {[
            { value: 'online', label: 'Pay Online' },
            { value: 'cod', label: 'Cash on Delivery' },
          ].map((method) => (
            <label
              key={method.value}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all bg-white ${
                selectedMethod === method.value ? 'border-black' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment_opt"
                value={method.value}
                checked={selectedMethod === method.value}
                onChange={() => setSelectedMethod(method.value)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <span className="ml-3 font-semibold text-gray-700 text-sm">{method.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-md disabled:opacity-70 disabled:cursor-wait"
        >
          {isProcessing ? 'Processing Payment...' : `Confirm & Pay ₹${totalPayable}`}
        </button>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center">
        <div className="text-center font-medium text-gray-500 animate-pulse">Loading billing details...</div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
