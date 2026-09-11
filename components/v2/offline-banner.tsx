"use client";

import { X } from "lucide-react";

interface OfflineBannerProps {
  onDismiss: () => void;
}

/** The "you are offline" notice.
 *
 *  Deliberately `fixed`: it must not take part in document flow, or appearing
 *  mid-game would push the board down and reflow every page it can show up on.
 *  A full-width bar on phones, a pill on the right on desktop.
 *
 *  Offset below the site header (72px on mobile, 96px at lg — see
 *  components/header.tsx) rather than pinned to the top as in the mockup: the
 *  header is sticky, so a top-pinned banner would sit over the logo and the
 *  hamburger menu and swallow taps meant for them.
 *
 *  z-55 sits in the gap between the two: above the sticky header and sidebar
 *  (z-50, z-30) so it is not painted over, and below the lowest dialog layer
 *  (ui/dialog.tsx's z-[60] backdrop, and everything above it up to z-[9999]).
 *  A persistent notice must not float over a dialog — at z-400 it sat on top
 *  of the full-screen game-analysis overlay (z-[70]) and could cover a
 *  dialog's own close button.
 */
export function OfflineBanner({ onDismiss }: OfflineBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[55] top-[80px] left-[16px] right-[16px] sm:left-auto lg:top-[104px] sm:right-[16px] sm:max-w-[460px] flex items-start gap-[12px] rounded-lg bg-[#221AE9] px-[16px] py-[12px] shadow-lg"
    >
      <p className="flex-1 text-[14px] leading-[140%] font-medium text-white">
        You&apos;re not connected to the internet. Some features may be
        unavailable until your connection is restored.
      </p>
      <button
        onClick={onDismiss}
        className="shrink-0 text-white/90 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
