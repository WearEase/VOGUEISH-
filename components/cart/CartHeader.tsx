import { ShoppingBag, Trash2 } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  onClearCart: () => void;
}

export default function CartHeader({ itemCount, onClearCart }: CartHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
            <span className="text-sm text-gray-500 ml-2">({itemCount} items)</span>
          </div>
          
          {itemCount > 0 && (
            <button
              onClick={onClearCart}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}