import { useMemo } from "react";
import type { SectionAValues, SectionBValues, NisabConfig, NisabStandard, ZakatCalculation } from "@/lib/types";
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

    const goldNisabThreshold = NISAB_GOLD_TOLA * nisab.goldPricePerTola;
    const silverNisabThreshold = NISAB_SILVER_TOLA * nisab.silverPricePerTola;

    const hasGold = nisab.goldPricePerTola > 0;
    const hasSilver = nisab.silverPricePerTola > 0;

    let nisabThreshold = 0;
    let activeStandard: NisabStandard | null = null;

    if (hasGold && hasSilver) {
      // Use whichever produces the lower threshold (more cautious / benefits the poor)
      if (silverNisabThreshold <= goldNisabThreshold) {
        nisabThreshold = silverNisabThreshold;
        activeStandard = "silver";
      } else {
        nisabThreshold = goldNisabThreshold;
        activeStandard = "gold";
      }
    } else if (hasGold) {
      nisabThreshold = goldNisabThreshold;
      activeStandard = "gold";
    } else if (hasSilver) {
      nisabThreshold = silverNisabThreshold;
      activeStandard = "silver";
    }

    const nisabEntered = hasGold || hasSilver;
    const meetsNisab = nisabEntered && netZakatableAmount >= nisabThreshold;
    const zakatAmount = meetsNisab ? netZakatableAmount / ZAKAT_DIVISOR : 0;

    return {
      totalAssets,
      totalDeductions,
      netZakatableAmount,
      goldNisabThreshold,
      silverNisabThreshold,
      nisabThreshold,
      activeStandard,
      meetsNisab,
      zakatAmount,
    };
  }, [sectionA, sectionB, nisab]);
}
