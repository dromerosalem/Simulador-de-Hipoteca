
import { useMemo } from 'react';
import { MortgageParams, AmortizationDataPoint, YearlyAmortizationData, CalculationResult, ExtraPaymentFrequency } from '../types';
import { MAX_MONTHS } from '../constants';

const FREQUENCY_TO_MONTHS: Record<ExtraPaymentFrequency, number> = {
    [ExtraPaymentFrequency.Monthly]: 1,
    [ExtraPaymentFrequency.Quarterly]: 3,
    [ExtraPaymentFrequency.SemiAnnually]: 6,
    [ExtraPaymentFrequency.Annually]: 12,
    [ExtraPaymentFrequency.OneTime]: Infinity, 
};

function runSimulation(params: MortgageParams, withExtras: boolean) {
    let balance = params.principal;
    const monthlyRate = params.annualRate / 100 / 12;
    const monthlyData: AmortizationDataPoint[] = [];
    let cumulativeInterest = 0;
    let warning: string | undefined;

    const extraPaymentFrequencyMonths = FREQUENCY_TO_MONTHS[params.extraFrequency];

    if (params.monthlyPayment <= params.principal * monthlyRate && params.annualRate > 0) {
        warning = "La cuota mensual es demasiado baja para cubrir los intereses. La deuda crecerá indefinidamente.";
    }

    for (let month = 1; month <= MAX_MONTHS && balance > 0; month++) {
        const interestForMonth = balance * monthlyRate;
        if (params.monthlyPayment < interestForMonth && month > 1) {
            // This condition is met when the debt is not decreasing
        }

        const principalFromPayment = Math.max(0, params.monthlyPayment - interestForMonth);
        
        let currentExtraPayment = 0;
        if (withExtras) {
            if (params.extraFrequency === ExtraPaymentFrequency.OneTime && month === 1) {
                currentExtraPayment = params.extraPayment;
            } else if (params.extraFrequency !== ExtraPaymentFrequency.OneTime && month % extraPaymentFrequencyMonths === 0) {
                currentExtraPayment = params.extraPayment;
            }
        }

        const totalPrincipalPaid = principalFromPayment + currentExtraPayment;

        const paidAmount = Math.min(balance, totalPrincipalPaid);
        balance -= paidAmount;
        cumulativeInterest += interestForMonth;

        monthlyData.push({
            month,
            year: Math.ceil(month / 12),
            interestPaid: interestForMonth,
            principalPaid: principalFromPayment,
            extraPayment: currentExtraPayment,
            totalPrincipalPaid: paidAmount,
            remainingBalance: balance,
            cumulativeInterest,
        });
    }

    const yearlyData: YearlyAmortizationData[] = [];
    if (monthlyData.length > 0) {
        const totalYears = Math.ceil(monthlyData.length / 12);
        for (let year = 1; year <= totalYears; year++) {
            const yearMonths = monthlyData.filter(d => d.year === year);
            yearlyData.push({
                year: year,
                interestPaid: yearMonths.reduce((acc, m) => acc + m.interestPaid, 0),
                principalPaid: yearMonths.reduce((acc, m) => acc + m.principalPaid, 0),
                extraPayments: yearMonths.reduce((acc, m) => acc + m.extraPayment, 0),
                endBalance: yearMonths[yearMonths.length - 1].remainingBalance,
            });
        }
    }

    return {
        termMonths: monthlyData.length,
        totalInterest: cumulativeInterest,
        monthlyData,
        yearlyData,
        warning,
    };
}

export const useMortgageCalculator = (params: MortgageParams): CalculationResult | null => {
    return useMemo(() => {
        if (params.principal <= 0 || params.monthlyPayment <= 0) {
            return null;
        }

        const baselineResult = runSimulation(params, false);
        const scenarioResult = runSimulation(params, true);

        const termReductionMonths = baselineResult.termMonths - scenarioResult.termMonths;
        const interestSaved = baselineResult.totalInterest - scenarioResult.totalInterest;

        return {
            scenario: {
                termMonths: scenarioResult.termMonths,
                totalInterest: scenarioResult.totalInterest,
                yearlyData: scenarioResult.yearlyData,
                monthlyData: scenarioResult.monthlyData,
            },
            baseline: {
                termMonths: baselineResult.termMonths,
                totalInterest: baselineResult.totalInterest,
            },
            savings: {
                termReductionMonths,
                interestSaved,
            },
            warning: scenarioResult.warning,
        };
    }, [params]);
};
