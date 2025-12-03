"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";

import DotSpinner from "./Spinner";
import HistoryTabs from "./components/HistoryTabs";
import StatisticsSection from "./components/StatisticsSection";
import ImportDialogButton from "./components/ImportDialogButton";
import LoadingDot from "./components/LoadingDot";
import ChessAccountSetup from "../analysis/onboarding/ChessAccountSetup";
import { useProfileStore } from "@/app/store/profile";
import { useTutorial } from "../TutorialProvider";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const GameHistoryPage: React.FC = () => {
  const pathname = usePathname();
  const { username, isOpenTutorial } = usePgnStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { isTutorialPlay, dataTutorial } = useTutorial();

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
      <main className="w-full  bg-primary-white relative">
        <ChessAccountSetup isLoading={isLoading} />
        <div className="p-4">
          <div className="hidden xl:flex items-center justify-left gap-[4px] mb-[32px]">
            <Link href={'/my-game-history'} className={`flex items-center gap-[8px] justify-center py-[12px] px-[24px] rounded-t-[12px] bg-[#221AE9] text-white`}>
              <Image src="/icons/sidebar-game-history.png" alt="icon" width={24} height={24} className="invert brightness-0" />
              <span className="font-semibold">Game History</span>
            </Link>

            <Link href={'/feedback-log'} className={`flex items-center gap-[8px] justify-center py-[12px] px-[24px] rounded-t-[12px] bg-[#ECF4FF]`}>
              <Image src="/icons/sidebar-saved-mistakes-icon.svg" alt="icon" width={24} height={24} />
              <span>Saved Mistakes</span>
            </Link>
          </div>

          <div className="flex justify-between items-center xl:mb-4">
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <h1 className="text-sm md:text-2xl xl:text-[32px] font-bold">
                My Game History

                {isUsernameFetching ? (
                  <LoadingDot />
                ) : (
                  <sub className="text-xs text-gray-500 font-normal lg:text-[18px]">
                    {isTutorialPlay
                      ? dataTutorial.username
                      : username
                      ? `(${username})`
                      : "(No username set)"}
                  </sub>
                )}
              </h1>
            </div>

            <ImportDialogButton />
          </div>

          <StatisticsSection username={username} />
        </div>

        <HistoryTabs username={username} />
      </main>
    </>
  );
};

export default GameHistoryPage;
