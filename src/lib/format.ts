const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const plain = new Intl.NumberFormat("en-US");

export const formatUsd = (value: number) => usd.format(value);
export const formatNumber = (value: number) => plain.format(value);
export const formatArea = (squareMeters: number) => `${plain.format(squareMeters)} m²`;
/** Square feet, for U.S. visitors who think in them. */
export const formatSquareFeet = (squareMeters: number) =>
  `${plain.format(Math.round(squareMeters * 10.7639))} sq ft`;
export const formatTerm = (months: number) =>
  months % 12 === 0 ? `${months} months (${months / 12} years)` : `${months} months`;

export function formatCoordinates(lat: number, lng: number) {
  const ns = lat < 0 ? "S" : "N";
  const ew = lng < 0 ? "W" : "E";
  return `${Math.abs(lat).toFixed(3)}° ${ns}, ${Math.abs(lng).toFixed(3)}° ${ew}`;
}
