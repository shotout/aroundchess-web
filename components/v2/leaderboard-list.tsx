"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PieceAvatar } from "@/components/v2/piece-avatar";

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
  isLoading?: boolean;
  /** Infinite scroll: whether more pages can be fetched. */
  hasMore?: boolean;
  /** Infinite scroll: a next page is currently being fetched. */
  isLoadingMore?: boolean;
  /** Infinite scroll: called when the user scrolls near the bottom. */
  onLoadMore?: () => void;
}

// The signed-in user's own row when they have no picture — same trophy
// avatar the play page uses for "You".
const MY_FALLBACK_AVATAR = "/images/homepage/v2/homepage_board_asset_4.png";

const RANK_BADGE_ICON: Record<number, string> = {
  1: "/images/v2/leaderboard/1.png",
  2: "/images/v2/leaderboard/2.png",
  3: "/images/v2/leaderboard/3.png",
};

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

function RankChange({ value }: { value?: number | null }) {
  if (!value) return <span className="w-[26px] h-[24px] shrink-0" />;
  const isUp = value > 0;
  return (
    <span className={`flex items-center h-[24px] leading-none gap-[1px] text-md font-semibold w-[26px] shrink-0 ${isUp ? "text-green-600" : "text-red-500"}`}>
      <Image
        src={isUp ? "/images/v2/leaderboard/ArrowUp.png" : "/images/v2/leaderboard/ArrowDown.png"}
        alt=""
        width={12}
        height={12}
        className="w-[16px] h-[16px] object-contain"
      />
      {Math.abs(value)}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const icon = RANK_BADGE_ICON[rank];
  if (icon) {
    return (
      <Image
        src={icon}
        alt={`#${rank}`}
        width={24}
        height={24}
        className="w-[24px] h-[24px] object-contain shrink-0"
      />
    );
  }
  return (
    <span className="flex items-center justify-center h-[24px] leading-none text-[13px] font-semibold text-[#6B7280] w-[24px] shrink-0">
      #{rank}
    </span>
  );
}

function Row({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  return (
    <div
      id={entry.isMe ? "my-rank" : undefined}
      className={`flex items-center gap-[10px] px-[14px] sm:px-[18px] py-[10px] border-b border-[#F3F4F6] last:border-b-0 sm:border-b-0 sm:rounded-[12px] sm:shadow-sm ${
        entry.isMe ? "bg-[#E6F7FE] border-l-[3px] border-l-[#221AE9]" : "bg-white"
      }`}
    >
      <RankChange value={entry.rankChange} />
      <RankBadge rank={entry.rank} />
      <UserAvatar entry={entry} index={index} />
      <span className="flex-1 min-w-0 truncate text-[13px] sm:text-[14px] font-semibold text-[#111827]">
        {entry.username}
      </span>
      <span className="text-[13px] sm:text-[14px] font-bold text-[#111827] shrink-0">{entry.score}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-[10px] px-[18px] py-[10px] border-b border-[#F3F4F6] shadow-md sm:border-b-0 sm:rounded-[12px] bg-white sm:shadow-sm">
      <span className="w-[26px]" />
      <span className="w-[24px] h-[16px] bg-gray-200 rounded animate-pulse" />
      <div className="w-[32px] h-[32px] rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 h-[13px] bg-gray-200 rounded animate-pulse" />
      <div className="w-[40px] h-[13px] bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export function LeaderboardList({
  entries,
  myRank,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: LeaderboardListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Keep the latest callback in a ref so the observer isn't re-created on
  // every render (loadMore's identity changes with its deps).
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

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
  }, [hasMore]);

  return (
    <div className="w-full sm:w-[70%] mx-auto bg-white sm:bg-white/40 rounded-[20px] shadow-xl p-3 sm:p-4">
      <div className="flex items-center justify-center gap-[8px] px-[4px] sm:px-[6px] pb-[10px]">
        <span className="text-[13px] sm:text-xl font-bold text-[#111827]">
          You are on {myRank > 0 ? `${myRank}th` : "—"} position
        </span>
        <Link
          href="#my-rank"
          className="text-[13px] sm:text-xl font-bold text-[#221AE9] sm:pl-4 flex items-center gap-[4px] hover:underline"
        >
          My Rank <span className="text-2xl font-normal leading-none">›</span>
        </Link>
      </div>

      <div className="flex items-center gap-[10px] px-[14px] sm:px-[18px] py-[10px] rounded-[12px] bg-[#221AE9]">
        <span className="w-[26px] shrink-0" />
        <span className="w-[24px] shrink-0" />
        <span className="flex-1 text-md sm:text-xl font-bold text-white">Player</span>
        <span
          className="flex items-center gap-[4px] text-md sm:text-xl font-bold text-white"
          title="Your leaderboard score, based on ELO and games played."
        >
          Score <span className="w-[13px] h-[13px] rounded-full border border-white text-[9px] leading-[11px] text-center">i</span>
        </span>
      </div>

      <div
        ref={scrollRef}
        className="leaderboard-scrollbar flex flex-col gap-0 sm:gap-[8px] mt-[10px] max-h-[420px] overflow-y-auto pl-[2px] pr-[10px] py-[2px]"
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
              <Row key={`${entry.rank}-${entry.username}`} entry={entry} index={index} />
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
    </div>
  );
}
