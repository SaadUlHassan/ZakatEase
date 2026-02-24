"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WIZARD_STEPS } from "@/lib/constants";
import { StepIcon } from "./StepIcon";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export function StepProgress({ currentStep, totalSteps, onStepClick }: StepProgressProps) {
  const t = useTranslations();
  const allSteps = [
    ...WIZARD_STEPS.map((s) => ({ ...s })),
    { id: "result", translationKey: "steps.result", icon: "result" },
  ];

  return (
    <div className="w-full py-4 no-print">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 inset-s-0 bg-linear-to-r from-teal-500 to-teal-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between items-start">
        {allSteps.map((step, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(i)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
              style={{ width: `${100 / allSteps.length}%` }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                    : isCompleted
                      ? "bg-teal-100 text-teal-600"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <StepIcon name={step.icon} />
              </motion.div>
              <span
                className={`text-[10px] leading-tight text-center hidden sm:block font-inter ${
                  isActive ? "text-teal-700 font-semibold" : isCompleted ? "text-teal-600" : "text-slate-400"
                }`}
              >
                {t(`${step.translationKey}.title`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
