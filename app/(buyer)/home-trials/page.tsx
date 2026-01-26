'use client';
import { motion } from 'framer-motion';
import { Home, ThumbsUp, PackageOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { Cormorant_Garamond } from 'next/font/google';
import Link from 'next/link';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function HomeTrialPage() {
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
          <h3 className={`text-3xl md:text-4xl text-center font-semibold ${cormorant.className}`}>
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
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex items-center gap-2 text-gold-600 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className={`text-lg leading-relaxed mb-3 ${cormorant.className}`}>
                  “{t.quote}”
                </p>
                <span className={`block font-medium text-sm text-gray-700 ${cormorant.className}`}>
                  — {t.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <Link href='/shop'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-black text-black py-4 px-12 rounded-full uppercase text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md"
          >
            Check Out our Store
          </motion.button>
          </Link>
        </div>
      </section>
    </main>
  );
}
