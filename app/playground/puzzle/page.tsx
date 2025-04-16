"use client";

import { usePuzzles } from "@/app/hooks/usePuzzles";
import Navigation from "@/components/navigator/navigation";
import { PuzzleGame } from "@/components/playground/puzzle/PuzzleGame";
import PuzzleInitialize from "@/components/playground/puzzle/PuzzleInitialize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiClient } from "@/functions/api-client";
import Image from "next/image";
import { useEffect, useState } from "react";
type Puzzle = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Themes: string;
};
export default function Puzzle() {
  const [filteredPuzzles, setFilteredPuzzles] = useState<Puzzle[]>([]); // Store filtered puzzles

  // Use the custom hook with the filtered puzzles
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
    toggleBoardOrientation,
    boardOrientation,
    setCurrentSolutionIndex,
    setGameStarted,
    getNextPuzzle,
    getHint,
    hint,
    clearHint,
    changeTopicPuzzle,
    showConfirmationBox,
    handleConfirm,
  } = usePuzzles(filteredPuzzles); // Pass filtered puzzles to the hook
  const { postPuzzle, getPuzzle, isLoading } = useApiClient();
  const [puzzleLog, setPuzzleLog] = useState<any[]>([]);
  useEffect(() => {
    handleGetLog();
    if (isSolved) {
      handleSaveLog();
    }
  }, [isSolved]);
  const handleGetLog = async () => {
    await getPuzzle().then((res) => {
      let logs = res.data;
      setPuzzleLog(logs);
      if (logs.length == 20) {
        // kondisi kalo udah 20
      }
    });
  };
  const handleSaveLog = async () => {
    let body = {
      puzzleId: filteredPuzzles[0].PuzzleId,
    };
    await postPuzzle(body);
  };
  // Callback for when puzzles are fetched and filtered
  const handleFetchPuzzles = (puzzles: Puzzle[]) => {
    if (puzzles.length === 0) {
      // console.warn('No puzzles fetched.')
      return;
    }
    console.log("puzzles", puzzles);
    setFilteredPuzzles(puzzles); // Update state first

    // Wait for the state to update before calling getRandomPuzzle
    setTimeout(() => {
      // console.log('Filtered puzzles updated. Fetching random puzzle...')
      getRandomPuzzle();
    }, 0);
  };

  const handleStart = () => {};
  return (
    <Navigation>
      {!currentPuzzle ? (
        <PuzzleInitialize
          jsonPath="/puzzle/mate_puzzles.json" // Path to your JSON file
          onFetchPuzzles={handleFetchPuzzles} // Pass filtered puzzles to this callback
          filteredPuzzles={filteredPuzzles}
          setFilteredPuzzles={setFilteredPuzzles}
          setGameStarted={setGameStarted}
        />
      ) : (
        <PuzzleGame
          fenHistory={fenHistory} // FEN of the current puzzle
          puzzleMoves={solutionHistory} // Solution moves
          currentMoveIndex={currentSolutionIndex}
          setCurrentMoveIndex={setCurrentSolutionIndex}
          isGameOver={isSolved} // Treat "solved" as game over for puzzles
          onGameOver={() => {}} // Optional callback for when the puzzle is solved
          setFenHistory={setFenHistory}
          setActivePlayer={setActivePlayer}
          activePlayer={activePlayer}
          color={playerColor}
          boardOrientation={boardOrientation}
          resetPuzzle={resetPuzzle}
          getNextPuzzle={getNextPuzzle}
          hint={hint}
          clearHint={clearHint}
          navigateToMove={handleNavigateToMove}
          onTakeBackMove={handleTakeBackMove}
          onGetHint={getHint}
          onChangeTopic={changeTopicPuzzle}
        />
      )}
    </Navigation>
  );
}
