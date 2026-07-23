import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  showDescription?: boolean;
}

const parsePrice = (value: number | string | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatINR = (value: number | string | undefined) => {
  const numeric = parsePrice(value);
  return new Intl.NumberFormat('en-IN').format(numeric);
};

export default function ProductCard({ 
  product, 
  viewMode = 'grid', 
  isInWishlist, 
  onToggleWishlist,
  showDescription = false 
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [showSizePopup, setShowSizePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowSizePopup(false);
      }
    };
    if (showSizePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSizePopup]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.sizesAvailable && product.sizesAvailable.length > 0) {
      setShowSizePopup(!showSizePopup);
    } else {
      addToCart(product);
    }
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    addToCart(product, size);
    setShowSizePopup(false);
  };

  const real = parsePrice(product.realPrice);
  const discounted = parsePrice(product.discountedPrice);
  const discountPercentage = real > discounted 
    ? Math.round(((real - discounted) / real) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="group flex gap-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 p-6">
        <Link href={`/shop/${product.slug}`} className="flex-shrink-0">
          <div className="relative w-32 h-40 rounded-lg overflow-hidden">
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${product.extraImage1 ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'}`}
            />
            {product.extraImage1 && (
              <Image
                src={product.extraImage1}
                alt={`${product.name} back`}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
              />
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                -{discountPercentage}%
              </div>
            )}
          </div>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Link href={`/shop/${product.slug}`}>
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors text-lg">
                  {product.name}
                </h3>
              </Link>
              
              {showDescription && product.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl text-gray-900">
                  ₹{formatINR(product.discountedPrice)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{formatINR(product.realPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2" ref={popupRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="p-3 rounded-full transition-all duration-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  aria-label="Add to cart"
                  title="Add to cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                {showSizePopup && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-50 min-w-[120px]">
                    <p className="text-xs text-gray-500 font-semibold mb-2 px-1">Select Size:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {product.sizesAvailable?.map(size => (
                        <button
                          key={size}
                          onClick={(e) => handleSizeSelect(e, String(size))}
                          className="py-1 px-2 text-sm font-medium rounded bg-gray-50 border border-gray-100 hover:bg-black hover:text-white hover:border-black transition-colors"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isInWishlist 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400'
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-500 ${product.extraImage1 ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'}`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {product.extraImage1 && (
            <Image
              src={product.extraImage1}
              alt={`${product.name} back`}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-lg z-10">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </Link>
      
      <div className="absolute top-3 right-3 flex items-center gap-2" ref={popupRef}>
        <div className="relative">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="p-2.5 rounded-full shadow-lg bg-white/80 text-gray-700 hover:bg-white transition-all duration-200"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          {showSizePopup && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-50 min-w-[120px]">
              <p className="text-xs text-gray-500 font-semibold mb-2 px-1">Select Size:</p>
              <div className="grid grid-cols-2 gap-1">
                {product.sizesAvailable?.map(size => (
                  <button
                    key={size}
                    onClick={(e) => handleSizeSelect(e, String(size))}
                    className="py-1 px-2 text-sm font-medium rounded bg-gray-50 border border-gray-100 hover:bg-black hover:text-white hover:border-black transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
            isInWishlist 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5">
        <Link href={`/shop/${product.slug}`}>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">
              ₹{formatINR(product.discountedPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{formatINR(product.realPrice)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}