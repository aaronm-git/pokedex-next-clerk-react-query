// Screen formatting for PokeAPI's units. Kept apart from the fixtures so
// phase 3's live data goes through the same functions.

/** Gen 1 always shows three digits: 001, 025, 151. */
export function padNo(id: number): string {
  return String(id).padStart(3, "0");
}

/** Decimetres to the games' feet and inches: 7 dm reads 2'04". */
export function formatHeight(decimetres: number): string {
  const inches = Math.round(decimetres * 3.937);
  const feet = Math.floor(inches / 12);
  const rest = String(inches % 12).padStart(2, "0");
  return `${feet}'${rest}"`;
}

/** Hectograms to the games' pounds with one decimal: 69 hg reads 15.2 lb. */
export function formatWeight(hectograms: number): string {
  return `${(hectograms * 0.220462).toFixed(1)} lb`;
}
