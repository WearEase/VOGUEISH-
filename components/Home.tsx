import React from "react";
import UspSection from "@/components/landingPageComponents/UspSection";
import ProductGrid from "@/components/landingPageComponents/ProductGrid";
import HeroSection from "./landingPageComponents/HeroSection";
import Navbar from "./Navbar";
import TailorFitSection from "./landingPageComponents/TailorFit";
import HomeTrialSection from "./landingPageComponents/HomeTrial";
import AIPoweredRecommendationSection from "./landingPageComponents/AIPoweredRecommendationSection";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#fefefe] text-[#1a1a1a] font-sans">
      <Navbar/>
     <HeroSection/> 
      <UspSection />
      <TailorFitSection/>
      <HomeTrialSection/>
      <AIPoweredRecommendationSection/>
      <ProductGrid />
    </main>
  );
};

export default LandingPage;