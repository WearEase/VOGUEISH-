import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CurrencySeed = string | number | undefined;

const DEFAULT_USD_TO_INR_RATE = 91;
const DEFAULT_INR_CAP = 200_000;

const parseMaybeNumber = (value: number | string): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const cleaned = value.replace(/[^0-9.\-]/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};

const hash32 = (input: string): number => {
  // Simple deterministic string hash (FNV-1a-ish) for stable UI variance.
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash | 0;
};

const seedToInt = (seed: CurrencySeed, fallback: string): number => {
  if (typeof seed === 'number') return Number.isFinite(seed) ? Math.trunc(seed) : 0;
  if (typeof seed === 'string' && seed.length > 0) return hash32(seed);
  return hash32(fallback);
};

export function formatINRFromUSD(
  usd: number | string,
  options?: {
    seed?: CurrencySeed;
    rate?: number;
    capINR?: number;
    maximumFractionDigits?: number;
  }
): string {
  const rate = options?.rate ?? DEFAULT_USD_TO_INR_RATE;
  const capINR = options?.capINR ?? DEFAULT_INR_CAP;
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;

  const usdNumber = parseMaybeNumber(usd);
  let inr = usdNumber * rate;

  if (inr > capINR) {
    // Soft-cap: keep values under the cap but still different (deterministic).
    const seedInt = seedToInt(options?.seed, `${usdNumber}`);
    const variance = Math.abs(seedInt) % 1000; // 0..999
    inr = capINR - 1 - variance;
  }

  const rounded = maximumFractionDigits === 0 ? Math.round(inr) : inr;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(rounded);

  return `₹${formatted}`;
}
