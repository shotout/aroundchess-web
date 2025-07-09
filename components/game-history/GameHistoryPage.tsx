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

const GameHistoryPage: React.FC = () => {
  const { username } = usePgnStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();

  console.log(sessionId);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUsernameFetching, setIsUsernameFetching] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setIsInitialLoading(false);
      return;
    }
    setIsSignedIn(true);
  }, [sessionId]);

  useEffect(() => {
    if (!isSignedIn) {
      setIsInitialLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setIsUsernameFetching(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  if (isInitialLoading && isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      <main className="w-full bg-primary-white relative">
        <ChessAccountSetup isLoading={false} />

        <div className="p-4">
          <div className="flex justify-between items-center xl:mb-4">
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <h1 className="text-sm md:text-2xl xl:text-[32px] font-bold">
                My Game History
              </h1>
              <div className="flex items-center h-full">
                {isUsernameFetching ? (
                  <LoadingDot />
                ) : (
                  <p className="text-xs text-gray-500 lg:text-[18px]">
                    {username ? `(${username})` : "(No username set)"}
                  </p>
                )}
              </div>
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
