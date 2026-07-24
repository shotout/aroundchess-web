"use client";

import Link from "next/link";
import Image from "next/image";
import { Game } from "@/components/game-history/types/GameHistoryTypes";
import { useGameHistoryAnalysis } from "@/components/v2/hooks/useGameHistoryAnalysis";
import { InfoTooltip } from "@/components/v2/info-tooltip";
import { PieceAvatar } from "@/components/v2/piece-avatar";
import { findRosterOpponentByName } from "@/components/v2/play-vs-ai-roster-data";

const ELO_UNRATED_INFO =
  "You used a “Hint” or “Undo Move” in this game. As a result, no ELO points are gained or lost.";

/** The opponent avatar: the matching AI roster face for vs-AI games, otherwise
 *  the seeded chess-piece placeholder (chess.com / imported games). */
function OpponentAvatar({ opponent }: { opponent: string }) {
  const roster = findRosterOpponentByName(opponent);
  if (roster) {
    return (
      <Image
        src={roster.img}
        alt={roster.name}
        width={44}
        height={44}
        className="w-[36px] h-[36px] rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <PieceAvatar
      seed={opponent || "?"}
      className="w-[36px] h-[36px]"
      pieceClassName="w-[16px] h-[20px]"
    />
  );
}

interface PlayRecentGamesProps {
  games: Game[];
  isLoading: boolean;
}

function formatDateTime(dateStr: string): { date: string; time: string } {
  try {
    const d = new Date(dateStr);
    const date = d
      .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
      .replace(/\//g, ".");
    const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  } catch {
    return { date: dateStr, time: "" };
  }
}

function GameRow({ game }: { game: Game }) {
  const result = game.result?.toLowerCase() ?? "";
  const isWin = result === "win";
  const isLoss = result === "loss";

  const resultLabel = isWin ? "WIN" : isLoss ? "LOSS" : "DRAW";
  const resultColor = isWin ? "text-green-600" : isLoss ? "text-red-500" : "text-gray-500";

  const eloRaw = Number(String(game.eloChange ?? "0").replace("+", ""));
  const eloDisplay = eloRaw > 0 ? `+${eloRaw}` : `${eloRaw}`;

  const isAI = game.source === "AI";
  // ELO wasn't rated (Hint/Undo used) — show the info icon + tooltip instead
  // of the up/down arrow. Undefined (older data) counts as processed.
  const eloProcessed = game.eloProcessed !== false;

  const { date, time } = game.date ? formatDateTime(game.date) : { date: "", time: "" };

  // Same analysis flow as the history page's GameCard.
  const { trigger, busy, modals } = useGameHistoryAnalysis(game);

  return (
    <div className="py-[12px] border-b border-[#F3F4F6] last:border-0">
      {modals}
      {/* Info row */}
      <div className="flex items-center gap-[10px] sm:gap-[16px]">
        {/* Opponent avatar */}
        <OpponentAvatar opponent={game.opponent} />

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#9CA3AF] leading-tight">
            {date}
            {time ? ` · ${time}` : ""}
            {" · "}
            <span className={`font-semibold ${resultColor} inline-flex items-center gap-[4px]`}>
              {resultLabel} ({eloDisplay})
              {!eloProcessed ? (
                <InfoTooltip
                  text={ELO_UNRATED_INFO}
                  size={14}
                  align="center"
                  iconSrc={isWin ? "/images/v2/play/Info.png" : "/images/v2/play/Info-red.png"}
                  maxWidthClass="max-w-[min(320px,85vw)]"
                />
              ) : (
                (isWin || isLoss) && (
                  <Image
                    src={isWin ? "/images/v2/play/up.png" : "/images/v2/play/down.png"}
                    alt={isWin ? "up" : "down"}
                    width={12}
                    height={12}
                  />
                )
              )}
            </span>
          </p>
          <p className="text-lg font-bold text-[#111827] truncate">
            {game.opponent}
            {game.rating ? ` (${game.rating})` : ""}
          </p>
        </div>

        {/* Source */}
        <span className="text-[12px] text-[#6B7280] shrink-0">{game.source}</span>

        {/* Action button — desktop only */}
        <button
          type="button"
          onClick={trigger}
          disabled={busy}
          className={`hidden sm:flex shrink-0 items-center justify-center gap-[5px] w-[250px] py-[12px] rounded-full text-sm sm:text-lg font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-70 ${
            isAI ? "bg-[#1B14CC]" : "bg-gradient-to-b from-[#0AD847] to-[#018F34]"
          }`}
        >
          <Image
            src={isAI ? "/images/v2/play/bar-chart.png" : "/images/v2/play/Eye.png"}
            alt=""
            width={16}
            height={16}
          />
          {isAI ? "Analyze Mistakes" : "See Mistakes"}
        </button>
      </div>

      {/* Action button — mobile full width */}
      <button
        type="button"
        onClick={trigger}
        disabled={busy}
        className={`sm:hidden mt-[10px] flex w-full items-center justify-center gap-[5px] py-[12px] rounded-full text-lg font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-70 ${
          isAI ? "bg-[#1B14CC]" : "bg-gradient-to-b from-[#0AD847] to-[#018F34]"
        }`}
      >
        <Image
          src={isAI ? "/images/v2/play/bar-chart.png" : "/images/v2/play/Eye.png"}
          alt=""
          width={16}
          height={16}
        />
        {isAI ? "Analyze Mistakes" : "See Mistakes"}
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-[16px] py-[12px] border-b border-[#F3F4F6]">
      <div className="w-[36px] h-[36px] rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 space-y-[6px]">
        <div className="h-[11px] bg-gray-200 rounded animate-pulse w-[55%]" />
        <div className="h-[13px] bg-gray-200 rounded animate-pulse w-[35%]" />
      </div>
      <div className="hidden sm:block h-[12px] w-[60px] bg-gray-200 rounded animate-pulse" />
      <div className="h-[32px] w-[130px] bg-gray-200 rounded-full animate-pulse shrink-0" />
    </div>
  );
}

export function PlayRecentGames({ games, isLoading }: PlayRecentGamesProps) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] px-[20px] py-[16px]">
      <div className="flex items-center justify-between mb-[4px]">
        <h2 className="font-bold text-xl text-[#111827]">Recent Games</h2>
        <Link
          href="/my-game-history"
          className="text-lg font-bold text-[#221AE9] flex items-center gap-[4px] hover:underline"
        >
          See all <span className=" text-2xl font-normal">›</span>
        </Link>
      </div>

      {isLoading ? (
        <div>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : games.length === 0 ? (
        <p className="text-[13px] text-[#6B7280] py-[32px] text-center">
          No recent games yet. Start playing!
        </p>
      ) : (
        <div>
          {games.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
