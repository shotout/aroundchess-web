import { VS_AI_CURRENT_GAME_KEY } from "@/app/store/playVSAI";

/**
 * Everything one account leaves behind on this browser, and how to get rid of
 * it.
 *
 * The signed-out state lives in localStorage, not in the session, so whatever
 * survives a sign-out belongs to the next account that signs in here. That is
 * how a brand-new account arrived on /play already carrying the previous
 * account's ELO, rank, day streak and Recent Games: the stores rehydrated from
 * keys nobody had cleared, and persisted data renders exactly as convincingly
 * as fresh data.
 *
 * This module holds no store imports on purpose — the stores import *it*, to
 * register their resets — so it can be called from anywhere, including the
 * stores' own dependents, without an import cycle.
 */

/**
 * Progress that exists *only* on this browser, so clearing it destroys it
 * rather than costing a refetch — but that still must not cross accounts.
 *
 * Kept by the sign-out teardown and dropped the moment a *different* account
 * signs in, which the account scope can tell apart because it outlives a
 * sign-out (see syncAccountScope in app/store/account-scope.ts).
 *
 * Note what is deliberately NOT in here: the onboarding tutorial. "Show it
 * once per user" is owned by the backend — MinimalTour POSTs
 * /v3/tutorial/chesscom and /no-chesscom on completion, and ChessAccountSetup
 * re-reads isChesscomTutorialComplete before ever starting it. `tutorial-
 * storage` is only a cache of that answer, so wiping it costs one request and
 * an account that has finished the tutorial is told so again. Keeping it is
 * the actual hazard: ChessAccountSetup returns early on the local flag and
 * never asks the backend, so a second account on this browser would inherit
 * "already completed" and never be shown the tutorial at all. The backend flag
 * is also the only version of this that survives a new device, a new browser
 * or cleared site data — which localStorage never could.
 */
const ACCOUNT_OWNED_KEYS = [
  /** Chess Fundamentals: sections ticked off, the derived percentage, and the
   *  sections the user pinned. Written by LearningProgressContext and
   *  PinnedSectionsContext, which have no API behind them at all — this
   *  browser is the only copy. */
  "chessFundamentalsProgress",
  "chessFundamentalsOverallProgress",
  "chessFundamentalsPinnedSections",
];

/**
 * The entries that survive a sign-out.
 *
 * Deliberately a keep-list rather than a delete-list. A delete-list only ever
 * covers the caches that existed on the day it was written, and every bug of
 * this shape so far has been a store nobody remembered to add to it — so the
 * default is now "goes", and anything that stays has to earn it here.
 */
const KEPT_LOCAL_KEYS = new Set([
  /** Cookie/GDPR consent. A browser-level legal choice, not account data, and
   *  dropping it re-prompts every user on every sign-out. */
  "modal-settings",
  /** Board and piece theme: a device preference. */
  "chess-theme-storage",
  /** Games finished offline that have not reached the backend yet. Real user
   *  data, and losing it on sign-out would lose the games themselves. Safe to
   *  keep because each entry is stamped with the account that played it and
   *  only ever replayed for that account — see app/store/pendingGameSaves.ts. */
  "aroundchess:pending-game-saves",
  /** Which account owns everything else here. Must outlive a sign-out or the
   *  next sign-in cannot tell "the same person came back" from "somebody else
   *  is using this browser" — which is the whole basis on which ACCOUNT_OWNED
   *  _KEYS below are kept or dropped. A one-way hash of a user id; nothing
   *  readable survives in it. */
  "ac_cache_scope",
  ...ACCOUNT_OWNED_KEYS,
]);

/**
 * Cookies left alone: the analytics and marketing IDs.
 *
 * Not account data — no part of the app reads them — and clearing them breaks
 * attribution for a returning visitor without protecting anybody's privacy,
 * since consent already governs whether they exist at all.
 */
const KEPT_COOKIE_PREFIXES = ["_ga", "_gid", "_gcl", "_fbp", "_fbc"];

/**
 * The per-account *display* caches: the ones that put somebody's games,
 * rating, rank, streak or half-finished board on screen.
 *
 * The narrow list, for when all that is known is that the caches are suspect —
 * a sign-out is a much bigger event and takes everything.
 */
