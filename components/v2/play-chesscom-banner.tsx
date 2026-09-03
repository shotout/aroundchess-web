"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useChessComConnected } from "@/components/v2/hooks/useChessComConnected";
import { openChesscomConnect } from "@/components/v2/hooks/useChesscomConnect";

/** Dismissal is permanent, so it's a plain flag rather than a date stamp like
 *  MarchOfferBanner's. Versioned in the key so the banner can be brought back
 *  for everyone later by bumping it.
 *
 *  Caveat worth knowing: localStorage is per-browser, so a dismissal doesn't
 *  follow the account to another device. A profile field (the way
 *  chesscomBannerShownCount works) would, but none exists for this banner. */
const DISMISSED_KEY = "ac_play_chesscom_banner_dismissed_v1";

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};

const ArrowRight = () => (
  <svg
    width="19"
    height="16"
    viewBox="0 0 19 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    aria-hidden="true"
  >
    <path
      d="M18.4209 8.67476L11.6709 15.4248C11.4596 15.6361 11.1729 15.7548 10.8741 15.7548C10.5752 15.7548 10.2885 15.6361 10.0772 15.4248C9.86584 15.2134 9.74711 14.9268 9.74711 14.6279C9.74711 14.329 9.86584 14.0424 10.0772 13.831L14.9062 9.00383H1.125C0.826631 9.00383 0.540483 8.8853 0.329505 8.67432C0.118526 8.46334 0 8.1772 0 7.87883C0 7.58046 0.118526 7.29431 0.329505 7.08333C0.540483 6.87235 0.826631 6.75383 1.125 6.75383H14.9062L10.0791 1.92383C9.86772 1.71248 9.74899 1.42584 9.74899 1.12695C9.74899 0.828065 9.86772 0.541421 10.0791 0.330076C10.2904 0.118732 10.5771 3.14928e-09 10.8759 0C11.1748 -3.14928e-09 11.4615 0.118732 11.6728 0.330076L18.4228 7.08008C18.5277 7.18473 18.6109 7.30908 18.6676 7.44598C18.7243 7.58288 18.7534 7.72963 18.7532 7.87781C18.7531 8.02599 18.7236 8.17267 18.6666 8.30944C18.6096 8.4462 18.5261 8.57035 18.4209 8.67476Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Flat sky-blue "Analyze your Chess.com Games" banner on the Play VS AI page,
 * sitting between the board panel and Recent Games.
 *
 * Same job as the gradient banner on /profile, but this one is dismissable —
 * the X sits inside the bar at its right edge, and closing it hides the banner
 * for good.
 *
 * Renders nothing once the account is linked or the banner has been dismissed.
 */
export function PlayChesscomBanner() {
  const isConnected = useChessComConnected();
  /** Starts hidden and is enabled in an effect: reading localStorage during
   *  render would differ between the server and client HTML. */
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Private mode / blocked storage: the banner still goes away for this
      // page view, it just comes back next time. Better than throwing.
    }
  };

  if (isConnected || dismissed) return null;

  return (
    /* mt-8 deliberately mirrors the pt-8 that PlayRecentGames carries below,
       so the gap above and below the banner match. Setting it here rather than
       shrinking that pt-8 keeps the hero -> Recent Games spacing unchanged for
       everyone who has dismissed the banner or already connected.

       lg:pr-[52px] reserves the X's column so justify-between lands the CTA
       just left of it rather than under it. The X is absolute rather than a
       third flex child because it is pinned to the bar's top-right corner at
       every width, and because below lg the bar stacks — a full-width CTA
       beside an inline X would leave no room for its label at 320-390px. */
    <div className="relative mt-8 flex w-full flex-col items-center gap-[12px] rounded-2xl bg-[#B4DEF8] px-[14px] py-[12px] sm:px-[20px] lg:flex-row lg:justify-between lg:py-[10px] lg:pr-[52px]">
      <div className="flex min-w-0 items-center gap-[10px] pr-[30px] sm:gap-[14px] lg:pr-0">
        <Image
          src="/images/v2/profile/connect_icon.png"
          alt=""
          width={228}
          height={170}
          className="h-[30px] w-[40px] shrink-0 object-contain sm:h-[40px] sm:w-[54px]"
          aria-hidden="true"
        />
        <p className="text-[15px] font-bold leading-[130%] text-[#221AE9] sm:text-[20px]">
          Analyze your Chess.com Games
        </p>
      </div>

      <button
        type="button"
        onClick={openChesscomConnect}
        className="flex h-[40px] w-full shrink-0 items-center justify-center gap-[8px] rounded-full border border-[#221AE9] bg-white px-[20px] text-[14px] font-bold text-[#221AE9] transition-colors hover:bg-[#F2F2FF] sm:px-[24px] sm:text-[15px] lg:w-auto"
      >
        <span>Connect Chess.com Account</span>
        <ArrowRight />
      </button>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute right-[10px] top-[10px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[#1E1E1E] transition-colors hover:bg-black/5 lg:right-[14px] lg:top-[12px]"
      >
        <svg
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px]"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 1.5L15.5 15.5M15.5 1.5L1.5 15.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default PlayChesscomBanner;
