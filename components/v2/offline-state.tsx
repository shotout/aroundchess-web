"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRetryCountdown } from "./hooks/useRetryCountdown";

const ICON = "/images/v2/play-vs-ai/WifinoInternet.png";

interface OfflineStateProps {
  /** Refetch whatever this area was meant to show. */
  onRetry: () => void;
  /** The refetch is in flight. */
  isRetrying?: boolean;
  /** Chrome for the surrounding surface — background, border, radius, outer
   *  spacing — where this stands alone as a card; nothing where it already
   *  sits inside one.
   *
   *  Surface only. Width and horizontal margin belong to the layout below and
   *  must not be passed: they collide with the `w-full` there, Tailwind
   *  resolves the winner by stylesheet order rather than by what is written
   *  here, and the loser's negative margins survive anyway — which is exactly
   *  how this panel ended up sitting 16px left of its container on mobile. */
  className?: string;
}

/** The offline notice as page content, standing in for a list that could not
 *  be loaded.
 *
 *  The inline counterpart to OfflineModal, and deliberately not the same
 *  thing: a modal interrupts something the user just asked for, while this
 *  answers a question they already asked by arriving on the page. Hence the
 *  softer copy — nothing is pending, there is just nothing to show — and no
 *  backdrop or dismiss, because there is nothing behind it to get back to.
 */
export function OfflineState({
  onRetry,
  isRetrying = false,
  className = "",
}: OfflineStateProps) {
  const { countdown, busy, retryNow } = useRetryCountdown(onRetry, isRetrying);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full flex-col items-center justify-center px-[16px] py-[48px] ${className}`}
    >
      <Image
        src={ICON}
        alt=""
        width={160}
        height={160}
        className="w-[80px] h-auto object-contain mb-[16px]"
      />

      <h3 className="text-center font-bold text-[18px] leading-[130%] text-[#111827] mb-[8px]">
        Seems like you&apos;re offline
      </h3>

      <p className="text-center text-[16px] leading-[150%] text-[#111827] mb-[20px] max-w-[420px]">
        Please check your internet connection or try again later.
      </p>

      <p className="text-center text-[16px] leading-[150%] text-[#9CA3AF] mb-[16px]">
        Retrying in {countdown}
      </p>

      <button
        type="button"
        onClick={retryNow}
        disabled={busy}
        className={`w-full max-w-[360px] py-[12px] rounded-full font-semibold text-[16px] transition-colors ${
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
  );
}
