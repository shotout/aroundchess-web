"use client";

import LoadingPage from "@/components/analysis-loading/LoadingPage";
import GameHistoryPage from "@/components/game-history/GameHistoryPage";
import Navigation from "@/components/navigator/navigation";
import { useAuth } from "@clerk/nextjs";
import { usePgnStore } from "../store/zustandStore";

export default function Page() {
  const { sessionId } = useAuth();
  const { isLoading } = usePgnStore();

  return (
    <>
      {isLoading == true ? (
        <LoadingPage />
      ) : (
        <div className="flex overflow-hidden bg-primary-white">
          <div className="flex flex-col overflow-y-auto w-full">
            <Navigation>
              <div className="w-full">
                <GameHistoryPage key={sessionId || "unauthenticated"} />
              </div>
            </Navigation>
          </div>
        </div>
      )}
    </>
  );
}
