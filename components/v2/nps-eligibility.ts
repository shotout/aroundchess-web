"use client";

import { registerAccountScopedStore } from "@/functions/clear-account-storage";

/** What this browser knows about the player's finished VS-AI games, which is
 *  the half of the NPS decision the backend cannot make for us.
 *
 *  Two separate things live here, and the layover needs both:
 *
 *  - the COUNT of real games finished on this browser, persisted, because
 *    reaching three is the bar for ever being asked;
 *  - whether one of those games ended in THIS session, which is what makes now
 *    a sensible moment to ask rather than a cold page load.
 *
 *  Without the second, a cold load was enough to put the layover up, which is
 *  how it landed in front of a player who had not played anything yet.
 *
 *  The count is account-owned: it is cleared with the rest of an account's
 *  local state on sign-out, and dropped when a different account turns up on
 *  this browser (see functions/clear-account-storage.ts). Inheriting somebody
 *  else's three games would ask a brand-new account on its first game. */

/** Finished games required before the layover may be shown at all. Matches the
 *  backend's own rule; both have to agree before anything appears. */
export const NPS_MIN_FINISHED_GAMES = 3;

/** Account-scoped, so it is in ACCOUNT_CACHE_KEYS in clear-account-storage. */
export const NPS_FINISHED_GAMES_KEY = "ac_nps_finished_games";

const SESSION_KEY = "nps-finished-vs-ai-game";

let countInMemory: number | null = null;
let finishedThisSession = false;

function readStoredCount(): number {
  try {
    const raw = localStorage.getItem(NPS_FINISHED_GAMES_KEY);
    const parsed = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    // Private mode / blocked storage.
    return 0;
  }
}

/** Called at the end of a real (non-tutorial) VS-AI game. */
export function markVsAiGameFinished(): void {
  finishedThisSession = true;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // The in-memory flag still covers the client-side navigation that follows
    // the game, which is the case that matters.
  }

  const next = (countInMemory ?? readStoredCount()) + 1;
  countInMemory = next;
  try {
    localStorage.setItem(NPS_FINISHED_GAMES_KEY, String(next));
  } catch {
    // Same: the session's own games still count, the tally just cannot outlive
    // the tab. Erring towards not asking is the safe direction here.
  }
}

/** Real games this browser has seen finished for the signed-in account. */
export function getFinishedVsAiGameCount(): number {
  if (countInMemory === null) countInMemory = readStoredCount();
  return countInMemory;
}

export function hasFinishedVsAiGameThisSession(): boolean {
  if (finishedThisSession) return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/** On sign-out: the next account has played nothing here. */
export function clearVsAiGameFinished(): void {
  finishedThisSession = false;
  countInMemory = 0;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear if it could never be written.
  }
  try {
    localStorage.removeItem(NPS_FINISHED_GAMES_KEY);
  } catch {
    // Same.
  }
}

// A different account on this browser, with or without a sign-out: the stored
// key is removed for us, but the in-memory mirror would otherwise carry the
// previous account's tally into this one.
registerAccountScopedStore(() => {
  countInMemory = 0;
  finishedThisSession = false;
});
