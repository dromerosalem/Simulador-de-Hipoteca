
import React, { useState } from 'react';

interface TooltipProps {
    text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div 
            className="relative flex items-center ml-2"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <i className="fa-solid fa-circle-info text-primary-dark dark:text-primary-light cursor-pointer"></i>
            {visible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-contrast-dark text-text-dark text-base rounded-lg shadow-xl z-10">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-contrast-dark"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
