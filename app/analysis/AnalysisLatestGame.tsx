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
import data from "../../json/fix_analyze_response.json";
import { usePgnStore } from "../store/zustandStore";

const AnalysisLatestGame: React.FC = () => {
  const { setIsLoading, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
  const {
    gameInfo,
    summary,
    movementDetails,
    opening,
    middleGame,
    endGame,
    improvementRecommendation,
    training,
  } = dataAnalysis;
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
          <Summary data={data.data} next={() => setFocusPage("movement")} />
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
    <div className="flex flex-col gap-4 bg-white mt-2 lg:mt-0 lg:border lg:border-input lg:rounded-lg">
      <div className="flex flex-col px-4 gap-2">
        <span className="text-sm sm:text-md md:text-lg lg:text-xl pt-4 font-bold">
          Analysis: Latest Game
        </span>
        <span className="text-xs sm:text-sm md:text-md lg:text-lg">
          {gameInfo.date}, {summary.whiteSide.profileInfo.username} (White
          <span className="text-[#00B427]">
            {gameInfo.whiteWin && " - WIN"}
          </span>
          ) vs {summary.blackSide.profileInfo.username} (Black
          <span className="text-[#00B427]">
            {gameInfo.blackWin && " - WIN"}
          </span>
          )
        </span>
      </div>

      <div className="flex flex-row overflow-x-scroll sm:overflow-x-hidden gap-1 px-4 pb-2">
        {/* tab horizontal */}
        {tabsMenu.map((tab, index) => {
          return (
            <div
              key={index}
              onClick={() => setFocusPage(tab.name)}
              className={`flex ${
                tab.name == "movement" && `min-w-[140px] `
              } p-2 ${
                focusPage == tab.name &&
                `shadow-lg rounded-md bg-[#FFF] font-semibold `
              }`}
            >
              <span className="text-xs sm:text-sm md:text-md lg:text-lg">
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
      {renderView(focusPage)}
      <SiteFooterNew />
    </div>
  );
};

export default AnalysisLatestGame;
