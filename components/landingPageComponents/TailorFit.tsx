'use client';
import { motion } from 'framer-motion';
import { Scissors, Ruler, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Cormorant_Garamond } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function TailorFitSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-24 px-6 md:px-20">
      {/* Background accent (optional subtle luxury pattern) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tailor-bg.jpg" // Optional: replace with a textured fabric or atelier shot
          alt="Tailoring"
          fill
          className="object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/tailor.jpg" 
            alt="Tailor at work"
            width={600}
            height={800}
            className="rounded-3xl shadow-2xl object-cover"
          />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8 text-black"
        >
          <h2 className={`text-5xl md:text-6xl font-semibold ${cormorant.className}`}>
            Tailor Your Fit
          </h2>
          <p className={`text-lg md:text-xl leading-relaxed ${cormorant.className}`}>
            Step into a world where every stitch whispers sophistication. Our artisans mold each piece to your silhouette, ensuring a flawless fit that feels like it was made in Milan — because it was inspired by it.
          </p>

          {/* Highlights */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Scissors className="w-6 h-6 text-black" />
              <span className={`text-base md:text-lg ${cormorant.className}`}>
                Hand-finished by master tailors
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Ruler className="w-6 h-6 text-black" />
              <span className={`text-base md:text-lg ${cormorant.className}`}>
                Precision measurements for flawless fit
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-black" />
              <span className={`text-base md:text-lg ${cormorant.className}`}>
                Guaranteed elegance with every wear
              </span>
            </div>
          </div>
          <Link
            href='/custom-tailoring'
          >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Book tailoring session')}
            className="mt-6 border border-black text-black py-3 px-10 rounded-full uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md"
          >
            Learn More
          </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
