"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("common");

  const toggleLocale = () => {
    const newLocale = locale === "ur" ? "en" : "ur";
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white text-sm font-medium transition-all cursor-pointer border border-white/20"
    >
      {t("language")}
    </button>
  );
}
