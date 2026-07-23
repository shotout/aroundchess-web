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
