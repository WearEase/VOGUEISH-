"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { Product, TabType } from '@/types/product';
import { Cormorant_Garamond } from 'next/font/google';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Home, X, Ruler } from 'lucide-react';
import { useHomeTrial } from '@/context/HomeTrialContext';
import { useCart } from '@/hooks/useCart';
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
  const { cart, addToCart: hookAddToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [didHydrateStorage, setDidHydrateStorage] = useState(false);

  // Size Guide modal state
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'chart' | 'measure' | 'video'>('chart');

  // Load product dynamically from API
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  const images = useMemo(() => product
    ? [
      product.mainImage,
      product.extraImage1,
      product.extraImage2,
      product.extraImage3,
      product.extraImage4,
    ].filter(Boolean) as string[]
    : [], [product]);

  // Set selected main image when product loads
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImg(images[0]);
    }
  }, [images]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    if (!product) return;
    setDidHydrateStorage(false);
    const savedWishlist = localStorage.getItem('ecommerce-wishlist');

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

    setDidHydrateStorage(true);
  }, [slug, product]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!didHydrateStorage) return;
    localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('ecommerce-cart-updated')); // Sync updates
  }, [wishlist, didHydrateStorage]);

  const addToCart = () => {
    if (!product || !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    hookAddToCart(product, selectedSize, quantity);

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

    toast.success('Added to Home Trial Bag! Redirecting...');
    setTimeout(() => {
      router.push('/service-fees');
    }, 500);
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist) {
      const updatedWishlist = wishlist.filter(item => item.slug !== product.slug);
      setWishlist(updatedWishlist);
      setIsInWishlist(false);
    } else {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center">
        <div className="text-gray-500 font-medium animate-pulse text-lg">Loading details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center">
        <div className="text-gray-500 font-medium text-lg">Product not found.</div>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((Number(String(product.realPrice).replace(/[^\d]/g, '')) - Number(String(product.discountedPrice).replace(/[^\d]/g, ''))) /
      Number(String(product.realPrice).replace(/[^\d]/g, ''))) * 100
  );

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
                className={`overflow-hidden border rounded-lg w-16 h-16 ${selectedImg === img ? 'ring-2 ring-neutral-800' : ''}`}
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
              className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
              ₹{Number(product.discountedPrice).toLocaleString()}
              <span className="line-through text-gray-400 text-base">
                ₹{Number(product.realPrice).toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-neutral-800">Select Size</h4>
                <button
                  type="button"
                  onClick={() => {
                    setActiveGuideTab('chart');
                    setShowSizeGuideModal(true);
                  }}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide & Measure
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.sizesAvailable.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${selectedSize === size
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md transform scale-105'
                      : 'bg-white text-neutral-700 border-gray-200 hover:border-neutral-400 hover:bg-gray-50'}`}
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
                    className={`pb-3 text-sm font-medium capitalize transition-all relative ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
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
                    <p><span className="font-medium text-gray-900">Brand:</span> {product.brand}</p>
                    <p><span className="font-medium text-gray-900">Category:</span> {product.collectionType || 'General'}</p>
                    <p><span className="font-medium text-gray-900">Care:</span> Dry Clean Only</p>
                    <p><span className="font-medium text-gray-900">Gender:</span> {product.gender}</p>
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

      {/* Size Guide Modal Overlay */}
      {showSizeGuideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6 md:p-8 border border-neutral-100">
            {/* Close Button */}
            <button
              onClick={() => setShowSizeGuideModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full text-neutral-500 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
              <h2 className={`text-2xl font-semibold text-neutral-900 ${cormorant.className}`}>
                {product.gender === 'Men' ? "Men's Size Guide" : "Lehenga Size Guide"}
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveGuideTab('chart')}
                  className={`pb-2 text-sm font-semibold transition-all relative ${activeGuideTab === 'chart' ? 'text-black font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Size guide
                  {activeGuideTab === 'chart' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveGuideTab('measure')}
                  className={`pb-2 text-sm font-semibold transition-all relative ${activeGuideTab === 'measure' ? 'text-black font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  How to Measure
                  {activeGuideTab === 'measure' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveGuideTab('video')}
                  className={`pb-2 text-sm font-semibold transition-all relative ${activeGuideTab === 'video' ? 'text-black font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Measurement video
                  {activeGuideTab === 'video' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab 1: Size Chart Table */}
            {activeGuideTab === 'chart' && (
              <div>
                <h3 className={`text-lg font-bold text-center tracking-wider text-neutral-700 uppercase mb-4 ${cormorant.className}`}>
                  {product.gender === 'Men' ? "Sherwani & Kurta Measurement Chart" : "Lehenga Measurement Chart"}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-center border-collapse text-sm text-neutral-700">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
                        <th className="py-3 px-4 text-left font-semibold">Measurement</th>
                        <th className="py-3 px-4 font-semibold">XXS</th>
                        <th className="py-3 px-4 font-semibold">XS</th>
                        <th className="py-3 px-4 font-semibold">S</th>
                        <th className="py-3 px-4 font-semibold">M</th>
                        <th className="py-3 px-4 font-semibold">L</th>
                        <th className="py-3 px-4 font-semibold">XL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {product.gender === 'Men' ? (
                        <>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Chest (Inches)</td>
                            <td className="py-3 px-4">34</td>
                            <td className="py-3 px-4">36</td>
                            <td className="py-3 px-4">38</td>
                            <td className="py-3 px-4">40</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">44</td>
                          </tr>
                          <tr className="bg-neutral-50/50">
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Shoulder (Inches)</td>
                            <td className="py-3 px-4">16.5</td>
                            <td className="py-3 px-4">17.0</td>
                            <td className="py-3 px-4">17.5</td>
                            <td className="py-3 px-4">18.0</td>
                            <td className="py-3 px-4">18.5</td>
                            <td className="py-3 px-4">19.0</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Sleeve Length (Inches)</td>
                            <td className="py-3 px-4">24.0</td>
                            <td className="py-3 px-4">24.5</td>
                            <td className="py-3 px-4">25.0</td>
                            <td className="py-3 px-4">25.5</td>
                            <td className="py-3 px-4">26.0</td>
                            <td className="py-3 px-4">26.5</td>
                          </tr>
                          <tr className="bg-neutral-50/50">
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Kurta Length (Inches)</td>
                            <td className="py-3 px-4">39.5</td>
                            <td className="py-3 px-4">40.0</td>
                            <td className="py-3 px-4">40.5</td>
                            <td className="py-3 px-4">41.0</td>
                            <td className="py-3 px-4">41.5</td>
                            <td className="py-3 px-4">42.0</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Neck (Inches)</td>
                            <td className="py-3 px-4">14.5</td>
                            <td className="py-3 px-4">15.0</td>
                            <td className="py-3 px-4">15.5</td>
                            <td className="py-3 px-4">16.0</td>
                            <td className="py-3 px-4">16.5</td>
                            <td className="py-3 px-4">17.0</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Bust (Inches)</td>
                            <td className="py-3 px-4">32</td>
                            <td className="py-3 px-4">34</td>
                            <td className="py-3 px-4">36</td>
                            <td className="py-3 px-4">38</td>
                            <td className="py-3 px-4">40</td>
                            <td className="py-3 px-4">42</td>
                          </tr>
                          <tr className="bg-neutral-50/50">
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Blouse Length (Lehenga)</td>
                            <td className="py-3 px-4">12.5</td>
                            <td className="py-3 px-4">12.5</td>
                            <td className="py-3 px-4">13</td>
                            <td className="py-3 px-4">13</td>
                            <td className="py-3 px-4">14</td>
                            <td className="py-3 px-4">14</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Bottom Length (Lehenga)</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">42</td>
                          </tr>
                          <tr className="bg-neutral-50/50">
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Armhole Sleeve</td>
                            <td className="py-3 px-4">15</td>
                            <td className="py-3 px-4">16</td>
                            <td className="py-3 px-4">16</td>
                            <td className="py-3 px-4">17</td>
                            <td className="py-3 px-4">17</td>
                            <td className="py-3 px-4">18</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Armhole Sleeveless</td>
                            <td className="py-3 px-4">16</td>
                            <td className="py-3 px-4">17</td>
                            <td className="py-3 px-4">17</td>
                            <td className="py-3 px-4">18</td>
                            <td className="py-3 px-4">18</td>
                            <td className="py-3 px-4">19</td>
                          </tr>
                          <tr className="bg-neutral-50/50">
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Around Above Waist</td>
                            <td className="py-3 px-4">26</td>
                            <td className="py-3 px-4">28</td>
                            <td className="py-3 px-4">30</td>
                            <td className="py-3 px-4">32</td>
                            <td className="py-3 px-4">34</td>
                            <td className="py-3 px-4">36</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Around Waist</td>
                            <td className="py-3 px-4">28</td>
                            <td className="py-3 px-4">30</td>
                            <td className="py-3 px-4">32</td>
                            <td className="py-3 px-4">34</td>
                            <td className="py-3 px-4">36</td>
                            <td className="py-3 px-4">38</td>
                          </tr>
                          <tr className="bg-neutral-50/50">
                            <td className="py-3 px-4 text-left font-medium text-neutral-900">Around Hips</td>
                            <td className="py-3 px-4">36</td>
                            <td className="py-3 px-4">38</td>
                            <td className="py-3 px-4">40</td>
                            <td className="py-3 px-4">42</td>
                            <td className="py-3 px-4">44</td>
                            <td className="py-3 px-4">46</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 mt-4 italic">
                  Note: All measurements are in inches. The lengths may vary slightly based on style and neckline design.
                </p>
              </div>
            )}

            {/* Tab 2: How to Measure */}
            {activeGuideTab === 'measure' && (
              <div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700">
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-neutral-900">Sizing Guidelines</h3>
                  <div>
                    <h4 className="font-semibold text-neutral-800">1. Bust / Chest</h4>
                    <p className="text-neutral-600 mt-0.5">Measure around the fullest part of the chest/bust, keeping the measuring tape horizontal and comfortably snug.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">2. Waist</h4>
                    <p className="text-neutral-600 mt-0.5">Measure around your natural waistline. This is the narrowest point of your torso (typically just above your navel).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">3. Hips</h4>
                    <p className="text-neutral-600 mt-0.5">Stand with feet together and measure around the fullest part of your hips (approx. 7-8 inches below your natural waistline).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">4. Length</h4>
                    <p className="text-neutral-600 mt-0.5">For tops, measure from the high point of the shoulder down to the hem. For bottoms, measure from natural waist down to the floor/ankles.</p>
                  </div>
                </div>
                <div className="bg-neutral-50 p-6 rounded-2xl flex flex-col justify-center border border-neutral-100">
                  <h4 className="font-bold text-neutral-900 mb-2">Measuring Tips:</h4>
                  <ul className="list-disc pl-4 space-y-2 text-neutral-600">
                    <li>Use a flexible, fabric measuring tape for accuracy.</li>
                    <li>Measure while wearing form-fitting clothing or undergarments.</li>
                    <li>Keep the tape flat against the body but not pulled too tight.</li>
                    <li>If you fall between sizes, we recommend selecting the larger size for a more comfortable fit (it can easily be altered down).</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Measurement Video */}
            {activeGuideTab === 'video' && (
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black border border-neutral-200">
                  <iframe
                    src="https://www.youtube.com/embed/J7dEwG7Qe5M"
                    title="How to Measure - Size Guide video"
                    className="absolute inset-0 w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-3 italic text-center">
                  This video walkthrough demonstrates the standard methods for taking body measurements for luxury ethnic clothing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}