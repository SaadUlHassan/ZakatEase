"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { SectionAValues, SectionBValues, NisabConfig } from "@/lib/types";
import { DEFAULT_SECTION_A, DEFAULT_SECTION_B, DEFAULT_NISAB, WIZARD_STEPS } from "@/lib/constants";
import { useZakatCalculation } from "@/hooks/useZakatCalculation";
import { formatPKR } from "@/lib/formatters";
import { StepProgress } from "./StepProgress";
import { FieldStep } from "./FieldStep";
import { ResultStep } from "./ResultStep";

const TOTAL_STEPS = WIZARD_STEPS.length + 1;

export function ZakatCalculator() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [sectionA, setSectionA] = useState<SectionAValues>(DEFAULT_SECTION_A);
  const [sectionB, setSectionB] = useState<SectionBValues>(DEFAULT_SECTION_B);
  const [nisab, setNisab] = useState<NisabConfig>(DEFAULT_NISAB);

  const calculation = useZakatCalculation(sectionA, sectionB, nisab);

  const allValues = { ...sectionA, ...sectionB };

  const handleFieldChange = useCallback(
    (field: string, value: number) => {
      if (field in sectionA) {
        setSectionA((prev) => ({ ...prev, [field]: value }));
      } else {
        setSectionB((prev) => ({ ...prev, [field]: value }));
      }
    },
    [sectionA]
  );

  const handleNisabChange = useCallback((config: NisabConfig) => {
    setNisab(config);
  }, []);

  const handleReset = useCallback(() => {
    setSectionA(DEFAULT_SECTION_A);
    setSectionB(DEFAULT_SECTION_B);
    setNisab(DEFAULT_NISAB);
    setCurrentStep(0);
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const getStepTotal = (stepIndex: number): number => {
    if (stepIndex >= WIZARD_STEPS.length) return 0;
    const step = WIZARD_STEPS[stepIndex];
    return step.fields.reduce((sum, f) => {
      const val = allValues[f.id as keyof typeof allValues] || 0;
      return sum + val;
    }, 0);
  };

  const isLastFieldStep = currentStep === WIZARD_STEPS.length - 1;
  const isResultStep = currentStep === WIZARD_STEPS.length;

  return (
    <div className="container mx-auto max-w-xl px-4 py-6">
      <StepProgress
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={setCurrentStep}
      />

      <div className="text-center mb-4">
        <span className="text-xs text-slate-400 font-inter">
          {currentStep + 1} {t("common.stepOf")} {TOTAL_STEPS}
        </span>
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {isResultStep ? (
            <ResultStep
              key="result"
              calculation={calculation}
              nisab={nisab}
              onNisabChange={handleNisabChange}
            />
          ) : (
            <FieldStep
              key={WIZARD_STEPS[currentStep].id}
              step={WIZARD_STEPS[currentStep]}
              values={allValues as SectionAValues & SectionBValues}
              onChange={handleFieldChange}
              stepTotal={getStepTotal(currentStep)}
            />
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="flex items-center justify-between mt-8 gap-3 no-print"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {currentStep > 0 ? (
          <button
            onClick={goPrev}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t("common.previous")}
          </button>
        ) : (
          <div />
        )}

        {isResultStep ? (
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-slate-200 text-slate-600 font-medium hover:bg-slate-300 transition-colors cursor-pointer"
          >
            {t("common.startOver")}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="px-8 py-3 rounded-xl bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-200 transition-all cursor-pointer"
          >
            {isLastFieldStep ? t("common.seeResult") : t("common.next")}
          </button>
        )}
      </motion.div>

      {!isResultStep && (calculation.totalAssets > 0 || calculation.totalDeductions > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-3 px-4 no-print z-50"
        >
          <div className="container mx-auto max-w-xl flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <span className="text-teal-600 font-semibold font-inter" dir="ltr">
                {formatPKR(calculation.totalAssets)}
              </span>
              {calculation.totalDeductions > 0 && (
                <>
                  {" "}-{" "}
                  <span className="text-rose-500 font-semibold font-inter" dir="ltr">
                    {formatPKR(calculation.totalDeductions)}
                  </span>
                </>
              )}
            </div>
            <div className="text-end">
              <p className="text-[10px] text-slate-400">{t("result.netAmount")}</p>
              <p className="text-sm font-bold text-slate-800 font-inter" dir="ltr">
                {formatPKR(calculation.netZakatableAmount)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
