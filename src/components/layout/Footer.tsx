"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="py-8 pb-20 no-print">
      <div className="container mx-auto max-w-xl px-4 text-center">
        <p className="text-xs text-slate-400">{t("disclaimer")}</p>
        <p className="text-[11px] text-slate-300 mt-3">
          Made with <span className="text-rose-400">&#9829;</span> by{" "}
          <a
            href="https://www.saadulhassan.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-500 transition-colors underline underline-offset-2"
          >
            Saad Ul Hassan
          </a>
        </p>
      </div>
    </footer>
  );
}
