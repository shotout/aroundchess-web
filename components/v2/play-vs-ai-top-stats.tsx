"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InfoTooltip } from "@/components/v2/info-tooltip";
import { formatNumber } from "@/components/v2/format-number";
import { ShareRankButton } from "@/components/v2/share-rank-button";
import { EloScoreModal } from "@/components/v2/elo-score-modal";

interface PlayVsAiTopStatsProps {
  elo: number;
  rank: number;
  movedUp: number | null;
}

// Product rule: only the top three ranks get st/nd/rd — every other rank is
// plain "th" (4th, 21th, 10002th), per design.
function ordinalSuffix(n: number): string {
  return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
}

function toOrdinal(n: number): string {
  if (n <= 0) return "—";
  return formatNumber(n) + ordinalSuffix(n);
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

/** Mobile card cell: label + info icon on top, value underneath, no leading
 *  icon — the mockup keeps the row icon-free so three cells fit a 360px screen. */
function MobileStatCell({
  label,
  infoText,
  infoAlign = "center",
  children,
}: {
  label: string;
  infoText: string;
  infoAlign?: "left" | "right" | "center";
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-[2px]">
      <span className="flex items-center gap-[4px]">
        <span className="text-[12px] min-[390px]:text-[13px] text-[#4B5563] whitespace-nowrap">{label}</span>
        <InfoTooltip text={infoText} size={14} align={infoAlign} />
      </span>
      {children}
    </div>
  );
}

export function PlayVsAiTopStats({ elo, rank, movedUp }: PlayVsAiTopStatsProps) {
  const isUp = movedUp !== null && movedUp > 0;
  const isDown = movedUp !== null && movedUp < 0;
  const movedUpAbs = movedUp !== null ? Math.abs(movedUp) : 0;
  const movedLabel = isDown ? "Moved Down" : "Moved Up";
  const [showEloModal, setShowEloModal] = useState(false);
  // Mockup renders the rank zero-padded with a smaller ordinal suffix ("08th").
  const rankPadded = rank > 0 && rank < 10 ? `0${formatNumber(rank)}` : formatNumber(rank);
  const rankSuffix = ordinalSuffix(rank);

  return (
    /* `sm:contents` makes this wrapper disappear from layout from 640px up, so
       the desktop card goes back to being the direct flex child of the page
       column exactly as it was — desktop is untouched. Mobile and desktop are
       two separate cards because the mockup restructures the mobile one: the
       Leaderboard link and Share move inside it, above a white stats panel. */
    <div className="sm:contents">
      {showEloModal && <EloScoreModal onClose={() => setShowEloModal(false)} />}

      {/* ── MOBILE card, per the mockup: header + Share, a white stats panel,
             and the ELO explainer link, all inside one gradient card. The
             desktop card below is a separate tree and stays untouched. ── */}
      <div className="sm:hidden rounded-[16px] border border-[#E5E7EB] bg-[linear-gradient(to_bottom,#FFFFFF,#ABE3FF)] shadow-md px-[14px] py-[14px]">
        <div className="flex items-center justify-between gap-[8px]">
          <Link href="/leaderboard" className="flex min-w-0 items-center gap-[8px]">
            <Image
              src="/images/v2/play/leaderboard.png"
              alt=""
              width={44}
              height={44}
              className="w-[38px] h-[38px] object-contain shrink-0"
            />
            <span className="font-bold text-[21px] text-[#111827] truncate">Leaderboard</span>
            <span className="text-[#221AE9] text-[24px] font-light leading-none shrink-0">›</span>
          </Link>
          {/* Renders nothing while the account is still calibrating. */}
          <ShareRankButton className="rounded-[10px] px-[14px] py-[9px] text-[14px] [&>img]:w-[18px] [&>img]:h-[18px]" />
        </div>

        <div className="mt-[12px] flex items-start justify-between gap-[8px] rounded-[12px] bg-white px-[13px] py-[12px]">
          <MobileStatCell
            label="Your ELO"
            infoText="Your current chess skill rating."
            infoAlign="left"
          >
            <span className="text-[21px] font-bold text-[#111827] leading-tight">{elo || "—"}</span>
          </MobileStatCell>

          <MobileStatCell
            label="Your Rank"
            infoText="Your current position on the leaderboard."
          >
            {rank > 0 ? (
              <span className="text-[21px] font-bold text-[#111827] leading-tight">
                {rankPadded}
                <span className="text-[14px]">{rankSuffix}</span>
              </span>
            ) : (
              <span className="text-[21px] font-bold text-[#9CA3AF] leading-tight">—</span>
            )}
          </MobileStatCell>

          <MobileStatCell
            label={movedLabel}
            infoText="The number of positions you gained or lost on the leaderboard since yesterday."
            infoAlign="right"
          >
            {isUp || isDown ? (
              <span className="flex items-center gap-[4px]">
                <Image
                  src={isUp ? "/images/v2/leaderboard/ArrowUp.png" : "/images/v2/leaderboard/ArrowDown.png"}
                  alt=""
                  width={20}
                  height={20}
                  className="w-[17px] h-[17px] object-contain shrink-0"
                />
                {/* Direction lives in the arrow, so the number stays dark (mockup). */}
                <span className="text-[21px] font-bold text-[#111827] leading-tight">
                  {formatNumber(movedUpAbs)}
                </span>
              </span>
            ) : (
              <span className="text-[21px] font-bold text-[#9CA3AF] leading-tight">—</span>
            )}
          </MobileStatCell>
        </div>

        <button
          type="button"
          onClick={() => setShowEloModal(true)}
          className="mt-[12px] text-[#221AE9] font-medium text-[14px] underline"
        >
          What is an ELO Score?
        </button>
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
      <div className="hidden bg-white/70 rounded-xl border border-[#E5E7EB] shadow-sm px-[10px] sm:px-[28px] min-[1500px]:px-[36px] py-[10px] sm:py-[14px] min-[1500px]:py-[18px] sm:flex justify-center">
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
