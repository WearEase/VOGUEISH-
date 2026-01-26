// components/cart/PromoCode.tsx
import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { Coupon } from "@/types/cart";

interface PromoCodeProps {
  coupons: Coupon[];
  appliedCoupon: string;
  discount: number;
  subtotal: number;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export default function PromoCode({
  coupons,
  appliedCoupon,
  discount,
  subtotal,
  onApplyCoupon,
  onRemoveCoupon
}: PromoCodeProps) {
  const [coupon, setCoupon] = useState<string>("");
  const [showCoupons, setShowCoupons] = useState<boolean>(false);

  const handleApplyCoupon = () => {
    onApplyCoupon(coupon);
    setCoupon("");
    setShowCoupons(false);
  };

  return (
    <div className="bg-white rounded-lg mt-5 shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Promo Code
          </h3>
          {!showCoupons && (
            <button
              onClick={() => setShowCoupons(true)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View available codes
            </button>
          )}
        </div>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Code {appliedCoupon} applied</div>
                <div className="text-sm text-green-700">You saved ₹{discount.toLocaleString()}</div>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-green-600 hover:text-green-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <button
              onClick={handleApplyCoupon}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply
            </button>
          </div>
        )}

        {showCoupons && !appliedCoupon && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Available codes:</span>
              <button
                onClick={() => setShowCoupons(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Hide
              </button>
            </div>
            {coupons.map(c => {
              const isEligible = !c.minOrder || subtotal >= c.minOrder;
              
              return (
                <button
                  key={c.code}
                  onClick={() => setCoupon(c.code)}
                  disabled={!isEligible}
                  className={`w-full text-left p-3 border rounded-md transition-colors ${
                    isEligible 
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' 
                      :  'border-gray-200 opacity-50 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{c.code}</div>
                      <div className="text-xs text-gray-600">{c.description}</div>
                      {c.minOrder && (
                        <div className="text-xs text-gray-500 mt-1">
                          {isEligible 
                            ? `✓ Eligible (Min order: ₹${c.minOrder.toLocaleString()})` 
                            : `Min order: ₹${c.minOrder.toLocaleString()} (₹${(c.minOrder - subtotal).toLocaleString()} more needed)`
                          }
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {c.discount > 100 ? `₹${c.discount}` : `${c.discount}%`} OFF
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}