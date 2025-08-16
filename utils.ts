
export const EURO = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const EURO_1D = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 1,
});

export function fmtEuro(n: number): string {
  if (n >= 1_000_000_000) return EURO_1D.format(n / 1_000_000_000).replace(/\s?€/, "Md€");
  if (n >= 1_000_000) return EURO_1D.format(n / 1_000_000).replace(/\s?€/, "M€");
  if (n >= 1_000) return EURO_1D.format(n / 1_000).replace(/\s?€/, "k€");
  return EURO.format(n);
}

export function arr(users: number, arpu: number): number {
  return users * arpu;
}

export function valuations(ARR: number, multMin: number, multMax: number) {
  const low = ARR * multMin;
  const high = ARR * multMax;
  return { low, high, span: high - low, mid: (low + high) / 2 };
}

export function pctDelta(now: number, base: number): number {
  if (!base) return 0;
  return ((now - base) / base) * 100;
}