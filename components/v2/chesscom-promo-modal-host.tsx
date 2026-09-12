"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
 *  promo's CTA outright on a narrow screen — hold the promo back until it is
 *  answered. Accepting reloads the page (see acceptCookies), re-running this.
 *
 *  Detected by its element, NOT by the `cookiesConsent` key. CookieConsent is
 *  rendered by the site footer, and the dashboard has no footer: on the one page
 *  the promo is allowed to open, that key is never set and never can be, so
 *  reading it held the promo back permanently. */
const isCookieBarUp = () => {
  try {
    return Boolean(document.querySelector("[data-cookie-consent-bar]"));
  } catch {
    return false;
  }
};

/** Modal-tier z-index. Page chrome sits at z-50/60 and the promo's own connect
 *  dialog at z-70, so this clears them while catching the real overlays:
 *  AnalyzeGameFreePopup z-460, DayStreakModal z-500, the playground tour z-700. */
const OVERLAY_MIN_Z = 100;

/**
 * Is another modal already holding the screen?
 *
 * The promo lives in the root layout, so it cannot see page-local state — the
 * play page keeps AnalyzeGameFreePopup's visibility in its own useState and
 * passes it down as `suppressed` to the tour and the streak trigger. The promo
 * had no such wire, which is how it ended up stacked on top of that popup.
 *
 * The promo's own overlay carries `data-chesscom-promo` and is skipped, so this
 * can also be used to spot a rival arriving while the promo is already up —
 * without the promo detecting itself.
 *
 * Rather than enumerate every overlay and miss the next one, look for the shape
 * they all share: a visible, near-full-viewport element at modal z. Both
 * `fixed` AND `absolute` count — AnalyzeGameFreePopup is `absolute inset-0
 * z-[460]` inside the play page's relative wrapper, and checking only `fixed`
 * is precisely why it slipped through the first version of this guard. The
 * size test is the real discriminator: the cookie bar is fixed and z-2000 but
 * only a strip, so it is skipped here and has its own gate below.
 */
