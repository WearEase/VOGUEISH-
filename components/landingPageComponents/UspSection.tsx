'use client'
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Scissors, Bot } from "lucide-react";

const uspFeatures = [
  {
    icon: <Sparkles className="text-gold-500 w-8 h-8" />,
    title: "Home Trials",
    description: "Try outfits at home before purchasing. Experience luxury and convenience together."
  },
  {
    icon: <Scissors className="text-gold-500 w-8 h-8" />,
    title: "Custom Tailoring",
    description: "Perfect fit with bespoke tailoring crafted by our elite artisans."
  },
  {
    icon: <Bot className="text-gold-500 w-8 h-8" />,
    title: "AI Recommendations",
    description: "Smart chatbot suggests outfits based on your preferences and occasion."
  }
];

const UspSection = () => {
    return (
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {uspFeatures.map((usp, index) => (
            <motion.div
              key={index}
              className="p-6 bg-[#f9f9f9] rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="mb-4 flex justify-center">{usp.icon}</div>
              <h3 className="text-xl font-medium mb-2">{usp.title}</h3>
              <p className="text-sm text-neutral-600">{usp.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };
  
  export default UspSection;