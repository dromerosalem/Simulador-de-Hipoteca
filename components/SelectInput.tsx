
import React from 'react';
import Tooltip from './Tooltip';

interface SelectInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    tooltip?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options, tooltip }) => {
    return (
        <div>
            <label className="flex items-center text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                {label}
                {tooltip && <Tooltip text={tooltip} />}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full text-xl p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
