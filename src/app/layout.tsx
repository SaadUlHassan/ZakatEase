import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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

export const metadata: Metadata = {
  title: "ZakatEase — زکوٰۃ ایز",
  description:
    "Calculate your Zakat easily with this self-assessment calculator. اپنی زکوٰۃ کا آسانی سے حساب لگائیں۔",
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
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
