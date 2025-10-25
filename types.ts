
export enum ExtraPaymentFrequency {
    OneTime = 'ONE_TIME',
    Annually = 'ANNUALLY',
    SemiAnnually = 'SEMI_ANNUALLY',
    Quarterly = 'QUARTERLY',
    Monthly = 'MONTHLY',
}

export interface MortgageParams {
    principal: number;
    annualRate: number;
    monthlyPayment: number;
    extraPayment: number;
    extraFrequency: ExtraPaymentFrequency;
}

export interface AmortizationDataPoint {
    month: number;
    year: number;
    interestPaid: number;
    principalPaid: number;
    extraPayment: number;
    totalPrincipalPaid: number;
    remainingBalance: number;
    cumulativeInterest: number;
}

export interface YearlyAmortizationData {
    year: number;
    interestPaid: number;
    principalPaid: number;
    extraPayments: number;
    endBalance: number;
}

export interface CalculationResult {
    scenario: {
        termMonths: number;
        totalInterest: number;
        yearlyData: YearlyAmortizationData[];
        monthlyData: AmortizationDataPoint[];
    };
    baseline: {
        termMonths: number;
        totalInterest: number;
    };
    savings: {
        termReductionMonths: number;
        interestSaved: number;
    };
    warning?: string;
}
