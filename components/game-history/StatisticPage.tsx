"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";

import DotSpinner from "./Spinner";
import StatisticsSection from "./components/StatisticsSection";
import ImportDialogButton from "./components/ImportDialogButton";
import LoadingDot from "./components/LoadingDot";
import ChessAccountSetup from "../analysis/onboarding/ChessAccountSetup";
import { useProfileStore } from "@/app/store/profile";
import { useTutorial } from "../TutorialProvider";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GameHistoriesTable } from "../game-histories-table";
import AccountNotConnected from "./components/AccountNotConnected";
import HistoryTabs from "./components/HistoryTabs";
import HistoryStatisticTabs from "./components/HistoryStatisticTabs";

const StatisticPage: React.FC = () => {
  const pathname = usePathname();
  const { username, isOpenTutorial } = usePgnStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { isTutorialPlay, dataTutorial } = useTutorial();

  const [openAccountConnected, setOpenAccountConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  const [isLoading, setIsLoading] = useState(true);
  const [isUsernameFetching, setIsUsernameFetching] = useState(false);

  useEffect(() => {
    if (!isTutorialPlay && !isOpenTutorial) {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      setIsUsernameFetching(true);

      setTimeout(() => {
        setIsLoading(false);
        setIsUsernameFetching(false);
      }, 500);
    }
  }, [isSignedIn]);

  if (!isTutorialPlay && !isOpenTutorial && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      {/* <main className="w-full  bg-primary-white relative"> */}
      <main className="w-full  bg-primary-white">
        <ChessAccountSetup isLoading={isLoading} open={openAccountConnected} setOpen={() => { setOpenAccountConnected(false) }} />
        <div className="p-4 bg-[#E6F7FE] lg:bg-white">
          <div className="flex justify-between items-center xl:mb-4">
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <Link href="/profile" className="flex items-center gap-2">          
                <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30.0846 19.0013H7.91797M7.91797 19.0013L19.0013 30.0846M7.91797 19.0013L19.0013 7.91797" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <h1 className="flex items-baseline text-[18px] --sm md:text-2xl xl:text-[32px] font-bold">
                My Statistics 

                <span className="ml-[8px]">
                  {isUsernameFetching ? (
                    <LoadingDot />
                  ) : (
                    <span className="text-[14px] --xs text-gray-500 font-normal lg:text-[18px]">
                      {isTutorialPlay
                        ? dataTutorial.username
                        : username
                        ? `(${username})`
                        : "(No username set)"}
                    </span>
                  )}
                </span>
              </h1>
            </div>
          </div>

          <StatisticsSection username={username} />
        </div>
        
        <HistoryStatisticTabs username={username} />
      </main>
    </>
  );
};

export default StatisticPage;
