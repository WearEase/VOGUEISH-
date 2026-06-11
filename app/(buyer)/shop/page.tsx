"use client";
import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import SearchBar from "@/components/shop/SearchBar";
import ProductFilters, { FilterState } from "@/components/shop/ProductFilters";
import SortDropdown from "@/components/shop/SortDropDown";
import ViewToggle from "@/components/shop/ViewToggle";
import ProductGrid from "@/components/shop/ProductGrid";

import type { Product } from "@/types/product";

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  slug: string;
}

const parsePrice = (value: number | string | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const staticFilterOptions = {
  priceRange: [
    { label: "Under ₹1,000", value: "0-1000" },
    { label: "₹1,000 - ₹3,000", value: "1000-3000" },
    { label: "₹3,000 - ₹5,000", value: "3000-5000" },
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "Above ₹10,000", value: "10000-999999" },
  ],
  gender: ["Men", "Women", "Unisex"],
  sortBy: [
    { label: "Popularity", value: "popularity" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest First", value: "newest" },
    { label: "Best Rated", value: "rating" },
  ],
};

export default function ShopPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    brand: [],
    priceRange: "",
    gender: [],
    sortBy: "popularity",
    searchQuery: "",
    collectionType: [],
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Fetch products from database API
  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
        }
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  // Compute dynamic brands and collection types
  const filterOptions = useMemo(() => {
    const uniqueBrands = Array.from(new Set(productsList.map(p => p.brand))).sort();
    const uniqueCollectionTypes = Array.from(new Set(productsList.map(p => p.collectionType).filter(Boolean))).sort() as string[];
    return {
      ...staticFilterOptions,
      brand: uniqueBrands,
      collectionType: uniqueCollectionTypes,
    };
  }, [productsList]);

  useEffect(() => {
    // const savedWishlist = localStorage.getItem('ecommerce-wishlist');
    // if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    // localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      brand: [],
      priceRange: "",
      gender: [],
      sortBy: "popularity",
      searchQuery: "",
      collectionType: [],
    });
  };

  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some(item => item.slug === product.slug);
    if (isInWishlist) {
      setWishlist(prev => prev.filter(item => item.slug !== product.slug));
    } else {
      const wishlistItem: WishlistItem = {
        id: product.slug,
        name: product.name,
        brand: product.brand,
        price: parsePrice(product.discountedPrice),
        image: product.mainImage,
        slug: product.slug,
      };
      setWishlist(prev => [...prev, wishlistItem]);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...productsList];
    if (filters.searchQuery) {
      const isNumeric = /^\d+$/.test(filters.searchQuery);
      if (isNumeric) {
        const searchPrice = parseInt(filters.searchQuery, 10);
        filtered = filtered.filter(product => {
          const price = typeof product.discountedPrice === 'string'
            ? parseInt(product.discountedPrice.replace(/[^\d]/g, ''))
            : product.discountedPrice;
          const rPrice = typeof product.realPrice === 'string'
            ? parseInt(product.realPrice.replace(/[^\d]/g, ''))
            : product.realPrice;
          return price === searchPrice || rPrice === searchPrice;
        });
      } else {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
      }
    }
    if (filters.category !== "All") {
      // Keep category filter mapping if needed
    }

    if (filters.brand.length > 0) {
      filtered = filtered.filter(product =>
        filters.brand.some(b => b.toLowerCase() === product.brand.toLowerCase())
      );
    }

    if (filters.collectionType && filters.collectionType.length > 0) {
      filtered = filtered.filter(product =>
        filters.collectionType.some(t => t.toLowerCase() === (product.collectionType || '').toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = typeof product.discountedPrice === 'string'
          ? parseInt(product.discountedPrice.replace(/[^\d]/g, ''))
          : product.discountedPrice;
        return price >= min && price <= max;
      });
    }

    if (filters.gender.length > 0) {
      filtered = filtered.filter(product =>
        filters.gender.some(g => (product.gender || 'Unisex').toLowerCase() === g.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const pA = typeof a.discountedPrice === 'string' ? parseInt(a.discountedPrice.replace(/[^\d]/g, '')) : a.discountedPrice;
          const pB = typeof b.discountedPrice === 'string' ? parseInt(b.discountedPrice.replace(/[^\d]/g, '')) : b.discountedPrice;
          return pA - pB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const pA = typeof a.discountedPrice === 'string' ? parseInt(a.discountedPrice.replace(/[^\d]/g, '')) : a.discountedPrice;
          const pB = typeof b.discountedPrice === 'string' ? parseInt(b.discountedPrice.replace(/[^\d]/g, '')) : b.discountedPrice;
          return pB - pA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.arrivalDate || '').getTime() - new Date(a.arrivalDate || '').getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return filtered;
  }, [filters, productsList]);

  const activeFiltersCount = [
    ...filters.brand,
    ...filters.gender,
    ...(filters.collectionType || []),
    filters.priceRange,
    filters.searchQuery,
  ].filter(Boolean).length + (filters.category !== "All" ? 1 : 0);

  const wishlistSlugs = wishlist.map(item => item.slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 font-medium animate-pulse text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            value={filters.searchQuery}
            onChange={(value) => setFilters(prev => ({ ...prev, searchQuery: value }))}
            className="max-w-2xl mx-auto mb-3"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-200">
              <span className="text-gray-600 font-medium">
                {filteredAndSortedProducts.length} products found
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <SortDropdown
              options={filterOptions.sortBy}
              value={filters.sortBy}
              onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            />
            <ViewToggle
              viewMode={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <ProductGrid
              products={filteredAndSortedProducts}
              viewMode={viewMode}
              wishlist={wishlistSlugs}
              onToggleWishlist={toggleWishlist}
              showDescription={viewMode === 'list'}
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-gray-50 overflow-y-auto">
            <ProductFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
              isMobile={true}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
