"use client";

import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import MovementDetails from "./MovementDetails";
import Threats from "./Threats";
import Opening from "./Opening";
import MiddleGame from "./MiddleGame";
import EndGame from "./EndGame";
import { SiteFooterNew } from "@/components/site-footer-new";

const AnalysisLatestGame: React.FC = () => {
  const [focusPage, setFocusPage] = useState<string>("summary");
  useEffect(() => {
    renderView(focusPage);
  }, [focusPage]);

  const renderView = (focusPage: string) => {
    switch (focusPage) {
      case "summary":
        return <Summary />;
      case "movement":
        return <MovementDetails />;
      case "threats":
        return <Threats />;
      case "opening":
        return <Opening />;
      case "middlegame":
        return <MiddleGame />;
      case "endgame":
        return <EndGame />;
    }
  };
  return (
    <div className="flex flex-col gap-4 bg-white mt-2">
      <div className="flex flex-col px-4 gap-2">
        <span className="text-sm pt-4 font-bold">Analysis: Latest Game</span>
        <span className="text-xs">
          13/02/2025,blitzmystic (White -{" "}
          <span className="text-[#00B427]">WIN</span>) vs Guest1234 (Black)
        </span>
      </div>

      <div className="flex flex-row overflow-x-scroll no-scrollbar gap-1 px-4 pb-2">
        {/* tab horizontal */}
        <div
          onClick={() => setFocusPage("summary")}
          className={`w-fill p-2 ${
            focusPage == "summary" &&
            `shadow-lg rounded-md bg-[#FFF] font-semibold `
          }gap-2`}
        >
          <span className="text-xs">Summary</span>
        </div>
        <div
          onClick={() => setFocusPage("movement")}
          className={`min-w-32 p-2 ${
            focusPage == "movement" &&
            `shadow-lg rounded-md bg-[#FFF] font-semibold `
          }gap-2`}
        >
          <span className="text-xs">Movement Details</span>
        </div>
        <div
          onClick={() => setFocusPage("threats")}
          className={`w-fill p-2 ${
            focusPage == "threats" &&
            `shadow-lg rounded-md bg-[#FFF] font-semibold `
          }gap-2`}
        >
          <span className="text-xs">Threats</span>
        </div>
        <div
          onClick={() => setFocusPage("opening")}
          className={`w-fill p-2 ${
            focusPage == "opening" &&
            `shadow-lg rounded-md bg-[#FFF] font-semibold `
          }gap-2`}
        >
          <span className="text-xs">Opening</span>
        </div>
        <div
          onClick={() => setFocusPage("middlegame")}
          className={`w-fill p-2 ${
            focusPage == "middlegame" &&
            `shadow-lg rounded-md bg-[#FFF] font-semibold `
          }gap-2`}
        >
          <span className="text-xs">Middlegame</span>
        </div>
        <div
          onClick={() => setFocusPage("endgame")}
          className={`w-fill p-2 ${
            focusPage == "endgame" &&
            `shadow-lg rounded-md bg-[#FFF] font-semibold `
          }gap-2`}
        >
          <span className="text-xs">Endgame</span>
        </div>
      </div>
      {renderView(focusPage)}
      <SiteFooterNew/>
    </div>
  );
};

export default AnalysisLatestGame;
