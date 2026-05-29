"use client";

import { useState } from "react";
import StepOne from "./sellerSteps/StepOne";
import StepTwo from "./sellerSteps/StepTwo";
import StepThree from "./sellerSteps/StepThree";

const SellerSignUp = () => {
  const [step, setStep] = useState(1);
  const [tempToken, setTempToken] = useState("");
  const [step3Token, setStep3Token] = useState("");

  const handleStepOneNext = (token: string) => {
    setTempToken(token);
    setStep(2);
  };

  const handleStepTwoNext = (token: string) => {
    setStep3Token(token);
    setStep(3);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Top Progress Steps */}
      <div className="w-full max-w-2xl mb-12">
        <h1 className="text-xl font-semibold mb-2">VOGUEISH | <span className="font-normal">SELLER PORTAL</span></h1>
        <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
          <div className="flex items-center space-x-2">
            <span className={`rounded-full w-6 h-6 border ${step >= 1 ? 'border-black' : 'border-gray-400'} flex items-center justify-center text-xs`}>✓</span>
            <span>EMAIL ID & GST</span>
          </div>
          <div className="h-px bg-gray-300 flex-1 mx-2" />
          <div className="flex items-center space-x-2">
            <span className={`rounded-full w-6 h-6 border ${step >= 2 ? 'border-black' : 'border-gray-400'} flex items-center justify-center text-xs`}>✓</span>
            <span>PASSWORD CREATION</span>
          </div>
          <div className="h-px bg-gray-300 flex-1 mx-2" />
          <div className="flex items-center space-x-2">
            <span className={`rounded-full w-6 h-6 border ${step >= 3 ? 'border-black' : 'border-gray-400'} flex items-center justify-center text-xs`}>✓</span>
            <span>ONBOARDING DASHBOARD</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md space-y-6">
        {step === 1 && <StepOne onNext={handleStepOneNext} />}
        {step === 2 && <StepTwo onNext={handleStepTwoNext} onBack={handleBack} tempToken={tempToken} />}
        {step === 3 && <StepThree step3Token={step3Token} />}
      </div>
    </div>
  );
};

export default SellerSignUp;
