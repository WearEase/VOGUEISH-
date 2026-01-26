import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { WishlistItem } from "@/types/cart";

interface WishlistSidebarProps {
  wishlist: WishlistItem[];
}

export default function WishlistSidebar({ wishlist }: WishlistSidebarProps) {
  if (wishlist.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Your Wishlist
        </h3>
        <div className="space-y-4">
          {wishlist.slice(0, 3).map(item => (
            <div key={item.id} className="flex gap-3">
              <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
                <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${item.slug}`}>
                  <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.name}
                  </h4>
                </Link>
                <p className="text-xs text-gray-600">{item.brand}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ₹{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {wishlist.length > 3 && (
            <Link
              href="/wishlist"
              className="block text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              View all {wishlist.length} items →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}