"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { NisabConfig, SectionAValues, SectionBValues, ZakatCalculation } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { useNumericInput } from "@/hooks/useNumericInput";
import { generateZakatPdf } from "@/lib/generate-pdf";

interface ResultStepProps {
  calculation: ZakatCalculation;
  nisab: NisabConfig;
  onNisabChange: (config: NisabConfig) => void;
  currencyCode?: string;
  sectionA: SectionAValues;
  sectionB: SectionBValues;
}

export function ResultStep({
  calculation,
  nisab,
  onNisabChange,
  currencyCode = "PKR",
  sectionA,
  sectionB,
}: ResultStepProps) {
  const t = useTranslations();

  const handleGoldPriceChange = useCallback(
    (val: number) => onNisabChange({ ...nisab, goldPricePerTola: val }),
    [nisab, onNisabChange]
  );

  const handleSilverPriceChange = useCallback(
    (val: number) => onNisabChange({ ...nisab, silverPricePerTola: val }),
    [nisab, onNisabChange]
  );

  const goldInput = useNumericInput(nisab.goldPricePerTola, handleGoldPriceChange);
  const silverInput = useNumericInput(nisab.silverPricePerTola, handleSilverPriceChange);

  const nisabEntered = nisab.goldPricePerTola > 0 || nisab.silverPricePerTola > 0;

  const handleDownloadPdf = useCallback(() => {
    generateZakatPdf({ sectionA, sectionB, calculation, nisab, currencyCode }, (key: string) => t(key));
  }, [sectionA, sectionB, calculation, nisab, currencyCode, t]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-5"
    >
      {/* Summary breakdown */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-4 border-b border-slate-100"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">{t("result.totalAssets")}</p>
            <p className="text-xs text-slate-400 font-inter mt-0.5" dir="ltr">
              {t("result.totalAssetsSecondary")}
            </p>
          </div>
          <span className="text-lg font-bold text-teal-600 font-inter" dir="ltr">
            {formatCurrency(calculation.totalAssets, currencyCode)}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-4 border-b border-slate-100"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">{t("result.totalDeductions")}</p>
            <p className="text-xs text-slate-400 font-inter mt-0.5" dir="ltr">
              {t("result.totalDeductionsSecondary")}
            </p>
          </div>
          <span className="text-lg font-bold text-rose-500 font-inter" dir="ltr">
            - {formatCurrency(calculation.totalDeductions, currencyCode)}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 bg-slate-50"
        >
          <div>
            <p className="text-base font-bold text-slate-800 leading-relaxed">{t("result.netAmount")}</p>
            <p className="text-xs text-slate-400 font-inter mt-0.5" dir="ltr">
              {t("result.netAmountSecondary")}
            </p>
          </div>
          <span className="text-xl font-bold text-slate-800 font-inter" dir="ltr">
            {formatCurrency(calculation.netZakatableAmount, currencyCode)}
          </span>
        </motion.div>
      </div>

      {/* Nisab section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-4"
      >
        <div>
          <h3 className="text-base font-bold text-slate-800">{t("nisab.title")}</h3>
          <p className="text-xs text-slate-400 mt-1">{t("nisab.description")}</p>
        </div>

        {/* Gold & Silver price inputs — side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Gold price */}
          <div>
            <label htmlFor="gold-price" className="block text-xs font-medium text-slate-600 mb-1.5">
              {t("nisab.goldPricePerTola")}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-[10px] font-semibold font-inter">
                {currencyCode}
              </span>
              <input
                id="gold-price"
                type="text"
                inputMode="numeric"
                value={goldInput.inputValue}
                onChange={goldInput.handleChange}
                onFocus={goldInput.handleFocus}
                onBlur={goldInput.handleBlur}
                placeholder="0"
                dir="ltr"
                className="w-full pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-end text-base font-medium font-inter text-slate-800 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            {nisab.goldPricePerTola > 0 && (
              <p className="text-[10px] text-slate-400 mt-1 font-inter" dir="ltr">
                {t("nisab.goldNisab")}: {formatCurrency(calculation.goldNisabThreshold, currencyCode)}
                {calculation.activeStandard === "gold" && (
                  <span className="text-teal-600 font-bold ms-1">({t("nisab.activeNisab")})</span>
                )}
              </p>
            )}
          </div>

          {/* Silver price */}
          <div>
            <label htmlFor="silver-price" className="block text-xs font-medium text-slate-600 mb-1.5">
              {t("nisab.silverPricePerTola")}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-[10px] font-semibold font-inter">
                {currencyCode}
              </span>
              <input
                id="silver-price"
                type="text"
                inputMode="numeric"
                value={silverInput.inputValue}
                onChange={silverInput.handleChange}
                onFocus={silverInput.handleFocus}
                onBlur={silverInput.handleBlur}
                placeholder="0"
                dir="ltr"
                className="w-full pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-end text-base font-medium font-inter text-slate-800 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
              />
            </div>
            {nisab.silverPricePerTola > 0 && (
              <p className="text-[10px] text-slate-400 mt-1 font-inter" dir="ltr">
                {t("nisab.silverNisab")}: {formatCurrency(calculation.silverNisabThreshold, currencyCode)}
                {calculation.activeStandard === "silver" && (
                  <span className="text-teal-600 font-bold ms-1">({t("nisab.activeNisab")})</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Active nisab display */}
        {nisabEntered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-500">
            {t("nisab.nisabValue")}:{" "}
            <span className="font-semibold font-inter text-slate-700" dir="ltr">
              {formatCurrency(calculation.nisabThreshold, currencyCode)}
            </span>
            <span className="text-xs text-slate-400 ms-1">
              ({calculation.activeStandard === "gold" ? t("nisab.goldLabel") : t("nisab.silverLabel")})
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Final Zakat result */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
      >
        {!nisabEntered ? (
          <div className="rounded-2xl bg-slate-100 p-6 text-center">
            <p className="text-base font-semibold text-slate-500">{t("result.enterNisab")}</p>
            <p className="text-xs text-slate-400 mt-1">{t("result.enterNisabReason")}</p>
          </div>
        ) : calculation.meetsNisab ? (
          <div className="rounded-2xl bg-linear-to-br from-teal-500 to-teal-600 p-6 text-center text-white shadow-lg shadow-teal-200">
            <p className="text-sm opacity-80">{t("result.formula")}</p>
            <p className="text-base font-semibold mt-1">{t("result.zakatAmount")}</p>
            <p className="text-xs opacity-70 font-inter">{t("result.zakatAmountSecondary")}</p>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
              className="text-4xl font-bold mt-3 font-inter"
              dir="ltr"
            >
              {formatCurrency(calculation.zakatAmount, currencyCode)}
            </motion.p>
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-6 text-center">
            <p className="text-lg font-bold text-amber-700">{t("result.noZakat")}</p>
            <p className="text-sm text-amber-500 mt-1">{t("result.noZakatReason")}</p>
          </div>
        )}
      </motion.div>

      {/* Generate PDF Report button */}
      {nisabEntered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 border-teal-200 bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100 hover:border-teal-300 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
            {t("common.generateReport")}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
