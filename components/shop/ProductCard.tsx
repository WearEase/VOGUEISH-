import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface Product {
  slug: string;
  name: string;
  brand: string;
  mainImage: string;
  discountedPrice: number;
  realPrice: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  showDescription?: boolean;
}

export default function ProductCard({ 
  product, 
  viewMode = 'grid', 
  isInWishlist, 
  onToggleWishlist,
  showDescription = false 
}: ProductCardProps) {
  const discountPercentage = product.realPrice > product.discountedPrice 
    ? Math.round(((product.realPrice - product.discountedPrice) / product.realPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 p-6">
        <Link href={`/shop/${product.slug}`} className="flex-shrink-0">
          <div className="relative w-32 h-40 rounded-lg overflow-hidden">
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
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
                  {product.discountedPrice.toLocaleString()}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.realPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-3 rounded-full transition-all duration-200 ${
                isInWishlist 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                  : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
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
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-lg">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </Link>
      
      <button
        onClick={() => onToggleWishlist(product)}
        className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
          isInWishlist 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
      </button>

      <div className="p-5">
        <Link href={`/shop/${product.slug}`}>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">
              ₹{product.discountedPrice.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.realPrice.toLocaleString()}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}