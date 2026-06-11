"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { 
  CheckCircle2, ChevronRight, LogOut, Mail, Phone, User as UserIcon, 
  Scissors, Gift, Calendar, Shield, AlertCircle
} from "lucide-react";
import { demoOrders } from "@/data/orders";
import { toast } from "sonner";

const formatMaybe = (value: string | null | undefined) => (value && value.trim().length > 0 ? value : "—");

type LocalUser = {
  email?: string;
  name?: string;
  type?: string;
};

interface TrialItem {
  name: string;
  brand: string;
  size: string;
  price: number;
}

interface HomeTrial {
  id: string;
  placedAt: string;
  status: string;
  vendorStatus: string;
  otpVerified: boolean;
  items: TrialItem[];
}

interface Donation {
  id: string;
  ngoName: string;
  pickupDate: string;
  timeSlot: string;
  itemType: string;
  status: string;
  linkedTrialId: string;
}

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

  // States for Home Trials & Donations
  const [homeTrials, setHomeTrials] = useState<HomeTrial[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  // OTP Verification state
  const [verifyingTrialId, setVerifyingTrialId] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState<string>("");

  // Donation Booking state
  const [isBookingDonation, setIsBookingDonation] = useState(false);
  const [selectedTrialForDonation, setSelectedTrialForDonation] = useState("");
  const [selectedNgo, setSelectedNgo] = useState("Goonj NGO");
  const [donationClothesCount, setDonationClothesCount] = useState("5-10 Items");

  useEffect(() => {
    setLocalUser(readLocalUser());

    // Load home trials from localStorage or set initial mocks
    const storedTrials = localStorage.getItem("profileHomeTrials");
    if (storedTrials) {
      try {
        setHomeTrials(JSON.parse(storedTrials));
      } catch {
        initTrials();
      }
    } else {
      initTrials();
    }

    // Load donations from localStorage or set initial mocks
    const storedDonations = localStorage.getItem("profileDonations");
    if (storedDonations) {
      try {
        setDonations(JSON.parse(storedDonations));
      } catch {
        initDonations();
      }
    } else {
      initDonations();
    }
  }, []);

  const initTrials = () => {
    const initialTrials: HomeTrial[] = [
      {
        id: "HT-8402",
        placedAt: "08 Jun 2026",
        status: "Delivered",
        vendorStatus: "Vendor at Door - Awaiting Arrival Verification",
        otpVerified: false,
        items: [
          { name: "Product 1", brand: "Loro Piana", size: "L", price: 4689 },
          { name: "Product 6", brand: "Nike", size: "L", price: 3499 }
        ]
      },
      {
        id: "HT-2931",
        placedAt: "02 Jun 2026",
        status: "Completed",
        vendorStatus: "Completed - Tailoring Allowed",
        otpVerified: true,
        items: [
          { name: "Product 2", brand: "Zegna", size: "XL", price: 6299 }
        ]
      }
    ];
    setHomeTrials(initialTrials);
    localStorage.setItem("profileHomeTrials", JSON.stringify(initialTrials));
  };

  const initDonations = () => {
    const initialDonations: Donation[] = [
      {
        id: "#VOG-DON-84729",
        ngoName: "Goonj NGO",
        pickupDate: "15 Jun 2026",
        timeSlot: "2:00–4:00 PM",
        itemType: "Formal Wear (5 Items)",
        status: "Pickup Scheduled",
        linkedTrialId: "HT-2931"
      }
    ];
    setDonations(initialDonations);
    localStorage.setItem("profileDonations", JSON.stringify(initialDonations));
  };

  const updateHomeTrialsLocal = (newTrials: HomeTrial[]) => {
    setHomeTrials(newTrials);
    localStorage.setItem("profileHomeTrials", JSON.stringify(newTrials));
  };

  const updateDonationsLocal = (newDonations: Donation[]) => {
    setDonations(newDonations);
    localStorage.setItem("profileDonations", JSON.stringify(newDonations));
  };

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
      await signOut({ redirect: false });
      router.replace("/login");
    } else {
      router.replace("/login");
    }
  };

  // 2nd OTP verification trigger
  const handleVerifyVendorArrival = (trialId: string) => {
    setVerifyingTrialId(trialId);
    setEnteredOtp("");
  };

  const confirmOtpVerification = (trialId: string) => {
    if (enteredOtp.trim() !== "4321") {
      toast.error("Invalid security OTP. Enter '4321' for demo verification.");
      return;
    }

    const updatedTrials = homeTrials.map(trial => {
      if (trial.id === trialId) {
        return {
          ...trial,
          status: "Completed",
          vendorStatus: "Completed - Tailoring Allowed",
          otpVerified: true
        };
      }
      return trial;
    });

    updateHomeTrialsLocal(updatedTrials);
    setVerifyingTrialId(null);
    setEnteredOtp("");
    toast.success("Home Trial verification completed! Alterations unlocked.");
  };

  // Handle donation booking submit
  const handleBookDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrialForDonation) {
      toast.error("Please select a linked Home Trial first.");
      return;
    }

    const linkedTrial = homeTrials.find(t => t.id === selectedTrialForDonation);
    const dateStr = linkedTrial ? linkedTrial.placedAt : "18 Jun 2026";

    const newDonation = {
      id: `#VOG-DON-${Math.floor(10000 + Math.random() * 90000)}`,
      ngoName: selectedNgo,
      pickupDate: dateStr,
      timeSlot: "11:00 AM–1:00 PM",
      itemType: donationClothesCount,
      status: "Pickup Scheduled",
      linkedTrialId: selectedTrialForDonation
    };

    updateDonationsLocal([newDonation, ...donations]);
    setIsBookingDonation(false);
    toast.success("Donation pickup scheduled! Vendor will collect garments during the Home Trial.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Header */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-sm text-gray-500 font-medium">My Account</p>
            <h1 className="text-4xl font-serif text-gray-900 mt-1">Your Profile</h1>
            <p className="mt-2 text-gray-600 max-w-2xl text-sm">
              Manage your personal preferences, trace orders, track Home Trials, and schedule NGO donations.
            </p>
          </div>

          {isAuthed ? (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm hover:bg-zinc-800 transition shadow-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm hover:bg-zinc-800 transition shadow-sm font-medium"
            >
              Sign in
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {!isAuthed ? (
          <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">You’re not signed in</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              Sign in to view your profile, trace home trials, and manage cloth alterations.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="px-5 py-3 rounded-xl bg-black text-white text-sm hover:bg-zinc-800 transition font-semibold"
              >
                Continue to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            
            {/* Top row: Profile & Journey Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Profile details */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-start gap-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 flex items-center justify-center flex-shrink-0">
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
                      <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
                    </div>
                    <p className="text-gray-500 mt-1 text-sm">Welcome back to Vogueish.</p>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{formatMaybe(profile.email)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{"—"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-6 pt-5">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-900 uppercase tracking-widest text-[10px]">Account Profile</span>
                    <span>Standard Buyer</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-100 p-3 bg-zinc-50/50">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
                      <p className="mt-1 text-xs font-semibold text-gray-900">Active</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 p-3 bg-zinc-50/50">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Region</p>
                      <p className="mt-1 text-xs font-semibold text-gray-900">India Hub</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Journey details */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">Your Vogueish Journey</h2>
                  <p className="mt-1 text-gray-600 text-xs leading-relaxed">
                    A quick snapshot of your active engagement parameters.
                  </p>

                  <div className="mt-5 space-y-2">
                    {[
                      { label: "Profile status", value: "Verified Client" },
                      { label: "Email status", value: "Confirmed" },
                      { label: "Total Home trials", value: `${homeTrials.length} trials` },
                      { label: "Total Donations", value: `${donations.length} pickups` }
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm">
                        <p className="text-gray-700">{row.label}</p>
                        <p className="text-gray-900 font-medium flex items-center gap-1.5">
                          {row.value}
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: MY ORDERS (Standard Purchases - No alteration button) */}
            <section id="my-orders" className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">My Orders</h2>
                  <p className="mt-1 text-gray-500 text-xs">
                    View and track your standard purchases. Cloth alterations are exclusively offered for Home Trial products.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {demoOrders.map((order) => (
                  <div key={order.id} className="p-6 sm:p-8 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{order.placedAt}</p>
                        <h3 className="mt-0.5 text-base font-semibold text-gray-900">{order.id}</h3>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {order.totalItems} item{order.totalItems > 1 ? "s" : ""} • ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                        {order.status}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.name}`} className="rounded-2xl border border-gray-100 p-4 bg-zinc-50/20">
                          <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.brand}</p>
                          <p className="mt-2 text-xs text-gray-600">
                            Size: <span className="font-medium text-gray-900">{item.size}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={order.trackingHref}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs hover:bg-zinc-800 transition font-medium"
                      >
                        Track order
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2: HOME TRIALS (Arrival & 2nd OTP Verification + Alterations Link) */}
            <section id="home-trials" className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <h2 className="text-2xl font-serif text-gray-900">Home Trials</h2>
                <p className="mt-1 text-gray-500 text-xs">
                  Your luxury door trials. Verify vendor arrival via OTP code once they reach your home to unlock alteration services.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {homeTrials.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No Home Trials scheduled. Check out our store to book wardrobe home trials.
                  </div>
                ) : (
                  homeTrials.map((trial) => (
                    <div key={trial.id} className="p-6 sm:p-8 flex flex-col gap-5">
                      
                      {/* Trial Header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Trial Booked: {trial.placedAt}</p>
                          <h3 className="mt-0.5 text-base font-semibold text-gray-900">{trial.id}</h3>
                          <p className="mt-1 text-xs font-medium text-gray-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            Status: <span className="text-zinc-850 font-bold">{trial.vendorStatus}</span>
                          </p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          trial.status === "Completed"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {trial.status}
                        </span>
                      </div>

                      {/* Products inside Home Trial */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {trial.items.map((item: TrialItem) => (
                          <div key={item.name} className="rounded-2xl border border-gray-100 p-4 bg-zinc-50/20 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.brand}</p>
                              <p className="mt-1 text-xs text-gray-600">Size: {item.size}</p>
                            </div>
                            
                            {/* Alteration option strictly only after OTP verification completed */}
                            {trial.otpVerified ? (
                              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Verification Cleared
                                </span>
                                <Link
                                  href={`/alteration?trialId=${trial.id}&productName=${encodeURIComponent(item.name)}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-black hover:bg-black hover:text-white text-xs font-medium transition"
                                >
                                  <Scissors className="w-3 h-3 mr-1" /> Request Alteration
                                </Link>
                              </div>
                            ) : (
                              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-amber-600 text-xs">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Verify vendor arrival below to request alteration.</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Verification Flow for vendor arrival */}
                      {!trial.otpVerified && (
                        <div className="mt-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Stylist Arrival & Showroom Verification
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            When our stylist reaches your home and presents the garments, request the security code and enter it below.
                          </p>

                          {verifyingTrialId === trial.id ? (
                            <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md">
                              <input
                                type="text"
                                maxLength={4}
                                value={enteredOtp}
                                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="Enter 4-Digit Security OTP (use '4321')"
                                className="flex-1 min-w-[200px] border border-gray-300 rounded-xl px-4 py-2 text-sm text-center font-mono focus:ring-2 focus:ring-black focus:border-black outline-none tracking-widest"
                              />
                              <button
                                onClick={() => confirmOtpVerification(trial.id)}
                                className="bg-black hover:bg-zinc-800 text-white text-xs px-5 py-2.5 rounded-xl transition font-semibold"
                              >
                                Confirm Verification
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleVerifyVendorArrival(trial.id)}
                              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl transition font-semibold shadow-sm inline-flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Verify Vendor Arrival
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* SECTION 3: NGO DONATIONS (Linked to active Home Trials) */}
            <section id="my-donations" className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">Cloth Donations</h2>
                  <p className="mt-1 text-gray-500 text-xs">
                    Divert your pre-loved clothes to verified local NGOs. Pickups are scheduled strictly in tandem with Home Trial visits.
                  </p>
                </div>
                
                <button
                  onClick={() => setIsBookingDonation(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white text-xs font-semibold transition"
                >
                  <Gift className="w-3.5 h-3.5" />
                  Schedule Donation
                </button>
              </div>

              {/* Donation pickup booking form overlay / container */}
              {isBookingDonation && (
                <div className="p-6 sm:p-8 bg-zinc-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Book Donation pickup</h3>
                  
                  {homeTrials.length === 0 ? (
                    <div className="text-sm text-red-650 bg-red-50 p-4 border border-red-200 rounded-2xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>You do not have any active Home Trials. Collection is done strictly during Home Trial visits.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleBookDonation} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Link to Home Trial Visit</label>
                        <select
                          value={selectedTrialForDonation}
                          onChange={(e) => setSelectedTrialForDonation(e.target.value)}
                          required
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-black outline-none"
                        >
                          <option value="">-- Select active trial visit --</option>
                          {homeTrials.map(t => (
                            <option key={t.id} value={t.id}>{t.id} (Scheduled: {t.placedAt})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select NGO</label>
                          <select
                            value={selectedNgo}
                            onChange={(e) => setSelectedNgo(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-black outline-none"
                          >
                            <option value="Goonj NGO">Goonj NGO</option>
                            <option value="Clothes Box Foundation">Clothes Box Foundation</option>
                            <option value="Uday Foundation">Uday Foundation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Clothes Size</label>
                          <select
                            value={donationClothesCount}
                            onChange={(e) => setDonationClothesCount(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-black outline-none"
                          >
                            <option value="1-5 Items">1-5 Items</option>
                            <option value="5-10 Items">5-10 Items</option>
                            <option value="10+ Items">10+ Items</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="submit"
                          className="bg-black hover:bg-zinc-800 text-white text-xs px-5 py-2.5 rounded-xl transition font-semibold"
                        >
                          Book Collection
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsBookingDonation(false)}
                          className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-4 py-2.5 rounded-xl transition font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Scheduled Donations List */}
              <div className="divide-y divide-gray-100">
                {donations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No scheduled cloth donations. Diversify your pre-loved outfits to NGOs during your trial visits.
                  </div>
                ) : (
                  donations.map((don) => (
                    <div key={don.id} className="p-6 sm:p-8 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 rounded w-fit">
                            NGO Collection Scheduled
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-gray-900">{don.id}</h3>
                          <p className="text-xs text-gray-500 mt-1">NGO: <span className="font-semibold text-gray-700">{don.ngoName}</span></p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                          {don.status}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl border border-gray-100 p-3 bg-zinc-50/20">
                          <p className="text-gray-400">Pickup Date & Time</p>
                          <p className="mt-1 font-semibold text-gray-800 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {don.pickupDate} at {don.timeSlot}
                          </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-3 bg-zinc-50/20">
                          <p className="text-gray-400">Items & Linked Trial</p>
                          <p className="mt-1 font-semibold text-gray-800">
                            {don.itemType} (Linked: <span className="font-mono">{don.linkedTrialId}</span>)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
