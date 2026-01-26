"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import for App Router

const StepThree = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/seller-dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <div className="text-center">🎉 Seller account successfully created! Redirecting...</div>;
};

export default StepThree;
