import type { Metadata, Viewport } from "next";
import { Noto_Nastaliq_Urdu, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZakatEase — Zakat Calculator | زکوٰۃ کیلکولیٹر",
    template: "%s | ZakatEase",
  },
  description:
    "Free online Zakat calculator. Calculate your Zakat on gold, silver, cash, investments, and business assets. Supports PKR, USD, GBP, EUR, AED, SAR. | زکوٰۃ کا آسان حساب",
  keywords: [
    "Zakat calculator",
    "Zakat",
    "Islamic finance",
    "Nisab",
    "gold Zakat",
    "silver Zakat",
    "Zakat on cash",
    "Zakat on investments",
    "Pakistan Zakat calculator",
    "online Zakat calculator",
    "free Zakat calculator",
    "زکوٰۃ کیلکولیٹر",
    "زکوٰۃ",
    "نصاب",
    "زکوٰۃ حساب",
  ],
  authors: [{ name: "ZakatEase" }],
  creator: "ZakatEase",
  publisher: "ZakatEase",
  applicationName: "ZakatEase",
  category: "Finance",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ur_PK",
    siteName: "ZakatEase",
    title: "ZakatEase — Free Zakat Calculator",
    description:
      "Calculate your Zakat easily on gold, silver, cash, investments & business assets. Multi-currency support.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ZakatEase — Free Zakat Calculator",
    description: "Calculate your Zakat easily on gold, silver, cash, investments & business assets.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ZakatEase",
  url: SITE_URL,
  description:
    "Free online Zakat calculator. Calculate your Zakat on gold, silver, cash, investments, and business assets.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  inLanguage: ["en", "ur"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === "ur" ? "rtl" : "ltr";
  const fontClass = locale === "ur" ? "font-nastaliq" : "font-inter";

  return (
    <html lang={locale} dir={dir} className={`${nastaliq.variable} ${inter.variable}`}>
      <body className={`${fontClass} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
