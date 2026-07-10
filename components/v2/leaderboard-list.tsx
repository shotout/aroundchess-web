"use client";

import Image from "next/image";
import Link from "next/link";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  rankChange?: number | null;
  isMe?: boolean;
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  myRank: number;
  isLoading?: boolean;
}

const AVATAR_COLORS = [
  "bg-[#F5A623]",
  "bg-[#4FA3E3]",
  "bg-[#E0507A]",
  "bg-[#5B6CF0]",
  "bg-[#2FAE60]",
  "bg-[#B5651D]",
  "bg-[#9CA3AF]",
  "bg-[#374151]",
  "bg-[#3B82F6]",
  "bg-[#6B7280]",
];

const RANK_BADGE_ICON: Record<number, string> = {
  1: "/images/v2/leaderboard/1.png",
  2: "/images/v2/leaderboard/2.png",
  3: "/images/v2/leaderboard/3.png",
};

function UserAvatar({ index }: { index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className={`w-[32px] h-[32px] rounded-full shrink-0 flex items-center justify-center ${color}`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-[16px] h-[16px]">
        <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.9" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="white" fillOpacity="0.9" />
      </svg>
    </div>
  );
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
      <UserAvatar index={index} />
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

export function LeaderboardList({ entries, myRank, isLoading }: LeaderboardListProps) {
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

      <div className="leaderboard-scrollbar flex flex-col gap-0 sm:gap-[8px] mt-[10px] max-h-[420px] overflow-y-auto pl-[2px] pr-[10px] py-[2px]">
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : entries.length === 0 ? (
          <p className="text-[13px] text-[#6B7280] py-[32px] text-center">No leaderboard data yet.</p>
        ) : (
          entries.map((entry, index) => <Row key={`${entry.rank}-${entry.username}`} entry={entry} index={index} />)
        )}
      </div>
    </div>
  );
}
