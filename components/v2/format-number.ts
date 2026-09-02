/**
 * Format an integer with thousands separators, e.g. 10000 -> "10,000".
 *
 * Used for every leaderboard number (rank, position, score, rank change) EXCEPT
 * the ELO rating, which is shown as a bare number by design.
 */
export function formatNumber(n: number | null | undefined): string {
  const num = Number(n);
  if (!Number.isFinite(num)) return n == null ? "" : String(n);
  return Math.round(num).toLocaleString("en-US");
}

/**
 * Signed ELO change for the end-of-game modals: "+25", "-25", "0".
 *
 * The modals always show it, including the 0 an account that is still
 * calibrating gets — hiding the badge made those games look as though the
 * result had no bearing on the rating at all.
 */
export function formatEloDelta(delta: number | null | undefined): string {
  const num = Math.round(Number(delta));
  if (!Number.isFinite(num) || num === 0) return "0";
  return num > 0 ? `+${num}` : `${num}`;
}

/** Colour class matching a signed ELO change (grey when it didn't move). */
export function eloDeltaColorClass(delta: number | null | undefined): string {
  const num = Number(delta);
  if (!Number.isFinite(num) || num === 0) return "text-[#6B7280]";
  return num > 0 ? "text-[#34C759]" : "text-[#DC2626]";
}