export const anotherModalIsOpen = (): boolean => {
  try {
    // Array.from, not for..of over the NodeList: this tsconfig targets below
    // es2015 and NodeList iteration needs downlevelIteration.
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("div,section,aside")
    );
    for (const el of els) {
      // Not the promo's own overlay, or it would see itself as the intruder.
      if (el.closest?.("[data-chesscom-promo]")) continue;
      const style = getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "absolute") continue;
      if (style.visibility === "hidden" || style.display === "none") continue;
      const z = Number.parseInt(style.zIndex, 10);
      if (!Number.isFinite(z) || z < OVERLAY_MIN_Z) continue;
      const rect = el.getBoundingClientRect();
      if (
        rect.width >= window.innerWidth * 0.9 &&
        rect.height >= window.innerHeight * 0.9
      ) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

/** The promo opens on the dashboard only — the screen a returning player lands
 *  on, and where connecting an account actually leads somewhere. `/play` is a
 *  re-export of the playground page, so both paths are the same screen. The
 *  marketing homepage at `/` is deliberately not on this list. */
const DASHBOARD_PATHS = ["/play", "/playground/play-vs-ai"];

const isDashboard = (pathname: string | null): boolean => {
  if (!pathname) return false;
  const clean = pathname.replace(/\/+$/, "") || "/";
  return DASHBOARD_PATHS.includes(clean);
};

const FIRST_VISIT_KEY = "ac_chesscom_promo_first_visit";
const VISIT_KEY = "ac_visit_id";

/** This visit's id, minted on first call and stable for the rest of it.
 *  sessionStorage is the right granularity: it survives client-side navigation
 *  and a reload, but not closing the site and coming back. */
const currentVisitId = (): string | null => {
  try {
    let visit = sessionStorage.getItem(VISIT_KEY);
    if (!visit) {
      visit = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(VISIT_KEY, visit);
    }
    return visit;
  } catch {
    return null;
  }
};

/**
 * Records that a signed-in visit has happened, so a later one can tell it isn't
 * the first.
 *
 * Called as soon as the user is known to be signed in — deliberately NOT from
 * inside the gate. Claiming it there was a bug: a first visit spent on the
 * tour, the cookie bar or the free-analysis popup returned early before ever
 * claiming, so the SECOND visit became "the first" and the promo slipped one
 * visit further back every time something else owned the screen.
 */
const claimFirstVisit = (): void => {
  try {
    const visit = currentVisitId();
    if (visit && !localStorage.getItem(FIRST_VISIT_KEY)) {
      localStorage.setItem(FIRST_VISIT_KEY, visit);
    }
  } catch {
    // Storage blocked — isFirstVisit() then reads "not the first visit", which
    // is the right way to fail: show the promo rather than hide it forever.
  }
};

/**
 * True while this is the browser's first signed-in visit.
 *
 * A freshly registered player already has the onboarding, the tour and the
 * free-analysis popup to take in, so the promo waits until they come back
 * rather than piling on.
 *
 * A pure read — claimFirstVisit() does the writing.
 */
const isFirstVisit = (): boolean => {
  try {
    const first = localStorage.getItem(FIRST_VISIT_KEY);
    // Nothing claimed yet means claimFirstVisit() hasn't run (not signed in, or
    // storage blocked) — don't hold the promo back on a guess.
    if (!first) return false;
    return first === currentVisitId();
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
 * It opens on the dashboard only (see DASHBOARD_PATHS), and never on a new
 * player's first visit — they come back to it.
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
 *                         Works on any page.
 *   ?chesscomPromo=live   End-to-end run on the dashboard. Every real gate
 *                         applies EXCEPT the once-per-day check, and dismissing
 *                         DOES PATCH — so reload repeatedly to walk the count
 *                         1 → 5 and watch the cap engage on the 6th.
 *   ?chesscomPromo=why    Explains itself and shows nothing. Logs the cached
 *                         gate values, the fresh /profile values and which gate
 *                         blocked, under "[chesscomPromo]".
 */
export function ChesscomPromoModalHost() {
  const pathname = usePathname();
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
  const onDashboard = isDashboard(pathname);

  const cachedBlocker: string | null = !onDashboard
    ? `not on the dashboard (${pathname})`
    : !hydrated
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
      isCookieBarUp() ||
      anotherModalIsOpen(),
    [tourActive]
  );

  /** Mark this visit as soon as the user is known to be signed in, whatever
   *  else is on screen and whatever page they are on — see claimFirstVisit(). */
  useEffect(() => {
    if (hydrated && sessionId && isProfileLoaded(profile)) claimFirstVisit();
  }, [hydrated, sessionId, profile]);

  useEffect(() => {
    if (typeof window === "undefined" || shownRef.current) return;

    const mode = readDebugMode();
    const ignoreDate = mode === "live";

    // ?chesscomPromo=live re-runs the cached filter with the date gate dropped,
    // so a profile blocked only by "already shown today" still gets through.
    const blocker =
      ignoreDate && onDashboard && hydrated && sessionId && isProfileLoaded(profile)
        ? promoBlockedBy(profile, { ignoreDate })
        : cachedBlocker;

    if (mode !== "preview" && mode !== "why" && (blocker || screenIsBusy())) {
      return;
    }
    // Not on a new player's first visit — but the QA hooks still force it.
    if (!mode && !blocker && isFirstVisit()) return;

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
          onDashboard,
          pathname,
          screenBusy: busy,
          cookieBarUp: isCookieBarUp(),
          anotherModalOpen: anotherModalIsOpen(),
          firstVisit: isFirstVisit(),
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

      // Last-moment re-check. The /profile round trip above takes as long as
      // the network takes, and the analyze popup and the streak modal both open
      // from mount effects — so the reading taken before the await can be stale
      // by the time we get here, which is how the promo ended up drawn on top
      // of AnalyzeGameFreePopup.
      if (screenIsBusy()) return;

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
    onDashboard,
    pathname,
    hydrated,
    profile,
    sessionId,
    tourActive,
    dayStreakRequest,
    fetchProfile,
    screenIsBusy,
  ]);

  /**
   * While the promo is up, step aside for anything that claims the screen after
   * it opened.
   *
   * Every pre-show check happens before a /profile round trip, and the
   * day-streak modal opens off its own /streaks/status fetch — so a rival can
   * arrive after the promo is already committed. They share z-[500], so nothing
   * in the stacking order would separate them; the result is the two drawn on
   * top of each other.
   *
   * Yielding deliberately does NOT record the showing, so the promo is still
   * due next time rather than silently spending one of its five.
   */
  useEffect(() => {
    if (!visible) return;

    const yieldIfCrowded = () => {
      if (anotherModalIsOpen()) setVisible(false);
    };

    yieldIfCrowded();
    const observer = new MutationObserver(yieldIfCrowded);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden"],
    });
    return () => observer.disconnect();
  }, [visible]);

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
