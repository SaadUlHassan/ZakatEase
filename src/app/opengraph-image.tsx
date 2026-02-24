import { ImageResponse } from "next/og";
import { OgImageContent } from "@/lib/og-image-content";

export const runtime = "edge";
export const alt = "ZakatEase — Free Zakat Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const arabicFont = await fetch(new URL("../assets/fonts/NotoNaskhArabic-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(<OgImageContent />, {
    ...size,
    fonts: [
      {
        name: "Noto Naskh Arabic",
        data: arabicFont,
        style: "normal",
        weight: 400,
      },
    ],
  });
}
