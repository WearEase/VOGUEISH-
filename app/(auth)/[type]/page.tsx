"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { FormType } from "@/types/authTypes";

const AuthPage = () => {
  const params = useParams();
  const type = params.type as FormType;

  const isSignIn = type.includes("sign-in");
  const isBuyer = type.includes("buyer");

  const title = isSignIn
    ? "Log in to your account"
    : "Create an account";
  const subtitle = isBuyer
    ? "Welcome to VOGUEISH (Buyer)"
    : "Welcome to VOGUEISH (Seller)";

  const alternateRoute = isSignIn
    ? type.replace("sign-in", "sign-up")
    : type.replace("sign-up", "sign-in");

  const alternateText = isSignIn
    ? "Don't have an account? "
    : "Already have an account? ";

  const alternateLinkText = isSignIn
    ? "Sign up"
    : "Sign in";

  const isSellerSignUp = type === "seller-sign-up";
  if (isSellerSignUp) {
    // Render just the customized seller sign-up version
    return (
      <>
        <AuthForm type="seller-sign-up" />
        <div className="hidden md:block">
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8">
          {/* Left Side - Form */}
          <div className="lg:w-1/2 px-6 md:px-12 text-left">
            <div className="flex justify-center lg:justify-start">
              <Image src="/logo.png" alt="VOGUEISH Logo" width={120} height={40} className="object-contain" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 text-center lg:text-left">{subtitle}</h2>
            <h3 className="text-3xl font-extrabold text-center lg:text-left">{title}</h3>

            <AuthForm type={type} />

            <p className="text-center text-sm text-gray-600 mt-4">
              {alternateText}
              <Link href={`/${alternateRoute}`} className="text-black font-medium">
                {alternateLinkText}
              </Link>
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <Link href="/" className="absolute top-4 right-4 px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-all z-50">
              Back to website →
            </Link>
            <div className="relative h-[500px] w-full">
              <Image
                src="/login.jpg"
                alt="Login"
                fill
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-60 text-white p-4 rounded-xl">
                <p className="text-sm italic">&quot;Vogueish, where home trial comes to your house...&quot;</p>
                <p className="text-lg font-semibold mt-2">Ishita Sharma</p>
                <p className="text-sm">Founder, Vogueish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default AuthPage;
