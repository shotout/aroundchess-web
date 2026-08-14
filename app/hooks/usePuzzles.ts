/* eslint-disable */
import { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";

type Puzzle = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Themes: string;
};

export function usePuzzles(initialPuzzles: Puzzle[]) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [solutionHistory, setSolutionHistory] = useState<string[]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [game] = useState(new Chess());
  const [fenHistory, setFenHistory] = useState<string[]>([]);
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [arrow, setArrow] = useState<any[] | null>(null);
  const [showConfirmationBox, setShowConfirmationBox] =
    useState<boolean>(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    if (!gameStarted) {
      setPuzzles(initialPuzzles);
    }
  }, [initialPuzzles, gameStarted]);

  useEffect(() => {
    if (gameStarted && puzzles.length > 0) {
      loadPuzzleByIndex(0);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (fenHistory.length > 0) {
      const currentFEN = fenHistory[fenHistory.length - 1];
      const sideToMove = currentFEN.split(" ")[1];
      setActivePlayer(sideToMove === "w" ? "white" : "black");

      if (fenHistory.length === 1) {
        setPlayerColor(sideToMove === "w" ? "white" : "black");
      }
    }
  }, [fenHistory]);

  const changeTopicPuzzle = () => {
    setCurrentPuzzle(null);
  };

  const loadPuzzleByIndex = (index: number, forceReload = false) => {
    if (index === currentPuzzleIndex && !forceReload) {
      return;
    }

    if (index >= 0 && index < puzzles.length) {
      const puzzle = puzzles[index];
      setCurrentPuzzle(puzzle);
      setCurrentPuzzleIndex(index);
      game.load(puzzle.FEN);
      setFenHistory([puzzle.FEN]);
      console.log("loadPuzzleByIndex", puzzle);
      setSolutionHistory(puzzle.Moves.split(" "));
      setCurrentSolutionIndex(0);
      setIsSolved(false);
      setHint(null);

      const startingSide = puzzle.FEN.split(" ")[1];
      setBoardOrientation(startingSide === "b" ? "black" : "white");

    }
  };

  const getRandomPuzzle = () => {
    if (puzzles.length === 0) return;

    let randomIndex = Math.floor(Math.random() * puzzles.length);

    while (randomIndex === currentPuzzleIndex && puzzles.length > 1) {
      randomIndex = Math.floor(Math.random() * puzzles.length);
    }

    loadPuzzleByIndex(randomIndex);
  };

  const getNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      loadPuzzleByIndex(currentPuzzleIndex + 1);
    } else {
      setShowConfirmationBox(true);
      setConfirmationAction(() => () => {
        if (typeof window !== "undefined") {
          window.location.href = "/puzzles";
        }
      });
    }
  };

  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setShowConfirmationBox(false);
  };

  const resetPuzzle = () => {
    if (currentPuzzle) {
      loadPuzzleByIndex(currentPuzzleIndex, true);
      setIsSolved(false);
    }
  };

  const handleTakeBackMove = () => {
    if (isSolved || currentSolutionIndex === 0) return;
    
    const isBotTurn = currentSolutionIndex % 2 === 0;
    const movesToUndo = 1;
    
    const actualMovesToUndo = Math.min(movesToUndo, currentSolutionIndex);
    
    for (let i = 0; i < actualMovesToUndo; i++) {
      game.undo();
    }
    
    setFenHistory((prev) => prev.slice(0, -actualMovesToUndo));
    setCurrentSolutionIndex((prev) => prev - actualMovesToUndo);
  };

  const toggleBoardOrientation = () => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  };

  const handleNavigateToMove = (index: number) => {
    if (index >= 0 && index < fenHistory.length) {
      setCurrentSolutionIndex(index);
    }
  };

  const getHint = () => {
    if (currentPuzzle) {
      const moves = solutionHistory;
      const nextMove = moves[currentSolutionIndex];
      const fromSquare = nextMove.slice(0, 2);
      setHint(fromSquare);
    }
  };
  const isKnightMove = (from: string, to: string): boolean => {
    const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankFrom = parseInt(from[1]) - 1;
    const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankTo = parseInt(to[1]) - 1;

    const fileDiff = Math.abs(fileTo - fileFrom);
    const rankDiff = Math.abs(rankTo - rankFrom);

    return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
  };

  const getHintArrow = () => {
    if (currentPuzzle) {
      const moves = solutionHistory;
      const nextMove = moves[currentSolutionIndex];
      const fromSquare = nextMove.substring(0, 2);
      const toSquare = nextMove.substring(2, 4);
      
      setArrow([
        {
          from: fromSquare,
          to: toSquare,
          color: "rgba(34, 26, 233, 0.7)",
          isKnightMove: isKnightMove(fromSquare, toSquare)
        },
      ]);
    }
  };
  const clearHintArrow = () => {
    setArrow(null);
  };
  const clearHint = () => {
    setHint(null);
  };

  useEffect(() => {
    if (
      solutionHistory.length > 0 &&
      currentSolutionIndex === solutionHistory.length
    ) {
      setIsSolved(true);
    }
  }, [currentSolutionIndex, solutionHistory]);

  return {
    changeTopicPuzzle,
    currentPuzzle,
    getRandomPuzzle,
    getNextPuzzle,
    resetPuzzle,
    isSolved,
    solutionHistory,
    currentSolutionIndex,
    fenHistory,
    setFenHistory,
    activePlayer,
    setActivePlayer,
    playerColor,
    toggleBoardOrientation,
    handleTakeBackMove,
    boardOrientation,
    setCurrentSolutionIndex,
    handleNavigateToMove,
    gameStarted,
    setGameStarted,
    getHint,
    getHintArrow,
    clearHintArrow,
    arrow,
    clearHint,
    hint,
    showConfirmationBox,
    handleConfirm,
  };
}
