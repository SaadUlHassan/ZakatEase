export interface ZakatFieldDef {
  id: string;
  index: number;
  translationKey: string;
  tooltip?: string;
  section: "A" | "B";
}

export interface StepDef {
  id: string;
  translationKey: string;
  icon: string;
  fields: ZakatFieldDef[];
  section: "A" | "B";
}

export interface SectionAValues {
  gold: number;
  silver: number;
  tradeGoods: number;
  cashInHand: number;
  bankBalance: number;
  receivableDebts: number;
  foreignCurrency: number;
  sharesForSale: number;
  sharesForDividends: number;
  savingsCertificates: number;
  securityDeposits: number;
  committeeDeposits: number;
  rawMaterials: number;
  finishedGoods: number;
  businessPartnership: number;
}

export interface SectionBValues {
  totalPayableDebts: number;
  committeeBalance: number;
  utilityBills: number;
  partyPayments: number;
  employeeSalaries: number;
  previousZakat: number;
  installmentsDue: number;
}

export type NisabStandard = "gold" | "silver";

export interface NisabConfig {
  standard: NisabStandard;
  pricePerTola: number;
}

export interface ZakatCalculation {
  totalAssets: number;
  totalDeductions: number;
  netZakatableAmount: number;
  nisabThreshold: number;
  meetsNisab: boolean;
  zakatAmount: number;
}

export interface ZakatFormState {
  sectionA: SectionAValues;
  sectionB: SectionBValues;
  nisab: NisabConfig;
}

export interface CurrencyEntry {
  id: string;
  currencyCode: string;
  amount: number;
  exchangeRate: number;
}

export type Locale = "ur" | "en";
