"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useProfileStore } from "@/app/store/profile";
import { useHasPlayedToday } from "@/app/store/streak";
import { InfoTooltip } from "@/components/v2/info-tooltip";
import { ELO_INFO, RANK_INFO, MOVED_INFO } from "@/components/v2/stat-info-text";
import { openDayStreakStatusModal } from "@/components/v2/hooks/useDayStreakModal";
import { formatNumber } from "@/components/v2/format-number";

interface PlayTopBarProps {
  streak: number;
  elo: number;
  rank: number;
  movedUp: number | null;
  canJoin?: boolean;
  gamesRemaining?: number;
  isInactive?: boolean;
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
  muted,
  children,
}: {
  icon: string;
  label: string;
  infoText?: string;
  infoAlign?: "left" | "right" | "center";
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <Image
        src={icon}
        alt=""
        width={22}
        height={22}
        className={`w-[22px] h-[22px] object-contain shrink-0 ${muted ? "grayscale opacity-70" : ""}`}
      />
      <span className="text-[11px] sm:text-[12px] text-[#6B7280] whitespace-nowrap">{label}</span>
      {infoText ? (
        <InfoTooltip text={infoText} size={14} align={infoAlign} />
      ) : (
        <Image src="/images/v2/play/information.png" alt="info" width={14} height={14} className="w-[14px] h-[14px] object-contain shrink-0" />
      )}
      {children}
    </div>
  );
}

function MobileStatItem({
  icon,
  label,
  infoText,
  infoAlign = "right",
  muted,
  children,
}: {
  icon: string;
  label: string;
  infoText?: string;
  infoAlign?: "left" | "right" | "center";
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[4px]">
        <Image
          src={icon}
          alt=""
          width={18}
          height={18}
          className={`w-[18px] h-[18px] object-contain shrink-0 ${muted ? "grayscale opacity-70" : ""}`}
        />
        <span className="text-[11px] text-[#6B7280] whitespace-nowrap">{label}</span>
        {infoText ? (
          <InfoTooltip text={infoText} size={12} align={infoAlign} />
        ) : (
          <Image src="/images/v2/play/information.png" alt="info" width={12} height={12} className="w-[12px] h-[12px] object-contain shrink-0" />
        )}
      </div>
      <div className="pl-[2px]">{children}</div>
    </div>
  );
}

/** Frozen blue cover over the ELO/rank stats for an inactive (frozen) player.
 *  The uncalibrated ("join") state is no longer a cover — it greys the stats
 *  block and shows "Calibrating…" for the ELO instead. */
function StatsCover({ gamesRemaining }: { gamesRemaining?: number }) {
  // A frozen player already qualified once, so "join the Leaderboard" is the
  // wrong nudge — they need to play again to reappear.
  const text =
    gamesRemaining && gamesRemaining > 0
      ? `${gamesRemaining} more ${gamesRemaining === 1 ? "game" : "games"} to join the Leaderboard.`
      : "Play a game to appear on the leaderboard again.";

  return (
    /* Semi-transparent so the frozen ELO/rank stay legible underneath, with the
       note pinned to the bottom of the block (design). */
    <div className="absolute inset-0 z-10 rounded-xl overflow-hidden flex items-end justify-center bg-[#C9EFFB]/80">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0px,transparent_70px,rgba(255,255,255,0.55)_70px,rgba(255,255,255,0.55)_110px)]" />
      {text && (
        <span className="relative px-4 pb-[6px] text-center text-[10px] sm:text-[12px] font-semibold text-[#111827]/50">
          {text}
        </span>
      )}
    </div>
  );
}

function EloModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl px-[32px] py-[28px] max-w-[460px] w-full mx-4 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[14px] right-[18px] text-[#9CA3AF] hover:text-[#374151] text-[20px] leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="font-bold text-[18px] text-[#111827] mb-[16px]">
          What is an ELO Score?
        </h2>

        <p className="text-[14px] text-[#374151] mb-[12px]">
          Your ELO score is a number that represents your current chess skill level.
          Every time you play a rated game, your ELO changes based on the result
          and the strength of your opponent.
        </p>
        <p className="text-[14px] text-[#374151] mb-[12px]">
          Winning against stronger opponents will increase your rating more, while
          losing to lower-rated opponents may cause a larger decrease.
        </p>
        <p className="text-[14px] text-[#374151] mb-[24px]">
          Your ELO helps match you with players of similar strength and determines
          your position on the leaderboard.*
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#221AE9] text-white py-[13px] rounded-full font-semibold text-[15px] hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/** Greeting row ("Hello, username" + "What is an ELO Score?") — rendered by the
 *  page above/outside the bordered content container. */
export function PlayGreeting() {
  const { profile } = useProfileStore();
  const username = profile?.username || profile?.name || "User";
  const [showEloModal, setShowEloModal] = useState(false);

  return (
    <div className="flex flex-col">
      {showEloModal && <EloModal onClose={() => setShowEloModal(false)} />}

      {/* Greeting row — mobile only */}
      <div className="sm:hidden flex items-center gap-[12px]">
        <span className="text-[16px] text-[#111827]">
          Hello <span className="font-bold">{username},</span>
        </span>
        <Link
          href="/profile"
          aria-label="Edit profile"
          className="flex items-center gap-[6px] border border-[#221AE9] text-[#221AE9] rounded-lg px-[14px] py-[5px] text-[14px] font-semibold"
        >
          <Pencil size={14} />
          Edit
        </Link>
      </div>

      {/* Greeting row — desktop only */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <span className="text-[18px] text-[#111827]">
            Hello <span className="font-bold">{username},</span>
          </span>
          <Link
            href="/profile"
            aria-label="Edit profile"
            className="flex items-center gap-[6px] border border-[#221AE9] text-[#221AE9] rounded-lg px-[14px] py-[5px] text-[14px] font-semibold hover:bg-[#221AE9]/5 transition-colors"
          >
            <Pencil size={14} />
            Edit
          </Link>
        </div>
        <button
          onClick={() => setShowEloModal(true)}
          className="flex items-center gap-[6px] text-[#221AE9] font-medium text-[14px] hover:underline"
        >
          <Image
            src="/images/v2/play/Question.png"
            alt="?"
            width={18}
            height={18}
            className="w-[18px] h-[18px] object-contain"
          />
          What is an ELO Score?
        </button>
      </div>
    </div>
  );
}

export function PlayTopBar({ streak, elo, rank, movedUp, canJoin, gamesRemaining, isInactive }: PlayTopBarProps) {
  const [showEloModal, setShowEloModal] = useState(false);
  // Flame lights up only when today's game is played — same rule as the
  // streak status modal's on/off flame.
  const hasPlayedToday = useHasPlayedToday();

  const isUp = movedUp !== null && movedUp > 0;
  const isDown = movedUp !== null && movedUp < 0;
  const movedUpAbs = movedUp !== null ? Math.abs(movedUp) : 0;
  const movedLabel = isDown ? "Moved Down" : "Moved Up";

  // Two mutually-exclusive stats covers (see StatsCover), matching the
  // leaderboard page's convention:
  //  • freeze (blue): player is frozen after inactivity — can_join === false
  //    && is_inactive === true (passed in as isInactive).
  //  • join (grey): uncalibrated player who still needs games to join —
  //    can_join === false && games remaining > 0, and is not frozen.
  const showFreezeCover = isInactive === true;
  const showJoinCover =
    canJoin === false && !showFreezeCover && (gamesRemaining ?? 0) > 0;
  const leaderboardNote =
    gamesRemaining && gamesRemaining > 0
      ? `${gamesRemaining} more ${gamesRemaining === 1 ? "game" : "games"} to join the Leaderboard.`
      : null;

  return (
    <div data-tour-anchor="play-top-bar" className="flex flex-col">
      {showEloModal && <EloModal onClose={() => setShowEloModal(false)} />}

      {/* ── MOBILE card ── */}
      <div className="sm:hidden bg-[linear-gradient(to_bottom,#EFFAFF,#C9E9FC)] rounded-xl border border-[#E5E7EB] px-[16px] py-[14px] shadow-xl">
        <div className="flex items-center justify-between mb-[12px]">
          <Image
            src="/images/v2/play/leaderboard.png"
            alt="Leaderboard"
            width={33}
            height={33}
            className="w-[33px] h-[33px] object-contain shrink-0"
          />
          <Link
            href="/leaderboard"
            className="flex items-center gap-[4px] font-bold text-[16px] text-[#221AE9]"
          >
            <span>Leaderboard</span>
            <span className="text-[#221AE9] text-xl leading-none">›</span>
          </Link>
        </div>

        {/* Stats row */}
        <div
          className={`relative mb-[14px] p-2 rounded-xl ${
            showJoinCover ? "bg-[#E5E7EB]" : "bg-white"
          } ${showFreezeCover ? "pb-[26px]" : ""}`}
        >
          {showFreezeCover && <StatsCover gamesRemaining={gamesRemaining} />}
          <div className="flex items-start justify-between">
            <MobileStatItem icon="/images/v2/play/elo.png" label="Your ELO" infoText={ELO_INFO} infoAlign="left" muted={showJoinCover}>
              {showJoinCover ? (
                <span className="text-[12px] font-semibold text-[#6B7280] whitespace-nowrap">Calibrating…</span>
              ) : (
                <span className="text-[20px] font-bold text-[#111827]">{elo || "—"}</span>
              )}
            </MobileStatItem>

            <MobileStatItem icon="/images/v2/play/rank.png" label="Your Rank" infoText={RANK_INFO} infoAlign="center" muted={showJoinCover}>
              <span className={`text-[20px] font-bold ${showJoinCover ? "text-[#6B7280]" : "text-[#111827]"}`}>
                {rank > 0 && rank < 10 ? `0${toOrdinal(rank)}` : toOrdinal(rank)}
              </span>
            </MobileStatItem>

            <MobileStatItem
              icon="/images/v2/play/rank_move.png"
              label={movedLabel}
              infoText={MOVED_INFO}
              infoAlign="right"
              muted={showJoinCover}
            >
              {isUp || isDown ? (
                <div className="flex items-center gap-[4px]">
                  <Image
                    src={isUp ? "/images/v2/play/up.png" : "/images/v2/play/down.png"}
                    alt=""
                    width={16}
                    height={16}
                    className="w-[16px] h-[16px] object-contain"
                  />
                  <span className={`text-[20px] font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
                    {formatNumber(movedUpAbs)}
                  </span>
                </div>
              ) : (
                <span className="text-[20px] font-bold text-[#9CA3AF]">—</span>
              )}
            </MobileStatItem>
          </div>
          {showJoinCover && leaderboardNote && (
            <p className="mt-[8px] text-center text-[11px] font-medium text-[#6B7280]">
              {leaderboardNote}
            </p>
          )}
        </div>

        {/* What is an ELO Score — bottom of mobile card */}
        <button
          onClick={() => setShowEloModal(true)}
          className="text-[#221AE9] font-medium text-[13px] underline"
        >
          What is an ELO Score?
        </button>
      </div>

      {/* ── DESKTOP card ── */}
      <div className="hidden sm:block bg-[linear-gradient(to_bottom,white,#E6F7FE)] rounded-xl border px-[35px] py-[14px] shadow-xl pb-5">
        <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
          {/* Title + Streak */}
          <div className="flex items-center gap-[16px] xl:gap-[30px] shrink-0 pt-2">
            <span className="font-bold text-[clamp(24px,2vw,30px)] text-[#221AE9] whitespace-nowrap">
              Play VS AI
            </span>
            <button
              type="button"
              onClick={() => openDayStreakStatusModal(streak)}
              className="flex items-center gap-[5px] pl-3 cursor-pointer"
              aria-label="Show day streak"
            >
              <Image
                src={hasPlayedToday ? "/images/v2/sidebar/mode_heat_on.png" : "/images/v2/sidebar/mode_heat.png"}
                alt="streak"
                width={32}
                height={38}
                className="w-[32px] h-[38px] object-contain"
              />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-[15px] font-bold text-[#2e3133]">{formatNumber(streak)} Day</span>
                <span className="text-[15px] font-base text-[#2e3133]">Streak</span>
              </div>
            </button>
          </div>

          {/* Stats — centered */}
          <div
            className={`relative flex-1 min-w-[300px] flex flex-col items-center gap-[6px] rounded-md p-2 ${
              showJoinCover ? "bg-[#E5E7EB]" : "bg-white"
            } ${showFreezeCover ? "pb-[24px]" : ""}`}
          >
            {showFreezeCover && <StatsCover gamesRemaining={gamesRemaining} />}
            <div className="flex flex-wrap items-center justify-center gap-x-[16px] xl:gap-x-[30px] gap-y-[6px]">
              <StatItem icon="/images/v2/play/elo.png" label="Your ELO" infoText={ELO_INFO} infoAlign="left" muted={showJoinCover}>
                {showJoinCover ? (
                  <span className="text-[13px] font-semibold text-[#6B7280] whitespace-nowrap">Calibrating…</span>
                ) : (
                  <span className="text-xl font-bold text-[#111827]">{elo || "—"}</span>
                )}
              </StatItem>

              <StatItem icon="/images/v2/play/rank.png" label="Your Rank" infoText={RANK_INFO} infoAlign="left" muted={showJoinCover}>
                <span className={`text-xl font-bold ${showJoinCover ? "text-[#6B7280]" : "text-[#111827]"}`}>{toOrdinal(rank)}</span>
              </StatItem>

              <StatItem
                icon="/images/v2/play/rank_move.png"
                label={movedLabel}
                infoText={MOVED_INFO}
                infoAlign="right"
                muted={showJoinCover}
              >
                {isUp || isDown ? (
                  <div className="flex items-center gap-[4px]">
                    <Image
                      src={isUp ? "/images/v2/play/up.png" : "/images/v2/play/down.png"}
                      alt=""
                      width={16}
                      height={16}
                      className="w-[16px] h-[16px] object-contain"
                    />
                    <span className={`text-xl font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
                      {formatNumber(movedUpAbs)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[18px] font-bold text-[#9CA3AF]">—</span>
                )}
              </StatItem>
            </div>
            {showJoinCover && leaderboardNote && (
              <p className="text-center text-[12px] font-medium text-[#6B7280]">
                {leaderboardNote}
              </p>
            )}
          </div>

          {/* Leaderboard */}
          <Link
            href="/leaderboard"
            className="flex items-center gap-[8px] font-bold text-xl text-[#111827] hover:text-[#221AE9] transition-colors shrink-0"
          >
            <Image
              src="/images/v2/play/leaderboard.png"
              alt="Leaderboard"
              width={48}
              height={44}
              className="h-[44px] w-auto object-contain"
            />
            Leaderboard
            <span className="text-[#221AE9] text-2xl leading-none">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
