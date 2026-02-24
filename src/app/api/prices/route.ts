import { NextResponse } from "next/server";
import { TOLAS_PER_TROY_OZ } from "@/lib/constants";

const PRIMARY_CDN = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_CDN = "https://latest.currency-api.pages.dev/v1/currencies";

interface PriceResponse {
  goldPerTola: Record<string, number>;
  silverPerTola: Record<string, number>;
  date: string;
}

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { next: { revalidate: 21600 } }); // 6-hour cache
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}

async function fetchWithFallback(path: string): Promise<Record<string, unknown>> {
  try {
    return await fetchJson(`${PRIMARY_CDN}/${path}`);
  } catch {
    return await fetchJson(`${FALLBACK_CDN}/${path}`);
  }
}

export async function GET() {
  try {
    const [goldData, silverData] = await Promise.all([fetchWithFallback("xau.json"), fetchWithFallback("xag.json")]);

    const goldRates = goldData.xau as Record<string, number> | undefined;
    const silverRates = silverData.xag as Record<string, number> | undefined;

    if (!goldRates || !silverRates) {
      return NextResponse.json({ error: "Unexpected API response shape" }, { status: 502 });
    }

    // Convert from per-troy-ounce to per-tola for all currencies
    const goldPerTola: Record<string, number> = {};
    const silverPerTola: Record<string, number> = {};

    for (const [currency, pricePerOz] of Object.entries(goldRates)) {
      goldPerTola[currency] = Math.round(pricePerOz / TOLAS_PER_TROY_OZ);
    }
    for (const [currency, pricePerOz] of Object.entries(silverRates)) {
      silverPerTola[currency] = Math.round(pricePerOz / TOLAS_PER_TROY_OZ);
    }

    const result: PriceResponse = {
      goldPerTola,
      silverPerTola,
      date: (goldData.date as string) || new Date().toISOString().split("T")[0],
    };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch metal prices" }, { status: 502 });
  }
}
