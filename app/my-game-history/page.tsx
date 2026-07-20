"use client";

import LoadingPage from "@/components/analysis-loading/LoadingPage";
import GameHistoryPage from "@/components/v2/game-history-page";
import Navigation from "@/components/navigator/navigation";
import { usePgnStore } from "../store/zustandStore";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";

export default function Page() {
  const { isLoading } = usePgnStore();
useEffect(() => {
    trackCustomEvent("ViewGameHistory");
  }, []);
  return (
    <>
      {isLoading == true ? (
        <LoadingPage />
      ) : (
        <div className="flex overflow-hidden bg-primary-white">
          <div className="flex flex-col overflow-y-auto w-full">
            <Navigation>
              <div className="w-full">
                <GameHistoryPage />
              </div>
            </Navigation>
          </div>
        </div>
      )}
    </>
  );
}
