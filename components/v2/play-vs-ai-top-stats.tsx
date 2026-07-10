"use client";

import Image from "next/image";
import { InfoTooltip } from "@/components/v2/info-tooltip";

interface PlayVsAiTopStatsProps {
  elo: number;
  rank: number;
  movedUp: number | null;
}

function toOrdinal(n: number): string {
  if (n <= 0) return "—";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function StatItem({
  icon,
  label,
  infoText,
  infoAlign = "right",
  children,
}: {
  icon: string;
  label: string;
  infoText: string;
  infoAlign?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[6px] sm:gap-[8px] min-w-0 shrink-0">
      <Image
        src={icon}
        alt=""
        width={32}
        height={32}
        className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] object-contain shrink-0"
      />
      {/* Mobile: label on top, value underneath. Desktop: everything on one line. */}
      <span className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-[8px] min-w-0 leading-tight">
        <span className="flex items-center gap-[3px] sm:gap-[4px]">
          <span className="text-[11px] sm:text-[13px] text-[#6B7280] whitespace-nowrap">{label}</span>
          <InfoTooltip text={infoText} size={12} align={infoAlign} />
        </span>
        {children}
      </span>
    </div>
  );
}

export function PlayVsAiTopStats({ elo, rank, movedUp }: PlayVsAiTopStatsProps) {
  const isUp = movedUp !== null && movedUp > 0;
  const isDown = movedUp !== null && movedUp < 0;
  const movedUpAbs = movedUp !== null ? Math.abs(movedUp) : 0;
  const movedLabel = isDown ? "Moved Down" : "Moved Up";

  return (
    <div className="bg-white/70 rounded-xl border border-[#E5E7EB] shadow-sm px-[10px] sm:px-[28px] py-[10px] sm:py-[14px] flex items-center justify-between sm:justify-center gap-[6px] sm:gap-[60px] lg:gap-[250px]">
      <StatItem
        icon="/images/v2/leaderboard/your_elo.png"
        label="Your ELO"
        infoText="Your current chess skill rating."
        infoAlign="left"
      >
        <span className="text-[14px] sm:text-[25px] font-bold text-[#111827]">{elo || "—"}</span>
      </StatItem>

      <StatItem
        icon="/images/v2/leaderboard/your_rank.png"
        label="Your Rank"
        infoText="Your current position on the leaderboard."
      >
        <span className="text-[14px] sm:text-[25px] font-bold text-[#111827]">{toOrdinal(rank)}</span>
      </StatItem>

      <StatItem
        icon="/images/v2/leaderboard/moved_rank.png"
        label={movedLabel}
        infoText="The number of positions you gained or lost on the leaderboard since yesterday."
      >
        {isUp || isDown ? (
          <span className="flex items-center gap-[3px]">
            <Image
              src={isUp ? "/images/v2/leaderboard/ArrowUp.png" : "/images/v2/leaderboard/ArrowDown.png"}
              alt=""
              width={13}
              height={13}
              className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] object-contain"
            />
            <span className={`text-[14px] sm:text-[25px] font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
              {movedUpAbs}
            </span>
          </span>
        ) : (
          <span className="text-[14px] sm:text-[20px] font-bold text-[#9CA3AF]">—</span>
        )}
      </StatItem>
    </div>
  );
}
