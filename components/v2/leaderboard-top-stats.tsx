"use client";

import Image from "next/image";
import { InfoTooltip } from "@/components/v2/info-tooltip";

interface LeaderboardTopStatsProps {
  elo: number;
  rank: number;
  movedUp: number | null;
}

function toOrdinal(n: number): string {
  if (n <= 0) return "—";
  // Product rule: only the top three ranks get st/nd/rd — every other rank
  // is plain "th" (4th, 21th, 10002th), per design.
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return n + suffix;
}

function StatCard({
  icon,
  label,
  infoText,
  size = 36,
  children,
}: {
  icon: string;
  label: string;
  infoText: string;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[10px] sm:gap-[12px]">
      <Image
        src={icon}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain shrink-0"
      />
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-[4px]">
          <span className="text-[11px] sm:text-[12px] text-[#6B7280] whitespace-nowrap">{label}</span>
          <InfoTooltip text={infoText} size={13} />
        </div>
        {children}
      </div>
    </div>
  );
}

function MobileStatCard({
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
    <div className="flex items-center gap-[6px] min-w-0">
      <Image src={icon} alt="" width={28} height={28} className="w-[26px] h-[26px] object-contain shrink-0" />
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-[2px]">
          <span className="text-[9px] text-[#6B7280] whitespace-nowrap truncate">{label}</span>
          <InfoTooltip text={infoText} size={10} align={infoAlign} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function LeaderboardTopStats({ elo, rank, movedUp }: LeaderboardTopStatsProps) {
  const isUp = movedUp !== null && movedUp > 0;
  const isDown = movedUp !== null && movedUp < 0;
  const movedUpAbs = movedUp !== null ? Math.abs(movedUp) : 0;
  const movedLabel = isDown ? "Moved Down" : "Moved Up";

  return (
    <>
      {/* Mobile — compact, independently sized so it never overflows */}
      <div className="sm:hidden bg-white/70 rounded-xl sm:border border-[#E5E7EB] sm:shadow-sm px-[10px] py-[10px] flex items-center justify-between gap-[4px]">
        <MobileStatCard icon="/images/v2/leaderboard/your_elo.png" label="Your ELO" infoText="Your current chess skill rating." infoAlign="left">
          <span className="text-[15px] font-bold text-[#111827]">{elo || "—"}</span>
        </MobileStatCard>

        <MobileStatCard icon="/images/v2/leaderboard/your_rank.png" label="Your Rank" infoText="Your current position on the leaderboard.">
          <span className="text-[15px] font-bold text-[#111827]">{toOrdinal(rank)}</span>
        </MobileStatCard>

        <MobileStatCard
          icon="/images/v2/leaderboard/moved_rank.png"
          label={movedLabel}
          infoText="The number of positions you gained or lost on the leaderboard since yesterday."
        >
          {isUp || isDown ? (
            <div className="flex items-center gap-[2px]">
              <Image
                src={isUp ? "/images/v2/leaderboard/ArrowUp.png" : "/images/v2/leaderboard/ArrowDown.png"}
                alt=""
                width={11}
                height={11}
                className="w-[11px] h-[11px] object-contain"
              />
              <span className={`text-[15px] font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
                {movedUpAbs}
              </span>
            </div>
          ) : (
            <span className="text-[15px] font-bold text-[#9CA3AF]">—</span>
          )}
        </MobileStatCard>
      </div>

      {/* Desktop — unchanged */}
      <div className="hidden sm:block bg-white/50 p-4 w-[80%] mx-auto rounded-xl">
        <div className="w-auto mx-auto bg-white/70 rounded-xl border-[#E5E7EB] shadow-sm px-[26px] sm:px-[28px] py-[12px] sm:py-[14px] flex items-center justify-center gap-[180px]">
          <StatCard icon="/images/v2/leaderboard/your_elo.png" label="Your ELO" infoText="Your current chess skill rating.">
            <span className="text-[18px] sm:text-[20px] font-bold text-[#111827]">{elo || "—"}</span>
          </StatCard>

          <StatCard icon="/images/v2/leaderboard/your_rank.png" label="Your Rank" infoText="Your current position on the leaderboard.">
            <span className="text-[18px] sm:text-[20px] font-bold text-[#111827]">{toOrdinal(rank)}</span>
          </StatCard>

          <StatCard
            icon="/images/v2/leaderboard/moved_rank.png"
            label={movedLabel}
            infoText="The number of positions you gained or lost on the leaderboard since yesterday."
          >
            {isUp || isDown ? (
              <div className="flex items-center gap-[4px]">
                <Image
                  src={isUp ? "/images/v2/leaderboard/ArrowUp.png" : "/images/v2/leaderboard/ArrowDown.png"}
                  alt=""
                  width={14}
                  height={14}
                  className="w-[14px] h-[14px] object-contain"
                />
                <span className={`text-[18px] sm:text-[20px] font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
                  {movedUpAbs}
                </span>
              </div>
            ) : (
              <span className="text-[18px] sm:text-[20px] font-bold text-[#9CA3AF]">—</span>
            )}
          </StatCard>
        </div>
      </div>
    </>
  );
}
