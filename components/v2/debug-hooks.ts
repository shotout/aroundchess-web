"use client";

/** Whether `__offline` / `__nps` exist. Vercel always builds production, so a
 *  deploy needs NEXT_PUBLIC_ENABLE_DEBUG_HOOKS set BEFORE the build. Never on
 *  Production: `__offline.on()` makes every fetch reject. */
export function areDebugHooksAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_DEBUG_HOOKS === "true" ||
    // The older offline-only flag, honoured where it is already set.
    process.env.NEXT_PUBLIC_ENABLE_OFFLINE_SIM === "true"
  );
}
