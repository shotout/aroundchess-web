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
  if (spec.avatarUrl) params.set("a", spec.avatarUrl);
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

function avatar(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
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
 * Caption for a share, matching the mobile app verbatim — the RN build passes
 * `useShareImage('My game on AroundChess')` on the play screen and
 * `useShareImage('My rank on the AroundChess leaderboard')` on the leaderboard,
 * so a share from the web now reads exactly like one from the app.
 *
 * Deliberately shorter than `shareCardMeta().text`, which stays rich because it
 * is the /s page's OG description, not a share caption.
 */
export function shareMessage(spec: ShareCardSpec): string {
  return spec.kind === "result"
    ? "My game on AroundChess"
    : "My rank on the AroundChess leaderboard";
}

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
    text: `I'm ${formatNumber(spec.rank)}${ordinalSuffix(
      spec.rank
    )} on the AroundChess leaderboard with an ELO of ${spec.elo}.`,
  };
}
