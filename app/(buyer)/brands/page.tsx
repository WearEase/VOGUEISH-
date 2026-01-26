'use client';
import Image from "next/image";

const brands = [
  {
    name: "Nike",
    logo: "/images/nike-logo.png",
  },
  {
    name: "Adidas",
    logo: "/images/adidas-logo.png",
  },
  {
    name: "Puma",
    logo: "/images/puma-logo.png",
  },
  {
    name: "Loro Piana",
    logo: "/images/loro-logo.png",
  },
  {
    name: "Reebok",
    logo: "/images/reebok-logo.png",
  },
  {
    name: "Under Armour",
    logo: "/images/underarmour-logo.png",
  },
  {
    name: "Zara",
    logo: "/images/zara-logo.png",
  },
  {
    name: "H&M",
    logo: "/images/hm-logo.png",
  },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-white px-8 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Explore Our Brands</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {brands.map((brand, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center p-6 bg-white border rounded-xl shadow hover:shadow-md transition-all"
          >
            <div className="relative w-24 h-24 mb-4">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  layout="fill"
                  objectFit="contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gray-100 rounded-full">
                  {brand.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-sm font-semibold">{brand.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
