"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { OpponentSummary } from "@/app/store/playVsAiStats";
import { PlayVsAiOpponentGamesPanel } from "@/components/v2/play-vs-ai-opponent-games-panel";
import { PlayVsAiOpponentProfileCard } from "@/components/v2/play-vs-ai-opponent-profile-card";
import { findRosterOpponentByName, stripAiSuffix } from "@/components/v2/play-vs-ai-roster-data";

interface PlayVsAiOpponentDetailProps {
  opponentUsername: string;
  opponentsPlayed: OpponentSummary[];
}

export function PlayVsAiOpponentDetail({
  opponentUsername,
  opponentsPlayed,
}: PlayVsAiOpponentDetailProps) {
  const router = useRouter();

  const summary = opponentsPlayed.find(
    (o) => o.opponentUsername.toLowerCase() === opponentUsername.toLowerCase()
  );

  const rosterEntry = findRosterOpponentByName(opponentUsername);
  const avatarSrc = rosterEntry?.img || summary?.opponentAvatar || "/images/avatar.svg";
  const displayName = stripAiSuffix(opponentUsername);
  const displayElo = summary?.opponentElo ?? rosterEntry?.elo ?? null;

  return (
    <div className="flex flex-col gap-[16px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-[4px] text-[14px] font-semibold text-[#111827] w-fit"
      >
        <ChevronLeft className="w-[18px] h-[18px]" />
        Back
      </button>

      <div className="relative flex flex-col lg:flex-row gap-[16px]">
        <div className="w-full lg:w-[300px] xl:w-[330px] lg:shrink-0">
          <PlayVsAiOpponentProfileCard
            displayName={displayName}
            avatarSrc={avatarSrc}
            elo={displayElo}
            summary={summary}
            rosterEntry={rosterEntry}
          />
        </div>

        <div className="w-full min-w-0 lg:absolute lg:inset-y-0 lg:right-0 lg:left-[316px] xl:left-[346px] lg:w-auto">
          <PlayVsAiOpponentGamesPanel
            key={opponentUsername}
            opponentUsername={opponentUsername}
          />
        </div>
      </div>
    </div>
  );
}
