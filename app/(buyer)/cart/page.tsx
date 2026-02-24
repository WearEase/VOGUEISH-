"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { useHomeTrial } from "@/context/HomeTrialContext";

export default function CartPage() {
  const [customTailoring, setCustomTailoring] = useState(false);
  const [homeTrial, setHomeTrial] = useState(false);
  const {
    trialItems,
    removeFromHomeTrial,
    clearHomeTrial,
    itemCount: trialCount,
  } = useHomeTrial();

  // Cart hook state and actions
  const {
    cart,
    isLoading,
    notification,
    clearCart,
    updateQuantity,
    removeItem,
    moveToWishlist,
    appliedCoupon,
    discount,
    getSavings,
    getSubtotal,
    getShippingFee,
    getTax,
    getTotal,
  } = useCart();

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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

  const CustomTailoringCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-semibold">T</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Custom Tailoring</h4>
              <p className="text-sm text-gray-600">Perfect fit guaranteed</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            Get your garments tailored to your exact measurements for the perfect fit every time.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Free alteration</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">7-day delivery</span>
          </div>
        </div>
        <ToggleSwitch
          enabled={customTailoring}
          onToggle={() => setCustomTailoring((v) => !v)}
          colorClass="bg-blue-600 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const HomeTrialCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-700 font-semibold">H</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Home Trial</h4>
              <p className="text-sm text-gray-600">Try before you buy</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            Experience our outfits in the comfort of your home. Return what doesn&apos;t fit perfectly.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Free service</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">3-day trial</span>
          </div>
        </div>
        <ToggleSwitch
          enabled={homeTrial}
          onToggle={() => setHomeTrial((v) => !v)}
          colorClass="bg-purple-600 focus:ring-purple-500"
        />
      </div>
    </div>
  );

  if (cart.length === 0 && trialItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {notification && (
          <div className="pt-6">
            <div className="rounded-lg bg-black text-white px-4 py-3 text-sm">
              {notification}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gray-900" />
                <h1 className="text-lg font-semibold text-gray-900">Shopping Cart</h1>
                <span className="text-sm text-gray-500">({totalItems + trialCount} items)</span>
              </div>
              {(cart.length > 0 || trialItems.length > 0) && (
                <button
                  onClick={() => {
                    clearCart();
                    clearHomeTrial();
                  }}
                  className="text-sm text-gray-600 hover:text-black"
                  type="button"
                >
                  Clear cart
                </button>
              )}
            </div>

            {cart.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6">
                    <CartItem
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      moveToWishlist={moveToWishlist}
                    />
                  </div>
                ))}
              </div>
            )}

            {trialItems.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Home Trial Bag</h2>
                    <p className="text-sm text-gray-500">({trialItems.length} items)</p>
                  </div>
                  <Link href="/shop" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Add more
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {trialItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="p-6 flex gap-4">
                      <div className="relative h-24 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                        <Image src={item.mainImage} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.brand}</p>
                            <p className="text-sm text-gray-600 mt-1">Size: <span className="font-medium">{item.selectedSize}</span></p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromHomeTrial(item.id, item.selectedSize)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 text-sm font-semibold text-gray-900">{item.discountedPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <CustomTailoringCard />
              <HomeTrialCard />
            </div>
          </div>

          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            appliedCoupon={appliedCoupon}
            shippingFee={shippingFee}
            tax={tax}
            total={total}
            totalItems={totalItems + trialItems.length}
            savings={getSavings()}
            freeShippingThreshold={1999}
          />
        </div>
      </div>
    </main>
  );
}
