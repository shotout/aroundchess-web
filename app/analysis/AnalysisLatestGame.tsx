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
    setIsLoading(false);
    renderView(focusPage);
  }, [focusPage]);
  const renderView = (focusPage: string) => {
    switch (focusPage) {
      case "summary":
        return (
          <Summary next={() => setFocusPage("movement")} />
        );
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
    <div className={`flex flex-col xl:min-w-[592px] xl:max-w-full gap-4 bg-white mt-2 lg:mt-0 lg:border lg:border-input lg:rounded-lg mb-2 sm:mb-4`}>
      <div className="flex flex-col px-4 gap-2">
        <span className="text-sm sm:text-md md:text-lg lg:text-xl pt-4 font-bold">
          Analysis: Latest Game
        </span>
        <span className="text-xs sm:text-sm md:text-md lg:text-lg">
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

      <div className="flex flex-row overflow-x-scroll gap-1 px-4 pb-2">
        {/* tab horizontal */}
        {tabsMenu.map((tab, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setTabFocus(tab.name);
                setFocusPage(tab.name);
              }}
              className={`flex ${
                tab.name == "movement" && `min-w-[120px] sm:min-w-[140px] xl:min-w-[174px]`
              } p-2 ${
                focusPage == tab.name &&
                `shadow-lg rounded-md bg-[#FFF] font-semibold `
              }`}
            >
              <span className="text-xs sm:text-sm md:text-md lg:text-md xl:text-lg xl:text-lg">
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* <div className="xl:max-h-[800px] lg:overflow-auto"> */}
        {renderView(focusPage)}
      {/* </div> */}
    </div>
  );
};

export default AnalysisLatestGame;
