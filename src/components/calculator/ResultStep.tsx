"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { NisabConfig, NisabStandard, ZakatCalculation } from "@/lib/types";
import { formatPKR, formatNumber, parseCurrencyInput } from "@/lib/formatters";
import { NISAB_GOLD_TOLA, NISAB_SILVER_TOLA } from "@/lib/constants";

interface ResultStepProps {
  calculation: ZakatCalculation;
  nisab: NisabConfig;
  onNisabChange: (config: NisabConfig) => void;
}

export function ResultStep({ calculation, nisab, onNisabChange }: ResultStepProps) {
  const t = useTranslations();
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const handleStandardChange = useCallback(
    (standard: NisabStandard) => {
      onNisabChange({ ...nisab, standard });
    },
    [nisab, onNisabChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(nisab.pricePerTola > 0 ? String(nisab.pricePerTola) : "");
  }, [nisab.pricePerTola]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseCurrencyInput(displayValue);
    onNisabChange({ ...nisab, pricePerTola: parsed });
    setDisplayValue("");
  }, [displayValue, nisab, onNisabChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
      setDisplayValue(raw);
    }
  }, []);

  const tolas = nisab.standard === "gold" ? NISAB_GOLD_TOLA : NISAB_SILVER_TOLA;
  const nisabEntered = nisab.pricePerTola > 0;

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
            <p className="text-sm font-semibold text-slate-700">{t("result.totalAssets")}</p>
            <p className="text-xs text-slate-400 font-inter">{t("result.totalAssetsSecondary")}</p>
          </div>
          <span className="text-lg font-bold text-teal-600 font-inter" dir="ltr">
            {formatPKR(calculation.totalAssets)}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-4 border-b border-slate-100"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700">{t("result.totalDeductions")}</p>
            <p className="text-xs text-slate-400 font-inter">{t("result.totalDeductionsSecondary")}</p>
          </div>
          <span className="text-lg font-bold text-rose-500 font-inter" dir="ltr">
            - {formatPKR(calculation.totalDeductions)}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 bg-slate-50"
        >
          <div>
            <p className="text-base font-bold text-slate-800">{t("result.netAmount")}</p>
            <p className="text-xs text-slate-400 font-inter">{t("result.netAmountSecondary")}</p>
          </div>
          <span className="text-xl font-bold text-slate-800 font-inter" dir="ltr">
            {formatPKR(calculation.netZakatableAmount)}
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
          <p className="text-xs text-slate-400 mt-0.5">{t("nisab.description")}</p>
        </div>

        {/* Gold / Silver toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleStandardChange("gold")}
            className={`flex-1 py-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
              nisab.standard === "gold"
                ? "border-amber-400 bg-amber-50 text-amber-800 shadow-sm"
                : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
            }`}
          >
            <span className="block text-sm font-semibold">{t("nisab.goldLabel")}</span>
          </button>
          <button
            type="button"
            onClick={() => handleStandardChange("silver")}
            className={`flex-1 py-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
              nisab.standard === "silver"
                ? "border-slate-400 bg-slate-100 text-slate-800 shadow-sm"
                : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
            }`}
          >
            <span className="block text-sm font-semibold">{t("nisab.silverLabel")}</span>
          </button>
        </div>

        {/* Price input */}
        <div>
          <label htmlFor="nisab-price" className="block text-sm text-slate-700 mb-1.5">
            {t("nisab.pricePerTola")}
          </label>
          <div className="relative">
            <span className="absolute top-1/2 -translate-y-1/2 inset-s-3.5 text-slate-400 text-xs font-semibold font-inter">
              PKR
            </span>
            <input
              id="nisab-price"
              type="text"
              inputMode="numeric"
              value={
                isFocused
                  ? displayValue
                  : nisab.pricePerTola > 0
                    ? formatNumber(nisab.pricePerTola)
                    : ""
              }
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="0"
              dir="ltr"
              className="w-full ps-13 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-end text-lg font-medium font-inter text-slate-800 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>
        </div>

        {/* Nisab threshold display */}
        {nisabEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-500"
          >
            {t("nisab.nisabValue")}: <span className="font-semibold font-inter text-slate-700" dir="ltr">{formatPKR(calculation.nisabThreshold)}</span>
            <span className="text-xs text-slate-400 ms-1">({tolas} tola)</span>
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
              {formatPKR(calculation.zakatAmount)}
            </motion.p>
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-6 text-center">
            <p className="text-lg font-bold text-amber-700">{t("result.noZakat")}</p>
            <p className="text-sm text-amber-500 mt-1">{t("result.noZakatReason")}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
