"use client";

import LoadingPage from "@/components/analysis-loading/LoadingPage";
import GameHistoryPage from "@/components/game-history/GameHistoryPage";
import Navigation from "@/components/navigator/navigation";
import { usePgnStore } from "../store/zustandStore";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
import { BlackFridayPromoTrigger } from "@/components/modal/BlackFridayPromoTrigger";
import { PricingOffer } from "@/components/modal/PricingOffer";

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
      <PricingOffer />
      <BlackFridayPromoTrigger />
    </>
  );
}
