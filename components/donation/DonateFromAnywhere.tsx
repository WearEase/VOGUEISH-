"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

type Step = 1 | 2 | 3;

const OFFICES = ["Ciena Gurugram Campus", "Noida Tech Park", "Bangalore ORR Hub"] as const;
const TIME_SLOTS = ["9:00–11:00 AM", "11:00–1:00 PM", "2:00–4:00 PM", "4:00–6:00 PM"] as const;

function cn(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

function CircleStep({
  label,
  state,
}: {
  label: string;
  state: "done" | "active" | "todo";
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
          state === "done" && "border-emerald-600 bg-emerald-600 text-white",
          state === "active" && "border-emerald-600 bg-emerald-50 text-emerald-700",
          state === "todo" && "border-zinc-200 bg-white text-zinc-500"
        )}
        aria-hidden="true"
      >
        {state === "done" ? <Check className="h-4 w-4" /> : ""}
      </div>
      <div
        className={cn(
          "text-xs font-medium",
          state === "todo" ? "text-zinc-500" : "text-zinc-900"
        )}
      >
        {label}
      </div>
    </div>
  );
}

function StepConnector({ active }: { active?: boolean }) {
  return (
    <div className={cn("h-[2px] w-20 rounded-full", active ? "bg-emerald-600" : "bg-zinc-200")} />
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CircleStep label="1. Select office" state={step > 1 ? "done" : step === 1 ? "active" : "todo"} />
      <StepConnector active={step >= 2} />
      <CircleStep label="2. Schedule pickup" state={step > 2 ? "done" : step === 2 ? "active" : "todo"} />
      <StepConnector active={step >= 3} />
      <CircleStep label="3. Track impact" state={step === 3 ? "active" : "todo"} />
    </div>
  );
}

