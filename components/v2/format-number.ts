export function formatNumber(n: number | null | undefined): string {
  const num = Number(n);
  if (!Number.isFinite(num)) return n == null ? "" : String(n);
  return Math.round(num).toLocaleString("en-US");
}

export function formatEloDelta(delta: number | null | undefined): string {
  const num = Math.round(Number(delta));
  if (!Number.isFinite(num) || num === 0) return "0";
  return num > 0 ? `+${num}` : `${num}`;
}

export function eloDeltaColorClass(delta: number | null | undefined): string {
  const num = Number(delta);
  if (!Number.isFinite(num) || num === 0) return "text-[#6B7280]";
  return num > 0 ? "text-[#34C759]" : "text-[#DC2626]";
}
