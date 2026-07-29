"use client";

import { usePuzzles } from "@/app/hooks/usePuzzles";
import { useLimitPuzzle } from "@/app/store/limitPuzzle";
import { useProfileStore } from "@/app/store/profile";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import Navigation from "@/components/navigator/navigation";
import { PuzzleGame } from "@/components/playground/puzzle/PuzzleGame";
import PuzzleInitialize from "@/components/playground/puzzle/PuzzleInitialize";
import { PracticePremiumGuard } from "@/components/v2/premium-lock-guard";
import { useApiClient } from "@/functions/api-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Puzzle = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Themes: string;
};

export default function Puzzle() {
  const [filteredPuzzles, setFilteredPuzzles] = useState<Puzzle[]>([]);
  const [showInitialization, setShowInitialization] = useState(true);

  const {
    currentPuzzle,
    getRandomPuzzle,
    resetPuzzle,
    isSolved,
    solutionHistory,
    currentSolutionIndex,
    fenHistory,
    setFenHistory,
    activePlayer,
    setActivePlayer,
    playerColor,
    handleNavigateToMove,
    handleTakeBackMove,
    boardOrientation,
    setCurrentSolutionIndex,
    setGameStarted,
    getNextPuzzle,
    getHint,
    getHintArrow,
    clearHintArrow,
    arrow,
    hint,
    clearHint,
    changeTopicPuzzle,
  } = usePuzzles(filteredPuzzles);
  const { setOpen } = useLimitPuzzle();

  const { isMember, isMemberMonthly } = useProfileStore();
  const { postPuzzle, getUsagePuzzle, isLoading } = useApiClient();
  const [remainingPuzzle, setRemainingPuzzle] = useState(0);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const hasRun = useRef(false);

  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    toast.success("Thank you for subscribing to Premium!");
  };
useEffect(() => {
    trackCustomEvent("ViewPuzzle");
  }, []);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    handleGetLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSolved) {
      handleGetLog();
      handleSaveLog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSolved]);
  const nextMonth =
    new Date().getMonth() + 2 > 12
      ? "01." + (new Date().getFullYear() + 1)
      : "01." + (new Date().getMonth() + 2) + "." + new Date().getFullYear();

  const handleGetLog = async () => {
    // apiRequest resolves to null when there is no session yet (signed out, or
    // the store hasn't hydrated), and rejects on a network failure — neither
    // should take the page down with "Cannot read properties of null".
    const res: any = await getUsagePuzzle().catch(() => null);
    const usage = Number(res?.data?.totalPuzzlesThisMonth) || 0;
    setRemainingPuzzle(usage);
    if (usage >= 20 && (!isMember&&!isMemberMonthly)) {
      // toast.error(
      //   `No free puzzles left this month. Free Puzzles reset on ${nextMonth}. Get Unlimited Puzzles now by clicking the button below.`
      // );
      setOpen(true);
    }
  };
  const handleNextPuzzle = () => {
    if (remainingPuzzle >= 20 && (!isMember&&!isMemberMonthly)) {
      setOpen(true);
    } else {
      getNextPuzzle();
    }
  };
  const handleSaveLog = async () => {
    const body = {
      puzzleId: filteredPuzzles[0].PuzzleId,
    };
    await postPuzzle(body);
    handleGetLog();
  };

  const handleFetchPuzzles = (puzzles: Puzzle[]) => {
    if (remainingPuzzle >= 20 && (!isMember&&!isMemberMonthly)) {
      return;
    } else if (puzzles.length === 0) {
      return;
    }
    setFilteredPuzzles(puzzles);
    setShowInitialization(false);

    setTimeout(() => {
      getRandomPuzzle();
    }, 0);
  };

  const handleBackToPuzzleInitialize = () => {
    setShowInitialization(true);
    setFilteredPuzzles([]);
    resetPuzzle();
    setGameStarted(false);
  };
  const handleStartPuzzle = () => {
    if (remainingPuzzle >= 20 &&(!isMember&&!isMemberMonthly)) {
      setOpen(true);
    } else {
      setGameStarted(true);
    }
  };
  return (
    <Navigation>
      <PracticePremiumGuard />
      {showInitialization || !currentPuzzle ? (
        <PuzzleInitialize
          jsonPath="/puzzle/mate_puzzles.json"
          onFetchPuzzles={handleFetchPuzzles}
          filteredPuzzles={filteredPuzzles}
          setFilteredPuzzles={setFilteredPuzzles}
          setGameStarted={handleStartPuzzle}
        />
      ) : (
        <PuzzleGame
          fenHistory={fenHistory}
          puzzleMoves={solutionHistory}
          currentMoveIndex={currentSolutionIndex}
          setCurrentMoveIndex={setCurrentSolutionIndex}
          isGameOver={isSolved}
          onGameOver={() => {}}
          setFenHistory={setFenHistory}
          setActivePlayer={setActivePlayer}
          activePlayer={activePlayer}
          color={playerColor}
          boardOrientation={boardOrientation}
          resetPuzzle={resetPuzzle}
          getNextPuzzle={handleNextPuzzle}
          hint={hint}
          arrow={arrow}
          clearHint={() => {
            clearHint();
            clearHintArrow();
          }}
          navigateToMove={handleNavigateToMove}
          onTakeBackMove={handleTakeBackMove}
          onGetHint={() => {
            getHint();
            getHintArrow();
          }}
          onChangeTopic={changeTopicPuzzle}
          onBackToPuzzleInitialize={handleBackToPuzzleInitialize}
        />
      )}
      <PremiumSubscription
        visible={showPremiumDialog && !isLoading}
        onClose={handleClosePremium}
        onGetPremium={handleGetPremium}
      />
    </Navigation>
  );
}
