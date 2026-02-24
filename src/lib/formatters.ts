export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrencyInput(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}
