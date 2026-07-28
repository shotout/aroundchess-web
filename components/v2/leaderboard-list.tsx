"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PieceAvatar } from "@/components/v2/piece-avatar";
import { formatNumber } from "@/components/v2/format-number";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  rankChange?: number | null;
  isMe?: boolean;
  /** profile picture URL; users without one get the pawn fallback avatar */
  avatarUrl?: string | null;
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  myRank: number;
  /** Total ranked players, shown in the "out of N players" subtitle. */
  totalPlayers?: number | null;
  isLoading?: boolean;
  /** Infinite scroll: whether more pages can be fetched. */
  hasMore?: boolean;
  /** Infinite scroll: a next page is currently being fetched. */
  isLoadingMore?: boolean;
  /** Infinite scroll: called when the user scrolls near the bottom. */
  onLoadMore?: () => void;
  /**
   * "My Rank": load + swap in the user's neighborhood when their row isn't
   * paged in yet. Resolves true once the row is available to scroll to.
   */
  onJumpToMyRank?: () => Promise<boolean> | void;
  /** The neighborhood fetch triggered by "My Rank" is in flight. */
  isJumpingToMyRank?: boolean;
  /**
   * Scroll-to-top: reload the first page so the list restarts at rank #1 when
   * the user is viewing a jumped-to neighborhood. Resolves true on success.
   */
  onResetToTop?: () => Promise<boolean> | void;
  /**
   * Increments once the initial page fetch has settled. Entering the page
   * auto-jumps to the user's own row when this ticks — keyed on the fetch
   * rather than on `isLoading`, which is already false on first render when
   * the store rehydrated a previous session's rows.
   */
  autoJumpNonce?: number;
}

// The signed-in user's own row when they have no picture — same trophy
// avatar the play page uses for "You".
const MY_FALLBACK_AVATAR = "/images/homepage/v2/homepage_board_asset_4.png";

const RANK_BADGE_ICON: Record<number, string> = {
  1: "/images/v2/leaderboard/1.png",
  2: "/images/v2/leaderboard/2.png",
  3: "/images/v2/leaderboard/3.png",
};

// Ordinal split so the suffix can render as a small superscript. Matches the
// top-stats rule: only the top three ranks get st/nd/rd, the rest are "th".
function ordinalParts(n: number): { value: string; suffix: string } {
  if (n <= 0) return { value: "—", suffix: "" };
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return { value: formatNumber(n), suffix };
}

function UserAvatar({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const [failed, setFailed] = useState(false);
  const src = entry.avatarUrl && !failed ? entry.avatarUrl : entry.isMe ? MY_FALLBACK_AVATAR : null;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={entry.username}
        className="w-[32px] h-[32px] rounded-full object-cover shrink-0"
        onError={() => setFailed(true)}
      />
    );
  }
  // Placeholder "[Username]" rows all share one name — seed by row instead
  // so the mock list still shows varied colors like the real one.
  const seed = entry.username === "[Username]" ? `u${index}` : entry.username;
  return <PieceAvatar seed={seed} className="w-[32px] h-[32px]" pieceClassName="w-[14px] h-[18px]" />;
}

// Fixed column so ranks line up across rows and multi-digit changes (↑10)
// don't spill onto the rank badge. It is reserved even on rows with no change,
// so on mobile it stays as narrow as the smaller arrow type allows — every px
// here is dead space on the left edge of every unchanged row.
const RANK_CHANGE_WIDTH = "w-[22px] sm:w-[40px]";

function RankChange({ value }: { value?: number | null }) {
  if (!value) return <span className={`${RANK_CHANGE_WIDTH} h-[24px] shrink-0`} />;
  const isUp = value > 0;
  return (
    <span className={`flex items-center justify-start h-[24px] leading-none gap-0 sm:gap-[1px] text-[10px] sm:text-md font-semibold ${RANK_CHANGE_WIDTH} shrink-0 ${isUp ? "text-green-600" : "text-red-500"}`}>
      <Image
        src={isUp ? "/images/v2/leaderboard/ArrowUp.png" : "/images/v2/leaderboard/ArrowDown.png"}
        alt=""
        width={12}
        height={12}
        className="w-[9px] h-[9px] sm:w-[16px] sm:h-[16px] object-contain"
      />
      {formatNumber(Math.abs(value))}
    </span>
  );
}

// Rank column. Fixed width so every avatar lines up in the same vertical column
// no matter how many digits the rank has. Content is right-aligned, so the rank
// always sits a consistent gap from the avatar; a longer rank grows leftward
// into the empty space instead of pushing the avatar over.
const RANK_WIDTH = "w-[44px] sm:w-[56px]";

