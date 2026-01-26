import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-8">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}