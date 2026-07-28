"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { Game } from "@/components/game-history/types/GameHistoryTypes";
import { useGameHistoryAnalysis } from "@/components/v2/hooks/useGameHistoryAnalysis";
import { InfoTooltip } from "@/components/v2/info-tooltip";
import { PieceAvatar } from "@/components/v2/piece-avatar";
import { findRosterOpponentByName } from "@/components/v2/play-vs-ai-roster-data";

const ELO_UNRATED_INFO = (
  <>
    You used a “ 
    <Image
      src="/images/v2/play/hint move.png"
      alt=""
      width={10}
      height={10}
      className="inline-block align-[-2px] mx-[3px]"
    />
     Hint” or “ 
    <Image
      src="/images/v2/play/undo move.png"
      alt=""
      width={13}
      height={13}
      className="inline-block align-[-1px] mx-[3px]"
    />
    Undo Move” in this game. As a result, no ELO points are gained or lost.
  </>
);

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

  // Button reflects analysis state: analyzed → green "See Mistakes" (shows the
  // result); not analyzed → blue "Analyze" (starts the analysis flow). The
  // trigger from useGameHistoryAnalysis already branches on the same flag.
  const analyzed = game.isAnalysis === true;
  const btnLabel = analyzed ? "See Mistakes" : "Analyze Mistakes";
  const btnIcon = analyzed ? "/images/v2/play/Eye.png" : "/images/v2/play/bar-chart.png";
  const btnColor = analyzed
    ? "bg-gradient-to-b from-[#0AD847] to-[#018F34]"
    : "bg-[#1B14CC]";
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
          <div className="text-[11px] text-[#9CA3AF] leading-tight">
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
          </div>
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
          className={`hidden sm:flex shrink-0 items-center justify-center gap-[5px] w-[180px] py-[8px] rounded-full text-[13px] sm:text-[14px] font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-70 ${btnColor}`}
        >
          <Image src={btnIcon} alt="" width={14} height={14} />
          {btnLabel}
        </button>
      </div>

      {/* Action button — mobile full width */}
      <button
        type="button"
        onClick={trigger}
        disabled={busy}
        className={`sm:hidden mt-[10px] flex w-full items-center justify-center gap-[5px] py-[9px] rounded-full text-[14px] font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-70 ${btnColor}`}
      >
        <Image src={btnIcon} alt="" width={14} height={14} />
        {btnLabel}
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

/** Nothing played yet: point the user at the opponent picker above, and offer a
 *  one-tap game against whoever is currently highlighted there. */
function EmptyState() {
  const router = useRouter();
  const { setAIChoosed, selectedOpponent, selectedColor, AIChoosed } = usePlayVSAIStore();

  // "Play Now" starts straight away against the opponent highlighted in the
  // picker above (mirrored into the store by HeroPlayVSAIPreview) — no detour
  // through the setup screen. Falls back to the last stored choice.
  const handlePlayNow = () => {
    const opponent = selectedOpponent ?? AIChoosed?.opponent;
    if (opponent) {
      setAIChoosed({
        color: selectedColor,
        difficulty: "recommended",
        opponent,
      });
    }
    router.push("/playground/play-vs-ai/playing");
  };

  return (
    <div className="flex flex-col items-center text-center gap-[12px] py-[20px]">
      <Image
        src="/images/v2/play-vs-ai/no-data.png"
        alt=""
        width={180}
        height={180}
        className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] object-contain"
      />
      <div>
        <h3 className="font-bold text-lg sm:text-xl text-[#111827]">
          You have not played any Games yet
        </h3>
        <p className="mt-[4px] text-[14px] sm:text-[15px] text-[#6B7280] leading-[140%]">
          Choose your opponent above or click the button below to challenge our
          recommended opponent.
        </p>
      </div>
      <button
        type="button"
        onClick={handlePlayNow}
        className="w-full max-w-[420px] py-[10px] rounded-full border border-[#221AE9] text-[15px] font-semibold text-[#221AE9] transition-colors hover:bg-[#221AE9]/5"
      >
        Play Now
      </button>
    </div>
  );
}

export function PlayRecentGames({ games, isLoading }: PlayRecentGamesProps) {
  // With no games there is nothing to see on the history page — the link stays
  // visible for layout, but greyed out and inert.
  const hasGames = games.length > 0;

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] px-[20px] py-[16px]">
      <div className="flex items-center justify-between mb-[4px]">
        <h2 className="font-bold text-xl text-[#111827]">Recent Games</h2>
        {hasGames || isLoading ? (
          <Link
            href="/my-game-history"
            className="text-lg font-bold text-[#221AE9] flex items-center gap-[4px] hover:underline"
          >
            See all <span className=" text-2xl font-normal">›</span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="text-lg font-bold text-[#9CA3AF] flex items-center gap-[4px] cursor-default select-none"
          >
            See all <span className=" text-2xl font-normal">›</span>
          </span>
        )}
      </div>

      {isLoading ? (
        <div>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : !hasGames ? (
        <EmptyState />
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
