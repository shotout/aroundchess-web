import { useProfileStore } from "@/app/store/profile";
import {
  clearAccountCaches,
  clearPreviousAccountData,
} from "@/functions/clear-account-storage";

/**
 * Which account the browser's cached data belongs to.
 *
 * Several stores persist an account's data to localStorage so the page has
 * something to show before its fetch lands — and, since offline mode, so it
 * has something to show when the fetch never lands at all. localStorage is per
 * browser, not per account, and no logout path clears these, so a second
 * account signing in on the same machine read the first one's Recent Games,
 * ELO, rank and day streak. Persisted data is exactly as convincing as fresh
 * data, so there was nothing to tell the user they were looking at somebody
 * else's games.
 *
 * The scope is written next to the caches and checked whenever the signed-in
 * account changes. A mismatch empties them rather than serving them on.
 */

/** localStorage key holding the account the caches currently belong to. */
const SCOPE_KEY = "ac_cache_scope";

/** Non-reversible, so no email or bearer token ends up in a localStorage key.
 *  Same djb2 the training-plan cache hashes its scope with. */
function hashScope(raw: string): string {
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash + raw.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

/**
 * Which account is signed in, or null when nobody is and when that cannot be
 * answered yet.
 *
 * Signed out deliberately reads the same as unknown rather than as an "anon"
 * account of its own. Signing out is not a change of account — it is the
 * absence of one — and treating it as a change would fire the teardown on the
 * way to /login, throwing away the tutorial and course progress of the very
 * person who is about to sign back in.
 *
 * Deliberately never derived from the access token either. A token is rotated
 * on every refresh while the account stays the same, so a scope built from it
 * would "change accounts" mid-session and throw away data the page had just
 * fetched.
 */
export function accountScopeOf(profile: any): string | null {
  const identity =
    profile?.id ??
    profile?.userId ??
    profile?.user_id ??
    profile?.email ??
    profile?.username;

  if (identity) return hashScope(String(identity));

  // Signed out, or signed in with the profile call still in flight. Either
  // way there is no account to bind to, and guessing one now only to correct
  // it a moment later would clear whatever was fetched in between.
  return null;
}

/** accountScopeOf against the live store, for callers outside a subscription
 *  — event handlers and the stores themselves. Components should subscribe and
 *  pass their own values, so a change re-renders them. */
export function currentAccountScope(): string | null {
  return accountScopeOf(useProfileStore.getState().profile);
}

/**
 * Bind the caches to whoever is signed in, emptying them if that has changed.
 *
 * Safe to call on every render pass of the host below — it compares first and
 * does nothing in the overwhelmingly common case where the account is the same
 * one as last time.
 */
export function syncAccountScope(): void {
  if (typeof window === "undefined") return;

  const scope = currentAccountScope();
  if (!scope) return;

  let stored: string | null;
  try {
    stored = localStorage.getItem(SCOPE_KEY);
  } catch {
    return;
  }
  if (stored === scope) return;

  // Never the sign-out teardown, whichever branch runs. This fires *after* the
  // new account is signed in, so wiping localStorage wholesale here would take
  // Profile-storage — and with it the access and refresh tokens of the session
  // that just started — logging the user straight back out.
  if (stored === null) {
    // Nothing has ever been scoped in this browser: a fresh profile, or the
    // first load after this shipped. Not evidence of a switch, so only the
    // display caches go — a refetch, and nobody's progress.
    clearAccountCaches();
  } else {
    // A different account than last time, and no sign-out ran in between (an
    // expired session, another tab, a closed laptop). Everything the previous
    // account owned here goes, the tutorial and course progress included:
    // inheriting "already completed" is how a new user never sees the
    // onboarding at all.
    clearPreviousAccountData();
  }

  try {
    localStorage.setItem(SCOPE_KEY, scope);
  } catch {
    // Nothing persisted this session, so nothing to scope. The next load
    // starts from an empty cache, which is the safe side to fail to.
  }
}
