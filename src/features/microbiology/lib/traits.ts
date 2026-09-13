/**
 * Common morphological and physiological trait definitions and matcher utilities
 * for microbiology species and groups.
 */

export const ROD_EMOJIS = ["🌭", "🌭🌭", "🌭🌭🌭"] as const;
export const COCCUS_EMOJIS = [
  "⚪",
  "🟣",
  "🟣🟣",
  "🟣🟣🟣",
  "🍇",
  "8",
  "⛓️",
] as const;

/**
 * Checks whether the given emojis represent a rod-shaped bacterium (bacillus, diplobacillus, etc.).
 */
export function isRod(emojis: string[]): boolean {
  return emojis.some((e) => (ROD_EMOJIS as readonly string[]).includes(e));
}

/**
 * Checks whether the given emojis represent a spherical/coccus bacterium (coccus, tetrad, sarcina, cluster, chain).
 */
export function isCoccus(emojis: string[]): boolean {
  return emojis.some((e) => (COCCUS_EMOJIS as readonly string[]).includes(e));
}

/**
 * Matches whether an item possessing `allEmojis` exhibits the trait identified by `traitEmoji`.
 * Handles compound and variant emojis for morphology categories (rods and cocci).
 */
export function matchesTrait(allEmojis: string[], traitEmoji: string): boolean {
  if (traitEmoji === "🌭") return isRod(allEmojis);
  if (traitEmoji === "⚪") return isCoccus(allEmojis);
  return allEmojis.includes(traitEmoji);
}
