import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

interface NumericInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    step?: number;
    fractionDigits?: number;
    tooltip?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({ label, value, onChange, step = 1, fractionDigits = 2, tooltip }) => {
    const formatNumber = (num: number) => new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(num);

    const [displayValue, setDisplayValue] = useState(formatNumber(value));

    // Update display when the underlying value changes from the parent
    useEffect(() => {
        setDisplayValue(formatNumber(value));
    }, [value, fractionDigits]);

    const handleStep = (direction: 'up' | 'down') => {
        const newValue = direction === 'up' ? value + step : value - step;
        onChange(parseFloat(newValue.toFixed(fractionDigits)));
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
    };

    const handleBlur = () => {
        // Flexible parsing: handles "1.234,56", "1,234.56", "1234.56", and "1234,56"
        let sanitized = displayValue.replace(/[^0-9.,-]+/g, '');
        
        const lastComma = sanitized.lastIndexOf(',');
        const lastDot = sanitized.lastIndexOf('.');

        // If both exist, assume the last one is the decimal separator
        if (lastComma > -1 && lastDot > -1) {
            if (lastComma > lastDot) {
                // Comma is decimal, dots are thousands separators
                sanitized = sanitized.replace(/\./g, '').replace(',', '.');
            } else {
                // Dot is decimal, commas are thousands separators
                sanitized = sanitized.replace(/,/g, '');
            }
        } else {
            // If only one type of separator, assume it's a decimal comma and replace with dot
            sanitized = sanitized.replace(',', '.');
        }

        const parsedValue = parseFloat(sanitized);

        if (!isNaN(parsedValue)) {
            onChange(parsedValue);
            setDisplayValue(formatNumber(parsedValue));
        } else {
            setDisplayValue(formatNumber(value));
        }
    };

    return (
        <div>
            <label className="flex items-center text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                {label}
                {tooltip && <Tooltip text={tooltip} />}
            </label>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleStep('down')}
                    className="w-14 h-14 text-2xl font-bold rounded-full bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light hover:opacity-80 transition-opacity"
                    aria-label={`Reducir ${label}`}
                >
                    -
                </button>
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full text-center text-2xl font-mono p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
                <button
                    onClick={() => handleStep('up')}
                    className="w-14 h-14 text-2xl font-bold rounded-full bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light hover:opacity-80 transition-opacity"
                    aria-label={`Aumentar ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default NumericInput;