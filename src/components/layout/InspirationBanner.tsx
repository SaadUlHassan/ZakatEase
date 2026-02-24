"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const QUOTES = [
  { key: "quote1", link: "https://quran.com/2/267" },
  { key: "quote2", link: "https://quran.com/9/103" },
  { key: "quote3", link: "https://quran.com/2/261" },
  { key: "quote4", link: "https://sunnah.com/bukhari:8" },
  { key: "quote5", link: "https://sunnah.com/tabarani" },
] as const;
const ROTATION_INTERVAL = 8000;

export function InspirationBanner() {
  const t = useTranslations("inspiration");
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance resets on every change (including manual dot clicks)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % QUOTES.length);
    }, ROTATION_INTERVAL);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const { key, link } = QUOTES[activeIndex];

  return (
    <section className="relative bg-gradient-to-b from-teal-800 to-teal-900 no-print overflow-hidden">
      <div className="relative container mx-auto max-w-xl px-4 py-5">
        <div className="min-h-[100px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-base leading-loose text-teal-100 font-medium px-2" dir="rtl" lang="ar">
                {t(`${key}.arabic`)}
              </p>

              <p className="text-xs leading-relaxed text-teal-200 max-w-md px-4">
                {t(`${key}.translation`)}
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 font-inter hover:text-teal-100 underline underline-offset-2 transition-colors"
                >
                  {" "}
                  — {t(`${key}.source`)}
                </a>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-3">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Quote ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex ? "w-5 h-1.5 bg-teal-300" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
