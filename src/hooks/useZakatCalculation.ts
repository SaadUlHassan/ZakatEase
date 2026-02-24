import { useMemo } from "react";
import type { SectionAValues, SectionBValues, NisabConfig, ZakatCalculation } from "@/lib/types";
import { ZAKAT_DIVISOR, NISAB_GOLD_TOLA, NISAB_SILVER_TOLA } from "@/lib/constants";

export function useZakatCalculation(
  sectionA: SectionAValues,
  sectionB: SectionBValues,
  nisab: NisabConfig
): ZakatCalculation {
  return useMemo(() => {
    const totalAssets = Object.values(sectionA).reduce((sum, val) => sum + (val || 0), 0);
    const totalDeductions = Object.values(sectionB).reduce((sum, val) => sum + (val || 0), 0);
    const netZakatableAmount = Math.max(0, totalAssets - totalDeductions);

    const tolas = nisab.standard === "gold" ? NISAB_GOLD_TOLA : NISAB_SILVER_TOLA;
    const nisabThreshold = tolas * nisab.pricePerTola;
    const meetsNisab = nisab.pricePerTola > 0 && netZakatableAmount >= nisabThreshold;
    const zakatAmount = meetsNisab ? netZakatableAmount / ZAKAT_DIVISOR : 0;

    return {
      totalAssets,
      totalDeductions,
      netZakatableAmount,
      nisabThreshold,
      meetsNisab,
      zakatAmount,
    };
  }, [sectionA, sectionB, nisab]);
}
