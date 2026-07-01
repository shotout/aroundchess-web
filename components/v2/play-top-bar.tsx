"use client";

import Image from "next/image";
import Link from "next/link";

interface PlayTopBarProps {
  streak: number;
  elo: number;
  rank: number;
  movedUp: number | null;
  canJoin?: boolean;
  gamesRemaining?: number;
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
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <Image src={icon} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain shrink-0" />
      <span className="text-[11px] sm:text-[12px] text-[#6B7280] whitespace-nowrap">{label}</span>
      <Image src="/images/v2/play/information.png" alt="info" width={14} height={14} className="w-[14px] h-[14px] object-contain shrink-0" />
      {children}
    </div>
  );
}

export function PlayTopBar({ streak, elo, rank, movedUp, canJoin, gamesRemaining }: PlayTopBarProps) {
  const isUp = movedUp !== null && movedUp > 0;
  const isDown = movedUp !== null && movedUp < 0;
  const movedUpAbs = movedUp !== null ? Math.abs(movedUp) : 0;

  return (
    <div className="bg-[linear-gradient(to_bottom,white,#E6F7FE)] rounded-xl border px-[20px] sm:px-[35px] py-[14px] shadow-xl pb-5">
      <div className="flex items-center gap-x-[16px] sm:gap-x-[24px] ">
        {/* Title + Streak */}
        <div className="flex items-center gap-[30px] shrink-0 pt-2">
          <span className="font-bold text-[18px] sm:text-[30px] text-[#221AE9] whitespace-nowrap">
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
        <div className="flex-1 flex flex-col items-center gap-[6px] bg-white rounded-md p-2">
          <div className="flex items-center justify-center gap-[16px] sm:gap-[30px]">
            {/* ELO */}
            <StatItem icon="/images/v2/play/elo.png" label="Your ELO">
              <span className="text-[16px] sm:text-xl font-bold text-[#111827]">
                {elo || "—"}
              </span>
            </StatItem>

            {/* Rank */}
            <StatItem icon="/images/v2/play/rank.png" label="Your Rank">
              <span className="text-[16px] sm:text-xl font-bold text-[#111827]">
                {toOrdinal(rank)}
              </span>
            </StatItem>

            {/* Moved Up */}
            <StatItem icon="/images/v2/play/rank_move.png" label="Moved Up">
              {isUp || isDown ? (
                <div className="flex items-center gap-[4px]">
                  <Image
                    src={isUp ? "/images/v2/play/up.png" : "/images/v2/play/down.png"}
                    alt=""
                    width={16}
                    height={16}
                    className="w-[16px] h-[16px] object-contain"
                  />
                  <span className={`text-[16px] sm:text-xl font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
                    {movedUpAbs}
                  </span>
                </div>
              ) : (
                <span className="text-[16px] sm:text-[18px] font-bold text-[#9CA3AF]">—</span>
              )}
            </StatItem>
          </div>
          {canJoin === false && (
            <p className="text-[12px] text-[#6B7280]">
              {gamesRemaining} more games to join the Leaderboard.
            </p>
          )}
        </div>

        {/* Leaderboard */}
        <Link
          href="/leaderboard"
          className="flex items-center gap-[8px] font-bold text-[14px] sm:text-xl text-[#111827] hover:text-[#221AE9] transition-colors shrink-0"
        >
          <Image
            src="/images/v2/play/leaderboard.png"
            alt="Leaderboard"
            width={48}
            height={44}
            className="h-[40px] sm:h-[44px] w-auto object-contain"
          />
          Leaderboard
          <span className="text-[#221AE9] text-2xl leading-none">›</span>
        </Link>
      </div>

    </div>
  );
}
