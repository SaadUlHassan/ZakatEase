import { ImageResponse } from "next/og";
import { OgImageContent } from "@/lib/og-image-content";

export const alt = "ZakatEase — Free Zakat Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
