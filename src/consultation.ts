import type { AnnualMileage, PaymentPercent, RentalTerm, RentalTrim } from './services/rentalQuote';

export type RentalSelection = {
  colorId: string;
  trim: RentalTrim;
  termMonths: RentalTerm;
  annualMileageKm: AnnualMileage;
  depositPercent: PaymentPercent;
  prepaymentPercent: PaymentPercent;
};

export const defaultRentalSelection: RentalSelection = {
  colorId: 'blue',
  trim: 'esprit-alpine',
  termMonths: 60,
  annualMileageKm: 20000,
  depositPercent: 0,
  prepaymentPercent: 10,
};

export const trimNames: Record<RentalTrim, string> = {
  techno: '테크노',
  iconic: '아이코닉',
  'iconic-4wd': '아이코닉 4WD',
  'esprit-alpine': '에스프리 알핀',
};

export const colorNames: Record<string, string> = {
  blue: '새틴 녹턴 블루',
  white: '새틴 유니버스 화이트',
  pearl: '클라우드 펄',
  black: '메탈릭 블랙',
  gray: '어반 그레이',
};
