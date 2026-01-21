"use client";

import LoadingPage from "@/components/analysis-loading/LoadingPage";
import GameHistoryPage from "@/components/game-history/GameHistoryPage";
import Navigation from "@/components/navigator/navigation";
import { usePgnStore } from "../store/zustandStore";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
import Script from "next/script";

export default function Page() {
  const { isLoading } = usePgnStore();
useEffect(() => {
    trackCustomEvent("ViewGameHistory");
  }, []);
  return (
    <>
      <Script 
        src="https://cdn.brevo.com/js/sdk-loader.js" 
        strategy="afterInteractive"
        async
      />
      <Script id="brevo-tracker" strategy="afterInteractive">
        {`
          // Version: 2.0
          window.Brevo = window.Brevo || [];
          Brevo.push([
            "init",
            {
              client_key: "j2yltq6rlqd3ojhemkgb7x1z"
            }
          ]);
        `}
      </Script>
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
