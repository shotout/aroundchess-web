"use client";

import React from "react";

import DotSpinner from "./Spinner";
import HistoryTabs from "./components/HistoryTabs";
import StatisticsSection from "./components/StatisticsSection";
import ImportDialogButton from "./components/ImportDialogButton";
import LoadingDot from "./components/LoadingDot";
import ChessAccountSetup from "../analysis/onboarding/ChessAccountSetup";
import { useChessProfile } from "../analysis/onboarding/useChessProfile";

const GameHistoryPage: React.FC = () => {
  const { username, isLoading, isSignedIn, checkComplete } = useChessProfile();

  if (!checkComplete && isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      <main className="w-full bg-primary-white relative">
        <ChessAccountSetup isLoading={isLoading} />

        <div className="p-4">
          <div className="flex justify-between items-center xl:mb-4">
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <h1 className="text-sm md:text-2xl xl:text-[32px] font-bold">
                My Game History
              </h1>
              <div className="flex items-center h-full">
                {isLoading ? (
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