function RankBadge({ rank }: { rank: number }) {
  const icon = RANK_BADGE_ICON[rank];
  return (
    <span className={`flex items-center justify-end h-[24px] shrink-0 ${RANK_WIDTH}`}>
      {icon ? (
        <Image
          src={icon}
          alt={`#${formatNumber(rank)}`}
          width={24}
          height={24}
          className="w-[24px] h-[24px] object-contain"
        />
      ) : (
        <span className="leading-none text-[12px] sm:text-[13px] font-semibold text-[#6B7280] whitespace-nowrap">
          #{formatNumber(rank)}
        </span>
      )}
    </span>
  );
}

function Row({
  entry,
  index,
  innerRef,
}: {
  entry: LeaderboardEntry;
  index: number;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={innerRef}
      id={entry.isMe ? "my-rank" : undefined}
      className={`flex items-center gap-[4px] sm:gap-[10px] px-[2px] sm:px-[18px] py-[10px] border-b border-[#F3F4F6] last:border-b-0 sm:border-b-0 sm:rounded-[12px] sm:shadow-sm border-l-[3px] ${
        entry.isMe ? "bg-[#E6F7FE] border-l-[#221AE9]" : "bg-white border-l-transparent"
      }`}
    >
      <RankChange value={entry.rankChange} />
      <RankBadge rank={entry.rank} />
      <UserAvatar entry={entry} index={index} />
      <span className="flex-1 min-w-0 truncate text-[13px] sm:text-[14px] font-semibold text-[#111827]">
        {entry.username}
      </span>
      <span className="text-[13px] sm:text-[14px] font-bold text-[#111827] shrink-0">{formatNumber(entry.score)}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-[4px] sm:gap-[10px] px-[2px] sm:px-[18px] py-[10px] border-b border-[#F3F4F6] shadow-md sm:border-b-0 sm:rounded-[12px] bg-white sm:shadow-sm">
      <span className={RANK_CHANGE_WIDTH} />
      <span className={`${RANK_WIDTH} h-[16px] bg-gray-200 rounded animate-pulse`} />
      <div className="w-[32px] h-[32px] rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 h-[13px] bg-gray-200 rounded animate-pulse" />
      <div className="w-[40px] h-[13px] bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export function LeaderboardList({
  entries,
  myRank,
  totalPlayers,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onJumpToMyRank,
  isJumpingToMyRank,
  onResetToTop,
  autoJumpNonce = 0,
}: LeaderboardListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // The signed-in user's own row, so "My Rank" can scroll straight to it.
  const meRowRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Set while waiting for a "My Rank" fetch to bring the user's row into the
  // list; the effect below scrolls to it as soon as it mounts.
  const [pendingScrollToMe, setPendingScrollToMe] = useState(false);
  // Set while waiting for a scroll-to-top reload to restart the list at rank #1.
  const [pendingScrollTop, setPendingScrollTop] = useState(false);
  // Keep the latest callback in a ref so the observer isn't re-created on
  // every render (loadMore's identity changes with its deps).
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  // Center the user's row in the scroll viewport. getBoundingClientRect keeps
  // this correct regardless of the container's positioning context.
  const scrollToMyRank = useCallback(() => {
    const container = scrollRef.current;
    const row = meRowRef.current;
    if (!container || !row) return;
    const delta =
      row.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      (container.clientHeight - row.clientHeight) / 2;
    container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" });
  }, []);

  const scrollToTop = useCallback(() => {
    // Already showing from rank #1 (or no reload available) — just scroll up.
    if ((entries[0]?.rank ?? 1) === 1 || !onResetToTop) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Viewing a jumped-to neighborhood: reload the first page, then the effect
    // below snaps to rank #1 once those rows are in.
    setPendingScrollTop(true);
    Promise.resolve(onResetToTop()).then((ok) => {
      if (ok === false) {
        setPendingScrollTop(false);
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, [entries, onResetToTop]);

  const handleMyRankClick = useCallback(() => {
    // Fast path: the row is already paged in — center it right away.
    if (meRowRef.current) {
      scrollToMyRank();
      return;
    }
    if (!onJumpToMyRank) return;
    // Deep rank: fetch the neighborhood, then let the effect below scroll to
    // the row once it mounts. Clear the flag if the fetch couldn't find it.
    setPendingScrollToMe(true);
    Promise.resolve(onJumpToMyRank()).then((ok) => {
      if (ok === false) setPendingScrollToMe(false);
    });
  }, [scrollToMyRank, onJumpToMyRank]);

  // Once a "My Rank" fetch swaps in the user's row, scroll to it.
  useEffect(() => {
    if (!pendingScrollToMe || !meRowRef.current) return;
    scrollToMyRank();
    setPendingScrollToMe(false);
  }, [entries, pendingScrollToMe, scrollToMyRank]);

  // Opening the page should land the user on their own row without making them
  // press "My Rank" — run that same jump once the initial fetch has settled.
  // Waiting on the nonce (not on `isLoading`) matters: with rehydrated entries
  // the list renders immediately, and jumping against those stale rows was
  // being undone the moment fresh page-1 data replaced them.
  const autoJumpedForRef = useRef(0);
  useEffect(() => {
    if (autoJumpNonce === 0 || autoJumpedForRef.current === autoJumpNonce) return;
    if (entries.length === 0 || myRank <= 0) return;
    autoJumpedForRef.current = autoJumpNonce;
    handleMyRankClick();
  }, [autoJumpNonce, entries, myRank, handleMyRankClick]);

  // Once the scroll-to-top reload restarts the list at rank #1, snap up.
  useEffect(() => {
    if (!pendingScrollTop || (entries[0]?.rank ?? 1) !== 1) return;
    scrollRef.current?.scrollTo({ top: 0 });
    setPendingScrollTop(false);
  }, [entries, pendingScrollTop]);

  // Only surface the scroll-to-top button once the list is scrolled down.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => setShowScrollTop(container.scrollTop > 120);
    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    // Hold off while a jump is landing: centering the user's row near the end
    // of a fetched neighborhood puts the sentinel in view and would append the
    // next page mid-scroll, shifting the row we just aimed at.
    if (!sentinel || !hasMore || pendingScrollToMe || isJumpingToMyRank) return;

    const observer = new IntersectionObserver(
      (observed) => {
        if (observed.some((e) => e.isIntersecting)) onLoadMoreRef.current?.();
      },
      // Start fetching one screen early so new rows are ready before the
      // user reaches the bottom — keeps the scroll feeling seamless.
      { root: scrollRef.current, rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pendingScrollToMe, isJumpingToMyRank]);

  const rankOrdinal = ordinalParts(myRank);

  return (
    <div className="w-full sm:w-[70%] mx-auto bg-white sm:bg-white/40 rounded-[20px] shadow-xl p-2 sm:p-4">
      <div className="flex items-center justify-between gap-[8px] px-[4px] sm:px-[10px] pb-[12px]">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[15px] sm:text-xl font-extrabold text-[#111827]">
            You are on {rankOrdinal.value}
            {rankOrdinal.suffix && (
              <sup className="text-[0.6em] font-bold">{rankOrdinal.suffix}</sup>
            )}{" "}
            position
          </span>
          <span className="text-[11px] sm:text-[14px] font-medium text-[#6B7280]">
            out of {totalPlayers != null ? totalPlayers.toLocaleString() : "[total amount]"} players
          </span>
        </div>
        <button
          type="button"
          onClick={handleMyRankClick}
          disabled={isJumpingToMyRank}
          className="shrink-0 text-[13px] sm:text-xl font-bold text-[#221AE9] flex items-center gap-[4px] hover:underline disabled:opacity-60 disabled:cursor-wait"
        >
          {isJumpingToMyRank ? (
            "Finding…"
          ) : (
            <>
              My Rank <span className="text-2xl font-normal leading-none">›</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-[4px] sm:gap-[10px] px-[2px] sm:px-[18px] py-[10px] rounded-[12px] bg-[#221AE9] border-l-[3px] border-l-transparent">
        <span className={`${RANK_CHANGE_WIDTH} shrink-0`} />
        <span className={`${RANK_WIDTH} shrink-0`} />
        <span className="flex-1 text-md sm:text-xl font-bold text-white">Player</span>
        <span
          className="flex items-center gap-[4px] text-md sm:text-xl font-bold text-white"
          title="Your leaderboard score, based on ELO and games played."
        >
          Score <span className="w-[13px] h-[13px] rounded-full border border-white text-[9px] leading-[11px] text-center">i</span>
        </span>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="leaderboard-scrollbar flex flex-col gap-0 sm:gap-[8px] mt-[10px] max-h-[420px] overflow-y-auto pl-[2px] pr-[2px] sm:pr-[10px] py-[2px]"
        >
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : entries.length === 0 ? (
            <p className="text-[13px] text-[#6B7280] py-[32px] text-center">No leaderboard data yet.</p>
          ) : (
            <>
              {entries.map((entry, index) => (
                <Row
                  key={`${entry.rank}-${entry.username}`}
                  entry={entry}
                  index={index}
                  innerRef={entry.isMe ? (el) => { meRowRef.current = el; } : undefined}
                />
              ))}
              {isLoadingMore && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}
              {/* Invisible sentinel — scrolling it into view loads the next page. */}
              {hasMore && <div ref={sentinelRef} className="h-px shrink-0" aria-hidden />}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`group absolute bottom-3 right-3 z-10 flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#221AE9] text-white shadow-lg transition-all duration-200 hover:bg-[#1a14c4] hover:shadow-xl ${
            showScrollTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-200 group-hover:-translate-y-[3px]"
          >
            <path
              d="M12 19V5M12 5l-6 6M12 5l6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
