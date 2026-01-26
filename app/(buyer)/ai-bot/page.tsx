'use client';
import Image from 'next/image';
import ChatBot from '@/components/ChatBot';

export default function AIBotPage() {
  return (
    <section className="relative w-full min-h-screen bg-[#f9f8f6] py-24 px-4 md:px-8 flex items-center justify-center">

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/trial-bg.jpg"
          alt="Background"
          fill
          className="object-cover opacity-[0.03]"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-5 gap-12 items-center">
        {/* Left Side text */}
        <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">24/7 Personal Stylist</span>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 leading-tight">
            Your Style,<br />Intelligently Curated.
          </h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            Ask me anything — from matching accessories to finding the perfect fit.
            I'm here to elevate your shopping experience.
          </p>

          <div className="hidden lg:block pt-8 space-y-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-900">"What do I wear to a summer wedding?"</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 opacity-70">
              <p className="text-sm font-medium text-gray-900">"Show me black leather jackets"</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 w-full flex justify-center">
          <ChatBot />
        </div>
      </div>
    </section>
  );
}
