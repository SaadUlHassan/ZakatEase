"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import type { CurrencyEntry } from "@/lib/types";
import { ALL_CURRENCIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { useNumericInput } from "@/hooks/useNumericInput";

interface MultiCurrencyInputProps {
  entries: CurrencyEntry[];
  onEntriesChange: (entries: CurrencyEntry[]) => void;
  total: number;
  primaryCurrency: string;
}

export function MultiCurrencyInput({ entries, onEntriesChange, total, primaryCurrency }: MultiCurrencyInputProps) {
  const t = useTranslations("sectionA.multiCurrency");
  const tField = useTranslations("sectionA.foreignCurrency");
  const tNote = useTranslations("sectionA");
  const locale = useLocale();
  const [showNote, setShowNote] = useState(false);

  const availableCurrencies = useMemo(
    () => ALL_CURRENCIES.filter((c) => c.code !== primaryCurrency),
    [primaryCurrency]
  );

  const addEntry = useCallback(() => {
    const usedCodes = new Set(entries.map((e) => e.currencyCode));
    const nextPreset = availableCurrencies.find((p) => !usedCodes.has(p.code));
    const newEntry: CurrencyEntry = {
      id: crypto.randomUUID(),
      currencyCode: nextPreset?.code ?? "",
      amount: 0,
      exchangeRate: 0,
    };
    onEntriesChange([...entries, newEntry]);
  }, [entries, onEntriesChange, availableCurrencies]);

  const updateEntry = useCallback(
    (id: string, partial: Partial<CurrencyEntry>) => {
      onEntriesChange(entries.map((e) => (e.id === id ? { ...e, ...partial } : e)));
    },
    [entries, onEntriesChange]
  );

  const removeEntry = useCallback(
    (id: string) => {
      onEntriesChange(entries.filter((e) => e.id !== id));
    },
    [entries, onEntriesChange]
  );

  const usedCodes = new Set(entries.map((e) => e.currencyCode));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12 }}
      className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
        entries.length > 0 ? "border-teal-200 bg-white" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex-1">
          <p className="text-base text-slate-800 leading-relaxed">{tField("label")}</p>
          <span className="block text-xs text-slate-400 font-inter mt-0.5" dir="ltr">
            {tField("secondary")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowNote(!showNote)}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-bold font-inter leading-none flex items-center justify-center hover:bg-amber-200 transition-colors cursor-pointer"
        >
          ?
        </button>
      </div>

      {showNote && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5 mb-3 leading-relaxed"
        >
          {tNote("foreignCurrencyNote")}
        </motion.p>
      )}

      {/* Currency entries */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <CurrencyEntryRow
              key={entry.id}
              entry={entry}
              locale={locale}
              usedCodes={usedCodes}
              availableCurrencies={availableCurrencies}
              primaryCurrency={primaryCurrency}
              onUpdate={(partial) => updateEntry(entry.id, partial)}
              onRemove={() => removeEntry(entry.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add button */}
      <motion.button
        type="button"
        onClick={addEntry}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-all cursor-pointer ${
          entries.length === 0
            ? "border-teal-400 text-teal-600 bg-teal-50/50 hover:bg-teal-50 mt-0"
            : "border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 mt-3"
        }`}
      >
        + {t("addCurrency")}
      </motion.button>

      {/* Total */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between"
        >
          <span className="text-sm font-semibold text-teal-700">{t("total")}</span>
          <span className="text-lg font-bold text-teal-600 font-inter" dir="ltr">
            {formatCurrency(total, primaryCurrency)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Per-entry row ──────────────────────────────────────────────── */

interface CurrencyEntryRowProps {
  entry: CurrencyEntry;
  locale: string;
  usedCodes: Set<string>;
  availableCurrencies: readonly { code: string; labelEn: string; labelUr: string; symbol: string }[];
  primaryCurrency: string;
  onUpdate: (partial: Partial<CurrencyEntry>) => void;
  onRemove: () => void;
}

function CurrencyEntryRow({ entry, locale, usedCodes, availableCurrencies, primaryCurrency, onUpdate, onRemove }: CurrencyEntryRowProps) {
  const t = useTranslations("sectionA.multiCurrency");
  const amtInput = useNumericInput(entry.amount, useCallback((v: number) => onUpdate({ amount: v }), [onUpdate]));
  const rateInput = useNumericInput(entry.exchangeRate, useCallback((v: number) => onUpdate({ exchangeRate: v }), [onUpdate]));

  const equivalent = entry.amount * entry.exchangeRate;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2.5"
    >
      {/* Currency selector + remove button */}
      <div className="flex items-center gap-2">
        <select
          value={entry.currencyCode}
          onChange={(e) => onUpdate({ currencyCode: e.target.value })}
          className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all cursor-pointer appearance-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25em 1.25em", paddingRight: "2rem" }}
        >
          <option value="">{t("selectCurrency")}</option>
          {availableCurrencies.map((p) => (
            <option key={p.code} value={p.code} disabled={usedCodes.has(p.code) && p.code !== entry.currencyCode}>
              {p.code} — {locale === "ur" ? p.labelUr : p.labelEn}
            </option>
          ))}
          <option value="OTHER">{t("other")}</option>
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
          title={t("remove")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Amount + Rate side by side */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 font-inter">{t("amount")}</label>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            placeholder="0"
            value={amtInput.inputValue}
            onFocus={amtInput.handleFocus}
            onBlur={amtInput.handleBlur}
            onChange={amtInput.handleChange}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium font-inter text-slate-800 placeholder-slate-300 text-end focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 font-inter">
            {t("rate", { currency: primaryCurrency })} {entry.currencyCode && entry.currencyCode !== "OTHER" ? `/ ${entry.currencyCode}` : ""}
          </label>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            placeholder="0"
            value={rateInput.inputValue}
            onFocus={rateInput.handleFocus}
            onBlur={rateInput.handleBlur}
            onChange={rateInput.handleChange}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium font-inter text-slate-800 placeholder-slate-300 text-end focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
          />
        </div>
      </div>

      {/* Equivalent in primary currency */}
      {equivalent > 0 && (
        <div className="text-end">
          <span className="text-xs text-slate-400">=</span>{" "}
          <span className="text-sm font-semibold text-teal-600 font-inter" dir="ltr">
            {formatCurrency(equivalent, primaryCurrency)}
          </span>
        </div>
      )}
    </motion.div>
  );
}
