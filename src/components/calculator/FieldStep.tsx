"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { StepDef, SectionAValues, SectionBValues } from "@/lib/types";
import { formatPKR } from "@/lib/formatters";
import { CurrencyInput } from "./CurrencyInput";
import { StepIcon } from "./StepIcon";

interface FieldStepProps {
  step: StepDef;
  values: SectionAValues & SectionBValues;
  onChange: (field: string, value: number) => void;
  stepTotal: number;
}

export function FieldStep({ step, values, onChange, stepTotal }: FieldStepProps) {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Step header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          step.section === "B"
            ? "bg-rose-100 text-rose-600"
            : "bg-teal-100 text-teal-600"
        }`}>
          <StepIcon name={step.icon} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {t(`${step.translationKey}.title`)}
          </h2>
          <p className="text-sm text-slate-400 font-inter">
            {t(`${step.translationKey}.subtitle`)}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {step.fields.map((field, i) => {
          const label = t(`${field.translationKey}.label`);
          const secondary = t(`${field.translationKey}.secondary`);
          const tooltip = field.tooltip ? t(field.tooltip) : undefined;

          return (
            <CurrencyInput
              key={field.id}
              id={field.id}
              index={i}
              labelPrimary={label}
              labelSecondary={secondary}
              value={values[field.id as keyof typeof values] || 0}
              onChange={(val) => onChange(field.id, val)}
              tooltip={tooltip}
            />
          );
        })}
      </div>

      {/* Step subtotal */}
      {stepTotal > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-5 rounded-2xl p-4 flex items-center justify-between ${
            step.section === "B"
              ? "bg-rose-50 border border-rose-200"
              : "bg-teal-50 border border-teal-200"
          }`}
        >
          <span className={`text-sm font-semibold ${
            step.section === "B" ? "text-rose-700" : "text-teal-700"
          }`}>
            {step.section === "B" ? t("sectionB.total") : t("sectionA.total")}
          </span>
          <span className={`text-lg font-bold font-inter ${
            step.section === "B" ? "text-rose-600" : "text-teal-600"
          }`} dir="ltr">
            {formatPKR(stepTotal)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
