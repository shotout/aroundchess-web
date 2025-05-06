"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";

import DotSpinner from "./Spinner";
import HistoryTabs from "./components/HistoryTabs";
import StatisticsSection from "./components/StatisticsSection";
import ImportDialogButton from "./components/ImportDialogButton";
import LoadingDot from "./components/LoadingDot";
import ChessAccountSetup from "../analysis/onboarding/ChessAccountSetup";

const GameHistoryPage: React.FC = () => {
  const { username } = usePgnStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const sessionId = localStorage.getItem("token");

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  const [isLoading, setIsLoading] = useState(true);
  const [isUsernameFetching, setIsUsernameFetching] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    setIsUsernameFetching(true);

    // Just wait for ChessAccountSetup to finish its work
    setTimeout(() => {
      setIsLoading(false);
      setIsUsernameFetching(false);
    }, 500);
  }, [isSignedIn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      <main className="w-full px-4 py-4 space-y-[16px] bg-primary-white relative">
        <ChessAccountSetup isLoading={isLoading} />

        <div className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-row items-end gap-2">
              <h1 className="text-base lg:text-[32px] font-bold">
                My Game History
              </h1>
              <div className="flex justify-center items-end h-full">
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
