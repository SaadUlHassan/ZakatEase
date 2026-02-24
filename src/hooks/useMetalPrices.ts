import { useEffect, useState } from "react";

interface MetalPrices {
  goldPerTola: Record<string, number>;
  silverPerTola: Record<string, number>;
  date: string;
}

interface UseMetalPricesResult {
  prices: MetalPrices | null;
  loading: boolean;
}

export function useMetalPrices(): UseMetalPricesResult {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/prices")
      .then((res) => (res.ok ? (res.json() as Promise<MetalPrices>) : null))
      .then((data) => {
        if (!cancelled && data) setPrices(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { prices, loading };
}
