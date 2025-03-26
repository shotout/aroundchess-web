"use client";

import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import MovementDetails from "./MovementDetails";
import Threats from "./Threats";
import Opening from "./Opening";
import MiddleGame from "./MiddleGame";
import EndGame from "./EndGame";
import { SiteFooterNew } from "@/components/site-footer-new";
import Improvement from "./Improvement";
import Training from "./Training";
import { usePgnStore } from "../store/zustandStore";
import { useTabFocusStore } from "../store/tabAnalysisStore";

const AnalysisLatestGame: React.FC = () => {
  const { setIsLoading, dataAnalysis, hideDiv } = usePgnStore(); // Get PGN from the Zustand store
  const { setTabFocus, tabFocus } = useTabFocusStore();
  const {
    gameInfo,
    summary,
    movementDetails,
    opening,
    middleGame,
    endGame,
    improvementRecommendation,
    training,
  } = dataAnalysis ?? {};
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const [focusPage, setFocusPage] = useState<string>("summary");

  const [tabsMenu, setTabsMenu] = useState<any[]>([
    { name: "summary", label: "Summary" },
    { name: "movement", label: "Movement Details" },
    { name: "threats", label: "Threats" },
    { name: "opening", label: "Opening" },
    { name: "middlegame", label: "Middlegame" },
    { name: "endgame", label: "Endgame" },
    { name: "improvement", label: "Improvement" },
    { name: "training", label: "Training" },
  ]);
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);
  const handleResize = () => {
    let widthC =window?.innerWidth<1024?window?.innerWidth: window?.innerWidth * 0.5;
    console.log("widthC", widthC);
    setWidthContainer(widthC)
  };
  useEffect(() => {
    setIsLoading(false);
    renderView(focusPage);
  }, [focusPage]);
  const renderView = (focusPage: string) => {
    switch (focusPage) {
      case "summary":
        return <Summary next={() => setFocusPage("movement")} />;
      case "movement":
        return (
          <MovementDetails
            prev={() => setFocusPage("summary")}
            next={() => setFocusPage("threats")}
          />
        );
      case "threats":
        return (
          <Threats
            prev={() => setFocusPage("movement")}
            next={() => setFocusPage("opening")}
          />
        );
      case "opening":
        return (
          <Opening
            prev={() => setFocusPage("threats")}
            next={() => setFocusPage("middlegame")}
          />
        );
      case "middlegame":
        return (
          <MiddleGame
            prev={() => setFocusPage("opening")}
            next={() => setFocusPage("endgame")}
          />
        );
      case "endgame":
        return (
          <EndGame
            prev={() => setFocusPage("middlegame")}
            next={() => setFocusPage("improvement")}
          />
        );
      case "improvement":
        return (
          <Improvement
            prev={() => setFocusPage("endgame")}
            next={() => setFocusPage("training")}
          />
        );
      case "training":
        return (
          <Training
            prev={() => setFocusPage("improvement")}
            next={() => null}
          />
        );
    }
  };

  return (
    <div
      style={{ maxWidth: widthContainer }}
      className={`${
        hideDiv && "mt-96 sm:mt-[64%]"
      } flex flex-col gap-4 bg-white mt-0 lg:mt-0 lg:border lg:border-input lg:rounded-lg mb-2 sm:mb-4`}
    >
      <div className="flex flex-col px-4 gap-2 py-2">
        <span className="text-sm sm:text-md md:text-lg lg:text-lg font-bold">
          Analysis: Latest Game
        </span>
        <span className="text-xs sm:text-sm md:text-md lg:text-md">
          {gameInfo?.date}, {summary?.whiteSide?.profileInfo.username} (White
          <span className="text-[#00B427]">
            {gameInfo?.whiteWin && " - WIN"}
          </span>
          ) vs {summary?.blackSide?.profileInfo.username} (Black
          <span className="text-[#00B427]">
            {gameInfo?.blackWin && " - WIN"}
          </span>
          )
        </span>
      </div>

      <div style={{ maxWidth: widthContainer }} className="flex flex-row max-w-sm md:max-w-3xl xl:max-w-full overflow-x-auto gap-1 px-4 pb-2">
        {/* tab horizontal */}
        {tabsMenu.map((tab, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setTabFocus(tab.name);
                setFocusPage(tab.name);
              }}
              className={`flex cursor-pointer ${
                tab.name == "movement" &&
                `min-w-[120px] sm:min-w-[140px] lg:min-w-[170px]`
              } p-2 ${
                focusPage == tab.name &&
                `shadow-lg border border-[#f0f0f0] rounded-md bg-[#FFF] font-semibold `
              }`}
            >
              <span className="text-xs sm:text-sm md:text-md lg:text-lg xl:text-lg">
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
      {renderView(focusPage)}
    </div>
  );
};

export default AnalysisLatestGame;
