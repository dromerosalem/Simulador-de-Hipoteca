
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { YearlyAmortizationData } from '../types';

interface InterestPrincipalChartProps {
    data: YearlyAmortizationData[];
}

const InterestPrincipalChart: React.FC<InterestPrincipalChartProps> = ({ data }) => {
     const chartData = data.map(d => ({
        ...d,
        yearLabel: `Año ${d.year}`,
        totalPrincipal: d.principalPaid + d.extraPayments,
    }));

    const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="w-full h-80">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                    <XAxis dataKey="yearLabel" tick={{ fill: 'currentColor' }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: 'currentColor' }} />
                     <RechartsTooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                            backgroundColor: 'rgba(45, 55, 72, 0.8)',
                            borderColor: '#005a9c',
                            color: '#f7fafc',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="interestPaid" name="Intereses" stackId="a" fill="#e53e3e" />
                    <Bar dataKey="totalPrincipal" name="Capital Amortizado" stackId="a" fill="#38a169" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InterestPrincipalChart;