const ACCOUNT_CACHE_KEYS = [
  "play-page-storage",
  "day-streak-storage",
  "play-vs-ai-stats-storage",
  VS_AI_CURRENT_GAME_KEY,
  /** Games this browser has watched the account finish, which is half of what
   *  decides whether the NPS layover may appear. Inheriting it would ask a
   *  brand-new account on its first game. Spelled out rather than imported so
   *  this module keeps its no-imports rule (see the header). */
  "ac_nps_finished_games",
];

type Reset = () => void;

const resetters = new Set<Reset>();

/**
 * Register a store's "forget this account" reset.
 *
 * Removing a storage key does not touch a store that has already hydrated from
 * it, and a sign-out can be a client-side route change rather than a reload —
 * so without this the stale values stay on screen, and the first set() after
 * the next sign-in writes them straight back out to the key just deleted.
 *
 * A store that was never imported registers nothing, which is correct: it has
 * no in-memory state to be stale, and its storage key is cleared regardless.
 */
export function registerAccountScopedStore(reset: Reset): void {
  resetters.add(reset);
}

function runResetters(): void {
  resetters.forEach((reset) => {
    try {
      reset();
    } catch {
      // One store's reset must not stop the others.
    }
  });
}

function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Private mode / blocked storage. The in-memory resets still run, which is
    // what the user actually sees.
  }
}

/**
 * Expire every cookie this origin can see, bar the analytics IDs.
 *
 * Each name is expired against the paths and domains it might have been set
 * on: a cookie written for `.aroundchess.com` is untouched by a delete scoped
 * to the exact host, and there is no way to ask which one it was.
 *
 * httpOnly cookies are invisible here and cannot be removed by script at all —
 * only the server that set one can clear it. None of the app's own cookies are
 * httpOnly today (middleware.ts reads `token`, which is written from the
 * client), so this covers them.
 */
function clearCookies(): void {
  let raw: string;
  try {
    raw = document.cookie;
  } catch {
    return;
  }
  if (!raw) return;

  const host = window.location.hostname;
  const labels = host.split(".");
  const domains: (string | null)[] = [null, host, `.${host}`];
  if (labels.length > 2) domains.push(`.${labels.slice(-2).join(".")}`);

  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

  for (const pair of raw.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (!name) continue;
    if (KEPT_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;

    for (const domain of domains) {
      document.cookie = `${name}=; ${expired}; path=/${
        domain ? `; domain=${domain}` : ""
      }`;
    }
  }
}

/**
 * Drop the per-account display caches, leaving preferences and the rest of the
 * browser alone.
 *
 * For the case where the account has changed but nobody signed out — a session
 * that expired, a sign-in in another tab — where the point is that this data
 * belongs to somebody else, not that the browser should be wiped.
 */
export function clearAccountCaches(): void {
  if (typeof window === "undefined") return;

  ACCOUNT_CACHE_KEYS.forEach(removeKey);
  runResetters();
}

/**
 * Everything the previous account owned locally: the display caches, plus the
 * "already done this" state a sign-out deliberately keeps.
 *
 * Only for a *confirmed* switch — a different account is signed in now than
 * was last time. Anything less certain must use clearAccountCaches, which
 * costs a refetch; this one costs somebody their tutorial progress if it fires
 * on the wrong account.
 */
export function clearPreviousAccountData(): void {
  if (typeof window === "undefined") return;

  ACCOUNT_CACHE_KEYS.forEach(removeKey);
  ACCOUNT_OWNED_KEYS.forEach(removeKey);
  runResetters();
}

/**
 * The sign-out teardown: everything this account left on the browser.
 *
 * All of localStorage bar KEPT_LOCAL_KEYS, all of sessionStorage, and the
 * cookies. Called on sign-out, on account deletion, and on a session the
 * backend has retired.
 *
 * Not called when a switch is merely detected after the fact: by then the new
 * account is already signed in, and this would take its own credentials with
 * everything else. That case uses clearPreviousAccountData.
 */
export function clearAccountLocalState(): void {
  if (typeof window === "undefined") return;

  try {
    // Object.keys snapshots, so removing as we go cannot skip an entry the way
    // indexing through localStorage.key(i) would.
    for (const key of Object.keys(localStorage)) {
      if (!KEPT_LOCAL_KEYS.has(key)) removeKey(key);
    }
  } catch {
    // Blocked storage: fall through, there is nothing to clear.
  }

  try {
    sessionStorage.clear();
  } catch {
    // Same.
  }

  clearCookies();
  runResetters();
}
