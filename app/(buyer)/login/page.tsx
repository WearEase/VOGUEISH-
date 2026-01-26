'use client';

import Link from 'next/link';

export default function NotLoggedInPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center px-4">
      {/* Brand Header */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight">
          Welcome to <span className="text-[#1e1e1e]">Vogueish</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 font-light max-w-md mx-auto">
          Where elegance meets effortless fashion. Step into your personalized experience.
        </p>
      </header>

      {/* Login Section */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Customer Section */}
        <div className="p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Explore as a Customer</h2>
          <p className="text-sm text-gray-500 mb-4">
            Buy premiuim quality products from top brands. Enjoy exclusive deals and offers.
          </p>
          <div className="flex items-center flex-col justify-center w-full">
            <Link href="/buyer-sign-in" className='w-full'>
              <button className="w-full py-3 px-6 rounded-xl bg-black text-white font-medium tracking-wide hover:bg-gray-900 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Seller Section */}
        <div className="p-8 bg-gray-50 flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sell with Vogueish</h2>
          <p className="text-sm text-gray-500 mb-4">
            Join our seller portal and connect your brand to a premium customer base.
          </p>
          <Link href="/seller-sign-in">
            <button className="w-full py-3 px-6 rounded-xl bg-purple-600 text-white font-medium tracking-wide hover:bg-purple-700 transition">
              Seller Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
