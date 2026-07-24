"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, ShoppingBag, Sun, Sunrise, X } from "lucide-react";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { useHomeTrial } from "@/context/HomeTrialContext";

export default function CartPage() {
  const [homeTrial, setHomeTrial] = useState(false);
  const [homeTrialSlot, setHomeTrialSlot] = useState<string>("");
  const [selectedForTrial, setSelectedForTrial] = useState<Set<string>>(new Set());
  
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
  const checkoutHref = (trialItems.length > 0 || (homeTrial && selectedForTrial.size > 0)) ? "/service-fees" : "/checkout";

  const { addToHomeTrial } = useHomeTrial();

  const handleCheckoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (homeTrial && selectedForTrial.size > 0) {
      if (!homeTrialSlot) {
        e.preventDefault();
        alert("Please select a time slot for your home trial.");
        return;
      }
      
      // Move selected items to home trial
      const itemsToMove = cart.filter(item => selectedForTrial.has(item.id));
      itemsToMove.forEach(item => {
        addToHomeTrial(
          { ...item, mainImage: item.image } as any, 
          item.size || 'M'
        );
        removeItem(item.id);
      });
      
      // Navigate naturally to /service-fees (handled by Link)
    }
  };

  const toggleTrialSelection = (id: string) => {
    setSelectedForTrial(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const timeSlots = [
    "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", 
    "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", 
    "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", 
    "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM"
  ];

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
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        enabled ? colorClass : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const HomeTrialCard = () => (
    <div
      className={`rounded-xl border p-6 ${homeTrial ? "bg-purple-50 border-purple-200" : "bg-white border-gray-200"}`}
    >
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

        </div>
        <ToggleSwitch
          enabled={homeTrial}
          onToggle={() =>
            setHomeTrial((v) => {
              const next = !v;
              if (!next) {
                setHomeTrialSlot("");
                setSelectedForTrial(new Set());
              } else {
                // Auto-select all items by default when turning on
                setSelectedForTrial(new Set(cart.map(item => item.id)));
              }
              return next;
            })
          }
          colorClass="bg-purple-600 focus:ring-purple-500"
        />
      </div>

      {homeTrial && (
        <div className="mt-5 pt-5 border-t border-purple-200">
          <p className="text-sm font-medium text-gray-900 mb-3">Choose your preferred trial time slot</p>
          <div className="relative max-w-sm">
            <select
              value={homeTrialSlot}
              onChange={(e) => setHomeTrialSlot(e.target.value)}
              className="block w-full rounded-lg border-gray-300 bg-white py-3 pl-4 pr-10 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            >
              <option value="" disabled>Select a time slot...</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      )}
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
                  <div key={item.id} className="p-6 flex items-start gap-4">
                    {homeTrial && (
                      <div className="mt-8 shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedForTrial.has(item.id)}
                          onChange={() => toggleTrialSelection(item.id)}
                          className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CartItem
                        item={item}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        moveToWishlist={moveToWishlist}
                      />
                    </div>
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
            checkoutHref={checkoutHref}
            onCheckoutClick={handleCheckoutClick}
          />
        </div>
      </div>
    </main>
  );
}
