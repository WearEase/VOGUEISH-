'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

const ProductGrid = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products?limit=6&sortBy=popularity');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-6 md:px-20 bg-[#fefefe]">
        <h1 className="text-4xl font-serif font-semibold text-gray-900 tracking-wide leading-tight mb-10">
          Featured Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden bg-neutral-50 h-96 border border-neutral-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 md:px-20 bg-[#fefefe]">
      <h1 className="text-4xl font-serif font-semibold text-gray-900 tracking-wide leading-tight mb-10">
        Featured Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredProducts.map((item) => (
          <Link
            key={item.slug}
            href={`/shop/${item.slug}`}
            className="group rounded-xl shadow hover:shadow-md overflow-hidden bg-white block border border-neutral-100 transition-all duration-300"
          >
            <div className="relative w-full h-80 overflow-hidden">
              <Image
                src={item.mainImage}
                alt={item.name}
                fill
                className={`object-cover transition-opacity duration-500 ${item.extraImage1 ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
              {item.extraImage1 && (
                <Image
                  src={item.extraImage1}
                  alt={`${item.name} back`}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
              )}
            </div>
            <div className="p-5">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{item.brand}</p>
              <h4 className="font-semibold text-neutral-800 text-base mb-1 line-clamp-1">{item.name}</h4>
              <p className="text-sm text-neutral-500 mb-3 line-clamp-1">{item.description}</p>
              <p className="font-bold text-neutral-900">₹{new Intl.NumberFormat('en-IN').format(Number(item.discountedPrice))}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
