'use client';

import { useParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product, TabType } from '@/types/product';
import { Cormorant_Garamond } from 'next/font/google';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Home } from 'lucide-react';
import { useHomeTrial } from '@/context/HomeTrialContext';
import { toast } from 'sonner';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  size: string;
  realPrice: number;
  quantity: number;
  image: string;
  slug: string;
  inStock: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  image: string;
  slug: string;
}

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToHomeTrial, trialItems } = useHomeTrial();
  const product: Product | undefined = products.find((p) => p.slug === slug);

  const images = product
    ? [
      product.mainImage,
      product.extraImage1,
      product.extraImage2,
      product.extraImage3,
      product.extraImage4,
    ].filter(Boolean) as string[]
    : [];

  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [didHydrateStorage, setDidHydrateStorage] = useState(false);

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    setDidHydrateStorage(false);
    const savedCart = localStorage.getItem('ecommerce-cart');
    const savedWishlist = localStorage.getItem('ecommerce-wishlist');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }

    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        setWishlist(wishlistData);
        setIsInWishlist(wishlistData.some((item: WishlistItem) => item.slug === slug));
      } catch {
        setWishlist([]);
        setIsInWishlist(false);
      }
    }

    // Prevent the initial "save" effects from overwriting storage with empty arrays.
    setDidHydrateStorage(true);
  }, [slug]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!didHydrateStorage) return;
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('ecommerce-cart-updated'));
  }, [cart, didHydrateStorage]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!didHydrateStorage) return;
    localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
  }, [wishlist, didHydrateStorage]);

  const addToCart = () => {
    if (!product || !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const cartItemId = `${product.slug}-${selectedSize}`;
    const numericPrice = typeof product.discountedPrice === 'string'
      ? Number(product.discountedPrice.replace(/[^0-9.]/g, ''))
      : product.discountedPrice;

    setCart((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      }

      const newCartItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        realPrice: Number.isFinite(numericPrice) ? Number(numericPrice) : 0,
        size: selectedSize,
        quantity,
        image: product.mainImage,
        slug: product.slug,
        inStock: true,
      };
      return [...prev, newCartItem];
    });

    toast.success('Added to cart! Redirecting...');
    setShowAddedToCart(true);
    setTimeout(() => {
      setShowAddedToCart(false);
      router.push('/cart');
    }, 500);
  };

  const handleHomeTrial = () => {
    if (!product || !selectedSize) {
      toast.error('Please select a size for Home Trial');
      return;
    }

    if (trialItems.length >= 10) {
      toast.error('Maximum 10 items allowed for Home Trial');
      return;
    }

    addToHomeTrial(product, selectedSize);

    // Redirect to service fees page as requested
    toast.success('Added to Home Trial Bag! Redirecting...');
    setTimeout(() => {
      router.push('/service-fees');
    }, 500);
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.slug !== product.slug);
      setWishlist(updatedWishlist);
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      const wishlistItem: WishlistItem = {
        id: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.discountedPrice,
        image: product.mainImage,
        slug: product.slug,
      };
      setWishlist([...wishlist, wishlistItem]);
      setIsInWishlist(true);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8f6] p-6 md:p-12 text-neutral-800">
      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Added to cart!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* Left - Images */}
        <div className="flex gap-6">
          {/* Thumbnails */}
          <div className="flex flex-col gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(img)}
                className={`overflow-hidden border rounded-lg w-16 h-16 ${selectedImg === img ? 'ring-2 ring-neutral-800' : ''
                  }`}
              >
                <Image
                  src={img}
                  alt={`thumb-${i}`}
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={selectedImg}
              alt="main"
              fill
              className="object-cover transition-all duration-300"
            />

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all ${isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">
              {product.brand}
            </h3>
            <h1 className={`text-4xl font-semibold ${cormorant.className}`}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(128 reviews)</span>
            </div>

            <div className="flex items-center gap-3 text-xl mt-3">
              {product.discountedPrice.toLocaleString()}
              <span className="line-through text-gray-400 text-base">
                {product.realPrice.toLocaleString()}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {Math.round(((parseInt(String(product.realPrice).replace(/[^\d]/g, '')) - parseInt(String(product.discountedPrice).replace(/[^\d]/g, ''))) / parseInt(String(product.realPrice).replace(/[^\d]/g, ''))) * 100)}% OFF
              </span>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Select Size</h4>
              <div className="flex gap-3 flex-wrap">
                {product.sizesAvailable.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${selectedSize === size
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md transform scale-105'
                      : 'bg-white text-neutral-700 border-gray-200 hover:border-neutral-400 hover:bg-gray-50'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Quantity</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={addToCart}
                className="bg-black text-white py-4 rounded-xl text-sm font-medium tracking-wide uppercase hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </button>

              <button
                onClick={handleHomeTrial}
                className="bg-white text-black border-2 border-black py-4 rounded-xl text-sm font-medium tracking-wide uppercase hover:bg-neutral-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4" />
                Home Trial
              </button>
            </div>

            {getCartItemCount() > 0 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                Cart: {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''}
              </div>
            )}

            {trialItems.length > 0 && (
              <div className="text-center text-sm text-blue-600 mt-1">
                Home Trial: {trialItems.length} item{trialItems.length !== 1 ? 's' : ''} selected
              </div>
            )}

            {/* Tabs */}
            <div className="mt-10">
              <div className="flex gap-6 border-b border-gray-200">
                {(['description', 'details', 'returns'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-all relative ${activeTab === tab
                      ? 'text-black'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-sm leading-7 text-gray-600 min-h-[80px]">
                {activeTab === 'description' && <p>{product.description}</p>}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <p><span className="font-medium text-gray-900">Material:</span> Premium Cotton Blend</p>
                    <p><span className="font-medium text-gray-900">Care:</span> Machine wash cold</p>
                    <p><span className="font-medium text-gray-900">Fit:</span> Regular fit</p>
                    <p><span className="font-medium text-gray-900">Origin:</span> Made in India</p>
                  </div>
                )}
                {activeTab === 'returns' && (
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Easy 30-day returns and exchanges</li>
                    <li>Free return shipping for orders above ₹1999</li>
                    <li>Items must be unused with original tags</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-xs font-medium text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-xs font-medium text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-xs font-medium text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}