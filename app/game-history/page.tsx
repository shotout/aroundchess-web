"use client";
import GameHistoryPage from "@/components/game-history/GameHistoryPage";
import { usePgnStore } from "../store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import Navigation from "@/components/navigator/navigation";

export default function Page() {
  const { isLoading } = usePgnStore();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full">
            <GameHistoryPage />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
