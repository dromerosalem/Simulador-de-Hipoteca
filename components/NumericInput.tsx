
import React from 'react';
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
    const handleStep = (direction: 'up' | 'down') => {
        const newValue = direction === 'up' ? value + step : value - step;
        onChange(parseFloat(newValue.toFixed(fractionDigits)));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '') {
            onChange(0);
        } else {
            const parsedValue = parseFloat(val);
            if (!isNaN(parsedValue)) {
                onChange(parsedValue);
            }
        }
    };

    const formattedValue = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);

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
                    value={formattedValue}
                    onChange={handleChange}
                    onBlur={(e) => { // Re-format on blur
                      const parsedValue = parseFloat(e.target.value.replace(/\./g, '').replace(',', '.'));
                      if (!isNaN(parsedValue)) {
                          onChange(parsedValue);
                      } else {
                          onChange(value); // revert if invalid
                      }
                    }}
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
