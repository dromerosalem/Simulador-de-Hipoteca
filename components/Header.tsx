
import React from 'react';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    adjustFontSize: (adjustment: number) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, adjustFontSize }) => {
    return (
        <header className="bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light p-4 shadow-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold">
                    <i className="fa-solid fa-house-medical-circle-check mr-3"></i>
                    Simulador de Hipoteca
                </h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button onClick={() => adjustFontSize(-0.1)} aria-label="Reducir tamaño de letra" className="p-2 w-10 h-10 text-lg rounded-full hover:bg-black/10 transition-colors">
                        A-
                    </button>
                    <button onClick={() => adjustFontSize(0.1)} aria-label="Aumentar tamaño de letra" className="p-2 w-10 h-10 text-xl rounded-full hover:bg-black/10 transition-colors">
                        A+
                    </button>
                    <button onClick={toggleDarkMode} aria-label="Cambiar modo de color" className="p-2 w-10 h-10 text-xl rounded-full hover:bg-black/10 transition-colors">
                        <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;