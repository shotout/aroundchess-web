"use client";

import { useConfirmLogin } from "@/app/store/confirmLogin";
import { useProfileStore } from "@/app/store/profile";
import React, { useEffect, useState, useRef } from "react";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import { useTabFocusStore } from "../../app/store/tabAnalysisStore";
import { usePgnStore } from "../../app/store/zustandStore";
import EndGame from "./EndGame";
import Improvement from "./Improvement";
import MiddleGame from "./MiddleGame";
import MovementDetails from "./MovementDetails";
import Opening from "./Opening";
import Summary from "./Summary";
import Threats from "./Threats";
import Training from "./Training";

const AnalysisLatestGame: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSession = () => {
      if (sessionId !== "") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);

  const { setIsLoading, dataAnalysis, hideDiv } = usePgnStore();
  const { setTabFocus } = useTabFocusStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const { gameInfo, summary } = dataAnalysis ?? {};
  const [widthContainer, setWidthContainer] = useState<number | string>(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const [focusPage, setFocusPage] = useState<string>("summary");
  const [userInitiatedChange, setUserInitiatedChange] =
    useState<boolean>(false);
  const { setChessMove } = useChessMoveStore();

  const tabsMenu = [
    { name: "summary", label: "Summary" },
    { name: "movement", label: "Movement Details" },
    { name: "threats", label: "Threats" },
    { name: "opening", label: "Opening" },
    { name: "middlegame", label: "Middlegame" },
    { name: "endgame", label: "Endgame" },
    { name: "improvement", label: "Improvement" },
  ];

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const handleResize = () => {
    const widthC =
      window?.innerWidth < 1280 ? "auto" : window?.innerWidth * 0.52;
    setWidthContainer(widthC);
  };

  useEffect(() => {
    setIsLoading(false);

    if (userInitiatedChange) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);

      setUserInitiatedChange(false);
    }
  }, [focusPage, setIsLoading, userInitiatedChange]);

  const renderView = (focusPage: string) => {
    if (!dataAnalysis) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analysis data...</p>
          </div>
        </div>
      );
    }

    switch (focusPage) {
      case "summary":
        return (
          <Summary
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("movement");
            }}
          />
        );
      case "movement":
        return (
          <MovementDetails
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("summary");
            }}
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("threats");
            }}
          />
        );
      case "threats":
        return (
          <Threats
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("movement");
            }}
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("opening");
            }}
          />
        );
      case "opening":
        return (
          <Opening
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("threats");
            }}
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("middlegame");
            }}
          />
        );
      case "middlegame":
        return (
          <MiddleGame
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("opening");
            }}
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("endgame");
            }}
          />
        );
      case "endgame":
        return (
          <EndGame
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("middlegame");
            }}
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("improvement");
            }}
          />
        );
      case "improvement":
        return (
          <Improvement
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("endgame");
            }}
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("summary");
            }}
          />
        );
      case "training":
        return (
          <Training
            prev={() => {
              setUserInitiatedChange(true);
              setFocusPage("improvement");
            }}
            next={() => null}
          />
        );
      default:
        return (
          <Summary
            next={() => {
              setUserInitiatedChange(true);
              setFocusPage("movement");
            }}
          />
        );
    }
  };
  useEffect(() => {
    setTabFocus(focusPage);
  }, [focusPage]);
  const handleOnChangeTab = (tab: { name: string; label: string }) => {
    if (isSignedIn) {
      setTabFocus(tab.name);
      setUserInitiatedChange(true);
      setFocusPage(tab.name);
      setChessMove({});
    } else {
      setOpenConfirmLogin(true);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ width: widthContainer }}
      className={`flex flex-col gap-2 bg-white mt-0 lg:mt-0 lg:border lg:border-input rounded-b-lg lg:rounded-lg mb-2 sm:mb-4 lg:p-[32px]`}
    >
      <div className="flex flex-col px-4 gap-2 border-b border-b-[#DEDEDE]">
        <span className="text-[24px] sm:text-md md:text-lg lg:text-[24px] font-medium mb-1">
          Analysis
        </span>
        <span className="text-md sm:text-md md:text-md lg:text-md mb-1">
          {gameInfo?.date || "Loading..."},{" "}
          {summary?.whiteSide?.profileInfo?.username || "Player 1"} (White
          <span className="text-[#00B427]">
            {gameInfo?.whiteWin && " - WIN"}
          </span>
          ) vs {summary?.blackSide?.profileInfo?.username || "Player 2"} (Black
          <span className="text-[#00B427]">
            {gameInfo?.blackWin && " - WIN"}
          </span>
          )
        </span>
      </div>

      <div className="flex flex-row bg-[#FAFDFF] border border-[C0CED4] rounded-[12px] overflow-x-auto gap-1 p-[8px]">
        {tabsMenu.map((tab, index) => {
          return (
            <div
              key={index}
              onClick={() => handleOnChangeTab(tab)}
              className={`flex cursor-pointer py-[8px] px-[16px] ${
                tab.name === "movement" &&
                `min-w-[154px] lg:min-w-[154px]`
              } p-2 ${
                focusPage === tab.name &&
                `shadow-sm border border-[#c0ced4] rounded-md bg-[#FFF] font-semibold `
              }`}
            >
              <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] font-medium">
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
