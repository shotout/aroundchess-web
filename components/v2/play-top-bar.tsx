"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProfileStore } from "@/app/store/profile";
import { InfoTooltip } from "@/components/v2/info-tooltip";

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
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function StatItem({
  icon,
  label,
  infoText,
  children,
}: {
  icon: string;
  label: string;
  infoText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <Image src={icon} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain shrink-0" />
      <span className="text-[11px] sm:text-[12px] text-[#6B7280] whitespace-nowrap">{label}</span>
      {infoText ? (
        <InfoTooltip text={infoText} size={14} />
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
  children,
}: {
  icon: string;
  label: string;
  infoText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[4px]">
        <Image src={icon} alt="" width={18} height={18} className="w-[18px] h-[18px] object-contain shrink-0" />
        <span className="text-[11px] text-[#6B7280] whitespace-nowrap">{label}</span>
        {infoText ? (
          <InfoTooltip text={infoText} size={12} />
        ) : (
          <Image src="/images/v2/play/information.png" alt="info" width={12} height={12} className="w-[12px] h-[12px] object-contain shrink-0" />
        )}
      </div>
      <div className="pl-[2px]">{children}</div>
    </div>
  );
}

function InactiveCover({ gamesRemaining }: { gamesRemaining?: number }) {
  const text =
    gamesRemaining && gamesRemaining > 0
      ? `${gamesRemaining} more ${gamesRemaining === 1 ? "game" : "games"} to join the Leaderboard.`
      : "Play more games to join the Leaderboard.";

  return (
    <div className="absolute inset-0 z-10 rounded-xl overflow-hidden flex items-center justify-center bg-[#C9EFFB]/95">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0px,transparent_70px,rgba(255,255,255,0.55)_70px,rgba(255,255,255,0.55)_110px)]" />
      <span className="relative px-4 text-center text-[12px] sm:text-[14px] font-semibold text-[#7ED2EC]">
        {text}
      </span>
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

export function PlayTopBar({ streak, elo, rank, movedUp, canJoin, gamesRemaining, isInactive }: PlayTopBarProps) {
  const { profile } = useProfileStore();
  const username = profile?.username || profile?.name || "User";
  const [showEloModal, setShowEloModal] = useState(false);

  const isUp = movedUp !== null && movedUp > 0;
  const isDown = movedUp !== null && movedUp < 0;
  const movedUpAbs = movedUp !== null ? Math.abs(movedUp) : 0;
  const movedLabel = isDown ? "Moved Down" : "Moved Up";

  return (
    <div data-tour-anchor="play-top-bar" className="flex flex-col">
      {showEloModal && <EloModal onClose={() => setShowEloModal(false)} />}

      {/* Greeting row — mobile only */}
      <div className="sm:hidden flex items-center mb-[10px]">
        <span className="text-[16px] text-[#111827]">
          Hello, <span className="font-bold">{username}</span>
        </span>
      </div>

      {/* Greeting row — desktop only, sits right above the card */}
      <div className="hidden sm:flex items-center justify-between mb-[6px]">
        <span className="text-[18px] text-[#111827]">
          Hello, <span className="font-bold">{username}</span>
        </span>
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

      {/* ── MOBILE card ── */}
      <div className="sm:hidden bg-[linear-gradient(to_bottom,#F8FDFF,#E6F7FE)] rounded-xl border border-[#E5E7EB] px-[16px] py-[14px] shadow-xl">
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
            className="flex items-center gap-[4px] font-bold text-[15px] text-[#111827] hover:text-[#221AE9] transition-colors"
          >
            <span>Leaderboard</span>
            <span className="text-[#221AE9] text-xl leading-none">›</span>
          </Link>
        </div>

        {/* Stats row */}
        <div className="relative flex items-start justify-between mb-[14px] bg-white p-2 rounded-xl">
          {isInactive && <InactiveCover gamesRemaining={gamesRemaining} />}
          <MobileStatItem icon="/images/v2/play/elo.png" label="Your ELO">
            <span className="text-[20px] font-bold text-[#111827]">{elo || "—"}</span>
          </MobileStatItem>

          <MobileStatItem icon="/images/v2/play/rank.png" label="Your Rank">
            <span className="text-[20px] font-bold text-[#111827]">{toOrdinal(rank)}</span>
          </MobileStatItem>

          <MobileStatItem
            icon="/images/v2/play/rank_move.png"
            label={movedLabel}
            infoText="The number of positions you gained or lost on the leaderboard since yesterday."
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
                  {movedUpAbs}
                </span>
              </div>
            ) : (
              <span className="text-[20px] font-bold text-[#9CA3AF]">—</span>
            )}
          </MobileStatItem>
        </div>

        {canJoin === false && !isInactive && (
          <p className="text-[12px] text-[#6B7280] mb-[10px]">
            {gamesRemaining} more games to join the Leaderboard.
          </p>
        )}

        {/* What is an ELO Score — bottom of mobile card */}
        <button
          onClick={() => setShowEloModal(true)}
          className="text-[#221AE9] font-medium text-[13px] hover:underline"
        >
          What is an ELO Score?
        </button>
      </div>

      {/* ── DESKTOP card ── */}
      <div className="hidden sm:block bg-[linear-gradient(to_bottom,white,#E6F7FE)] rounded-xl border px-[35px] py-[14px] shadow-xl pb-5">
        <div className="flex items-center gap-x-[24px]">
          {/* Title + Streak */}
          <div className="flex items-center gap-[30px] shrink-0 pt-2">
            <span className="font-bold text-[30px] text-[#221AE9] whitespace-nowrap">
              Play VS AI
            </span>
            <div className="flex items-center gap-[5px] pl-3">
              <Image
                src={streak >= 3 ? "/images/v2/sidebar/mode_heat_on.png" : "/images/v2/sidebar/mode_heat.png"}
                alt="streak"
                width={32}
                height={38}
                className="w-[32px] h-[38px] object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold text-[#2e3133]">{streak} Day</span>
                <span className="text-[15px] font-base text-[#2e3133]">Streak</span>
              </div>
            </div>
          </div>

          {/* Stats — centered */}
          <div className="relative flex-1 flex flex-col items-center gap-[6px] bg-white rounded-md p-2">
            {isInactive && <InactiveCover gamesRemaining={gamesRemaining} />}
            <div className="flex items-center justify-center gap-[30px]">
              <StatItem icon="/images/v2/play/elo.png" label="Your ELO">
                <span className="text-xl font-bold text-[#111827]">{elo || "—"}</span>
              </StatItem>

              <StatItem icon="/images/v2/play/rank.png" label="Your Rank">
                <span className="text-xl font-bold text-[#111827]">{toOrdinal(rank)}</span>
              </StatItem>

              <StatItem
                icon="/images/v2/play/rank_move.png"
                label={movedLabel}
                infoText="The number of positions you gained or lost on the leaderboard since yesterday."
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
                      {movedUpAbs}
                    </span>
                  </div>
                ) : (
                  <span className="text-[18px] font-bold text-[#9CA3AF]">—</span>
                )}
              </StatItem>
            </div>
            {canJoin === false && !isInactive && (
              <p className="text-[12px] text-[#6B7280]">
                {gamesRemaining} more games to join the Leaderboard.
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
