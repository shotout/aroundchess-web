"use client";

import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useRetryCountdown } from "./hooks/useRetryCountdown";

const ICON = "/images/v2/play-vs-ai/WifinoInternet.png";

/** Which problem the card is describing.
 *
 *  `sync` is the finished game whose result has not reached the backend yet —
 *  it promises the game is safe and asks the player to stay put, because that
 *  promise only holds while the tab is open (there is no service worker, and
 *  the restore path drops ended-game snapshots).
 *
 *  `blocked` is something the user just asked for that cannot happen offline
 *  — opening an analysis, most of all. Nothing is pending, so there is nothing
 *  to promise. For an area of the page that simply has no data to show, the
 *  inline OfflineState is the right surface instead of this one. */
export type OfflineModalVariant = "sync" | "blocked";

const BODY: Record<OfflineModalVariant, string> = {
  sync: "Your game is saved on this browser and will sync automatically once your connection is restored. Please keep this tab open.",
  blocked: "Please try reconnecting or try again later.",
};

interface OfflineModalProps {
  variant?: OfflineModalVariant;
  /** Runs one attempt. The modal does not close itself on the strength of
   *  having tried — the parent unmounts it once an attempt succeeds. */
  onRetry: () => void;
  /** Dismiss. Callers keep retrying in the background, so this is "stop
   *  telling me", not "give up". */
  onClose: () => void;
  /** An attempt is in flight: freezes the countdown and the button. */
  isRetrying?: boolean;
}

export function OfflineModal({
  variant = "blocked",
  onRetry,
  onClose,
  isRetrying = false,
}: OfflineModalProps) {
  const { countdown, busy, retryNow } = useRetryCountdown(onRetry, isRetrying);

  return (
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-modal-title"
    >
      <div className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-2xl px-[24px] py-[28px]">
        <button
          onClick={onClose}
          className="absolute top-[18px] right-[20px] text-[#111827] hover:text-[#374151]"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-[16px]">
          <Image
            src={ICON}
            alt=""
            width={160}
            height={160}
            className="w-[80px] h-auto object-contain"
          />
        </div>

        <h2
          id="offline-modal-title"
          className="text-center font-bold text-[18px] leading-[130%] text-[#111827] mb-[8px]"
        >
          Seems like you&apos;re offline
        </h2>

        <p className="text-center text-[16px] leading-[150%] text-[#111827] mb-[20px]">
          {BODY[variant]}
        </p>

        {/* The countdown stays put while an attempt runs — only the button
            changes — so the card does not reflow mid-retry. */}
        <p
          className="text-center text-[16px] leading-[150%] text-[#9CA3AF] mb-[16px]"
          aria-live="polite"
        >
          Retrying in {countdown}
        </p>

        <button
          onClick={retryNow}
          disabled={busy}
          className={`w-full py-[12px] rounded-full font-semibold text-[16px] transition-colors ${
            busy
              ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-default"
              : "bg-[#221AE9] text-white hover:bg-[#2d25ea]"
          }`}
        >
          {busy ? (
            <span className="inline-flex items-center justify-center gap-[8px]">
              <Loader2 className="w-5 h-5 animate-spin" />
              Reconnecting...
            </span>
          ) : (
            "Try to Reconnect"
          )}
        </button>
      </div>
    </div>
  );
}