export default function DonateFromAnywhere() {
  const [step, setStep] = useState<Step>(1);
  const [officeQuery, setOfficeQuery] = useState("");
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<(typeof TIME_SLOTS)[number]>(TIME_SLOTS[2]);
  const [monthCursor, setMonthCursor] = useState(() => new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 15));
  const donationTypeLabel = "Formal wear";
  const trackingId = "#VOG-DON-84729";

  const monthLabel = useMemo(() => {
    const month = monthCursor.toLocaleString("en-US", { month: "long" });
    return `${month} ${monthCursor.getFullYear()}`;
  }, [monthCursor]);

  const calendar = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const leading = first.getDay();
    const days = last.getDate();
    const cells: Array<{ date: Date | null; day: number | null }> = [];

    for (let i = 0; i < leading; i++) cells.push({ date: null, day: null });
    for (let d = 1; d <= days; d++) cells.push({ date: new Date(year, month, d), day: d });
    while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
    return cells;
  }, [monthCursor]);

  const filteredOffices = useMemo(() => {
    const q = officeQuery.trim().toLowerCase();
    if (!q) return OFFICES as unknown as string[];
    return (OFFICES as unknown as string[]).filter((o) => o.toLowerCase().includes(q));
  }, [officeQuery]);

  const canContinueToSchedule = Boolean(selectedOffice);
  const canConfirmPickup = Boolean(selectedOffice && selectedDate && selectedSlot);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-4xl text-zinc-900">Donate From Anywhere</h1>
        </div>

        <Stepper step={step} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT CARD */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {step === 1 && (
              <>
                <h2 className="font-serif text-3xl text-zinc-900">Select office</h2>

                <div className="mt-4">
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2">
                    <span className="text-zinc-400">⌕</span>
                    <input
                      value={officeQuery}
                      onChange={(e) => setOfficeQuery(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                      placeholder="Search your company campus"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {filteredOffices.map((office) => (
                      <button
                        key={office}
                        type="button"
                        onClick={() => setSelectedOffice(office)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs",
                          selectedOffice === office
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        {office}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!canContinueToSchedule}
                      onClick={() => setStep(2)}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      className="text-sm text-zinc-500 underline-offset-4 hover:underline"
                    >
                      Save for later
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-serif text-3xl text-zinc-900">Schedule your pickup</h2>

                {/* Calendar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm font-medium text-zinc-900">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() =>
                        setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
                      }
                      className="px-2 text-zinc-500 hover:text-zinc-900"
                    >
                      ‹
                    </button>
                    <div className="text-xs font-semibold text-zinc-900">{monthLabel}</div>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
                      }
                      className="px-2 text-zinc-500 hover:text-zinc-900"
                    >
                      ›
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendar.map((cell, idx) => {
                      const isSelected =
                        !!cell.date &&
                        !!selectedDate &&
                        cell.date.getFullYear() === selectedDate.getFullYear() &&
                        cell.date.getMonth() === selectedDate.getMonth() &&
                        cell.date.getDate() === selectedDate.getDate();

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!cell.date}
                          onClick={() => cell.date && setSelectedDate(cell.date)}
                          className={cn(
                            "h-9 w-9 rounded-full text-sm",
                            !cell.date && "cursor-default",
                            cell.date && !isSelected && "hover:bg-zinc-100 text-zinc-900",
                            isSelected && "bg-emerald-600 text-white"
                          )}
                        >
                          {cell.day ?? ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div className="mt-5">
                  <div className="text-xs font-semibold text-zinc-900">Available time slots</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "h-9 rounded-full border px-3 text-xs font-medium",
                          selectedSlot === slot
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    disabled={!canConfirmPickup}
                    onClick={() => setStep(3)}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Confirm pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-500 underline-offset-4 hover:underline"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center">
                  <h2 className="font-serif text-3xl text-zinc-900">Donation Confirmed!</h2>
                  <div className="mt-4 flex justify-center text-emerald-600">
                    <Check className="h-16 w-16" />
                  </div>
                  <p className="mt-4 text-sm text-zinc-600">
                    Thank you for your donation. Your pickup has been scheduled.
                  </p>
                </div>

                <div className="mt-6 rounded-lg border border-zinc-200 bg-white">
                  <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Tracking ID:</span>
                        <span className="font-medium text-zinc-900">{trackingId}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Pickup Schedule:</span>
                        <span className="text-zinc-900">
                          {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                          {"  |  "}{selectedSlot}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Location:</span>
                        <span className="text-zinc-900">{selectedOffice || "—"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Donation Type:</span>
                        <span className="text-zinc-900">{donationTypeLabel}</span>
                      </div>
                    </div>

                    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        Pickup Scheduled
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-zinc-700">
                        {["In Transit", "Received at Hub", "Sorted", "Delivered to NGO"].map((label) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-zinc-300" />
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-center">
                    <button
                      type="button"
                      className="inline-flex h-10 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto"
                    >
                      View My Donations
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-full items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-sm font-medium text-emerald-700 hover:bg-emerald-50 sm:w-auto"
                    >
                      Share Impact
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {step < 3 ? (
              <>
                <h3 className="text-lg font-semibold text-zinc-900">Select office</h3>

                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 640 480"
                      aria-hidden="true"
                    >
                      <rect width="640" height="480" fill="#FAFAFA" />
                      <g stroke="#E5E7EB" strokeWidth="2">
                        <path d="M40 90 H600" />
                        <path d="M40 150 H600" />
                        <path d="M40 210 H600" />
                        <path d="M40 270 H600" />
                        <path d="M40 330 H600" />
                        <path d="M40 390 H600" />
                        <path d="M120 50 V430" />
                        <path d="M220 50 V430" />
                        <path d="M320 50 V430" />
                        <path d="M420 50 V430" />
                        <path d="M520 50 V430" />
                      </g>
                      <g stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round" opacity="0.7">
                        <path d="M80 120 C170 140, 240 80, 330 120" />
                        <path d="M170 320 C260 280, 360 360, 470 320" />
                        <path d="M420 90 C470 160, 540 160, 580 210" />
                      </g>
                    </svg>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="rounded-md bg-white/95 px-2 py-1 text-xs text-zinc-700 shadow-sm">
                        Your office
                      </div>
                      <div className="mx-auto mt-2 h-4 w-4 rounded-full bg-emerald-600 ring-4 ring-emerald-200" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-semibold text-zinc-900">{selectedOffice || "—"}</div>
                  <p className="mt-2 text-sm text-zinc-600">Where your clothes go</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    We route every piece to verified NGOs and circular initiatives.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif text-3xl text-zinc-900">Your donation’s journey</h3>

                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 480" aria-hidden="true">
                      <rect width="640" height="480" fill="#FAFAFA" />
                      <g stroke="#E5E7EB" strokeWidth="2">
                        <path d="M40 90 H600" />
                        <path d="M40 150 H600" />
                        <path d="M40 210 H600" />
                        <path d="M40 270 H600" />
                        <path d="M40 330 H600" />
                        <path d="M40 390 H600" />
                        <path d="M120 50 V430" />
                        <path d="M220 50 V430" />
                        <path d="M320 50 V430" />
                        <path d="M420 50 V430" />
                        <path d="M520 50 V430" />
                      </g>

                      <path
                        d="M120 160 C220 120, 300 120, 360 210 S480 330, 540 300"
                        fill="none"
                        stroke="#15803D"
                        strokeWidth="4"
                        strokeDasharray="4 8"
                        opacity="0.8"
                      />

                      <g>
                        <circle cx="120" cy="160" r="10" fill="#16A34A" opacity="0.2" />
                        <circle cx="120" cy="160" r="6" fill="#16A34A" />
                        <circle cx="360" cy="210" r="10" fill="#16A34A" opacity="0.2" />
                        <circle cx="360" cy="210" r="6" fill="#16A34A" />
                        <circle cx="540" cy="300" r="10" fill="#16A34A" opacity="0.2" />
                        <circle cx="540" cy="300" r="6" fill="#16A34A" />
                      </g>

                      <g fill="#111827" fontSize="14" fontFamily="ui-sans-serif, system-ui">
                        <text x="92" y="140">Your Location</text>
                        <text x="332" y="190">Sorting Hub</text>
                        <text x="505" y="330">Partner NGO</text>
                      </g>
                    </svg>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-600">
                  Your clothes are on their way to be sorted and delivered to our partners. Follow their journey here.
                </p>
                {/* SDG logos removed per your instruction */}
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
              <div className="text-xs text-zinc-500"> Donors engaged</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">7</div>
              <div className="text-xs text-zinc-500">partner NGOs onboarded</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}