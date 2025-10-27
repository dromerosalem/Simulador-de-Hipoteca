export const formatCurrency = (value: number, options?: Intl.NumberFormatOptions): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'EUR',
    };
    // Handle the "-0.00" case by treating very small negative numbers as 0.
    const numberToFormat = Math.abs(value) < 0.005 ? 0 : value;
    return new Intl.NumberFormat('es-ES', { ...defaultOptions, ...options }).format(numberToFormat);
};
