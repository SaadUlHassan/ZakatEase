"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPrompt() {
  const { canInstall, install, dismiss } = useInstallPrompt();

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="no-print fixed inset-x-0 bottom-0 z-50 p-4"
        >
          <div className="container mx-auto max-w-xl">
            <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-teal-200 bg-white p-4 shadow-lg shadow-teal-100">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">Install ZakatEase</p>
                <p className="mt-0.5 text-xs text-slate-500">Use offline anytime, no internet needed</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={dismiss}
                  className="cursor-pointer px-3 py-2 text-xs text-slate-400 transition-colors hover:text-slate-600"
                >
                  Not now
                </button>
                <button
                  onClick={install}
                  className="cursor-pointer rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
