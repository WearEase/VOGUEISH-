"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Check, AlertCircle, MapPin, Loader2, ChevronDown, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Step = 1 | 2 | 3;

interface LeafletMap {
  remove: () => void;
  fitBounds: (bounds: unknown, options?: { padding: [number, number] }) => void;
}
interface LeafletMapContainer extends HTMLElement {
  _leaflet_map?: LeafletMap;
}
interface LeafletGlobal {
  map: (id: string) => { setView: (c: [number, number], z: number) => LeafletMap; remove: () => void; fitBounds: (b: unknown, o?: { padding: [number, number] }) => void };
  tileLayer: (url: string, o?: { attribution: string }) => { addTo: (m: LeafletMap) => void };
  divIcon: (o: { className?: string; html: string; iconSize: [number, number]; iconAnchor: [number, number] }) => unknown;
  marker: (ll: [number, number], o?: { icon: unknown }) => { addTo: (m: LeafletMap) => { bindPopup: (c: string) => { openPopup: () => void } } };
  polyline: (ll: [number, number][], o?: { color?: string; dashArray?: string; weight?: number }) => { addTo: (m: LeafletMap) => void };
  latLngBounds: (b: [number, number][]) => unknown;
}

interface HomeTrial {
  _id: string;
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  pincode: string;
  date: string;
  timeSlot: string;
  serviceType: string;
  status: "Pending" | "Completed";
  vendorStatus: string;
}

