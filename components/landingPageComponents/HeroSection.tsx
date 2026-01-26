'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Cormorant_Garamond } from 'next/font/google';
import { Sparkles, Truck, Bot } from 'lucide-react'; 

import { useRouter } from 'next/navigation';


const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-start px-6 md:px-20 py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/model7.png"
          alt="Luxury Fashion"
          fill
          className="object-cover object-right-top grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/20" />
      </div>

      {/* Content Block */}
      <div className="relative z-10 max-w-3xl space-y-10 text-black">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`text-6xl md:text-7xl font-extrabold leading-[1.2] tracking-tight ${cormorant.className}`}
        >
          Vogueish
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className={`text-xl md:text-2xl italic text-neutral-800 ${cormorant.className}`}
        >
          Fashion & elegance for the ones who turns pages and heads.
        </motion.p>

        {/* Chic USP Highlights */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.4 }}
  className="space-y-2 flex flex-wrap md:flex-nowrap md:gap-4 gap-4"
>
  <div className="flex items-center gap-4 ">
    <Sparkles className="w-6 h-6 text-black" />
    <span className={`text-base md:text-lg ${cormorant.className}`}>
      Tailored to your silhouette
    </span>
  </div>
  <div className="flex items-center gap-4 ">
    <Truck className="w-6 h-6 text-black" />
    <span className={`text-base md:text-lg ${cormorant.className}`}>
      Home wardrobe trials
    </span>
  </div>
  <div className="flex items-center gap-4">
    <Bot className="w-6 h-6 text-black" />
    <span className={`text-base md:text-lg ${cormorant.className}`}>
      AI-powered styling companion
    </span>
  </div>
</motion.div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          onClick={() => router.push('/shop')}
          className="border border-black text-black py-3 px-10 rounded-full uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md"
        >
          Explore the Collection
        </motion.button>
      </div>
    </section>
  );
}
