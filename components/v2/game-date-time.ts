import { Game } from "@/components/game-history/types/GameHistoryTypes";

/** Any game-shaped object with the two fields the date/time is read from. */
type DatedGame = Pick<Game, "date" | "pgn">;

/** "7:05" → "07:05". PGN writers (ours included) don't always pad the hour. */
const padHour = (h: string, m: string): string => `${h.padStart(2, "0")}:${m}`;

/**
 * Game date as "DD.MM.YYYY".
 *
 * Split as a string, never through `new Date()` — the API sends a plain
 * "YYYY-MM-DD", which `new Date()` reads as UTC midnight and then renders a day
 * early west of Greenwich (and as a bogus 07:00 local time east of it).
 */
export function formatGameDate(game: DatedGame): string {
  const raw = (game.date || "").split("T")[0];
  const [y, m, d] = raw.split("-");
  if (y && m && d) return `${d}.${m}.${y}`;

  // No usable API date — the PGN carries its own [Date "YYYY.MM.DD"].
  const tag = (game.pgn || "").match(/\[(?:EndDate|UTCDate|Date) "(\d{4})\.(\d{2})\.(\d{2})"/);
  return tag ? `${tag[3]}.${tag[2]}.${tag[1]}` : raw;
}

/**
 * Game time as "HH:MM", read from the PGN tags the game was saved with — the
 * API's `date` field is date-only, so the PGN is the only time source.
 *
 * Hours are matched as `\d{1,2}`: games finished before 10:00 were written with
 * an unpadded hour ("7:05:00"), and a `\d{2}` match dropped their time entirely.
 */
export function formatGameTime(game: DatedGame): string {
  const pgn = game.pgn || "";
  const tag =
    pgn.match(/\[EndTime "(\d{1,2}):(\d{2})/) ??
    pgn.match(/\[UTCTime "(\d{1,2}):(\d{2})/) ??
    pgn.match(/\[StartTime "(\d{1,2}):(\d{2})/);
  if (tag) return padHour(tag[1], tag[2]);

  // Some sources send a full ISO timestamp rather than a plain date.
  const iso = (game.date || "").match(/T(\d{1,2}):(\d{2})/);
  return iso ? padHour(iso[1], iso[2]) : "";
}

export function formatGameDateTime(game: DatedGame): { date: string; time: string } {
  return { date: formatGameDate(game), time: formatGameTime(game) };
}

/** "DD.MM.YYYY · HH:MM", falling back to the date alone when no time is known. */
export function formatGameDateTimeLabel(game: DatedGame): string {
  const { date, time } = formatGameDateTime(game);
  if (!date) return "";
  return time ? `${date} · ${time}` : date;
}
