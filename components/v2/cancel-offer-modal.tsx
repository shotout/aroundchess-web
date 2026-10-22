"use client";

import { useProfileStore } from "@/app/store/profile";
import { useOfflineGate } from "@/app/store/offlineGate";
import DotSpinner from "@/components/game-history/Spinner";
import { useDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";
import { isBlockedRoute } from "@/components/v2/nps-feedback-host";
import { isPlaygroundTourPending } from "@/components/v2/playground-tour-gate";
import {
  CANCEL_OFFER_PENDING_COOKIE,
  CANCEL_OFFER_PENDING_MAX_AGE_S,
  CANCEL_OFFER_QUERY_PARAM,
} from "@/constants/cancelOffer";
import { useCancellationOffer } from "@/hooks/useCancellationOffer";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CancelOfferModalProps {
  /** What the pass costs. */
  price: number;
  /** The same months at the full monthly price, struck through. */
  fullPrice: number;
  months: number;
  analyses: number;
  onClose: () => void;
  onGetOffer: () => void;
  isLoading: boolean;
  /** Another dialog took the screen: stay mounted but hidden until it's gone. */
  suspended?: boolean;
}

/** "Enjoy up to 66% off — Resubscribe now": the cancellation-offer pass. */
export function CancelOfferModal({
  price,
  fullPrice,
  months,
  analyses,
  onClose,
  onGetOffer,
  isLoading,
  suspended = false,
}: CancelOfferModalProps) {
  // The page behind can't scroll while the banner is up. Tied to mount only:
  // suspending hides the banner rather than unmounting it, so this lock is
  // released after the dialog that covered it has released its own, the order
  // those save/restore pairs need.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Esc closes — unless it's hidden, then the Esc belongs to the dialog on screen.
  useEffect(() => {
    if (suspended) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, suspended]);

  return (
    /* z-[500] matches the other v2 overlays — clears the z-50 header/sidebar.
       The overlay scrolls, not the card, so on a short phone screen the card
       grows past the fold and its background still covers all of it.
       While hidden it drops its dialog role, so the hosts that wait for a
       clear screen (NPS) and MinimalTour's sidebar probe don't mistake it for
       an open dialog. */
    <div
      data-cancel-offer
      className={`fixed inset-0 z-[500] overflow-y-auto bg-black/50 ${
        suspended ? "hidden" : ""
      }`}
      onClick={onClose}
      role={suspended ? undefined : "dialog"}
      aria-modal={suspended ? undefined : true}
      aria-labelledby={suspended ? undefined : "cancel-offer-title"}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Portrait on phones, landscape from md: there the card takes the
            art's own 1234x918 ratio, so the background lands uncropped and the
            content is centred in it. aspect-ratio only sets a minimum here —
            taller content would grow the card rather than be clipped. */}
        <div
          className="relative w-full max-w-[361px] overflow-hidden rounded-[20px] bg-[#2323EA] shadow-[0_18px_50px_rgba(16,34,153,.4)] sm:max-w-[420px] sm:rounded-[24px] md:flex md:max-w-[617px] md:aspect-[1234/918] md:flex-col md:justify-center md:rounded-[20px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* On the portrait card cover fits the height and trims the sides —
              the glow stays centred and the teal ledge along the bottom edge
              survives. bg-[#2323EA] is the art's edge tone, so nothing flashes
              before it decodes. */}
          <Image
            src="/images/v2/cancelation/background.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 617px, (min-width: 640px) 420px, 361px"
            className="pointer-events-none select-none object-cover"
            draggable={false}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-[12px] top-[12px] z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:right-[16px] sm:top-[16px] md:right-[10px] md:top-[10px] md:h-[36px] md:w-[36px]"
          >
            <svg
              className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] md:h-[22px] md:w-[22px]"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M3 3l14 14M17 3L3 17"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="relative flex flex-col items-center px-[30px] pb-[24px] pt-[40px] sm:px-[32px] sm:pb-[28px] sm:pt-[48px] md:px-[48px] md:py-[24px]">
            <h2 id="cancel-offer-title" className="sr-only">
              Enjoy up to 66% off — resubscribe now
            </h2>
            {/* The trimmed art (no transparent margin) under its own name:
                next.config caches optimized images by URL for 30 days. */}
            <Image
              src="/images/v2/cancelation/resubscribe-66.png"
              alt=""
              aria-hidden
              width={450}
              height={274}
              priority
              draggable={false}
              className="h-auto w-[90%] select-none md:w-[60%]"
            />

            <p className="mt-[24px] flex flex-wrap items-baseline justify-center gap-x-[8px] text-white md:mt-[18px]">
              <span className="relative text-[15px] text-white/60 sm:text-[17px]">
                ${fullPrice.toFixed(2)}
                {/* Same rotated red bar the plan cards use for a struck price. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[-2px] right-[-2px] top-1/2 h-[2px] -translate-y-1/2 -rotate-12 rounded-full bg-red-500"
                />
              </span>
              <span className="text-[28px] font-bold leading-none sm:text-[32px]">
                ${price.toFixed(2)}
              </span>
              <span className="text-[16px] sm:text-[18px]">
                /{months === 1 ? "month" : `${months} months`}
              </span>
            </p>
            {/* Phones: the count on its own line. md: one line. */}
            <p className="mt-[6px] text-center text-[15px] leading-[140%] text-white sm:text-[16px]">
              <span className="block font-bold md:inline">
                {analyses.toLocaleString("en-US")} Game Analyses
              </span>{" "}
              <span className="block md:inline">
                (<span className="font-bold">${(price / analyses).toFixed(2)}</span> per
                Analysis)
              </span>
            </p>

            <button
              type="button"
              onClick={onGetOffer}
              disabled={isLoading}
              className="mt-[16px] flex h-[48px] w-full items-center justify-center rounded-full border-[3px] border-white/40 bg-[linear-gradient(180deg,#FFFFFF_0%,#E6F7FE_100%)] text-[17px] font-bold uppercase tracking-[0.02em] text-[#221AE9] shadow-[0_8px_24px_rgba(10,20,120,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:hover:scale-100 sm:h-[54px] sm:text-[19px] md:mt-[28px] md:h-[48px] md:w-[300px]"
            >
              {isLoading ? <DotSpinner size={8} /> : "Get Offer"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-[22px] text-[15px] font-bold uppercase tracking-[0.02em] text-white transition-opacity hover:opacity-80 sm:text-[16px]"
            >
              No Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const hasPendingOffer = () => {
  try {
    return document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${CANCEL_OFFER_PENDING_COOKIE}=`));
  } catch {
    return false;
  }
};

const setPendingOffer = (pending: boolean) => {
  try {
    document.cookie = `${CANCEL_OFFER_PENDING_COOKIE}=1; path=/; max-age=${
      pending ? CANCEL_OFFER_PENDING_MAX_AGE_S : 0
    }; samesite=lax`;
  } catch {
    // Cookies blocked: the banner just won't survive a reload or the login.
  }
};

/** The banner's own overlay, left out of every "is something else up" check. */
const OWN_OVERLAY = "[data-cancel-offer]";

/** Modal z-tier. Catches the z-40/50 overlays that don't announce themselves
 *  (the legacy pricing dialog, the leaderboard/ELO modals, the day-streak modal
 *  at z-500) while skipping page chrome, which never covers the viewport. */
const OVERLAY_MIN_Z = 40;

/**
 * Is anything other than the banner holding the screen?
 *
 * The stores catch the playground tour, the day-streak modal and the offline
 * gate before they draw. The DOM checks catch everything else: dialogs that
 * announce themselves (Radix, the v2 overlays), then any visible, near
 * full-viewport layer at modal z, which is the shape every other overlay in the
 * app shares. The cookie bar is only a strip but covers the CTA on a phone.
 */
const otherOverlayIsUp = (): boolean => {
  if (isPlaygroundTourPending()) return true;
  if (useDayStreakModal.getState().request) return true;
  if (useOfflineGate.getState().open) return true;

  try {
    if (document.querySelector("[data-cookie-consent-bar]")) return true;

    const dialogs = Array.from(
      document.querySelectorAll<HTMLElement>('[role="dialog"], [aria-modal="true"]')
    );
    if (dialogs.some((el) => !el.closest(OWN_OVERLAY))) return true;

    // Array.from, not for..of over the NodeList: this tsconfig targets below
    // es2015 and NodeList iteration needs downlevelIteration.
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("div,section,aside")
    );
    for (const el of layers) {
      if (el.closest(OWN_OVERLAY)) continue;
      const style = getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "absolute") continue;
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
      ) {
        continue;
      }
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

/** Let the page settle — mount-time modals (day streak, offers, status
 *  dialogs) claim the screen first instead of popping up over the banner. */
const SHOW_DELAY_MS = 1500;
/** How often to look for a clear screen while the banner is pending, and when
 *  to stop looking on this page (the NPS layover's pacing). It stays pending,
 *  so the next page change tries again. */
const SCREEN_POLL_MS = 600;
const SCREEN_POLL_GIVE_UP_MS = 45_000;
/** How often to look for a rival dialog while the banner is up. */
const OPEN_POLL_MS = 300;

/** Mounted only while the banner is up, so the checkout hook (and its API
 *  client) isn't running on every page. */
function CancelOfferModalContainer({
  onClose,
  suspended,
}: {
  onClose: () => void;
  suspended: boolean;
}) {
  const { offer, reason, loaded, startCheckout, isCheckingOut } =
    useCancellationOffer(true);

  // Opened from an email link, possibly days later: when the pass can't be
  // bought any more, say why instead of showing an offer checkout would refuse.
  useEffect(() => {
    if (!loaded || offer) return;
    if (reason === "window_closed") toast.info("This offer has ended.");
    else if (reason === "already_redeemed") {
      toast.info("You've already claimed this offer.");
    }
    onClose();
  }, [loaded, offer, reason, onClose]);

  if (!offer) return null;

  return (
    <CancelOfferModal
      price={offer.price}
      fullPrice={9.99 * offer.durationInMonths}
      months={offer.durationInMonths}
      analyses={offer.tokens > 0 ? offer.tokens : 80 * offer.durationInMonths}
      onClose={onClose}
      onGetOffer={startCheckout}
      isLoading={isCheckingOut}
      suspended={suspended}
    />
  );
}

/**
 * Opens the resubscribe banner for `?cancel_offer` on any page, for signed-in
 * users only, while the backend still sells them the cancellation-offer pass.
 * "Get Offer" starts the pass's Stripe checkout, as the /profile banner does.
 *
 * The param only marks the offer pending (a cookie) and is dropped from the
 * URL. A signed-out visitor never sees the banner; the offer waits until they
 * have logged in (the middleware parks it the same way when it bounces a
 * protected page to /login). It opens off the auth/onboarding screens and live
 * games, once nothing else holds the screen, and is shown once: closing it
 * clears the cookie.
 *
 * It never shares the screen. If a dialog opens over it, it hides until that
 * dialog is gone; if the user ends up on a screen it must not cover, it goes
 * back to pending.
 *
 * Lives in the root layout, so it reads `window.location` rather than
 * useSearchParams (which would client-render every static page).
 */
export default function CancelOfferModalHost() {
  const pathname = usePathname();
  const hydrated = useProfileStore((state) => state.hydrated);
  const sessionId = useProfileStore((state) => state.sessionId);
  const isSignedIn = hydrated && Boolean(sessionId);
  const [open, setOpen] = useState(false);
  const [suspended, setSuspended] = useState(false);

  // 1. Turn the URL param into the pending cookie.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has(CANCEL_OFFER_QUERY_PARAM)) return;

    setPendingOffer(true);

    params.delete(CANCEL_OFFER_QUERY_PARAM);
    const query = params.toString();
    // null state: Next's patched replaceState then syncs its router (and
    // useSearchParams) to the new URL, so the param can't be written back.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
  }, [pathname]);

  // 2. Open it once signed in, on an allowed page, with the screen free.
  useEffect(() => {
    if (open || !isSignedIn || isBlockedRoute(pathname) || !hasPendingOffer()) {
      return;
    }

    let poll: number | undefined;
    const delay = window.setTimeout(() => {
      const startedAt = Date.now();
      poll = window.setInterval(() => {
        if (Date.now() - startedAt > SCREEN_POLL_GIVE_UP_MS) {
          window.clearInterval(poll);
          return;
        }
        if (otherOverlayIsUp()) return;

        window.clearInterval(poll);
        setPendingOffer(false);
        setSuspended(false);
        setOpen(true);
      }, SCREEN_POLL_MS);
    }, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(delay);
      window.clearInterval(poll);
    };
  }, [open, isSignedIn, pathname]);

  // 3. While it's up, never share the screen.
  useEffect(() => {
    if (!open) return;

    const check = () => {
      if (otherOverlayIsUp()) {
        setSuspended(true);
        return;
      }
      if (!isSignedIn || isBlockedRoute(pathname)) {
        // Signed out, or onto a screen it must not cover: try again later.
        setPendingOffer(true);
        setSuspended(false);
        setOpen(false);
        return;
      }
      setSuspended(false);
    };

    // The day-streak modal shares z-[500] and sits earlier in the DOM, so the
    // banner would paint over it: react to its store at once instead of on
    // the next poll. Same for the offline gate.
    const unsubscribeStreak = useDayStreakModal.subscribe(check);
    const unsubscribeOffline = useOfflineGate.subscribe(check);
    const poll = window.setInterval(check, OPEN_POLL_MS);

    return () => {
      unsubscribeStreak();
      unsubscribeOffline();
      window.clearInterval(poll);
    };
  }, [open, isSignedIn, pathname]);

  const handleClose = useCallback(() => {
    setSuspended(false);
    setOpen(false);
  }, []);

  if (!open) return null;

  return <CancelOfferModalContainer onClose={handleClose} suspended={suspended} />;
}
