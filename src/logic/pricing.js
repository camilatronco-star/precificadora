
const BUSHELS_PER_TON = 36.7437;

export const calculateReferencePrice = ({
  chicagoPrice, // in cents/bu
  fxRate,
  fixedCosts,
  freightType = 'sem frete'
}) => {
  // Convert cents/bu to USD/Ton
  // formula requires ChicagoPrice in USD/Ton for the 0.06 factor to yield ~165 BRL/sc
  const priceUsdPerTon = (chicagoPrice / 100) * BUSHELS_PER_TON;

  // Formula: IF(Freight = "sem frete", (ChicagoPrice * FX * 0.06) - FixedCosts, (ChicagoPrice * FX * 0.06))
  // Applied to priceUsdPerTon

  const baseValue = priceUsdPerTon * fxRate * 0.06;

  if (freightType === 'sem frete') {
    return Math.max(0, baseValue - fixedCosts);
  } else {
    return Math.max(0, baseValue);
  }
};
