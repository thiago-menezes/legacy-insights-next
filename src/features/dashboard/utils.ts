export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number, showSign = true): string => {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// Helper to generate dynamic colors based on index
// Base color: #3739cd (approx HSL: 239, 58%, 51%)
export const getBarColor = (index: number) => {
  // Start with base lightness of 70% and decrease by 12% for each stage
  // Increase saturation by 5% for each stage to keep it vibrant
  const baseHue = 267;
  const initialSaturation = 72;
  const saturationStep = 5;
  const initialLightness = 72;
  const lightnessStep = 12;

  const saturation = Math.min(100, initialSaturation + index * saturationStep);
  const lightness = Math.max(10, initialLightness - index * lightnessStep);

  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};
