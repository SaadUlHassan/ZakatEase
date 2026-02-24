import { jsPDF } from "jspdf";
import type { SectionAValues, SectionBValues, ZakatCalculation, NisabConfig } from "./types";
import { WIZARD_STEPS, SITE_URL } from "./constants";
import { formatCurrency } from "./formatters";

interface ZakatReportData {
  sectionA: SectionAValues;
  sectionB: SectionBValues;
  calculation: ZakatCalculation;
  nisab: NisabConfig;
  currencyCode: string;
}

type T = (key: string) => string;
type RGB = [number, number, number];

// ── Design tokens ──────────────────────────────────────────────────
const C = {
  teal50: [240, 253, 250] as RGB,
  teal100: [204, 251, 241] as RGB,
  teal200: [153, 246, 228] as RGB,
  teal500: [20, 184, 166] as RGB,
  teal600: [13, 148, 136] as RGB,
  teal700: [15, 118, 110] as RGB,
  teal800: [17, 94, 89] as RGB,
  teal900: [19, 78, 73] as RGB,
  white: [255, 255, 255] as RGB,
  slate50: [248, 250, 252] as RGB,
  slate100: [241, 245, 249] as RGB,
  slate200: [226, 232, 240] as RGB,
  slate300: [203, 213, 225] as RGB,
  slate400: [148, 163, 184] as RGB,
  slate500: [100, 116, 139] as RGB,
  slate600: [71, 85, 105] as RGB,
  slate700: [51, 65, 85] as RGB,
  slate800: [30, 41, 59] as RGB,
  rose50: [255, 241, 242] as RGB,
  rose500: [244, 63, 94] as RGB,
  rose600: [225, 29, 72] as RGB,
  amber50: [255, 251, 235] as RGB,
  amber600: [217, 119, 6] as RGB,
  amber700: [180, 83, 9] as RGB,
};

const M = 18; // page margin

// ── Helpers ────────────────────────────────────────────────────────
function rr(d: jsPDF, x: number, y: number, w: number, h: number, r: number, s: "F" | "S" | "FD" = "F") {
  d.roundedRect(x, y, w, h, r, r, s);
}

function opacity(d: jsPDF, o: number) {
  d.setGState(d.GState({ opacity: o }));
}

function line(d: jsPDF, x1: number, y1: number, x2: number, y2: number, color: RGB, width = 0.3) {
  d.setDrawColor(...color);
  d.setLineWidth(width);
  d.line(x1, y1, x2, y2);
}

