"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, LogOut, Mail, Phone, User as UserIcon } from "lucide-react";

const formatMaybe = (value: string | null | undefined) => (value && value.trim().length > 0 ? value : "—");

type LocalUser = {
  email?: string;
  name?: string;
  type?: string;
};

const readLocalUser = (): LocalUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as LocalUser;
  } catch {
    return null;
  }
};

export default function MyAccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState<LocalUser | null>(() => readLocalUser());

  useEffect(() => {
    // Keep local user state in sync (demo login stores it)
    setLocalUser(readLocalUser());
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && !localUser) {
      router.replace("/login");
    }
  }, [router, status, localUser]);

  const profile = useMemo(() => {
    const name = session?.user?.name ?? localUser?.name ?? "";
    const email = session?.user?.email ?? localUser?.email ?? "";
    return {
      name,
      email,
    };
  }, [localUser?.email, localUser?.name, session?.user?.email, session?.user?.name]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 w-56 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-white rounded-2xl border border-gray-200" />
            <div className="h-72 bg-white rounded-2xl border border-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const isAuthed = (status === "authenticated" && !!session?.user) || !!localUser;
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    if (status === "authenticated") {
      await signOut({ redirect: true, callbackUrl: "/login" });
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-sm text-gray-500">My Account</p>
            <h1 className="text-3xl font-semibold text-gray-900">Your Profile</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              View your account details and recent activity.
            </p>
          </div>

          {isAuthed ? (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
            >
              Sign in
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {!isAuthed ? (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900">You’re not signed in</h2>
            <p className="mt-2 text-gray-600">
              Sign in to view your profile and account activity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-black text-white text-sm hover:bg-gray-900 transition"
              >
                Continue to Sign In
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 hover:bg-gray-50 transition"
              >
                Back to login options
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Profile card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8 flex items-start gap-5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                ) : (
                  <UserIcon className="w-7 h-7 text-gray-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {formatMaybe(profile.name) as string}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-600 mt-1">Welcome back to Vogueish.</p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{formatMaybe(profile.email)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{"—"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Account</p>
                <span className="text-xs text-gray-500">Buyer</span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">Active</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Member since</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">—</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Activity / Journey card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-900">Your Vogueish journey</h2>
              <p className="mt-2 text-gray-600">
                A quick snapshot of your recent activity.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { label: "Profile created", value: "Completed" },
                  { label: "Email verified", value: "Completed" },
                  { label: "First order", value: "Not yet" },
                  { label: "Saved address", value: "Not yet" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-900">{row.label}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      {row.value}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 sm:px-8 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Orders placed</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">0</p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Wishlist items</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">0</p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Home trials</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
