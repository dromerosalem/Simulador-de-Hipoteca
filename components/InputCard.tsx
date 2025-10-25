
import React, { ReactNode } from 'react';

interface InputCardProps {
    title: string;
    children: ReactNode;
}

const InputCard: React.FC<InputCardProps> = ({ title, children }) => {
    return (
        <div className="bg-contrast-light dark:bg-contrast-dark p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-6 border-b-2 border-primary-light dark:border-primary-dark pb-3">
                {title}
            </h2>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

export default InputCard;
