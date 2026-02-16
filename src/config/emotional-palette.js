// emotional-palette.js — Bipolar color scales per emotional quadrant
//
// Each quadrant has a negative pole color and a positive pole color.
// Values range from -1 (unset) through 0 to 3 (max intensity).
// Negative values (below 0) use the negative pole color.
// Positive values (above 0) use the positive pole color.
//
// The cross (pride factor) uses a single bipolar scale.
// Color intensity maps to alpha: 0 = transparent, 3 = fully opaque.

// --- Quadrant color definitions ---
// Colors as hex numbers for PixiJS

export const PALETTE = {
  // Intrigue Drive (x): agitation (-) ↔ anticipation (+)
  x: {
    negative: 0xcc4400, // red-orange (agitation)
    positive: 0xdaa520, // gold (anticipation)
  },

  // Conformity Ratio (y): independence (-) ↔ conformity (+)
  y: {
    negative: 0x7b2d8b, // purple (independence)
    positive: 0x2e8b57, // green (conformity)
  },

  // Comfort Drive (o): fear (-) ↔ safety (+)
  o: {
    negative: 0x8b1a1a, // dark red (fear)
    positive: 0x4682b4, // warm blue (safety)
  },

  // Connectedness Ratio (g): isolation (-) ↔ inclusion (+)
  g: {
    negative: 0x708090, // cold gray (isolation)
    positive: 0xdb7093, // warm pink (inclusion)
  },

  // Pride Factor (cross: s, L, d, R, n): shame (-) ↔ pride (+)
  cross: {
    negative: 0x6b4226, // muted brown (shame)
    positive: 0xffd700, // white-gold (pride)
  },
};

// Neutral color for unset/zero emotional state
export const NEUTRAL_COLOR = 0x1a1a1a;

// Background color for the dot body
export const DOT_BACKGROUND = 0x111111;

// Cross keys use the same palette entry
const CROSS_KEYS = new Set(['s', 'L', 'd', 'R', 'n']);

/**
 * Get the color for a given emotional key and value.
 * Returns { color, alpha } suitable for PixiJS fill.
 *
 * @param {string} key - Emotional grid key (x, s, y, L, d, R, o, n, g)
 * @param {number} value - Emotional value (-1 to 3)
 * @returns {{ color: number, alpha: number }}
 */
export function getEmotionalColor(key, value) {
  // Unset or zero — neutral
  if (value <= 0) {
    return { color: NEUTRAL_COLOR, alpha: 0 };
  }

  const paletteEntry = CROSS_KEYS.has(key) ? PALETTE.cross : PALETTE[key];
  if (!paletteEntry) {
    return { color: NEUTRAL_COLOR, alpha: 0 };
  }

  // Positive values use positive pole color
  // Alpha scales from 0.33 (value=1) to 1.0 (value=3)
  const alpha = value / 3;
  return { color: paletteEntry.positive, alpha };
}

/**
 * Get the bloom size ratio for a given emotional intensity.
 * Maps value 1→0.4, 2→0.7, 3→1.0 of the cell size.
 * Returns 0 for unset/zero values.
 *
 * @param {number} value - Emotional value (-1 to 3)
 * @returns {number} Ratio 0..1 of cell size
 */
export function getBloomSize(value) {
  if (value <= 0) return 0;
  // Linear interpolation: 1→0.4, 2→0.7, 3→1.0
  return 0.1 + (value / 3) * 0.9;
}
