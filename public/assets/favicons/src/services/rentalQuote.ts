// Public rental offers are references, not binding quotations from our company.
// Source (checked 2026-10-29): https://www.autosign.kr/장기렌트/그랑-콜레오스
// 2026 gasoline 2.0 turbo, 48 months, 20,000 km/year, basic options.
export type RentalTrim = 'techno' | 'iconic' | 'iconic-4wd' | 'esprit-alpine';
export type RentalTerm = 36 | 48 | 60;
export type AnnualMileage = 10000 | 20000 | 30000 | 'unlimited';
export type PaymentPercent = 0 | 10 | 20 | 30;

export interface RentalSelection {
  trim: RentalTrim;
  exteriorColor: string;
  termMonths: RentalTerm;
  annualMileageKm: AnnualMileage;
  depositPercent: PaymentPercent;
  prepaymentPercent: PaymentPercent;
}

const publishedReference: Record<RentalTrim, { base: number; prepaid30: number; deposited30: number }> = {
  techno: { base: 537350, prepaid30: 286025, deposited30: 477400 },
  iconic: { base: 585530, prepaid30: 306420, deposited30: 518980 },
  'esprit-alpine': { base: 611930, prepaid30: 317685, deposited30: 541860 },
  'iconic-4wd': { base: 618640, prepaid30: 320628, deposited30: 547690 },
};

// Public 36-/60-month lowest-offer ratios relative to the 48-month techno offer.
// Other trims / periods are extrapolated and never represented as provider quotes.
const durationFactor: Record<RentalTerm, number> = {
  36: 566500 / 537350,
  48: 1,
  60: 510400 / 537350,
};

export const RENTAL_QUOTE_REFERENCE = {
  sourceName: '오토사인 공개 장기렌트 견적',
  sourceUrl: 'https://www.autosign.kr/장기렌트/그랑-콜레오스',
  checkedOn: '2026-10-29',
  powertrain: '2026년형 가솔린 터보 2.0',
} as const;

export type RentalQuoteResult =
  | { status: 'ready'; monthlyRentWon: number; isExactPublicReference: boolean }
  | { status: 'unavailable'; reason: 'unlimited-mileage-requires-consultation' };

export function resolveRentalQuote(selection: RentalSelection): RentalQuoteResult {
  // Published offers do not price unlimited mileage for general customers.
  if (selection.annualMileageKm === 'unlimited') {
    return { status: 'unavailable', reason: 'unlimited-mileage-requires-consultation' };
  }

  const rate = publishedReference[selection.trim];
  const duration = durationFactor[selection.termMonths];
  // Mileage and non-reference term adjustments are internal estimates.
  const mileageAdjustment = ((selection.annualMileageKm - 20000) / 10000) * 22000;
  const prepaymentDiscount = (rate.base - rate.prepaid30) * (selection.prepaymentPercent / 30) * (48 / selection.termMonths);
  const depositDiscount = (rate.base - rate.deposited30) * (selection.depositPercent / 30);
  const isExactPublicReference = selection.termMonths === 48 && selection.annualMileageKm === 20000
    && selection.depositPercent === 0 && selection.prepaymentPercent === 0;
  const monthlyRentWon = isExactPublicReference ? rate.base
    : Math.max(0, Math.round((rate.base * duration + mileageAdjustment - prepaymentDiscount - depositDiscount) / 100) * 100);

  return {
    status: 'ready',
    monthlyRentWon,
    isExactPublicReference,
  };
}
