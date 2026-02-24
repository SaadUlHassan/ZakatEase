"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const t = useTranslations("app");

  return (
    <header className="relative overflow-hidden bg-linear-to-br from-teal-600 via-teal-700 to-teal-800 text-white no-print">
      {/* Decorative circles */}
      <div className="absolute -top-20 -inset-e-20 w-60 h-60 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -inset-s-10 w-40 h-40 rounded-full bg-white/5" />

      <div className="relative container mx-auto max-w-xl px-4 py-8">
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-teal-200 text-sm mt-1">{t("subtitle")}</p>
          </motion.div>
          <LanguageToggle />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-teal-100 text-sm mt-4 max-w-xs"
        >
          {t("description")}
        </motion.p>
      </div>
    </header>
  );
}
