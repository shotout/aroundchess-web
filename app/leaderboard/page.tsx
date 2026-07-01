"use client";

import Navigation from "@/components/navigator/navigation";
import Image from "next/image";

export default function LeaderboardPage() {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-[16px] p-[16px]">
            <Image
              src="/images/v2/sidebar/Ranking.png"
              alt="Leaderboard"
              width={80}
              height={80}
              className="w-[80px] h-[80px] object-contain opacity-60"
            />
            <h1 className="font-semibold text-[24px] text-[#2e3133]">Leaderboard</h1>
            <p className="text-[#6b7280] text-[16px] text-center max-w-[400px]">
              Coming soon — see how you rank against other players.
            </p>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
