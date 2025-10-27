import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { YearlyAmortizationData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BalanceChartProps {
    data: YearlyAmortizationData[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
    const chartData = data.map(d => ({
        ...d,
        yearLabel: `Año ${d.year}`,
    }));

    const formatTick = (value: number) => formatCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return (
        <div className="w-full h-80">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                    <XAxis dataKey="yearLabel" tick={{ fill: 'currentColor' }} />
                    <YAxis tickFormatter={formatTick} tick={{ fill: 'currentColor' }} />
                    <RechartsTooltip
                        formatter={(value: number) => [formatTick(value), "Saldo Pendiente"]}
                        contentStyle={{
                            backgroundColor: 'rgba(45, 55, 72, 0.8)',
                            borderColor: '#005a9c',
                            color: '#f7fafc',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="endBalance" name="Saldo Pendiente" stroke="#fdb813" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BalanceChart;