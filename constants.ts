
import { MortgageParams, ExtraPaymentFrequency } from './types';

export const DEFAULT_VALUES: MortgageParams = {
    principal: 108570.49,
    annualRate: 4.416,
    monthlyPayment: 743,
    extraPayment: 14000,
    extraFrequency: ExtraPaymentFrequency.Annually,
};

export const MAX_MONTHS = 12 * 50; // 50 years max to prevent infinite loops
