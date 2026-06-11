"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, ThumbsUp, PackageOpen, Star, Play, X } from 'lucide-react';
import Image from 'next/image';
import { Cormorant_Garamond } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function HomeTrialPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <main className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image
          src="/home-trial3.jpg"
          alt="Luxury Home Trial"
          fill
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/50" />

        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 md:px-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`text-4xl md:text-6xl font-semibold ${cormorant.className}`}
          >
            Home Wardrobe Trials
          </motion.h1>
          <p
            className={`mt-6 max-w-2xl text-lg md:text-xl leading-relaxed ${cormorant.className}`}
          >
            Couture meets convenience. Discover the future of luxury shopping — curated, styled, and delivered to your doorstep.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mt-8 z-20"
          >
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="group relative flex flex-col items-center gap-3 cursor-pointer outline-none focus:outline-none"
            >
              <div className="relative w-72 sm:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-900">
                <video
                  src="/Home trial.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-60 transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-5 h-5 ml-0.5 fill-black" />
                  </div>
                </div>
              </div>
              <span className="text-sm tracking-widest uppercase font-medium group-hover:text-zinc-600 transition-colors drop-shadow">
                Watch the Experience
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto space-y-20">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Home className="w-8 h-8" />,
              title: 'Try from Home',
              desc: 'Experience high fashion at home — no pressure, no crowds.',
              img: '/home-trial.jpg',
            },
            {
              icon: <ThumbsUp className="w-8 h-8" />,
              title: 'Keep What You Love',
              desc: 'Only pay for what feels right. Send the rest back, hassle-free.',
              img: '/home-trial1.jpg',
            },
            {
              icon: <PackageOpen className="w-8 h-8" />,
              title: 'Seamless Pickup & Delivery',
              desc: 'We deliver, you decide. We pick it back up — on your schedule.',
              img: '/delivery.jpg',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={600}
                height={500}
                className="object-cover h-60 w-full"
              />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-black">{item.icon}</div>
                <h3 className={`text-2xl font-semibold ${cormorant.className}`}>{item.title}</h3>
                <p className={`text-md text-gray-700 ${cormorant.className}`}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[60vh] w-full rounded-3xl overflow-hidden shadow-xl"
        >
          <Image
            src="/fashion.jpg"
            alt="Model Trying Outfit"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <h2 className={`text-white text-3xl md:text-5xl font-semibold ${cormorant.className}`}>
              Fashion Freedom. Redefined.
            </h2>
          </div>
        </motion.div>

        {/* Testimonials */}
        <section className="space-y-12">
          <h3 className={`text-3xl md:text-4xl text-center font-semibold ${cormorant.className} text-gray-900 dark:text-white`}>
            What Our Clients Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                name: 'Sofia Saifi.',
                quote:
                  "I’ve never felt more pampered — the pieces were exquisite, and the process was seamless.",
              },
              {
                name: 'Priya Singh',
                quote:
                  "It’s like a personal stylist delivered straight to my home. Absolutely loved the experience.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-2 text-gold-600 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                  ))}
                </div>
                <p className={`text-lg leading-relaxed mb-3 ${cormorant.className} text-gray-800 dark:text-gray-200`}>
                  “{t.quote}”
                </p>
                <span className={`block font-medium text-sm text-gray-700 dark:text-gray-400 ${cormorant.className}`}>
                  — {t.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <FaqSection />

        {/* Final CTA */}
        <div className="text-center mt-20">
          <Link href='/shop'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-black dark:border-white text-black dark:text-white py-4 px-12 rounded-full uppercase text-sm tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 shadow-md"
          >
            Check Out our Store
          </motion.button>
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-6">
          <div className="relative max-w-4xl w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 text-white hover:text-zinc-300 bg-black/40 hover:bg-black/60 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10 font-bold"
            >
              <X className="w-4 h-4" />
            </button>
            <video
              src="/Home trial.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "How long does a home trial session last?",
      answer: "You can keep the trial garments for up to 24 hours. This gives you plenty of time to try them on in the comfort of your home, match them with your existing wardrobe, and decide which ones you love."
    },
    {
      question: "Is there any charge for booking a home wardrobe trial?",
      answer: "We charge a nominal, fully refundable trial service fee of ₹199. When you make a purchase from your trial selection, this entire fee is fully adjusted against the final checkout total."
    },
    {
      question: "What happens if a garment gets damaged or soiled during the trial?",
      answer: "We understand that minor slips can happen. However, major stains, fabric tears, or alterations to the garment during the trial session will be subject to charges up to the original retail price of the item."
    }
  ];

  return (
    <section className="space-y-12 max-w-4xl mx-auto py-12">
      <h3 className="text-3xl md:text-4xl text-center font-semibold font-serif text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="border-b border-gray-200 dark:border-zinc-800 pb-4 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex justify-between items-center w-full text-left py-3 font-semibold text-lg md:text-xl text-gray-900 dark:text-white group"
              >
                <span className="font-serif group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {item.question}
                </span>
                <span className={`text-xl transition-transform duration-300 ${isOpen ? "transform rotate-180 text-purple-600 dark:text-purple-400" : ""}`}>
                  ↓
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-md text-gray-650 dark:text-gray-400 mt-2 leading-relaxed font-serif">
                  {item.answer}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
