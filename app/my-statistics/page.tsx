"use client";

import { usePgnStore } from "../store/zustandStore";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
import { PricingOffer } from "@/components/modal/PricingOffer";
import Navigation from "@/components/navigator/navigation";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import StatisticPage from "@/components/game-history/StatisticPage";

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
                <StatisticPage />
              </div>
            </Navigation>
          </div>
        </div>
      )}
      <PricingOffer />
    </>
  );
}
