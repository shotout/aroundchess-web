"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { ChesscomPromoModal } from "@/components/v2/chesscom-promo-modal";
import { useChesscomConnect } from "@/components/v2/hooks/useChesscomConnect";
import { useDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";
import { usePlaygroundTourActive } from "@/components/v2/playground-tour-active";
import { useProfileStore } from "@/app/store/profile";
import { getLocalDateStamp } from "@/app/store/streak";
import { useApiClient } from "@/functions/api-client";

/** Lifetime cap on how many times a user is shown the promo. */
const MAX_SHOWS = 5;

/** Let the page settle (and the day-streak modal claim the screen if it is
 *  going to) before spending a request on the eligibility check. */
const SHOW_DELAY_MS = 1200;

/** The cookie bar is `fixed bottom-0 z-[2000]`, so while it is up it covers the
 *  promo's CTA outright on a narrow screen. It has no store to subscribe to —
 *  CookieConsent keeps its own local state off this key — so read the key and
 *  hold the promo back until it is answered. Accepting reloads the page
 *  (see acceptCookies), which re-runs this gate. */
const isCookieBarUp = () => {
  try {
    return !localStorage.getItem("cookiesConsent");
  } catch {
    return false;
  }
};

/**
 * Why the promo is or isn't due, from one profile payload. Returns null when it
 * IS due, otherwise the gate that blocked it:
 *
 *  - the account is not linked to Chess.com   (isChessComConnected)
 *  - seen fewer than MAX_SHOWS times          (chesscomBannerShownCount)
 *  - not already seen today                   (chesscomBannerLastShownAt)
 *
 * The stored timestamp is UTC; it is compared on the user's own calendar day so
 * "the first time on that date" means what they'd expect it to mean.
 *
 * Kept pure so the same rule applies to the cached profile and to a fresh
 * /profile response — and returning the reason rather than a boolean is what
 * lets ?chesscomPromo=why name the blocker instead of saying "nothing happened".
 *
 * `ignoreDate` is for ?chesscomPromo=live only: it drops the once-per-day gate
 * so the count can be walked 1 → 5 in a single sitting.
 */
const promoBlockedBy = (
  profile: any,
  { ignoreDate = false }: { ignoreDate?: boolean } = {}
): string | null => {
  if (!profile) return "no profile";

  const connected =
    (profile.isChessComConnected ?? profile.is_chesscom_connected) === true;
  if (connected) return "chess.com account already connected";

  const count = Number(profile.chesscomBannerShownCount ?? 0);
  if (count >= MAX_SHOWS) return `shown ${count}/${MAX_SHOWS} times already`;

  const lastShownAt = profile.chesscomBannerLastShownAt;
  if (
    !ignoreDate &&
    lastShownAt &&
    getLocalDateStamp(new Date(lastShownAt)) === getLocalDateStamp()
  ) {
    return `already shown today (${lastShownAt})`;
  }

  return null;
};

/** The profile object is persisted, so it can be `{}` on a first login until
 *  useProfileFetch lands. promoBlockedBy reads absent fields as "due", so wait
 *  for a payload with an identity on it before letting it decide anything. */
const isProfileLoaded = (profile: any) =>
  Boolean(profile?.email || profile?.username || profile?.id);

/** QA hooks, via `?chesscomPromo=` on any page — the host lives in the root
 *  layout, so any URL works. See "Testing it" on the component. */
type PromoDebugMode = "preview" | "live" | "why" | null;

const readDebugMode = (): PromoDebugMode => {
  const value = new URLSearchParams(window.location.search).get(
    "chesscomPromo"
  );
  if (value === "1" || value === "preview") return "preview";
  if (value === "live") return "live";
  if (value === "why") return "why";
  return null;
};

/**
 * Decides when to show the Chess.com connect promo, and records each showing.
 *
 * The count and the last-shown date are always taken from a FRESH /profile
 * read before the modal opens — never from the persisted store alone. The
 * cached profile is used only as a cheap negative filter, which is sound
 * because all three fields in promoBlockedBy are monotonic: the count only
 * rises, the timestamp only moves forward, and an account only ever goes
 * unconnected → connected. So a cached "not due" can be trusted outright,
 * while a cached "due" is just a maybe, and has to be confirmed against the
 * server before one of the five showings is spent.
 *
 * The promo also waits for whatever else may own the screen (the playground
 * tour, the day-streak modal, the cookie-consent bar).
 *
 * Dismissing it PATCHes `{ chesscomBannerShown: true }`; the backend owns the
 * increment and the timestamp, so the count can't drift between devices.
 *
 * ## Testing it
 *
 * Append one of these to any page URL:
 *
 *   ?chesscomPromo=1      Design preview. Opens regardless of every gate and
 *                         never PATCHes, so it cannot burn one of the five.
 *   ?chesscomPromo=live   End-to-end run. Every real gate applies EXCEPT the
 *                         once-per-day check, and dismissing DOES PATCH — so
 *                         reload repeatedly to walk the count 1 → 5 and watch
 *                         the cap engage on the 6th.
 *   ?chesscomPromo=why    Explains itself and shows nothing. Logs the cached
 *                         gate values, the fresh /profile values and which gate
 *                         blocked, under "[chesscomPromo]".
 */
export function ChesscomPromoModalHost() {
  const { profile, setProfile, sessionId, hydrated } = useProfileStore();
  const { updateProfile, profile: fetchProfile } = useApiClient();
  const tourActive = usePlaygroundTourActive();
  const dayStreakRequest = useDayStreakModal((s) => s.request);

  const [visible, setVisible] = useState(false);
  /** True only for ?chesscomPromo=1 — suppresses the PATCH. */
  const [isPreview, setIsPreview] = useState(false);

  /** This host owns the app's single ChessAccountSetup, mounted only while a
   *  connect request is open — its profile check toasts "Verifying
   *  username...", which has no business firing on every page just because the
   *  host is mounted. The promo CTA and PlayChesscomBanner both request it
   *  through useChesscomConnect. */
  const connectRequested = useChesscomConnect((s) => s.requested);
  const requestConnect = useChesscomConnect((s) => s.open);
  const closeConnect = useChesscomConnect((s) => s.close);

  /** One showing per page load, and one PATCH per showing. */
  const shownRef = useRef(false);
  const patchedRef = useRef(false);
  /** Count from the server read that authorised this showing, so the
   *  optimistic bump below writes the right next number. */
  const confirmedCountRef = useRef<number | null>(null);

  /** Cheap negative filter, as a reason rather than a boolean so the `why`
   *  hook can report it — see the note on the component. */
  const cachedBlocker: string | null = !hydrated
    ? "store not hydrated yet"
    : !sessionId
      ? "not signed in"
      : !isProfileLoaded(profile)
        ? "profile not loaded yet"
        : promoBlockedBy(profile);

  /** Something else is claiming the screen and the promo should wait. Read
   *  imperatively so it can be re-checked after the delay, not just at the
   *  moment the effect was set up. */
  const screenIsBusy = useCallback(
    () =>
      tourActive ||
      Boolean(useDayStreakModal.getState().request) ||
      isCookieBarUp(),
    [tourActive]
  );

  useEffect(() => {
    if (typeof window === "undefined" || shownRef.current) return;

    const mode = readDebugMode();
    const ignoreDate = mode === "live";

    // ?chesscomPromo=live re-runs the cached filter with the date gate dropped,
    // so a profile blocked only by "already shown today" still gets through.
    const blocker =
      ignoreDate && hydrated && sessionId && isProfileLoaded(profile)
        ? promoBlockedBy(profile, { ignoreDate })
        : cachedBlocker;

    if (mode !== "preview" && mode !== "why" && (blocker || screenIsBusy())) {
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      if (mode === "preview") {
        shownRef.current = true;
        setIsPreview(true);
        setVisible(true);
        return;
      }

      // Re-check: the tour or the streak modal may have claimed the screen
      // during the delay.
      const busy = screenIsBusy();
      if (mode !== "why" && busy) return;

      // Confirm against the server. The cached profile got us this far, but it
      // may be a localStorage snapshot from a previous session (or from another
      // device), in which case the count is too low or the date too old.
      const response: any = await fetchProfile().catch(() => null);
      if (cancelled) return;

      const fresh = response?.data ?? response;
      const freshBlocker =
        !fresh || typeof fresh !== "object"
          ? "/profile read failed"
          : promoBlockedBy(fresh, { ignoreDate });

      if (mode === "why") {
        console.log("[chesscomPromo] diagnostic", {
          wouldShow: !freshBlocker && !busy,
          blockedBy:
            freshBlocker ?? (busy ? "another modal owns the screen" : null),
          cachedBlocker: blocker,
          screenBusy: busy,
          cached: {
            count: profile?.chesscomBannerShownCount,
            lastShownAt: profile?.chesscomBannerLastShownAt,
            connected: profile?.isChessComConnected,
          },
          server: fresh
            ? {
                count: fresh.chesscomBannerShownCount,
                lastShownAt: fresh.chesscomBannerLastShownAt,
                connected: fresh.isChessComConnected,
              }
            : null,
          today: getLocalDateStamp(),
          maxShows: MAX_SHOWS,
        });
        return;
      }

      if (freshBlocker) return;

      confirmedCountRef.current = Number(fresh.chesscomBannerShownCount ?? 0);
      shownRef.current = true;
      setVisible(true);
    }, SHOW_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    cachedBlocker,
    hydrated,
    profile,
    sessionId,
    tourActive,
    dayStreakRequest,
    fetchProfile,
    screenIsBusy,
  ]);

  /** Records the showing. Optimistic locally so a slow PATCH or a stale
   *  /profile read can't pop the promo again in the same session. */
  const recordShown = useCallback(() => {
    if (isPreview || patchedRef.current) return;
    patchedRef.current = true;

    const from =
      confirmedCountRef.current ??
      Number(profile?.chesscomBannerShownCount ?? 0);

    setProfile({
      ...profile,
      chesscomBannerShownCount: from + 1,
      chesscomBannerLastShownAt: new Date().toISOString(),
    });

    updateProfile({ chesscomBannerShown: true })?.catch(() => {});
  }, [isPreview, profile, setProfile, updateProfile]);

  const handleClose = useCallback(() => {
    setVisible(false);
    recordShown();
  }, [recordShown]);

  const handleConnect = useCallback(() => {
    setVisible(false);
    recordShown();
    requestConnect();
  }, [recordShown, requestConnect]);

  return (
    <>
      {visible && (
        <ChesscomPromoModal onClose={handleClose} onConnect={handleConnect} />
      )}
      {connectRequested && (
        <ChessAccountSetup
          autoOpen={false}
          open
          setOpen={(next) => {
            if (!next) closeConnect();
          }}
        />
      )}
    </>
  );
}

export default ChesscomPromoModalHost;
