"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Presentational banner shown on the revamped Game History page.
 * The artwork (headline text + CTA) is baked into the image, so the whole
 * banner is a single clickable image. A dedicated mobile crop is used below
 * the sm breakpoint since the desktop artwork is too wide/short to stay
 * legible at phone widths.
 */
export default function GameHistoryAiProgressBanner() {
  return (
    <Link
      href="/my-game-history/play-vs-ai-stats"
      aria-label="Discover your progress against the AI Opponents — See my progress"
      className="block w-full my-[16px] rounded-2xl overflow-hidden transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221AE9]"
    >
      <Image
        src="/images/v2/game_history/banner_game_history_mobile.png"
        alt="Discover your progress against the AI Opponents"
        width={1097}
        height={550}
        priority
        className="block w-full h-auto sm:hidden"
      />
      <Image
        src="/images/v2/game_history/banner_game_history.png"
        alt="Discover your progress against the AI Opponents"
        width={2026}
        height={300}
        priority
        className="hidden sm:block w-full h-auto"
      />
    </Link>
  );
}
