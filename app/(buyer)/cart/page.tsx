"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import CartHeader from "@/components/cart/CartHeader";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  // State for premium services toggles and inputs
  const [customTailoring, setCustomTailoring] = useState(false);
  const [measurements, setMeasurements] = useState("");
  const [homeTrial, setHomeTrial] = useState(false);
  const [trialSlot, setTrialSlot] = useState("");

  // Cart hook state and actions
  const {
    cart,
    wishlist,
    isLoading,
    notification,
    clearCart,
    updateQuantity,
    removeItem,
    moveToWishlist,
    applyCouponCode,
    removeCoupon,
    appliedCoupon,
    discount,
    getSavings,
    coupons,
    getSubtotal,
  } = useCart();

  const subtotal = getSubtotal();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Reusable Toggle Switch component
  const ToggleSwitch = ({
    enabled,
    onToggle,
    colorClass,
  }: {
    enabled: boolean;
    onToggle: () => void;
    colorClass: string;
  }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${enabled ? colorClass : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  // Custom Tailoring card JSX
  const CustomTailoringCard = () => (
    <div
      className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
        customTailoring ? "border-blue-400 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9m12 0v6m0 0v6m0-6h-4"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Custom Tailoring</h4>
              <p className="text-sm text-gray-600">Perfect fit guaranteed</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Get your garments tailored to your exact measurements for the perfect fit every time.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Free alteration
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              7-day delivery
            </span>
          </div>
        </div>
        <div className="ml-4">
          <ToggleSwitch
            enabled={customTailoring}
            onToggle={() => setCustomTailoring(!customTailoring)}
            colorClass="bg-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      {customTailoring && (
        <div className="mt-4 pt-4 border-t border-blue-200 animate-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share your measurements
          </label>
          <textarea
            value={measurements}
            onChange={(e) => setMeasurements(e.target.value)}
            rows={3}
            placeholder="Example: Chest: 38, Waist: 32 Shoulder: 16, Sleeve: 25"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Our tailoring expert will contact you for precise measurements
          </p>
        </div>
      )}
    </div>
  );

  // Home Trial card JSX
const HomeTrialCard = () => {
  const timeSlots = [
    { value: "morning", label: "Morning", time: "9 AM - 12 PM", icon: "🌅" },
    { value: "afternoon", label: "Afternoon", time: "12 PM - 3 PM", icon: "☀️" },
    { value: "evening", label: "Evening", time: "4 PM - 7 PM", icon: "🌆" },
  ];

  return (
    <div
      className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
        homeTrial
          ? "border-purple-400 bg-purple-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Home Trial</h4>
              <p className="text-sm text-gray-600">Try before you buy</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Experience our outfits in the comfort of your home. Return what doesn&apos;t fit perfectly.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Free service</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">3-day trial</span>
          </div>
        </div>
        <div className="sm:ml-4">
          <ToggleSwitch
            enabled={homeTrial}
            onToggle={() => setHomeTrial(!homeTrial)}
            colorClass="bg-purple-600 focus:ring-purple-500"
          />
        </div>
      </div>

      {homeTrial && (
        <div className="mt-4 pt-4 border-t border-purple-200 animate-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose your preferred trial time slot
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {timeSlots.map(({ value, label, time, icon }) => (
              <button
                key={value}
                onClick={() => setTrialSlot(value)}
                type="button"
                className={`flex w-full sm:w-auto items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors focus:outline-none ${
                  trialSlot === value
                    ? "bg-purple-600 text-white border-transparent shadow"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-400"
                }`}
              >
                <span className="text-lg">{icon}</span>
                <div className="text-left">
                  <p>{label}</p>
                  <p className="text-xs text-purple-300">{time}</p>
                </div>
                {trialSlot === value && (
                  <Check className="ml-auto text-white" size={20} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <CartHeader
          clearCart={clearCart}
          wishlist={wishlist}
          cart={cart}
          isLoading={isLoading}
          notification={notification}
        />

        <section className="grid gap-12 md:grid-cols-[1fr_360px] mt-12">
          {/* Left side - Cart Items and Addons */}
          <div className="space-y-8">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                moveToWishlist={moveToWishlist}
              />
            ))}

            {/* Addons Section */}
            <div className="space-y-6">
              <CustomTailoringCard />
              <HomeTrialCard />
            </div>
          </div>

          {/* Right side - Order Summary */}
          <OrderSummary
            cart={cart}
            appliedCoupon={appliedCoupon}
            discount={discount}
            getSavings={getSavings}
            coupons={coupons}
            removeCoupon={removeCoupon}
            applyCouponCode={applyCouponCode}
            subtotal={subtotal}
            customTailoring={customTailoring}
            homeTrial={homeTrial}
          />
        </section>
      </div>
    </main>
  );
}
