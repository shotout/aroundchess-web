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

const AnalysisLatestGame: React.FC = () => {
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
    <div className="flex flex-col gap-4 bg-white mt-2">
      <div className="flex flex-col px-4 gap-2">
        <span className="text-sm sm:text-md md:text-lg lg:text-xl pt-4 font-bold">
          Analysis: Latest Game
        </span>
        <span className="text-xs sm:text-sm md:text-md lg:text-lg">
          13/02/2025,blitzmystic (White -{" "}
          <span className="text-[#00B427]">WIN</span>) vs Guest1234 (Black)
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
                tab.name == "movement" && `min-w-[124px] `
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
