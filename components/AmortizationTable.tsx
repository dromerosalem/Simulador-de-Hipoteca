
import React, { useState } from 'react';
import { AmortizationDataPoint } from '../types';

interface AmortizationTableProps {
    data: AmortizationDataPoint[];
}

const ITEMS_PER_PAGE = 12;

const AmortizationTable: React.FC<AmortizationTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    const paginatedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full text-lg text-left">
                    <thead className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light">
                        <tr>
                            <th className="p-4 rounded-tl-lg">Mes</th>
                            <th className="p-4">Intereses</th>
                            <th className="p-4">Capital (Cuota)</th>
                            <th className="p-4">Capital (Extra)</th>
                            <th className="p-4 rounded-tr-lg">Saldo Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={row.month} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="p-4 font-semibold">{row.month}</td>
                                <td className="p-4 text-red-600 dark:text-red-400">{formatCurrency(row.interestPaid)}</td>
                                <td className="p-4 text-green-600 dark:text-green-400">{formatCurrency(row.principalPaid)}</td>
                                <td className="p-4 text-blue-600 dark:text-blue-400">{formatCurrency(row.extraPayment)}</td>
                                <td className="p-4 font-mono">{formatCurrency(row.remainingBalance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-lg">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default AmortizationTable;
