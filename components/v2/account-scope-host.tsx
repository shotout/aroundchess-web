"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/app/store/profile";
import { syncAccountScope } from "@/app/store/account-scope";

/**
 * Keeps the per-account caches bound to whoever is signed in (see
 * app/store/account-scope.ts).
 *
 * Mounted site-wide (app/layout.tsx), and above the pages that read those
 * caches, so the switch is noticed before anything renders the previous
 * account's data. Both ways in are covered: a fresh load, where the profile
 * store has already rehydrated by the time effects run, and a sign-in inside a
 * live tab, where setProfile fires this before the router reaches the play
 * page.
 */
export function AccountScopeHost() {
  const profile = useProfileStore((state) => state.profile);
  const sessionId = useProfileStore((state) => state.sessionId);

  useEffect(() => {
    syncAccountScope();
  }, [profile, sessionId]);

  return null;
}
