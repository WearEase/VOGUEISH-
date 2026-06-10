"use client";

import Link from 'next/link';

export default function NotLoggedInPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f3ee_0%,_#f2efe9_35%,_#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10">
        <header className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-neutral-500">Vogueish access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            One place for buyers to sign in or create an account.
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
            Continue to your order history, saved details, and home-trial experience without losing your flow.
          </p>
        </header>

        <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_30px_100px_-40px_rgba(0,0,0,0.4)] lg:grid-cols-2">
          <div className="border-b border-neutral-200 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Buyers</p>
            <h2 className="mt-3 text-2xl font-semibold text-neutral-950">Continue your shopping journey</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Sign in to access your account, saved addresses, and personalized updates.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/buyer-sign-in"
                className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Sign in
              </Link>
              <Link
                href="/buyer-sign-up"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-50"
              >
                Create account
              </Link>
            </div>

            <div className="mt-8 grid gap-3">
              {[
                'Order tracking and delivery updates',
                'Quick checkout with saved buyer details',
                'Access to home trials and account history',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,#181818_0%,#363636_100%)] p-8 text-white sm:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-white/55">Seller portal</p>
            <h2 className="mt-3 text-2xl font-semibold">For brands and merchants</h2>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Manage onboarding, product flow, and customer requests from the seller dashboard.
            </p>

            <Link
              href="/seller-sign-in"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-neutral-950 transition hover:bg-white/90"
            >
              Seller login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
