"use client";

import Image from "next/image";
import Link from "next/link";
import { InfoTooltip } from "@/components/v2/info-tooltip";
import { formatNumber } from "@/components/v2/format-number";
import { ShareRankButton } from "@/components/v2/share-rank-button";

interface PlayVsAiTopStatsProps {
  elo: number;
  rank: number;
  movedUp: number | null;
}

function toOrdinal(n: number): string {
  if (n <= 0) return "—";
  // Product rule: only the top three ranks get st/nd/rd — every other rank
  // is plain "th" (4th, 21th, 10002th), per design.
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return formatNumber(n) + suffix;
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
    <div className="flex items-center gap-[6px] sm:gap-[8px] min-[1500px]:gap-[10px] min-w-0 shrink-0">
      <Image
        src={icon}
        alt=""
        width={44}
        height={44}
        className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] min-[1500px]:w-[36px] min-[1500px]:h-[36px] min-[1800px]:w-[40px] min-[1800px]:h-[40px] object-contain shrink-0"
      />
      {/* Mobile: label on top, value underneath. Desktop: everything on one line. */}
      <span className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-[8px] min-[1500px]:gap-[10px] min-w-0 leading-tight">
        <span className="flex items-center gap-[3px] sm:gap-[4px]">
          <span className="text-[11px] sm:text-[13px] min-[1500px]:text-[14px] min-[1800px]:text-[15px] text-[#6B7280] whitespace-nowrap">{label}</span>
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
    /* `sm:contents` makes this wrapper disappear from layout from 640px up, so
       the card below goes back to being the direct flex child of the page
       column exactly as it was — desktop is untouched. Below 640px the wrapper
       is a column that puts Share on its own line under the stats, which is
       where the leaderboard card on /play already puts it. It cannot go INSIDE
       the stats row: that row is `justify-between` with a 6px gap, and a fourth
       item would squeeze ELO / Rank / Moved on a 360px screen. */
    <div className="flex flex-col gap-[10px] sm:contents">
      <div className="flex items-center justify-between gap-[8px] sm:hidden">
        <div className="flex min-w-0 items-center gap-[6px]">
          <Image
            src="/images/v2/play/leaderboard.png"
            alt="Leaderboard"
            width={33}
            height={33}
            className="w-[28px] h-[28px] object-contain shrink-0"
          />
          <Link
            href="/leaderboard"
            className="flex items-center gap-[4px] font-bold text-[16px] text-[#221AE9]"
          >
            <span>Leaderboard</span>
            <span className="text-[#221AE9] text-xl leading-none">›</span>
          </Link>
        </div>
        {/* Renders nothing while the account is still calibrating. */}
        <ShareRankButton />
      </div>

      {/* Two things this row has to survive, both seen in the wild:
          - It used to centre the items behind fixed `sm:gap-[60px]
            lg:gap-[250px]` gaps. Flex gaps never shrink, so that forced a
            ~1416px minimum against the ~1150px available beside the sidebar at
            1470px — the Share button was pushed off the right edge and the
            whole page read as cut off. Hence justify-between, which derives
            spacing from the width that actually exists.
          - Uncapped, though, justify-between poured every spare pixel of a wide
            monitor into the gaps and left the items stranded. So the card stays
            full width while the row inside is capped: spare width becomes
            margin either side, and the gaps stay in a sane range.
          Mobile is unaffected — it was already justify-between at gap-[6px],
          and max-w-[1240px] is a no-op below that width. */}
      <div className="bg-white/70 rounded-xl border border-[#E5E7EB] shadow-sm px-[10px] sm:px-[28px] min-[1500px]:px-[36px] py-[10px] sm:py-[14px] min-[1500px]:py-[18px] flex justify-center">
        <div className="flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-[6px] sm:gap-x-[16px] gap-y-[10px]">
        <StatItem
        icon="/images/v2/leaderboard/your_elo.png"
        label="Your ELO"
        infoText="Your current chess skill rating."
        infoAlign="left"
      >
        <span className="text-[14px] sm:text-[25px] min-[1500px]:text-[28px] min-[1800px]:text-[32px] font-bold text-[#111827]">{elo || "—"}</span>
        </StatItem>

        <StatItem
        icon="/images/v2/leaderboard/your_rank.png"
        label="Your Rank"
        infoText="Your current position on the leaderboard."
      >
        <span className="text-[14px] sm:text-[25px] min-[1500px]:text-[28px] min-[1800px]:text-[32px] font-bold text-[#111827]">{toOrdinal(rank)}</span>
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
              className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] min-[1500px]:w-[15px] min-[1500px]:h-[15px] min-[1800px]:w-[17px] min-[1800px]:h-[17px] object-contain"
            />
            <span className={`text-[14px] sm:text-[25px] min-[1500px]:text-[28px] min-[1800px]:text-[32px] font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
              {formatNumber(movedUpAbs)}
            </span>
          </span>
        ) : (
          <span className="text-[14px] sm:text-[20px] min-[1500px]:text-[23px] min-[1800px]:text-[26px] font-bold text-[#9CA3AF]">—</span>
        )}
        </StatItem>

        <div className="hidden sm:block">
          <ShareRankButton />
        </div>

        {/* Desktop end of the row, per the mockup — same trophy + link the
            /play top bar carries. Mobile already has it in the header above,
            so this is sm-and-up only. */}
        <Link
          href="/leaderboard"
          className="hidden sm:flex items-center gap-[6px] font-bold text-[17px] min-[1500px]:text-lg text-[#111827] hover:text-[#221AE9] transition-colors shrink-0 whitespace-nowrap"
        >
          <Image
            src="/images/v2/play/leaderboard.png"
            alt="Leaderboard"
            width={48}
            height={44}
            className="h-[34px] min-[1500px]:h-[40px] w-auto object-contain"
          />
          Leaderboard
          <span className="text-[#221AE9] text-2xl leading-none">›</span>
        </Link>
        </div>
      </div>

    </div>
  );
}
