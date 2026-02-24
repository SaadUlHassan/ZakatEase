"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { formatNumber, parseCurrencyInput } from "@/lib/formatters";

interface CurrencyInputProps {
  id: string;
  labelPrimary: string;
  labelSecondary: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  index: number;
}

export function CurrencyInput({
  id,
  labelPrimary,
  labelSecondary,
  value,
  onChange,
  tooltip,
  index,
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [showNote, setShowNote] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(value > 0 ? String(value) : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseCurrencyInput(displayValue);
    onChange(parsed);
    setDisplayValue("");
  }, [displayValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
      setDisplayValue(raw);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
        isFocused
          ? "border-teal-400 bg-teal-50/50 shadow-sm"
          : value > 0
            ? "border-teal-200 bg-white"
            : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <label htmlFor={id} className="block text-base text-slate-800 cursor-pointer">
            {labelPrimary}
          </label>
          <span className="text-xs text-slate-400 font-inter">
            {labelSecondary}
          </span>
        </div>
        {tooltip && (
          <button
            type="button"
            onClick={() => setShowNote(!showNote)}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center hover:bg-amber-200 transition-colors cursor-pointer"
          >
            ?
          </button>
        )}
      </div>

      {showNote && tooltip && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5 mb-3 leading-relaxed"
        >
          {tooltip}
        </motion.p>
      )}

      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 inset-s-3.5 text-slate-400 text-xs font-semibold font-inter">
          PKR
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={isFocused ? displayValue : value > 0 ? formatNumber(value) : ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0"
          dir="ltr"
          className="w-full ps-13 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-end text-lg font-medium font-inter text-slate-800 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
        />
      </div>
    </motion.div>
  );
}
