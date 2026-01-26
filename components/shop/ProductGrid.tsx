import ProductCard from './ProductCard';

interface Product {
  slug: string;
  name: string;
  brand: string;
  mainImage: string;
  discountedPrice: number;
  realPrice: number;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  showDescription?: boolean;
  className?: string;
}

export default function ProductGrid({ 
  products, 
  viewMode, 
  wishlist, 
  onToggleWishlist,
  showDescription = false,
  className = ""
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "space-y-6"
      }>
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            viewMode={viewMode}
            isInWishlist={wishlist.includes(product.slug)}
            onToggleWishlist={onToggleWishlist}
            showDescription={showDescription}
          />
        ))}
      </div>
    </div>
  );
}