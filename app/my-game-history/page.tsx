"use client";

import GameHistoryPage from "@/components/game-history/GameHistoryPage";
import Navigation from "@/components/navigator/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const { sessionId } = useAuth();

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full">
            <GameHistoryPage key={sessionId || "unauthenticated"} />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
