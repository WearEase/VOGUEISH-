
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, X, Heart } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  onMoveToWishlist: (item: CartItemType) => void;
}

export default function CartItem({ 
  item, 
  updateQuantity, 
  removeItem, 
  onMoveToWishlist 
}: CartItemProps) {
  return (
    <div className="flex gap-4">
      {/* Product Image */}
      <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link href={`/shop/${item.slug}`}>
              <h3 className="text-base font-medium text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600">{item.brand}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onMoveToWishlist(item)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Move to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Remove Item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-3 space-y-1">
          {item.color && (
            <div className="flex items-center gap-2">
              <span>Color:</span>
              <span className="font-medium">{item.color}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>Size:</span>
            <span className="font-medium">{item.size}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <div className="px-4 py-2 text-sm font-medium text-gray-900 border-x border-gray-300 min-w-[3rem] text-center">
              {item.quantity}
            </div>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="p-2 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Price and Stock */}
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              ₹{(item.realPrice * item.quantity).toLocaleString()}
            </div>
            <div className={`text-xs mt-1 ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {item.inStock ? 'In Stock' : 'Out of Stock - Will ship when available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}