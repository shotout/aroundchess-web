import { formatEloDelta, formatNumber } from "@/components/v2/format-number";

export type GameResult = "win" | "lose" | "draw";

export interface ResultShareSpec {
  kind: "result";
  result: GameResult;
  elo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
}

export interface LeaderboardShareSpec {
  kind: "leaderboard";
  username: string;
  elo: number;
  rank: number;
  totalPlayers: number | null;
  avatarUrl?: string | null;
}

export type ShareCardSpec = ResultShareSpec | LeaderboardShareSpec;

export const SHARE_PATH = "/s";
export const SHARE_IMAGE_PATH = "/api/share-image";

const RESULTS: GameResult[] = ["win", "lose", "draw"];

const NAME_LIMIT = 40;

function int(value: unknown, fallback = 0): number {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

export function shareCardParams(spec: ShareCardSpec): URLSearchParams {
  const params = new URLSearchParams();
  if (spec.kind === "result") {
    params.set("k", "r");
    params.set("r", spec.result);
    params.set("e", String(int(spec.elo)));
    params.set("d", String(int(spec.delta)));
    if (spec.opponentName) params.set("o", spec.opponentName.slice(0, NAME_LIMIT));
    if (spec.opponentElo != null) params.set("oe", String(int(spec.opponentElo)));
    return params;
  }
  params.set("k", "l");
  params.set("u", (spec.username || "Player").slice(0, NAME_LIMIT));
  params.set("e", String(int(spec.elo)));
  params.set("p", String(int(spec.rank)));
  if (spec.totalPlayers != null) params.set("t", String(int(spec.totalPlayers)));
  if (spec.avatarUrl) params.set("a", packAvatar(spec.avatarUrl));
  return params;
}

export function shareCardUrl(spec: ShareCardSpec, origin: string): string {
  return `${origin}${SHARE_PATH}?${shareCardParams(spec)}`;
}

export function shareCardImageUrl(spec: ShareCardSpec, origin: string): string {
  return `${origin}${SHARE_IMAGE_PATH}?${shareCardParams(spec)}`;
}

type Query = Record<string, string | string[] | undefined>;

function one(query: Query, key: string): string | undefined {
  const value = query[key];
  const single = Array.isArray(value) ? value[0] : value;
  return single === "" ? undefined : single;
}

function name(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, NAME_LIMIT) : undefined;
}

const BLOCKED_AVATAR_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|\[?::1)/i;

/** Every profile picture lives under this one prefix, and spelling it out in
 *  the share URL cost ~130 characters — url-encoded into the link, then
 *  encodeURIComponent'd again into `wa.me/?text=`, it ballooned a 60-character
 *  share link past 270. Store just the object key and rebuild the URL on the
 *  way out. Anything hosted elsewhere still round-trips in full. */
export const AVATAR_PREFIX = "https://aroundchess-news.s3.amazonaws.com/";

/** Same-origin URL for an avatar the browser needs to read pixels from (canvas).
 *  The bucket sends no CORS header, so a direct crossOrigin load is blocked —
 *  see app/api/avatar/route.ts. Anything hosted elsewhere is returned unchanged
 *  and keeps whatever CORS behaviour it already had. */
export function avatarForCanvas(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith(AVATAR_PREFIX)
    ? `/api/avatar?k=${encodeURIComponent(url.slice(AVATAR_PREFIX.length))}`
    : url;
}

function packAvatar(value: string): string {
  return value.startsWith(AVATAR_PREFIX) ? value.slice(AVATAR_PREFIX.length) : value;
}

function unpackAvatar(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `${AVATAR_PREFIX}${value}`;
}

function avatar(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(unpackAvatar(value));
    if (url.protocol !== "https:") return null;
    if (BLOCKED_AVATAR_HOST.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function parseShareCardSpec(query: Query): ShareCardSpec | null {
  const kind = one(query, "k");

  if (kind === "r") {
    const result = one(query, "r") as GameResult | undefined;
    return {
      kind: "result",
      result: result && RESULTS.includes(result) ? result : "win",
      elo: int(one(query, "e")),
      delta: int(one(query, "d")),
      opponentName: name(one(query, "o")),
      opponentElo: one(query, "oe") != null ? int(one(query, "oe")) : undefined,
    };
  }

  if (kind === "l") {
    return {
      kind: "leaderboard",
      username: name(one(query, "u")) ?? "Player",
      elo: int(one(query, "e")),
      rank: int(one(query, "p")),
      totalPlayers: one(query, "t") != null ? int(one(query, "t")) : null,
      avatarUrl: avatar(one(query, "a")),
    };
  }

  return null;
}

export function ordinalSuffix(n: number): string {
  return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
}

/**
 * Title, caption and file name for one shared card. `text` is used twice: as
 * the /s page's Open Graph description, and as the share caption itself (see
 * ShareImageSheet.shareTo) — so the wording a recipient reads on a social post
 * and the wording a link preview shows are the same sentence.
 */
export function shareCardMeta(spec: ShareCardSpec): {
  fileName: string;
  title: string;
  text: string;
} {
  if (spec.kind === "result") {
    const outcome =
      spec.result === "win" ? "won" : spec.result === "lose" ? "lost" : "drew";
    const against = spec.opponentName ? ` against ${spec.opponentName}` : "";
    return {
      fileName: `aroundchess-${spec.result}.png`,
      title: `I ${outcome} on AroundChess`,
      text: `I just ${outcome}${against} on AroundChess — my ELO is now ${Math.round(
        spec.elo
      )} (${formatEloDelta(spec.delta)}).`,
    };
  }
  return {
    fileName: "aroundchess-leaderboard.png",
    title: "My AroundChess leaderboard standing",
    // U+2019, not an ASCII apostrophe. The caption survives our code intact
    // (verified) but arrives at WhatsApp stripped down to just the URL, and a
    // bare ' two characters in is the classic thing a naive quote-parser
    // truncates on. Typographically correct anyway.
    text: `I\u2019m ${formatNumber(spec.rank)}${ordinalSuffix(
      spec.rank
    )} on the AroundChess leaderboard with an ELO of ${spec.elo}.`,
  };
}
