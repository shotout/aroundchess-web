"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import type { OpponentSummary } from "@/app/store/playVsAiStats";
import type { AiRosterOpponent } from "@/components/v2/play-vs-ai-roster-data";

interface PlayVsAiOpponentProfileCardProps {
  displayName: string;
  avatarSrc: string;
  elo: number | null;
  summary: OpponentSummary | undefined;
  rosterEntry: AiRosterOpponent | undefined;
}

export function PlayVsAiOpponentProfileCard({
  displayName,
  avatarSrc,
  elo,
  summary,
  rosterEntry,
}: PlayVsAiOpponentProfileCardProps) {
  const router = useRouter();
  const { setAIChoosed } = usePlayVSAIStore();

  const handlePlayAgainst = () => {
    if (!rosterEntry) return;
    setAIChoosed({
      color: "white",
      difficulty: "recommended",
      opponent: rosterEntry,
    });
    router.push("/playground/play-vs-ai/playing");
  };

  return (
    <div className="w-full rounded-2xl border border-[#221AE9] bg-white overflow-hidden">
      {/* Mobile: compact card — name + ELO with a small avatar, inline stats, full-width CTA */}
      <div className="md:hidden p-[16px] flex flex-col gap-[14px]">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="min-w-0 flex flex-col gap-[6px]">
            <div className="flex items-center gap-[8px] text-[16px] text-[#111827] min-w-0">
              <Image
                src="/images/v2/leaderboard/sword.png"
                alt=""
                width={18}
                height={18}
                className="w-[18px] h-[18px] object-contain brightness-0 shrink-0"
              />
              <span className="truncate">
                <span className="font-bold">{displayName}</span>
                {elo !== null && <span> · ELO {elo}</span>}
              </span>
            </div>
            <div className="text-[13px] text-[#111827]">
              Games: {summary?.totalGames ?? 0} · Win: {summary?.wins ?? 0} ·
              Draw: {summary?.draws ?? 0} · Loss: {summary?.losses ?? 0}
            </div>
          </div>
          <Image
            src={avatarSrc}
            alt={displayName}
            width={56}
            height={56}
            className="w-[56px] h-[56px] rounded-full object-cover bg-[#F1F3F9] shrink-0"
          />
        </div>

        {rosterEntry && (
          <button
            type="button"
            onClick={handlePlayAgainst}
            className="w-full h-[48px] bg-[#221AE9] text-white rounded-full font-bold text-[15px] flex items-center justify-between px-[24px] hover:opacity-90 transition-opacity"
          >
            <span>Play against this Opponent</span>
            <ChevronRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Header */}
      <div className="hidden bg-[#221AE9] px-[16px] py-[10px] md:flex items-center justify-center gap-[8px]">
        <Image
          src="/images/v2/leaderboard/sword.png"
          alt=""
          width={18}
          height={18}
          className="w-[18px] h-[18px] object-contain brightness-0 invert shrink-0"
        />
        <span className="text-white font-bold text-[15px] truncate">{displayName}</span>
      </div>

      <div className="hidden p-[16px] md:p-[20px] md:flex flex-col items-center text-center gap-[14px]">
        {/* Avatar */}
        <Image
          src={avatarSrc}
          alt={displayName}
          width={96}
          height={96}
          className="w-[96px] h-[96px] rounded-full object-cover bg-[#F1F3F9]"
        />

        {/* ELO */}
        {elo !== null && (
          <div className="font-bold text-[18px] text-[#111827]">ELO {elo}</div>
        )}

        {/* Game stats */}
        <div className="w-full rounded-[10px] bg-[#F1F3F9] px-[12px] py-[10px] flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px] text-[13px] text-[#111827]">
          <span>Games: {summary?.totalGames ?? 0}</span>
          <span>Win: {summary?.wins ?? 0}</span>
          <span>Draw: {summary?.draws ?? 0}</span>
          <span>Loss: {summary?.losses ?? 0}</span>
        </div>

        {/* Play against this opponent */}
        {rosterEntry && (
          <button
            type="button"
            onClick={handlePlayAgainst}
            className="relative w-full h-[44px] bg-[#221AE9] text-white rounded-full font-semibold text-[14px] flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            Play against this Opponent
            <ChevronRight
              className="w-[16px] h-[16px] absolute right-[14px] top-1/2 -translate-y-1/2"
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>
    </div>
  );
}
