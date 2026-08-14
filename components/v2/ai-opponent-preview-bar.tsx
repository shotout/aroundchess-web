"use client";

import Image from "next/image";
import { ArrowDownUp, Settings } from "lucide-react";
import { usePlayVSAIStore, SelectedOpponent } from "@/app/store/playVSAI";

// Opponent bar shown above the board preview on the home and play pages.
// Reflects whichever opponent is highlighted in the "Choose Your Opponent"
// panel (usePlayVSAIStore.selectedOpponent), replacing the old static image
// that had one bot ("Lisa") baked in. Falls back to the last confirmed
// opponent, then a sane default, so it always renders someone.
const FALLBACK: SelectedOpponent = {
  name: "Thomas",
  elo: 250,
  img: "/images/v2/AI avatar/Beginner/Thomas.png",
};

export function AiOpponentPreviewBar() {
  const { selectedOpponent, AIChoosed } = usePlayVSAIStore();
  const opponent = selectedOpponent || AIChoosed?.opponent || FALLBACK;

  return (
    <div data-preview-bar="opponent" className="flex items-center gap-2">
      <Image
        src={opponent.img}
        alt={opponent.name}
        width={96}
        height={96}
        className="w-[48px] h-[48px] rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col items-start text-left leading-tight min-w-0">
        <span className="font-bold text-[clamp(14px,1.4vw,18px)] text-[#040404] truncate">
          {opponent.name}
        </span>
        <span className="text-[clamp(11px,1.1vw,14px)] text-gray-500">
          ELO {opponent.elo}
        </span>
      </div>
      <div className="flex items-center gap-3 ml-auto text-[#040404] pr-1">
        <ArrowDownUp size={18} />
        <Settings size={18} />
      </div>
    </div>
  );
}

export default AiOpponentPreviewBar;