// ── Main export ────────────────────────────────────────────────────
export function generateZakatPdf(data: ZakatReportData, t: T): void {
  const { sectionA, sectionB, calculation, nisab, currencyCode } = data;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const cw = pw - M * 2;
  let y = 0;

  // ================================================================
  //  BACKGROUND — subtle teal tinted page
  // ================================================================
  doc.setFillColor(252, 254, 253);
  doc.rect(0, 0, pw, ph, "F");

  // Decorative top-right circle
  doc.setFillColor(...C.teal100);
  opacity(doc, 0.25);
  doc.circle(pw + 10, -20, 55, "F");
  opacity(doc, 1);

  // Decorative bottom-left circle
  doc.setFillColor(...C.teal100);
  opacity(doc, 0.15);
  doc.circle(-15, ph + 10, 45, "F");
  opacity(doc, 1);

  // ================================================================
  //  HEADER — gradient-style band
  // ================================================================
  const headerH = 48;
  doc.setFillColor(...C.teal900);
  rr(doc, M, M, cw, headerH, 5, "F");

  // Inner gradient overlay (lighter strip at top)
  doc.setFillColor(...C.teal800);
  opacity(doc, 0.6);
  rr(doc, M, M, cw, headerH / 2, 5, "F");
  // fill the bottom corners that rounded rect missed
  doc.rect(M, M + 5, cw, headerH / 2 - 5, "F");
  opacity(doc, 1);

  // Decorative circle inside header
  doc.setFillColor(...C.white);
  opacity(doc, 0.04);
  doc.circle(pw - M - 15, M + 12, 30, "F");
  opacity(doc, 1);

  // Small decorative circle
  doc.setFillColor(...C.white);
  opacity(doc, 0.06);
  doc.circle(M + 25, M + headerH - 5, 15, "F");
  opacity(doc, 1);

  // Logo icon
  const logoX = M + 10;
  const logoY = M + (headerH - 16) / 2;
  doc.setFillColor(...C.teal100);
  opacity(doc, 0.18);
  rr(doc, logoX, logoY, 16, 16, 3, "F");
  opacity(doc, 1);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.teal100);
  doc.text("Z", logoX + 8, logoY + 11.5, { align: "center" });

  // Brand name + subtitle
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text("ZakatEase", logoX + 22, logoY + 7);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.teal200);
  doc.text(t("result.title"), logoX + 22, logoY + 13);

  // Date badge (right-aligned)
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFillColor(...C.white);
  opacity(doc, 0.1);
  const dateW = 44;
  rr(doc, pw - M - dateW - 8, M + (headerH - 10) / 2, dateW, 10, 3, "F");
  opacity(doc, 1);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.teal100);
  doc.text(dateStr, pw - M - dateW / 2 - 8, M + headerH / 2 + 1, { align: "center" });

  y = M + headerH + 10;

  // ================================================================
  //  HERO — Final Zakat result (show the most important info first)
  // ================================================================
  if (calculation.meetsNisab) {
    const heroH = 38;
    // Teal gradient card
    doc.setFillColor(...C.teal600);
    rr(doc, M, y, cw, heroH, 5, "F");
    // Inner lighter strip at top
    doc.setFillColor(...C.teal500);
    opacity(doc, 0.5);
    rr(doc, M, y, cw, heroH * 0.45, 5, "F");
    doc.rect(M, y + 5, cw, heroH * 0.45 - 5, "F");
    opacity(doc, 1);

    // Decorative circle
    doc.setFillColor(...C.white);
    opacity(doc, 0.06);
    doc.circle(pw - M - 20, y + heroH - 8, 18, "F");
    opacity(doc, 1);

    // Label
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    opacity(doc, 0.8);
    doc.text(t("result.zakatAmount"), M + cw / 2, y + 10, { align: "center" });
    opacity(doc, 1);

    // Amount (hero)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.white);
    doc.text(formatCurrency(calculation.zakatAmount, currencyCode), M + cw / 2, y + 24, { align: "center" });

    // Formula badge
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    opacity(doc, 0.65);
    doc.text(t("result.formula"), M + cw / 2, y + 32, { align: "center" });
    opacity(doc, 1);

    y += heroH + 8;
  } else {
    const heroH = 26;
    doc.setFillColor(...C.amber50);
    rr(doc, M, y, cw, heroH, 5, "F");
    doc.setDrawColor(...C.amber600);
    doc.setLineWidth(0.4);
    rr(doc, M, y, cw, heroH, 5, "S");

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.amber700);
    doc.text(t("result.noZakat"), M + cw / 2, y + 11, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.amber600);
    doc.text(t("result.noZakatReason"), M + cw / 2, y + 19, { align: "center" });

    y += heroH + 8;
  }

  // ================================================================
  //  SUMMARY STRIP — 3 metric cards in a row
  // ================================================================
  const stripH = 22;
  const gap = 4;
  const cardW = (cw - gap * 2) / 3;

  // Card 1: Total Assets
  drawMetricCard(doc, M, y, cardW, stripH, {
    label: t("result.totalAssets"),
    value: formatCurrency(calculation.totalAssets, currencyCode),
    bg: C.white,
    border: C.slate200,
    labelColor: C.slate500,
    valueColor: C.teal700,
  });

  // Card 2: Total Deductions
  drawMetricCard(doc, M + cardW + gap, y, cardW, stripH, {
    label: t("result.totalDeductions"),
    value: `- ${formatCurrency(calculation.totalDeductions, currencyCode)}`,
    bg: C.white,
    border: C.slate200,
    labelColor: C.slate500,
    valueColor: C.rose600,
  });

  // Card 3: Net Amount
  drawMetricCard(doc, M + (cardW + gap) * 2, y, cardW, stripH, {
    label: t("result.netAmount"),
    value: formatCurrency(calculation.netZakatableAmount, currencyCode),
    bg: C.teal50,
    border: C.teal200,
    labelColor: C.teal700,
    valueColor: C.teal800,
  });

  y += stripH + 10;

  // ================================================================
  //  DETAIL SECTIONS — Assets & Deductions
  // ================================================================
  y = drawDetailSection(doc, t, "A", sectionA, currencyCode, y, pw);
  y += 6;
  y = drawDetailSection(doc, t, "B", sectionB, currencyCode, y, pw);
  y += 8;

  // ================================================================
  //  NISAB INFO — clean card
  // ================================================================
  const nisabH = 24;
  doc.setFillColor(...C.white);
  rr(doc, M, y, cw, nisabH, 4, "F");
  doc.setDrawColor(...C.slate200);
  doc.setLineWidth(0.3);
  rr(doc, M, y, cw, nisabH, 4, "S");

  // Teal accent bar on left
  doc.setFillColor(...C.teal500);
  rr(doc, M, y, 3, nisabH, 1.5, "F");

  const activeLabel = calculation.activeStandard === "gold" ? t("nisab.goldLabel") : t("nisab.silverLabel");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.slate800);
  doc.text(t("nisab.title"), M + 9, y + 8);

  // Active standard badge
  const badgeX = M + 9 + doc.getTextWidth(t("nisab.title")) + 5;
  const badgeW = doc.getTextWidth(activeLabel) + 8;
  doc.setFillColor(...C.teal50);
  rr(doc, badgeX, y + 3, badgeW, 7, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.teal700);
  doc.text(activeLabel, badgeX + badgeW / 2, y + 7.8, { align: "center" });

  // Nisab details line — show both thresholds if both entered
  const parts: string[] = [];
  if (nisab.goldPricePerTola > 0) {
    parts.push(`${t("nisab.goldNisab")}: ${formatCurrency(calculation.goldNisabThreshold, currencyCode)}`);
  }
  if (nisab.silverPricePerTola > 0) {
    parts.push(`${t("nisab.silverNisab")}: ${formatCurrency(calculation.silverNisabThreshold, currencyCode)}`);
  }
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.slate500);
  doc.text(parts.join("  ·  "), M + 9, y + 17);

  // Nisab status indicator on right
  const statusText = calculation.meetsNisab ? t("nisab.meetsNisab") : t("nisab.belowNisab");
  const statusColor = calculation.meetsNisab ? C.teal600 : C.amber700;
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...statusColor);
  doc.text(statusText, pw - M - 6, y + 8, { align: "right" });

  y += nisabH + 12;

  // ================================================================
  //  FOOTER
  // ================================================================
  line(doc, M, y, pw - M, y, C.slate200, 0.3);
  y += 5;

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...C.slate400);
  doc.text(t("common.disclaimer"), M, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.slate300);
  doc.text(`Generated by ZakatEase  ·  ${SITE_URL}`, M, y);

  // ZakatEase small branding on right
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.teal500);
  doc.text("ZakatEase", pw - M, y, { align: "right" });

  // ── Save ─────────────────────────────────────────────────────────
  doc.save(`ZakatEase-Report-${new Date().toISOString().split("T")[0]}.pdf`);
}

