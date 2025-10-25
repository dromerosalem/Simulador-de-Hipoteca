
import React, { useState, useMemo, useCallback } from 'react';
import { useMortgageCalculator } from './hooks/useMortgageCalculator';
import { MortgageParams, ExtraPaymentFrequency, CalculationResult } from './types';
import Header from './components/Header';
import InputCard from './components/InputCard';
import NumericInput from './components/NumericInput';
import SelectInput from './components/SelectInput';
import ResultsSummary from './components/ResultsSummary';
import BalanceChart from './components/BalanceChart';
import InterestPrincipalChart from './components/InterestPrincipalChart';
import AmortizationTable from './components/AmortizationTable';
import { DEFAULT_VALUES } from './constants';
import { speakText } from './services/ttsService';

const App: React.FC = () => {
    const [params, setParams] = useState<MortgageParams>(DEFAULT_VALUES);
    const [fontSize, setFontSize] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const calculationResults = useMortgageCalculator(params);

    const handleParamChange = useCallback(<K extends keyof MortgageParams>(key: K, value: MortgageParams[K]) => {
        setParams(prev => ({ ...prev, [key]: value }));
    }, []);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newMode;
        });
    }, []);

    const adjustFontSize = useCallback((adjustment: number) => {
        setFontSize(prev => Math.max(0.8, Math.min(1.5, prev + adjustment)));
    }, []);

    const handleSpeakResults = useCallback(async (results: CalculationResult | null) => {
        if (!results || isSpeaking) return;

        setIsSpeaking(true);
        const { scenario, savings } = results;
        const years = Math.floor(scenario.termMonths / 12);
        const months = scenario.termMonths % 12;

        const termText = `${years} año${years !== 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
        const interestSavedText = `${Math.round(savings.interestSaved).toLocaleString('es-ES')} euros`;
        
        const textToSpeak = `Con los pagos extra, terminarás de pagar en ${termText}. Ahorrarás un total de ${interestSavedText} en intereses.`;

        try {
            await speakText(textToSpeak);
        } catch (error) {
            console.error("Error en Text-to-Speech:", error);
            alert("No se pudo reproducir el resumen. Por favor, revisa la consola para más detalles.");
        } finally {
            setIsSpeaking(false);
        }
    }, [isSpeaking]);
    
    const containerStyle = { fontSize: `${fontSize}rem` };

    return (
        <div style={containerStyle} className="min-h-screen transition-colors duration-300">
            <Header
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                adjustFontSize={adjustFontSize}
            />

            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {calculationResults && (
                    <ResultsSummary 
                        results={calculationResults} 
                        onSpeak={() => handleSpeakResults(calculationResults)}
                        isSpeaking={isSpeaking}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-1 space-y-6">
                        <InputCard title="Parámetros Principales">
                            <NumericInput
                                label="Capital Pendiente (€)"
                                value={params.principal}
                                onChange={(val) => handleParamChange('principal', val)}
                                step={1000}
                                tooltip="La cantidad de dinero que todavía debes de tu hipoteca."
                            />
                            <NumericInput
                                label="Tipo de Interés (TIN %)"
                                value={params.annualRate}
                                onChange={(val) => handleParamChange('annualRate', val)}
                                step={0.1}
                                fractionDigits={3}
                                tooltip="El porcentaje de interés anual que pagas por el préstamo, sin incluir otros gastos."
                            />
                            <NumericInput
                                label="Cuota Mensual (€)"
                                value={params.monthlyPayment}
                                onChange={(val) => handleParamChange('monthlyPayment', val)}
                                step={50}
                                tooltip="La cantidad fija que pagas cada mes, sin contar los pagos extra."
                            />
                        </InputCard>

                        <InputCard title="Pagos Extra al Capital">
                             <NumericInput
                                label="Importe del Pago Extra (€)"
                                value={params.extraPayment}
                                onChange={(val) => handleParamChange('extraPayment', val)}
                                step={500}
                                tooltip="Dinero adicional que pagas para reducir tu deuda más rápido."
                            />
                            <SelectInput
                                label="Frecuencia del Pago Extra"
                                value={params.extraFrequency}
                                onChange={(e) => handleParamChange('extraFrequency', e.target.value as ExtraPaymentFrequency)}
                                options={[
                                    { value: ExtraPaymentFrequency.OneTime, label: 'Única vez' },
                                    { value: ExtraPaymentFrequency.Annually, label: 'Anual' },
                                    { value: ExtraPaymentFrequency.SemiAnnually, label: 'Semestral' },
                                    { value: ExtraPaymentFrequency.Quarterly, label: 'Trimestral' },
                                    { value: ExtraPaymentFrequency.Monthly, label: 'Mensual' },
                                ]}
                                tooltip="Cada cuánto tiempo realizas el pago extra."
                            />
                        </InputCard>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                       {calculationResults && calculationResults.scenario.yearlyData.length > 0 && (
                           <>
                            <InputCard title="Evolución del Saldo Pendiente">
                                <BalanceChart data={calculationResults.scenario.yearlyData} />
                            </InputCard>
                            <InputCard title="Intereses vs. Capital Pagado por Año">
                                <InterestPrincipalChart data={calculationResults.scenario.yearlyData} />
                            </InputCard>
                           </>
                       )}
                    </div>
                </div>

                {calculationResults && calculationResults.scenario.monthlyData.length > 0 && (
                     <div className="mt-8">
                        <InputCard title="Tabla de Amortización Detallada">
                            <AmortizationTable data={calculationResults.scenario.monthlyData} />
                        </InputCard>
                    </div>
                )}

                 {calculationResults && calculationResults.warning && (
                    <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 rounded-md">
                        <p className="font-bold">Aviso</p>
                        <p>{calculationResults.warning}</p>
                    </div>
                 )}
            </main>
        </div>
    );
};

export default App;