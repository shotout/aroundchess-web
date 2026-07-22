"use client";

import Image from "next/image";
import { HeroPlayVSAIPreview } from "./hero-play-vs-ai-preview";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { GamePlayerAvatar } from "@/components/v2/game-player-avatar";

export function PlayHeroGamePreview({ recommendedListHeightClass }: { recommendedListHeightClass?: string }) {
  const { profile } = useProfileStore();
  const { leaderboard } = usePlayPageStore();
  const username = profile?.username || profile?.name || "User";
  const elo = leaderboard?.my_elo ?? 0;
  // Same seed recipe as the sidebar so the placeholder color is stable per user.
  const avatarSeed = profile?.username || profile?.name || profile?.email || "user";

  return (
    <div data-tour-anchor="playground-hero" className="w-full flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center mt-4 sm:mt-3">
      <div data-tour-anchor="board-preview" className="hidden sm:flex sm:w-[70%] bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex-col gap-2">
        <Image
          src="/images/homepage/v2/homepage_board_asset_1.png"
          alt="Player preview"
          width={525}
          height={52}
          className="w-full h-auto"
        />
        <Image
          src="/images/homepage/v2/homepage_board_asset_2.png"
          alt="Chessboard preview"
          width={1050}
          height={1050}
          className="w-full h-auto"
          priority
        />
        <Image
          src="/images/homepage/v2/homepage_board_asset_3.png"
          alt="Move legend"
          width={1050}
          height={36}
          className="w-full h-auto"
        />
        <div className="flex items-center justify-left gap-2 pt-2 sm:pt-2 border-t-2 mt-auto">
          <GamePlayerAvatar imageUrl={profile?.imageUrl} seed={avatarSeed} />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-bold text-[clamp(14px,1.4vw,18px)] text-[#040404] truncate">
              {username}
            </span>
            <span className="text-[clamp(11px,1.1vw,14px)] text-gray-500">
              ELO {elo}
            </span>
          </div>
        </div>
      </div>

      <div data-tour-anchor="opponent-panel" className="w-full sm:w-[42%] bg-white rounded-2xl shadow-lg border-2 border-[#81CFF3] p-3 sm:p-4 flex flex-col">
        <h1 className="sm:hidden text-center font-bold text-[28px] text-[#221AE9] mb-[8px]">
          Play VS AI
        </h1>
        <HeroPlayVSAIPreview recommendedListHeightClass={recommendedListHeightClass} />
      </div>
    </div>
  );
}
