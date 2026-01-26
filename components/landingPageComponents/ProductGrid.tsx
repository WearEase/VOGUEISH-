'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from '@/data/products'; // adjust path as needed

const ProductGrid = () => {
  // Use stable sort for featured products to avoid hydration mismatch
  const randomProducts = [...products]
    .sort((a, b) => (a.popularityRank || 0) - (b.popularityRank || 0))
    .slice(0, 6);
  return (
    <section className="py-24 px-6 md:px-20 bg-[#fefefe]">
      <h1 className="text-4xl font-serif font-semibold text-gray-900 tracking-wide leading-tight mb-10">
        Featured Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {randomProducts.map((item) => (
          <Link
            key={item.slug}
            href={`/shop/${item.slug}`}
            className="rounded-xl shadow hover:shadow-md overflow-hidden bg-white block"
          >
            <div className="relative w-full h-80">
              <Image
                src={item.mainImage}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium text-base">{item.name}</h4>
              <p className="text-sm text-neutral-600">{item.description}</p>
              <p className="font-semibold mt-2">{item.discountedPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
