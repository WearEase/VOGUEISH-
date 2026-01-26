'use client';
import { motion } from 'framer-motion';
import { Cormorant_Garamond } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export default function AIRecommendationSection() {
  return (
    <section className="relative py-28 px-6 md:px-20 bg-[#faf8f5] overflow-hidden text-neutral-800">
      {/* Text Content */}
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-semibold leading-tight ${cormorant.className}`}
        >
          AI-Curated Fashion, Just for You
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`mt-4 text-lg md:text-xl text-neutral-600 ${cormorant.className}`}
        >
          Meet your intelligent fashion assistant. Discover outfits, get personalized suggestions, and shop effortlessly — all through one smart chat.
        </motion.p>
      </div>

      {/* Central Chat Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 mt-16 mx-auto w-full max-w-xl bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg p-6 border border-neutral-200"
      >
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 text-sm shadow-sm max-w-[80%] self-start">
            👗 Hello! I&apos;m your fashion assistant. Need help with an outfit?
          </div>
          <div className="bg-neutral-100 rounded-xl p-4 text-sm shadow-sm max-w-[80%] self-end">
            Yes! I’m looking for something classy for a dinner date.
          </div>
          <div className="bg-white rounded-xl p-4 text-sm shadow-sm max-w-[80%] self-start">
            Got it! Here are some recommendations I think you’ll love.
          </div>
        </div>
      </motion.div>

      {/* Floating Fashion Suggestions (blurred) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-48 bg-[url('/model.jpg')] bg-cover bg-center rounded-xl opacity-50 rotate-6" />
        <div className="absolute top-48 right-12 w-36 h-52 bg-[url('/model2.png')] bg-cover bg-center rounded-xl opacity-40 -rotate-3" />
        <div className="absolute bottom-10 left-1/3 w-40 h-56 bg-[url('/jeans.jpg')] bg-cover bg-center rounded-xl opacity-60 rotate-2" />
      </div>

      {/* CTA Button */}
      <div className="text-center mt-12 z-10 relative">
        <Link href='/ai-bot'>
        <button className="inline-block bg-black text-white px-8 py-3 rounded-full tracking-wider uppercase hover:bg-neutral-800 transition-all duration-300">
          Start Chatting
        </button>
        </Link>
      </div>
    </section>
  );
}
