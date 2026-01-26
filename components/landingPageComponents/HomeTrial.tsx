'use client';
import { motion } from 'framer-motion';
import { Home, ThumbsUp, PackageOpen } from 'lucide-react';
import Image from 'next/image';
import { Cormorant_Garamond } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function HomeTrialSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-24 px-6 md:px-20">
      {/* Background accent */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/trial-bg.jpg" 
          alt="Home Trial Background"
          fill
          className="object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/80" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8 text-black"
        >
          <h2 className={`text-5xl md:text-6xl font-semibold ${cormorant.className}`}>
            Home Wardrobe Trials
          </h2>
          <p className={`text-lg md:text-xl leading-relaxed ${cormorant.className}`}>
            Luxury isn’t just about fabric — it’s about freedom. Try handpicked couture looks in the comfort of your home, styled and sent just for you.
          </p>

          {/* Feature Points */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Home className="w-6 h-6 text-black" />
              <span className={`text-base md:text-lg ${cormorant.className}`}>
                Try before you buy, from home
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThumbsUp className="w-6 h-6 text-black" />
              <span className={`text-base md:text-lg ${cormorant.className}`}>
                Keep what you love, return the rest
              </span>
            </div>
            <div className="flex items-center gap-4">
              <PackageOpen className="w-6 h-6 text-black" />
              <span className={`text-base md:text-lg ${cormorant.className}`}>
                Delivered and picked up at your convenience
              </span>
            </div>
          </div>
          <Link
            href='/home-trials'
          >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Schedule home trial')}
            className="mt-6 border border-black text-black py-3 px-10 rounded-full uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md"
          >
            Learn more 
          </motion.button>
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/home-trial.jpg" // Optional: lifestyle image of trying outfits at home
            alt="Try at home"
            width={600}
            height={800}
            className="rounded-3xl shadow-2xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
