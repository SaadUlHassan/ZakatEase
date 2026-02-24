import type { ZakatFieldDef, StepDef, SectionAValues, SectionBValues, NisabConfig } from "./types";

export const SITE_URL = "https://zakat-ease-three.vercel.app";

export const ZAKAT_DIVISOR = 40;

export const NISAB_GOLD_TOLA = 7.5;
export const NISAB_SILVER_TOLA = 52.5;
export const NISAB_GOLD_GRAMS = 87.48;
export const NISAB_SILVER_GRAMS = 612.36;

const F = {
  gold: { id: "gold", index: 1, translationKey: "sectionA.gold", section: "A" as const },
  silver: { id: "silver", index: 2, translationKey: "sectionA.silver", section: "A" as const },
  tradeGoods: {
    id: "tradeGoods",
    index: 3,
    translationKey: "sectionA.tradeGoods",
    tooltip: "sectionA.tradeGoodsNote",
    section: "A" as const,
  },
  cashInHand: { id: "cashInHand", index: 4, translationKey: "sectionA.cashInHand", section: "A" as const },
  bankBalance: { id: "bankBalance", index: 5, translationKey: "sectionA.bankBalance", section: "A" as const },
  receivableDebts: {
    id: "receivableDebts",
    index: 6,
    translationKey: "sectionA.receivableDebts",
    tooltip: "sectionA.receivableDebtsNote",
    section: "A" as const,
  },
  foreignCurrency: {
    id: "foreignCurrency",
    index: 7,
    translationKey: "sectionA.foreignCurrency",
    tooltip: "sectionA.foreignCurrencyNote",
    section: "A" as const,
  },
  sharesForSale: { id: "sharesForSale", index: 8, translationKey: "sectionA.sharesForSale", section: "A" as const },
  sharesForDividends: {
    id: "sharesForDividends",
    index: 9,
    translationKey: "sectionA.sharesForDividends",
    tooltip: "sectionA.sharesForDividendsNote",
    section: "A" as const,
  },
  savingsCertificates: {
    id: "savingsCertificates",
    index: 10,
    translationKey: "sectionA.savingsCertificates",
    tooltip: "sectionA.savingsCertificatesNote",
    section: "A" as const,
  },
  securityDeposits: {
    id: "securityDeposits",
    index: 11,
    translationKey: "sectionA.securityDeposits",
    section: "A" as const,
  },
  committeeDeposits: {
    id: "committeeDeposits",
    index: 12,
    translationKey: "sectionA.committeeDeposits",
    section: "A" as const,
  },
  rawMaterials: { id: "rawMaterials", index: 13, translationKey: "sectionA.rawMaterials", section: "A" as const },
  finishedGoods: { id: "finishedGoods", index: 14, translationKey: "sectionA.finishedGoods", section: "A" as const },
  businessPartnership: {
    id: "businessPartnership",
    index: 15,
    translationKey: "sectionA.businessPartnership",
    section: "A" as const,
  },
  totalPayableDebts: {
    id: "totalPayableDebts",
    index: 1,
    translationKey: "sectionB.totalPayableDebts",
    tooltip: "sectionB.totalPayableDebtsNote",
    section: "B" as const,
  },
  committeeBalance: {
    id: "committeeBalance",
    index: 2,
    translationKey: "sectionB.committeeBalance",
    section: "B" as const,
  },
  utilityBills: { id: "utilityBills", index: 3, translationKey: "sectionB.utilityBills", section: "B" as const },
  partyPayments: { id: "partyPayments", index: 4, translationKey: "sectionB.partyPayments", section: "B" as const },
  employeeSalaries: {
    id: "employeeSalaries",
    index: 5,
    translationKey: "sectionB.employeeSalaries",
    section: "B" as const,
  },
  previousZakat: { id: "previousZakat", index: 6, translationKey: "sectionB.previousZakat", section: "B" as const },
  installmentsDue: {
    id: "installmentsDue",
    index: 7,
    translationKey: "sectionB.installmentsDue",
    tooltip: "sectionB.installmentsDueNote",
    section: "B" as const,
  },
};

export const WIZARD_STEPS: StepDef[] = [
  {
    id: "cash",
    translationKey: "steps.cash",
    icon: "banknotes",
    section: "A",
    fields: [F.cashInHand, F.bankBalance, F.foreignCurrency],
  },
  {
    id: "precious",
    translationKey: "steps.precious",
    icon: "gem",
    section: "A",
    fields: [F.gold, F.silver],
  },
  {
    id: "investments",
    translationKey: "steps.investments",
    icon: "chart",
    section: "A",
    fields: [F.sharesForSale, F.sharesForDividends, F.savingsCertificates],
  },
  {
    id: "business",
    translationKey: "steps.business",
    icon: "store",
    section: "A",
    fields: [F.tradeGoods, F.rawMaterials, F.finishedGoods, F.businessPartnership],
  },
  {
    id: "other",
    translationKey: "steps.other",
    icon: "folder",
    section: "A",
    fields: [F.receivableDebts, F.securityDeposits, F.committeeDeposits],
  },
  {
    id: "deductions",
    translationKey: "steps.deductions",
    icon: "minus",
    section: "B",
    fields: [
      F.totalPayableDebts,
      F.committeeBalance,
      F.utilityBills,
      F.partyPayments,
      F.employeeSalaries,
      F.previousZakat,
      F.installmentsDue,
    ],
  },
];

export const SECTION_A_FIELDS: ZakatFieldDef[] = WIZARD_STEPS.filter((s) => s.section === "A").flatMap((s) => s.fields);

export const SECTION_B_FIELDS: ZakatFieldDef[] = WIZARD_STEPS.filter((s) => s.section === "B").flatMap((s) => s.fields);

export const ALL_CURRENCIES = [
  { code: "PKR", labelEn: "Pakistani Rupee", labelUr: "پاکستانی روپیہ", symbol: "₨" },
  { code: "USD", labelEn: "US Dollar", labelUr: "امریکی ڈالر", symbol: "$" },
  { code: "GBP", labelEn: "British Pound", labelUr: "برطانوی پاؤنڈ", symbol: "£" },
  { code: "EUR", labelEn: "Euro", labelUr: "یورو", symbol: "€" },
  { code: "AED", labelEn: "UAE Dirham", labelUr: "اماراتی درہم", symbol: "د.إ" },
  { code: "SAR", labelEn: "Saudi Riyal", labelUr: "سعودی ریال", symbol: "﷼" },
  { code: "USDT", labelEn: "Tether (USDT)", labelUr: "ٹیتھر (USDT)", symbol: "₮" },
] as const;

export const DEFAULT_PRIMARY_CURRENCY = "PKR";

export const DEFAULT_SECTION_A: SectionAValues = {
  gold: 0,
  silver: 0,
  tradeGoods: 0,
  cashInHand: 0,
  bankBalance: 0,
  receivableDebts: 0,
  foreignCurrency: 0,
  sharesForSale: 0,
  sharesForDividends: 0,
  savingsCertificates: 0,
  securityDeposits: 0,
  committeeDeposits: 0,
  rawMaterials: 0,
  finishedGoods: 0,
  businessPartnership: 0,
};

export const DEFAULT_SECTION_B: SectionBValues = {
  totalPayableDebts: 0,
  committeeBalance: 0,
  utilityBills: 0,
  partyPayments: 0,
  employeeSalaries: 0,
  previousZakat: 0,
  installmentsDue: 0,
};

export const DEFAULT_NISAB: NisabConfig = {
  standard: "gold",
  pricePerTola: 0,
};
