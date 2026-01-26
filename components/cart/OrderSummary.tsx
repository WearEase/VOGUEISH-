import { Shield, Truck, ArrowRight } from "lucide-react";

interface OrderSummaryProps {
  subtotal?: number;
  discount?: number;
  appliedCoupon?: string;
  shippingFee?: number;
  tax?: number;
  total?: number;
  totalItems?: number;
  savings?: number;
  freeShippingThreshold?: number;
}

export default function OrderSummary({
  subtotal = 0,
  discount = 0,
  appliedCoupon = "",
  shippingFee = 0,
  tax = 0,
  total = 0,
  totalItems = 0,
  savings = 0,
  freeShippingThreshold = 0,
}: OrderSummaryProps) {
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount ({appliedCoupon})</span>
              <span className="font-medium text-green-600">
                -₹{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shippingFee === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `₹${shippingFee.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-medium">₹{tax.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total Amount</span>
            <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <div className="text-sm text-green-600 mt-1">
              You&apos;re saving ₹{savings.toLocaleString()} on this order!
            </div>
          )}
        </div>

        {shippingFee > 0 && remainingForFreeShipping > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Free Shipping</span>
            </div>
            <div className="text-sm text-blue-700 mb-2">
              Add ₹{remainingForFreeShipping.toLocaleString()} more for free shipping
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4">
          Proceed to Checkout
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure 256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <span>Free returns within 30 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
