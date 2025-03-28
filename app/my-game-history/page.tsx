"use client";

import GameHistoryPage from "@/components/game-history/GameHistoryPage";
import Navigation from "@/components/navigator/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const { sessionId } = useAuth();

  // Use the sessionId as a key to force remounting when auth changes
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full">
            {/* Adding the key prop forces React to remount the component when sessionId changes */}
            <GameHistoryPage key={sessionId || "unauthenticated"} />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