interface NGODoc {
  _id: string;
  name: string;
  area: string;
  address?: string;
  pincode?: string;
  lat?: number;
  lon?: number;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function cn(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

/** Extract the dominant area keyword from an address string */
function extractAreaFromAddress(address: string): string {
  const known = [
    "rohini", "pitampura", "model town", "paharganj", "karol bagh",
    "dwarka", "janakpuri", "laxmi nagar", "shahdara", "hauz khas",
    "saket", "malviya nagar", "green park", "civil lines", "mukherjee nagar",
    "preet vihar", "mayur vihar", "uttam nagar", "rajouri garden", "tilak nagar",
    "punjabi bagh", "paschim vihar", "shalimar bagh", "ashok vihar",
    "kirti nagar", "moti nagar", "patel nagar", "rajinder nagar",
    "narela", "burari", "adarsh nagar", "shakurpur", "janakpuri",
    "vasant kunj", "vasant vihar", "r k puram", "munirka", "safdarjung",
    "lajpat nagar", "defence colony", "south extension", "greater kailash",
    "kalkaji", "okhla", "jasola", "badarpur", "sangam vihar", "mehrauli",
    "connaught place", "new delhi", "central delhi",
  ];
  const lower = address.toLowerCase();
  for (const area of known) {
    if (lower.includes(area)) {
      // Capitalize each word
      return area.replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  return "";
}


/* ─── Sub-components ─────────────────────────────────────────────────────── */
function CircleStep({ label, state }: { label: string; state: "done" | "active" | "todo" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-xs",
        state === "done" && "border-emerald-600 bg-emerald-600 text-white",
        state === "active" && "border-emerald-600 bg-emerald-50 text-emerald-700",
        state === "todo" && "border-zinc-200 bg-white text-zinc-500")} aria-hidden="true">
        {state === "done" ? <Check className="h-4 w-4" /> : ""}
      </div>
      <div className={cn("text-xs font-medium", state === "todo" ? "text-zinc-500" : "text-zinc-900")}>{label}</div>
    </div>
  );
}
function StepConnector({ active }: { active?: boolean }) {
  return <div className={cn("h-[2px] w-20 rounded-full", active ? "bg-emerald-600" : "bg-zinc-200")} />;
}
function Stepper({ step }: { step: Step }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CircleStep label="1. Your Trial Booking" state={step > 1 ? "done" : step === 1 ? "active" : "todo"} />
      <StepConnector active={step >= 2} />
      <CircleStep label="2. Choose NGO" state={step > 2 ? "done" : step === 2 ? "active" : "todo"} />
      <StepConnector active={step >= 3} />
      <CircleStep label="3. Track Impact" state={step === 3 ? "active" : "todo"} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-32 shrink-0 text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-900">{value}</span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function DonateFromAnywhere() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const userEmail = session?.user?.email ?? "";

  // ── States ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);

  // Home trial states
  const [trials, setTrials] = useState<HomeTrial[]>([]);
  const [trialsLoading, setTrialsLoading] = useState(true);
  const [selectedTrial, setSelectedTrial] = useState<HomeTrial | null>(null);
  const [showTrialDropdown, setShowTrialDropdown] = useState(false);

  // NGO states
  const [ngos, setNgos] = useState<NGODoc[]>([]);
  const [ngosLoading, setNgosLoading] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<NGODoc | null>(null);



  // Confirmation states
  const [submitting, setSubmitting] = useState(false);
  const trackingId = useMemo(() => `#VOG-DON-${Math.floor(10000 + Math.random() * 90000)}`, []);

  // Leaflet
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // ── Load Leaflet ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else if ((window as unknown as { L?: LeafletGlobal }).L) {
      setLeafletLoaded(true);
    }
  }, []);

  // ── Fetch home trials for this user ─────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    setTrialsLoading(true);
    fetch(`/api/home-trials?email=${encodeURIComponent(userEmail)}`)
      .then(r => r.json())
      .then((data: HomeTrial[]) => {
        setTrials(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedTrial(data[0]); // most recent first
        }
      })
      .catch(() => toast.error("Could not load your home trial bookings."))
      .finally(() => setTrialsLoading(false));
  }, [userEmail]);

  // ── Fetch NGOs when trial is selected (runs both Option A + B) ───────────
  const fetchNGOs = useCallback(async (trial: HomeTrial) => {
    setNgosLoading(true);
    setNgos([]);
    setSelectedNgo(null);

    let results: NGODoc[] = [];

    // Option B — exact pincode match
    if (trial.pincode) {
      try {
        const r = await fetch(`/api/ngos?pincode=${encodeURIComponent(trial.pincode)}`);
        const data: NGODoc[] = await r.json();
        if (Array.isArray(data)) results = data;
      } catch {/* ignore */}
    }

    // Option A — fuzzy area extraction from address (merge results, dedup by _id)
    const area = extractAreaFromAddress(trial.addressLine1 || "");
    if (area) {
      try {
        const r = await fetch(`/api/ngos?area=${encodeURIComponent(area)}`);
        const data: NGODoc[] = await r.json();
        if (Array.isArray(data)) {
          const ids = new Set(results.map(n => n._id));
          results = [...results, ...data.filter(n => !ids.has(n._id))];
        }
      } catch {/* ignore */}
    }

    // If still empty — fetch all and sort by distance
    if (results.length === 0) {
      try {
        const r = await fetch("/api/ngos");
        const data: NGODoc[] = await r.json();
        if (Array.isArray(data)) results = data;
      } catch {/* ignore */}
    }

    // Sort by distance if we have coordinates
    if (trial.pincode) {
      // Rough geocode using a pincode→lat/lon heuristic in AREA_COORDINATES is not possible here,
      // so sort by those that have lat/lon and are closest (if lat/lon available)
      results.sort((a, b) => {
        const aHasCoords = a.lat !== undefined && a.lon !== undefined;
        const bHasCoords = b.lat !== undefined && b.lon !== undefined;
        if (aHasCoords && bHasCoords) return 0;
        if (aHasCoords) return -1;
        return 1;
      });
    }

    setNgos(results);
    setNgosLoading(false);
  }, []);

  useEffect(() => {
    if (selectedTrial) fetchNGOs(selectedTrial);
  }, [selectedTrial, fetchNGOs]);

  // ── Leaflet map for step 2 NGO view ─────────────────────────────────────
  useEffect(() => {
    if (!leafletLoaded || step !== 2 || !selectedNgo) return;
    const L = (window as unknown as { L?: LeafletGlobal }).L;
    if (!L) return;

    const container = document.getElementById("leaflet-map");
    if (!container) return;

    const existing = (container as LeafletMapContainer)._leaflet_map;
    if (existing) {
      existing.remove();
      delete (container as LeafletMapContainer)._leaflet_map;
    }

    const defaultLat = 28.6139, defaultLon = 77.2090;
    const nLat = selectedNgo.lat ?? defaultLat;
    const nLon = selectedNgo.lon ?? defaultLon;

    const map = L.map("leaflet-map").setView([nLat, nLon], 14);
    (container as LeafletMapContainer)._leaflet_map = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const ngoIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color:#10b981;border:2px solid white;border-radius:50%;width:28px;height:28px;box-shadow:0 2px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🏢</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([nLat, nLon], { icon: ngoIcon })
      .addTo(map)
      .bindPopup(`<div style="font-size:11px;font-weight:bold;color:#065f46;">${selectedNgo.name}</div><div style="font-size:10px;color:#6b7280;margin-top:3px;">${selectedNgo.address ?? selectedNgo.area}</div>`)
      .openPopup();

    return () => {
      map.remove();
      delete (container as LeafletMapContainer)._leaflet_map;
    };
  }, [leafletLoaded, step, selectedNgo]);

  // ── Leaflet map for step 3 journey view ──────────────────────────────────
  useEffect(() => {
    if (!leafletLoaded || step !== 3) return;
    const L = (window as unknown as { L?: LeafletGlobal }).L;
    if (!L) return;

    const container = document.getElementById("leaflet-map-journey");
    if (!container) return;

    const existing = (container as LeafletMapContainer)._leaflet_map;
    if (existing) {
      existing.remove();
      delete (container as LeafletMapContainer)._leaflet_map;
    }

    const uLat = 28.6514, uLon = 77.1903;
    const hubLat = 28.6304, hubLon = 77.2177;
    const nLat = selectedNgo?.lat ?? 28.5604;
    const nLon = selectedNgo?.lon ?? 77.2057;

    const map = L.map("leaflet-map-journey").setView([hubLat, hubLon], 11);
    (container as LeafletMapContainer)._leaflet_map = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);

    const makeIcon = (color: string, emoji: string) => L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color:${color};border:2px solid white;border-radius:50%;width:26px;height:26px;box-shadow:0 2px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:11px;">${emoji}</div>`,
      iconSize: [26, 26], iconAnchor: [13, 13],
    });

    L.marker([uLat, uLon], { icon: makeIcon("#3b82f6", "📦") }).addTo(map).bindPopup("Your Location");
    L.marker([hubLat, hubLon], { icon: makeIcon("#f59e0b", "🏭") }).addTo(map).bindPopup("Vogueish Sorting Hub");
    L.marker([nLat, nLon], { icon: makeIcon("#10b981", "🏢") }).addTo(map).bindPopup(`Partner NGO: ${selectedNgo?.name ?? ""}`);

    L.polyline([[uLat, uLon], [hubLat, hubLon]], { color: "#3b82f6", dashArray: "5,8", weight: 3 }).addTo(map);
    L.polyline([[hubLat, hubLon], [nLat, nLon]], { color: "#10b981", dashArray: "5,8", weight: 3 }).addTo(map);

    const bounds = L.latLngBounds([[uLat, uLon], [hubLat, hubLon], [nLat, nLon]]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
      delete (container as LeafletMapContainer)._leaflet_map;
    };
  }, [leafletLoaded, step, selectedNgo]);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleConfirmPickup = async () => {
    if (!selectedTrial || !selectedNgo) return;
    setSubmitting(true);
    try {
      const payload = {
        id: trackingId.replace("#", ""),
        userEmail,
        ngoName: selectedNgo.name,
        ngoId: selectedNgo._id,
        pickupDate: selectedTrial.date,
        timeSlot: selectedTrial.timeSlot,
        itemType: "Clothes (from Home Trial)",
        linkedTrialId: selectedTrial.id,
        addressLine1: selectedTrial.addressLine1,
        pincode: selectedTrial.pincode,
        phone: selectedTrial.phone,
      };

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Donation creation failed");
      }

      toast.success("Donation scheduled successfully! 🎉");
      setStep(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Auth loading ─────────────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  // ── Not signed in ────────────────────────────────────────────────────────
  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <ShoppingBag className="w-12 h-12 text-zinc-300" />
        <h1 className="font-serif text-3xl text-zinc-900">Sign in to Donate</h1>
        <p className="text-sm text-zinc-500 max-w-sm">Please sign in to access the donation workflow.</p>
        <Link href="/login" className="inline-flex h-10 items-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  // ── Trials loading ───────────────────────────────────────────────────────
  if (trialsLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <p className="text-sm text-zinc-500">Checking your Home Trial bookings…</p>
      </div>
    );
  }

  // ── No trials — gate the page ────────────────────────────────────────────
  if (trials.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">🏠</div>
        <h1 className="font-serif text-3xl text-zinc-900">Book a Home Trial First</h1>
        <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
          Our donation service is tied to your Home Trial visit. When our vendor arrives for your trial, 
          they will also pick up the clothes you want to donate &mdash; no extra trip needed!
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-sm text-left">
          <p className="text-xs font-semibold text-amber-800 mb-1">How it works</p>
          <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>Book a Home Trial for clothes you want to try on</li>
            <li>Our vendor arrives at your address on the scheduled date</li>
            <li>They pick up your donation clothes on the same visit</li>
            <li>Clothes are sorted and delivered to an NGO of your choice</li>
          </ol>
        </div>
        <button
          type="button"
          onClick={() => router.push("/home-trials")}
          className="inline-flex h-10 items-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Book a Home Trial →
        </button>
      </div>
    );
  }

  /* ── Main render (trials exist) ────────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-4xl text-zinc-900">Donate From Anywhere</h1>
          <p className="mt-2 text-sm text-zinc-500">Your vendor will pick up your donation during your scheduled Home Trial visit.</p>
        </div>

        <Stepper step={step} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 text-left">
          {/* ── LEFT CARD ────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">

            {/* STEP 1 — Select which Home Trial */}
            {step === 1 && (
              <>
                <h2 className="font-serif text-3xl text-zinc-900">Your Trial Booking</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  The pickup address and time are taken from your Home Trial. Your donation vendor will be the same stylist.
                </p>

                {/* Trial selector if multiple trials */}
                {trials.length > 1 && (
                  <div className="mt-4 relative">
                    <p className="text-xs font-semibold text-zinc-700 mb-1">Link donation to:</p>
                    <button
                      type="button"
                      onClick={() => setShowTrialDropdown(v => !v)}
                      className="w-full flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 transition"
                    >
                      <span>{selectedTrial?.id} — {selectedTrial?.date}</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                    {showTrialDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowTrialDropdown(false)} />
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          {trials.map(t => (
                            <button
                              key={t._id}
                              type="button"
                              onClick={() => { setSelectedTrial(t); setShowTrialDropdown(false); }}
                              className={cn(
                                "w-full text-left px-3 py-2.5 text-sm hover:bg-zinc-50 transition",
                                selectedTrial?._id === t._id && "bg-emerald-50 text-emerald-800 font-semibold"
                              )}
                            >
                              {t.id} — {t.date} — {t.status}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Trial details card */}
                {selectedTrial && (
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        selectedTrial.status === "Completed" ? "bg-zinc-100 text-zinc-600" : "bg-emerald-100 text-emerald-700"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", selectedTrial.status === "Completed" ? "bg-zinc-400" : "bg-emerald-500")} />
                        {selectedTrial.status}
                      </span>
                      <span className="text-xs text-zinc-400">Trial ID: {selectedTrial.id}</span>
                    </div>
                    <InfoRow label="Name" value={selectedTrial.fullName} />
                    <InfoRow label="Phone" value={selectedTrial.phone} />
                    <InfoRow label="Address" value={selectedTrial.addressLine1} />
                    <InfoRow label="Pincode" value={selectedTrial.pincode} />
                    <InfoRow label="Trial Date" value={selectedTrial.date} />
                    <InfoRow label="Time Slot" value={selectedTrial.timeSlot} />
                    <InfoRow label="Stylist" value={selectedTrial.serviceType + " Stylist"} />
                    <InfoRow label="Vendor Status" value={selectedTrial.vendorStatus} />
                  </div>
                )}

                <div className="mt-5">
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Address details are read-only and fetched from your booked trial.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-5 inline-flex h-10 items-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Choose NGO →
                </button>
              </>
            )}

            {/* STEP 2 — Choose NGO + schedule */}
            {step === 2 && (
              <>
                <h2 className="font-serif text-3xl text-zinc-900">Choose an NGO</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  NGOs near your trial address ({selectedTrial?.pincode}). Click one to select it.
                </p>

                {ngosLoading ? (
                  <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Finding NGOs near your area…
                  </div>
                ) : ngos.length === 0 ? (
                  <div className="mt-6 text-sm text-zinc-500">No partner NGOs found near your area. Please contact support.</div>
                ) : (
                  <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
                    {ngos.map(ngo => {
                      const isSelected = selectedNgo?._id === ngo._id;
                      return (
                        <button
                          key={ngo._id}
                          type="button"
                          onClick={() => setSelectedNgo(ngo)}
                          className={cn(
                            "w-full text-left rounded-xl border p-3 transition-all",
                            isSelected
                              ? "border-emerald-500 bg-emerald-50 shadow-sm"
                              : "border-zinc-200 bg-white hover:bg-zinc-50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-emerald-600" : "text-zinc-400")} />
                                <span className="text-sm font-semibold text-zinc-800">{ngo.name}</span>
                              </div>
                              <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed pl-5">
                                {ngo.address ?? ngo.area}
                                {ngo.pincode && <span className="ml-1 text-zinc-400">· {ngo.pincode}</span>}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}



                <div className="mt-5 flex items-center gap-4">
                  <button
                    type="button"
                    disabled={!selectedNgo || submitting}
                    onClick={handleConfirmPickup}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirm Donation Pickup
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-zinc-500 underline-offset-4 hover:underline">
                    Back
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 — Confirmation */}
            {step === 3 && (
              <div className="text-center">
                <h2 className="font-serif text-3xl text-zinc-900">Donation Confirmed!</h2>
                <div className="mt-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-500">
                  Thank you! Your vendor will collect your clothes during the Home Trial visit.
                </p>

                <div className="mt-6 rounded-xl border border-zinc-200 bg-white text-left">
                  <div className="p-4 space-y-2.5">
                    <InfoRow label="Tracking ID" value={trackingId} />
                    <InfoRow label="NGO Partner" value={selectedNgo?.name ?? "—"} />
                    <InfoRow label="Pickup Date" value={selectedTrial?.date ?? "—"} />
                    <InfoRow label="Time Slot" value={selectedTrial?.timeSlot ?? "—"} />
                    <InfoRow label="Address" value={selectedTrial?.addressLine1 ?? "—"} />
                    <InfoRow label="Pincode" value={selectedTrial?.pincode ?? "—"} />
                    <InfoRow label="Linked Trial" value={selectedTrial?.id ?? "—"} />
                  </div>

                  <div className="border-t border-zinc-100 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 mb-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      Pickup Scheduled
                    </div>
                    <div className="space-y-2 text-sm text-zinc-500">
                      {["In Transit", "Received at Hub", "Sorted", "Delivered to NGO"].map(label => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-zinc-300" />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-center">
                    <button
                      type="button"
                      onClick={() => router.push("/my-account#my-donations")}
                      className="inline-flex h-10 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto transition-colors"
                    >
                      View My Donations
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStep(1); }}
                      className="inline-flex h-10 w-full items-center justify-center rounded-full border border-emerald-200 px-6 text-sm font-medium text-emerald-700 hover:bg-emerald-50 sm:w-auto"
                    >
                      Donate Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT CARD ───────────────────────────────────────────────── */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {step < 3 ? (
              <>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {step === 1 ? "How Your Donation Works" : selectedNgo ? `Map: ${selectedNgo.name}` : "NGO Location Map"}
                </h3>

                {step === 1 && (
                  <div className="mt-4 space-y-4">
                    {[
                      { icon: "🏠", title: "Vendor visits you", desc: "The same stylist who comes for your trial picks up your donation clothes — no extra trip." },
                      { icon: "🏭", title: "Sorted at our hub", desc: "Clothes are cleaned and sorted at the Vogueish hub to ensure quality before donation." },
                      { icon: "🏢", title: "Delivered to NGO", desc: "Your chosen NGO receives the clothes directly. You can track the full journey." },
                      { icon: "❤️", title: "Impact report", desc: "You receive an impact report once the clothes reach the NGO." },
                    ].map(item => (
                      <div key={item.title} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">{item.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                      {selectedNgo ? (
                        <div id="leaflet-map" className="w-full h-full z-0" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
                          <MapPin className="w-8 h-8" />
                          <p className="text-xs">Select an NGO to see it on the map</p>
                        </div>
                      )}
                    </div>
                    {selectedNgo && (
                      <div className="mt-3 text-xs text-zinc-600">
                        <span className="font-semibold text-emerald-700">{selectedNgo.name}</span>
                        <span className="text-zinc-400"> · </span>
                        {selectedNgo.area}
                        {selectedNgo.pincode && <span className="text-zinc-400"> · {selectedNgo.pincode}</span>}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="font-serif text-3xl text-zinc-900">Your donation&apos;s journey</h3>
                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                    <div id="leaflet-map-journey" className="w-full h-full z-0" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-600">
                  Your clothes are on their way to be sorted and delivered to <span className="font-semibold text-emerald-700">{selectedNgo?.name}</span>. Follow their journey here.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="mt-10 rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">2,431 kg</div>
              <div className="text-xs text-zinc-500">textiles diverted from landfill</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">1,120</div>
              <div className="text-xs text-zinc-500">Donors engaged</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">7</div>
              <div className="text-xs text-zinc-500">partner NGOs onboarded</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-div-icon {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}