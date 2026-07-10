"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import {
  pickRecommendedOpponents,
  type AiRosterOpponent,
} from "@/components/v2/play-vs-ai-roster-data";

interface PlayVsAiRecommendedOpponentsProps {
  userElo: number;
}

export function PlayVsAiRecommendedOpponents({ userElo }: PlayVsAiRecommendedOpponentsProps) {
  const router = useRouter();
  const { setAIChoosed } = usePlayVSAIStore();

  const recommended = useMemo(
    () => pickRecommendedOpponents(userElo || 1200),
    [userElo]
  );

  const [selectedId, setSelectedId] = useState<number | undefined>(recommended[0]?.id);
  const activeSelection: AiRosterOpponent | undefined =
    recommended.find((o) => o.id === selectedId) ?? recommended[0];

  const handleStartGame = () => {
    if (!activeSelection) return;
    setAIChoosed({
      color: "white",
      difficulty: "recommended",
      opponent: activeSelection,
    });
    router.push("/playground/play-vs-ai/playing");
  };

  if (recommended.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-[16px] border border-[#221AE9] shadow-sm px-[16px] sm:px-[24px] py-[16px] flex flex-col lg:flex-row lg:items-center gap-[12px] lg:gap-[16px]">
      <h2 className="font-bold text-[16px] sm:text-[18px] text-[#111827] flex items-center gap-[8px] shrink-0">
        <Image
          src="/images/v2/leaderboard/sword.png"
          alt=""
          width={22}
          height={22}
          className="w-[22px] h-[22px] object-contain shrink-0"
        />
        <span className="leading-tight">
          Recommended <br className="hidden lg:block" />
          Opponents
        </span>
      </h2>

      <div className="grid grid-cols-4 gap-[6px] sm:gap-[10px] lg:flex-1 min-w-0">
        {recommended.map((opponent) => {
          const isSelected = activeSelection?.id === opponent.id;
          return (
            <button
              key={opponent.id}
              type="button"
              onClick={() => setSelectedId(opponent.id)}
              className={`w-full flex flex-col lg:flex-row items-center gap-[6px] lg:gap-[8px] rounded-2xl py-[10px] lg:py-[8px] px-[6px] lg:px-[10px] transition-colors ${
                isSelected ? "bg-[#EEF0FF]" : "bg-transparent hover:bg-[#F9FAFB]"
              }`}
            >
              <Image
                src={opponent.img}
                alt={opponent.name}
                width={56}
                height={56}
                className="w-[56px] h-[56px] lg:w-[44px] lg:h-[44px] rounded-full object-cover shrink-0"
              />
              <span className="flex flex-col items-center lg:items-start leading-tight min-w-0">
                <span
                  className={`text-[13px] lg:text-[14px] font-bold truncate max-w-full text-center lg:text-left ${
                    isSelected ? "text-[#221AE9]" : "text-[#111827]"
                  }`}
                >
                  {opponent.name}
                </span>
                <span className="text-[11px] lg:text-[12px] text-[#6B7280]">ELO {opponent.elo}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleStartGame}
        className="w-full lg:w-auto shrink-0 bg-[#221AE9] text-white py-[13px] lg:py-[11px] px-[20px] lg:px-[28px] rounded-full font-semibold text-[15px] flex items-center justify-between lg:justify-center gap-[6px] hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Start Game <ChevronRight className="w-[18px] h-[18px] shrink-0" strokeWidth={2.5} />
      </button>
    </div>
  );
}
