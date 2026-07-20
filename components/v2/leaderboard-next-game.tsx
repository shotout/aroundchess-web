"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import {
  pickRecommendedOpponents,
  type AiRosterOpponent,
} from "@/components/v2/play-vs-ai-roster-data";

interface LeaderboardNextGameProps {
  userElo: number;
}

export function LeaderboardNextGame({ userElo }: LeaderboardNextGameProps) {
  const router = useRouter();
  const { setAIChoosed } = usePlayVSAIStore();

  const opponents = useMemo(
    () => pickRecommendedOpponents(userElo || 1200),
    [userElo]
  );

  const [selectedId, setSelectedId] = useState<number | undefined>(opponents[0]?.id);
  const selected: AiRosterOpponent | undefined =
    opponents.find((o) => o.id === selectedId) ?? opponents[0];

  const handleStartGame = () => {
    if (!selected) return;
    setAIChoosed({
      color: "white",
      difficulty: "recommended",
      opponent: selected,
    });
    router.push("/playground/play-vs-ai/playing");
  };

  if (opponents.length === 0) return null;

  return (
    <div className="w-full sm:w-[70%] mx-auto bg-white rounded-[16px] border border-[#221AE9] shadow-sm px-[16px] sm:px-[24px] py-[16px] flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[12px] sm:gap-[8px]">
        <div className="flex items-center justify-center gap-[8px]">
          <Image
            src="/images/v2/leaderboard/sword.png"
            alt=""
            width={20}
            height={20}
            className="w-[25px] h-[25px] object-contain"
          />
          <h2 className="font-bold text-[16px] sm:text-2xl text-[#111827]">Play your next Game</h2>
        </div>
        <div className="border-t border-[#E5E7EB] sm:hidden" />
      </div>

      <div className="grid grid-cols-4 gap-[8px] sm:gap-[12px]">
        {opponents.map((opponent) => {
          const isSelected = selected?.id === opponent.id;
          return (
            <button
              key={opponent.id}
              type="button"
              onClick={() => setSelectedId(opponent.id)}
              className={`w-full flex flex-col sm:flex-row items-center gap-[6px] sm:gap-[10px] rounded-2xl py-[10px] px-[6px] sm:px-[12px] transition-colors ${
                isSelected ? "bg-[#EEF0FF]" : "bg-transparent hover:bg-[#F9FAFB]"
              }`}
            >
              <Image
                src={opponent.img}
                alt={opponent.name}
                width={56}
                height={56}
                className="w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] rounded-full object-cover shrink-0"
              />
              <span className="flex flex-col items-center sm:items-start leading-tight min-w-0">
                <span className={`text-[13px] sm:text-[15px] font-bold truncate text-center sm:text-left ${isSelected ? "text-[#221AE9]" : "text-[#111827]"}`}>
                  {opponent.name}
                </span>
                <span className="text-[11px] sm:text-[13px] text-[#6B7280]">ELO {opponent.elo}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleStartGame}
        className="w-full bg-[#221AE9] text-white py-[13px] rounded-full font-semibold text-[15px] flex items-center justify-center gap-[6px] hover:opacity-90 transition-opacity"
      >
        Start Game <span className="text-xl font-normal leading-none">›</span>
      </button>
    </div>
  );
}
