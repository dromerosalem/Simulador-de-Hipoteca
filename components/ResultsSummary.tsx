import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ResultsSummaryProps {
    results: CalculationResult;
    onSpeak: () => void;
    isSpeaking: boolean;
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className="flex-1 text-center p-4 bg-contrast-light dark:bg-contrast-dark rounded-lg shadow">
        <p className="text-lg text-gray-600 dark:text-gray-300">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results, onSpeak, isSpeaking }) => {
    const { scenario, savings } = results;

    const years = Math.floor(scenario.termMonths / 12);
    const months = scenario.termMonths % 12;
    const termText = `${years}a ${months}m`;

    const termReductionYears = Math.floor(savings.termReductionMonths / 12);
    const termReductionMonths = savings.termReductionMonths % 12;
    const termReductionText = `-${termReductionYears}a ${termReductionMonths}m`;
    
    const currencyOptions = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

    return (
        <div className="bg-primary/10 dark:bg-primary-dark/30 p-4 rounded-xl shadow-lg border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-4">
                <StatCard title="Plazo Restante" value={termText} color="text-primary-dark dark:text-primary-light" />
                <StatCard title="Ahorro Intereses" value={formatCurrency(savings.interestSaved, currencyOptions)} color="text-green-600 dark:text-green-400" />
                <StatCard title="Ahorro Tiempo" value={termReductionText} color="text-green-600 dark:text-green-400" />
                <StatCard title="Intereses Totales" value={formatCurrency(scenario.totalInterest, currencyOptions)} color="text-red-600 dark:text-red-400" />
                <button 
                    onClick={onSpeak}
                    disabled={isSpeaking}
                    className="flex items-center justify-center p-4 rounded-full bg-secondary hover:bg-secondary-dark transition-colors text-primary-dark text-2xl w-16 h-16 md:w-20 md:h-20 self-center disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Escuchar resumen de resultados"
                >
                    {isSpeaking ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high"></i>}
                </button>
            </div>
        </div>
    );
};

export default ResultsSummary;