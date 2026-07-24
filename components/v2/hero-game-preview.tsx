"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroPlayVSAIPreview } from "./hero-play-vs-ai-preview";
import { AiOpponentPreviewBar } from "@/components/v2/ai-opponent-preview-bar";

export function HeroGamePreview({ recommendedListHeightClass }: { recommendedListHeightClass?: string }) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center mt-4 sm:mt-3">
      <div className="hidden sm:flex sm:w-[70%] bg-white rounded-2xl shadow-lg border border-[#DEDEDE] p-3 sm:p-4 flex-col gap-2">
        <AiOpponentPreviewBar />
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
          <Image
            src="/images/homepage/v2/homepage_board_asset_4.png"
            alt=""
            width={86}
            height={88}
            className="w-[26px] h-auto shrink-0"
          />
          <p className="text-[clamp(10px,1.1vw,14px)] text-[#040404] whitespace-nowrap">
            <Link href="/login" className="font-semibold text-primary underline">
              Sign-in
            </Link>{" "}
            or{" "}
            <Link href="/register" className="font-semibold text-primary underline">
              sign-up
            </Link>{" "}
            to start the game
          </p>
        </div>
      </div>

      <div className="w-full sm:w-[42%] bg-white rounded-2xl shadow-lg border-2 border-[#7CC0F2] p-3 sm:p-4 flex flex-col">
        <HeroPlayVSAIPreview recommendedListHeightClass={recommendedListHeightClass} />
      </div>
    </div>
  );
}
