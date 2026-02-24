"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="py-8 pb-20 no-print">
      <div className="container mx-auto max-w-xl px-4 text-center">
        <p className="text-xs text-slate-400">{t("disclaimer")}</p>
      </div>
    </footer>
  );
}
