"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";
import { useTutorial } from "@/components/TutorialProvider";
import DotSpinner from "@/components/game-history/Spinner";
import LoadingDot from "@/components/game-history/components/LoadingDot";
import ImportDialogButton from "@/components/game-history/components/ImportDialogButton";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import GameHistoryAiProgressBanner from "@/components/v2/game-history-ai-progress-banner";
import GameHistoryConnectBanner from "@/components/v2/game-history-connect-banner";
import { GameHistoryTable } from "@/components/v2/game-history-table";
import { GameHistoryTabs } from "@/components/v2/game-history-tabs";

const GameHistoryPageV2: React.FC = () => {
  const { username, isOpenTutorial } = usePgnStore();
  const { sessionId } = useProfileStore();
  const { isTutorialPlay, dataTutorial } = useTutorial();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [openAccountConnected, setOpenAccountConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsernameFetching, setIsUsernameFetching] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  useEffect(() => {
    if (!isTutorialPlay && !isOpenTutorial) {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      setIsUsernameFetching(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsUsernameFetching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isTutorialPlay, isOpenTutorial]);

  if (!isTutorialPlay && !isOpenTutorial && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <main className="w-full bg-primary-white min-h-screen">
      <ChessAccountSetup
        isLoading={isLoading}
        open={openAccountConnected}
        setOpen={() => setOpenAccountConnected(false)}
      />

      <div className="p-4 md:p-6">
        <GameHistoryTabs />

        <div className="flex justify-between md:justify-end items-center gap-4 mb-[8px]">
          <h1 className="hidden text-[22px] md:text-2xl xl:text-[32px] font-bold text-[#111827]">
            My Game History
          </h1>

          {/* w-auto lets the row's justify-end place the button on the right;
              the button's own root div is w-full and would otherwise fill the row. */}
          <div className="w-full md:w-auto">
            <ImportDialogButton />
          </div>
        </div>
        
        <GameHistoryAiProgressBanner />

        {!isTutorialPlay && !username && (
          <GameHistoryConnectBanner
            onClick={() => setOpenAccountConnected(true)}
          />
        )}

        <GameHistoryTable />
      </div>
    </main>
  );
};

export default GameHistoryPageV2;
