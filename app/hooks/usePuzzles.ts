/* eslint-disable */
import { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";

// Define the simplified puzzle type
type Puzzle = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Themes: string; // Used for filtering by theme
};

export function usePuzzles(initialPuzzles: Puzzle[]) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [solutionHistory, setSolutionHistory] = useState<string[]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [game] = useState(new Chess());
  const [fenHistory, setFenHistory] = useState<string[]>([]); // Track FEN history
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [hint, setHint] = useState<string | null>(null); // Track the current hint
  const [arrow, setArrow] = useState<any[] | null>(null); // Track the current hint
  const [showConfirmationBox, setShowConfirmationBox] =
    useState<boolean>(false);
  const [confirmationAction, setConfirmationAction] = useState<
    (() => void) | null
  >(null);

  // Update puzzles when `initialPuzzles` changes
  useEffect(() => {
    if (!gameStarted) {
      setPuzzles(initialPuzzles);
    }
  }, [initialPuzzles, gameStarted]);

  // Start the game and load the first puzzle
  useEffect(() => {
    if (gameStarted && puzzles.length > 0) {
      loadPuzzleByIndex(0);
    }
  }, [gameStarted]); // Remove puzzles from dependencies

  // Update active player and player color whenever FEN changes
  useEffect(() => {
    if (fenHistory.length > 0) {
      const currentFEN = fenHistory[fenHistory.length - 1];
      const sideToMove = currentFEN.split(" ")[1]; // Second part of FEN indicates active side ('w' or 'b')
      setActivePlayer(sideToMove === "w" ? "white" : "black");

      if (fenHistory.length === 1) {
        setPlayerColor(sideToMove === "w" ? "white" : "black");
      }
    }
  }, [fenHistory]);

  const changeTopicPuzzle = () => {
    setCurrentPuzzle(null);
  };

  // Load a puzzle by its index
  const loadPuzzleByIndex = (index: number, forceReload = false) => {
    if (index === currentPuzzleIndex && !forceReload) {
      // console.log('Puzzle already loaded:', index)
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
      setHint(null); // Reset hint when loading a new puzzle

      const startingSide = puzzle.FEN.split(" ")[1];
      setBoardOrientation(startingSide === "b" ? "white" : "black");

      // console.log('Loaded Puzzle:', puzzle)
    }
  };

  // Fetch a random puzzle
  const getRandomPuzzle = () => {
    if (puzzles.length === 0) return;

    let randomIndex = Math.floor(Math.random() * puzzles.length);

    // Avoid reloading the same puzzle
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

  // Reset the current puzzle
  const resetPuzzle = () => {
    if (currentPuzzle) {
      loadPuzzleByIndex(currentPuzzleIndex, true); // Reload the puzzle
      setIsSolved(false);
    }
  };

  // Undo the last move
  const handleTakeBackMove = () => {
    if (isSolved || currentSolutionIndex === 0) return;
    setFenHistory((prev) => prev.slice(0, -1));
    setCurrentSolutionIndex((prev) => prev - 1);
    game.undo();
  };

  // Toggle the board orientation
  const toggleBoardOrientation = () => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  };

  // Navigate to a specific move
  const handleNavigateToMove = (index: number) => {
    if (index >= 0 && index < fenHistory.length) {
      setCurrentSolutionIndex(index);
    }
  };

  // Get a hint for the current puzzle
  const getHint = () => {
    if (currentPuzzle) {
      const moves = solutionHistory;
      const nextMove = moves[currentSolutionIndex]; // Get the next move in the solution
      const fromSquare = nextMove.slice(0, 2); // Extract the starting square
      setHint(fromSquare); // Set the hint to the starting square of the next move
    }
  };
  // Helper function to detect if a move is a knight move (L-shaped)
  const isKnightMove = (from: string, to: string): boolean => {
    const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankFrom = parseInt(from[1]) - 1;
    const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankTo = parseInt(to[1]) - 1;

    const fileDiff = Math.abs(fileTo - fileFrom);
    const rankDiff = Math.abs(rankTo - rankFrom);

    // Knight moves: 2 squares in one direction, 1 in perpendicular
    return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
  };

  const getHintArrow = () => {
    if (currentPuzzle) {
      const moves = solutionHistory;
      const nextMove = moves[currentSolutionIndex]; // Get the next move in the solution
      const fromSquare = nextMove.substring(0, 2);
      const toSquare = nextMove.substring(2, 4);
      
      setArrow([
        {
          from: fromSquare,
          to: toSquare,
          color: "rgba(34, 26, 233, 0.3)", // Purple hint color
          isKnightMove: isKnightMove(fromSquare, toSquare)
        },
      ]);
    }
  };
  const clearHintArrow = () => {
    setArrow(null);
  };
  // Clear the hint
  const clearHint = () => {
    setHint(null);
  };

  // Detect when a puzzle is solved
  useEffect(() => {
    if (
      solutionHistory.length > 0 &&
      currentSolutionIndex === solutionHistory.length
    ) {
      setIsSolved(true);
      // console.log('Puzzle solved!')
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
    getHint, // Expose the getHint function
    getHintArrow,
    clearHintArrow,
    arrow,
    clearHint, // Expose the clearHint function
    hint, // Expose the current hint
    showConfirmationBox,
    handleConfirm,
  };
}
