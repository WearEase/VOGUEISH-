'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = useMemo(() => {
    const next = searchParams.get('next');
    return next && next.startsWith('/') ? next : '/thank-you';
  }, [searchParams]);

  const [expectedOtp, setExpectedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Demo OTP for UI flow.
    setExpectedOtp(generateOtp());
  }, []);

  const handleVerify = async () => {
    if (inputOtp.trim().length !== 4) {
      toast.error('Please enter a 4-digit OTP.');
      return;
    }

    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo behavior: accept correct OTP; if you want to accept any OTP, remove this check.
    if (inputOtp.trim() !== expectedOtp) {
      setIsVerifying(false);
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    toast.success('OTP verified successfully.');
    router.replace(nextUrl);
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center p-6">
      <div className="bg-white max-w-lg w-full p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-3xl font-serif text-center mb-3 text-neutral-900">Verify OTP</h1>
        <p className="text-center text-gray-600 mb-8">
          Enter the 4-digit security code to continue.
        </p>

        <div className="mb-6">
          <div className="bg-neutral-900 text-white p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Demo OTP</p>
            <div className="text-3xl font-mono font-bold tracking-[0.5em]">{expectedOtp || '----'}</div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={inputOtp}
            onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-center tracking-[0.35em] font-mono text-lg"
          />

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-neutral-800 transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isVerifying ? 'Verifying…' : 'Verify & Continue'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                const newOtp = generateOtp();
                setExpectedOtp(newOtp);
                toast.success('OTP resent.');
              }}
              className="text-gray-600 hover:text-black transition-colors"
            >
              Resend OTP
            </button>

            <Link href={nextUrl} className="text-gray-500 hover:text-black transition-colors">
              Skip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpContent />
    </Suspense>
  );
}