// ── Metric card (summary strip) ────────────────────────────────────
function drawMetricCard(
  d: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: {
    label: string;
    value: string;
    bg: RGB;
    border: RGB;
    labelColor: RGB;
    valueColor: RGB;
  }
) {
  d.setFillColor(...opts.bg);
  rr(d, x, y, w, h, 3, "F");
  d.setDrawColor(...opts.border);
  d.setLineWidth(0.3);
  rr(d, x, y, w, h, 3, "S");

  d.setFontSize(7);
  d.setFont("helvetica", "normal");
  d.setTextColor(...opts.labelColor);
  d.text(opts.label, x + w / 2, y + 7, { align: "center" });

  d.setFontSize(12);
  d.setFont("helvetica", "bold");
  d.setTextColor(...opts.valueColor);
  d.text(opts.value, x + w / 2, y + 16, { align: "center" });
}

// ── Detail section (assets / deductions) ───────────────────────────
function drawDetailSection(
  doc: jsPDF,
  t: T,
  section: "A" | "B",
  values: SectionAValues | SectionBValues,
  currencyCode: string,
  startY: number,
  pw: number
): number {
  const cw = pw - M * 2;
  const steps = WIZARD_STEPS.filter((s) => s.section === section);
  const isAssets = section === "A";
  let y = startY;

  // Collect non-zero fields across all steps for this section
  const hasData = steps.some((step) =>
    step.fields.some((f) => ((values as unknown as Record<string, number>)[f.id] || 0) > 0)
  );
  if (!hasData) return y;

  // Section container
  const sectionStartY = y;

  // Section header pill
  const headerColor = isAssets ? C.teal600 : C.rose500;
  const headerBg = isAssets ? C.teal50 : C.rose50;
  const headerTitle = isAssets ? t("sectionA.title") : t("sectionB.title");

  doc.setFillColor(...headerBg);
  rr(doc, M, y, cw, 9, 3, "F");

  // Accent dot
  doc.setFillColor(...headerColor);
  doc.circle(M + 7, y + 4.5, 1.5, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headerColor);
  doc.text(headerTitle, M + 12, y + 6.2);

  y += 12;

  let rowIdx = 0;
  for (const step of steps) {
    // Check if this step has any non-zero values
    const stepHasData = step.fields.some((f) => ((values as unknown as Record<string, number>)[f.id] || 0) > 0);
    if (!stepHasData) continue;

    // Step category label
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.slate600);
    doc.text(t(`${step.translationKey}.title`).toUpperCase(), M + 5, y + 3.5);

    // Thin underline
    line(
      doc,
      M + 5,
      y + 5,
      M + 5 + doc.getTextWidth(t(`${step.translationKey}.title`).toUpperCase()),
      y + 5,
      C.slate200,
      0.25
    );
    y += 7;

    for (const field of step.fields) {
      const value = (values as unknown as Record<string, number>)[field.id] || 0;
      if (value === 0) continue;

      // Alternate row bg
      if (rowIdx % 2 === 0) {
        doc.setFillColor(...C.slate50);
        rr(doc, M + 2, y - 1, cw - 4, 7, 1.5, "F");
      }

      // Label
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.slate700);
      doc.text(t(`${field.translationKey}.label`), M + 8, y + 3.5);

      // Dot leader
      const labelW = doc.getTextWidth(t(`${field.translationKey}.label`));
      const valStr = formatCurrency(value, currencyCode);
      const valW = doc.getTextWidth(valStr);
      const dotsStart = M + 8 + labelW + 2;
      const dotsEnd = pw - M - 6 - valW - 2;
      if (dotsEnd > dotsStart + 5) {
        doc.setFontSize(6);
        doc.setTextColor(...C.slate300);
        let dx = dotsStart;
        while (dx < dotsEnd) {
          doc.text("·", dx, y + 3.5);
          dx += 2;
        }
      }

      // Value
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...C.slate800);
      doc.text(valStr, pw - M - 6, y + 3.5, { align: "right" });

      rowIdx++;
      y += 7;
    }
    y += 1;
  }

  // Section total bar
  y += 1;
  const totalLabel = isAssets ? t("sectionA.total") : t("sectionB.total");
  const totalValue = isAssets
    ? Object.values(values as SectionAValues).reduce((s, v) => s + v, 0)
    : Object.values(values as SectionBValues).reduce((s, v) => s + v, 0);

  const totalBg = isAssets ? C.teal50 : C.rose50;
  const totalColor = isAssets ? C.teal700 : C.rose600;

  doc.setFillColor(...totalBg);
  rr(doc, M, y, cw, 9, 3, "F");

  // Accent line on left
  doc.setFillColor(...totalColor);
  rr(doc, M, y, 2.5, 9, 1, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...totalColor);
  doc.text(totalLabel, M + 8, y + 6.2);
  doc.text(formatCurrency(totalValue, currencyCode), pw - M - 6, y + 6.2, { align: "right" });

  y += 11;

  // Outer container border (drawn last so it wraps everything)
  doc.setDrawColor(...C.slate200);
  doc.setLineWidth(0.25);
  rr(doc, M, sectionStartY, cw, y - sectionStartY - 2, 4, "S");

  return y;
}
