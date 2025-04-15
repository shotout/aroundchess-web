"use client";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import ThreeDChessboard from "@/components/chessboard/3d/ThreeDChessboard";
import WoodBoard from "@/components/chessboard/wood/WoodBoard";
import { SettingBoard } from "@/components/modal/SettingBoard";
import Navigation from "@/components/navigator/navigation";
import GameCard from "@/components/playground/play-vs-ai/GameCard";
import { Engine } from "@/components/playground/src/lib/stockfish";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changeNamePiece } from "@/functions/change-name-piece";
import { useAuth, useUser } from "@clerk/nextjs";
import { Chess, Piece, PieceSymbol, Square } from "chess.js";
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  HistoryIcon,
  Info,
  MoveRightIcon,
  Plus,
  RefreshCcw,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "@/components/game-history/Spinner";
import { usePgnStore } from "@/app/store/zustandStore";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import {
  getMoveHighlightStyle,
  getLastMoveHighlightStyle,
  getHintHighlightStyle,
  getInvalidMoveHighlightStyle,
} from "@/app/utils/highlightStyles";
import { clearSelection } from "@/app/utils/gameUtils";
import { getMaterialDifferences } from "@/app/utils/calculateMaterialDifference";
import ReactCountryFlag from "react-country-flag";

interface PuzzleGameProps {
  color: "white" | "black";
  boardOrientation: "white" | "black";
  onGameOver: () => void;
  isGameOver: boolean;
  currentMoveIndex: number;
  activePlayer: "white" | "black";
  setActivePlayer: (player: "white" | "black") => void;
  fenHistory: string[];
  setFenHistory: React.Dispatch<React.SetStateAction<string[]>>;
  puzzleMoves: string[];
  setCurrentMoveIndex: React.Dispatch<React.SetStateAction<number>>;
  resetPuzzle: () => void;
  getNextPuzzle: () => void;
  hint: string | null;
  clearHint: () => void;
  navigateToMove: (index: number) => void;
  onTakeBackMove: () => void;
  onGetHint: () => void;
  onChangeTopic: () => void;
}
export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  boardOrientation,
  onGameOver,
  isGameOver,
  currentMoveIndex,
  activePlayer,
  setActivePlayer,
  fenHistory,
  setFenHistory,
  puzzleMoves,
  setCurrentMoveIndex,
  resetPuzzle,
  getNextPuzzle,
  hint,
  clearHint,
  navigateToMove,
  onTakeBackMove,
  onGetHint,
  onChangeTopic,
}) => {
  const router = useRouter();
  const chessGame = useMemo(() => new Chess(), []);

  const [position, setPosition] = useState<string>(chessGame.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<
    {
      square: Square;
      isCapture: boolean;
    }[]
  >([]);
  const [highlightedSquares, setHighlightedSquares] = useState<Square[]>([]);

  const [gameEnded, setGameEnded] = useState(false);
  const [moveProcessed, setMoveProcessed] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [whiteMaterialDifference, setWhiteMaterialDifference] = useState(0);
  const [blackMaterialDifference, setBlackMaterialDifference] = useState(0);
  const [invalidMoveSquares, setInvalidMoveSquares] = useState<string[]>([]);

  const prevFenHistory = useRef<string[]>([]);

  useEffect(() => {
    // Update material differences when the position changes
    const board = chessGame.board();
    const { whiteMaterialDifference, blackMaterialDifference } =
      getMaterialDifferences(board);
    setWhiteMaterialDifference(whiteMaterialDifference);
    setBlackMaterialDifference(blackMaterialDifference);

    // Update the active player if the game is not over
    if (!chessGame.isGameOver() && !gameEnded) {
      setActivePlayer(chessGame.turn() === "w" ? "white" : "black");
    }

    // Check for game over
    if (!gameEnded && chessGame.isGameOver()) {
      setGameEnded(true);
      onGameOver();
    }
  }, [position, gameEnded, onGameOver]);

  useEffect(() => {
    // Handle changes to fenHistory and position
    if (fenHistory.length < prevFenHistory.current.length) {
      setLastMove(null); // Clear last move if history has been shortened
    }

    if (currentMoveIndex >= 0 && currentMoveIndex < fenHistory.length) {
      const newFen = fenHistory[currentMoveIndex];
      setPosition(newFen);
      chessGame.load(newFen);
      setActivePlayer(chessGame.turn() === "w" ? "white" : "black");
    }

    // Save fenHistory to local storage
    localStorage.setItem("fenHistory", JSON.stringify(fenHistory));

    // Load previous fenHistory on initial render
    if (prevFenHistory.current.length === 0) {
      const savedHistory = JSON.parse(
        localStorage.getItem("fenHistory") || "[]"
      );
      if (savedHistory.length) {
        setFenHistory(savedHistory);
        setPosition(savedHistory[savedHistory.length - 1]);
      }
    }

    prevFenHistory.current = fenHistory;
  }, [fenHistory, currentMoveIndex]);

  const isAtCurrentMove = useMemo(
    () => position === fenHistory[fenHistory.length - 1],
    [position, fenHistory]
  );

  const highlightStyles = useMemo(
    () =>
      isAtCurrentMove
        ? possibleMoves.map(({ square, isCapture }) =>
            getMoveHighlightStyle(square, isCapture, boardOrientation)
          )
        : [],
    [possibleMoves, boardOrientation, isAtCurrentMove]
  );

  const handleClearSelection = useCallback(() => {
    clearSelection(setSelectedSquare, setPossibleMoves);
  }, []);

  const getPossibleMoves = useCallback((square: Square) => {
    const game = chessGame;
    const moves = game.moves({ square, verbose: true });
    const moveSquares = moves.map((move) => ({
      square: move.to as Square,
      isCapture: !!move.captured,
    }));
    setPossibleMoves(moveSquares);
  }, []);

  const makeMoveCallback = useCallback(
    (fromSquare: Square, toSquare: Square) => {
      const game = chessGame;

      const expectedMove = puzzleMoves[currentMoveIndex];
      if (!expectedMove) {
        // console.error('No more moves in the puzzle.')
        return false;
      }

      const expectedFrom = expectedMove.slice(0, 2);
      const expectedTo = expectedMove.slice(2, 4);

      // Check if the move is legal
      const legalMoves = game.moves({ square: fromSquare, verbose: true });
      const isMoveLegal = legalMoves.some((m) => m.to === toSquare);

      if (!isMoveLegal) {
        // console.error(`Illegal move from ${fromSquare} to ${toSquare}`)
        return false; // No invalid highlighting for illegal moves
      }

      // Check if the move matches the puzzle's expected move
      if (fromSquare !== expectedFrom || toSquare !== expectedTo) {
        // console.error(
        //   `Invalid move. Expected: ${expectedFrom} to ${expectedTo}, got: ${fromSquare} to ${toSquare}`
        // )
        setInvalidMoveSquares([toSquare]); // Highlight invalid square
        setTimeout(() => setInvalidMoveSquares([]), 500); // Clear after 1 second
        return false;
      }

      // Perform the move
      const move = game.move({ from: fromSquare, to: toSquare });
      if (move) {
        const currentFen = game.fen();
        setPosition(currentFen);
        setFenHistory((prevHistory) => [...prevHistory, currentFen]);
        setLastMove({ from: move.from, to: move.to });
        setCurrentMoveIndex((prevIndex) => prevIndex + 1);
        setActivePlayer(game.turn() === "w" ? "white" : "black");
        setHighlightedSquares([]);
        clearHint();
        return true;
      }

      return false;
    },
    [
      puzzleMoves,
      currentMoveIndex,
      setPosition,
      setFenHistory,
      setLastMove,
      setCurrentMoveIndex,
      setActivePlayer,
    ]
  );

  const handleSquareClickCallback = useCallback(
    (square: Square) => {
      if (!isAtCurrentMove) return;

      const game = chessGame;
      const pieceAtSquare = game.get(square);

      // Case 1: A piece is already selected
      if (selectedSquare) {
        const fromSquare = selectedSquare;

        // Case 1a: Clicking on a different piece of the same color
        if (
          pieceAtSquare &&
          pieceAtSquare.color === game.turn() &&
          !isComputerTurn
        ) {
          setSelectedSquare(square);
          getPossibleMoves(square);
          return;
        }

        // Case 1b: Clicking on the same square (deselect)
        if (fromSquare === square) {
          handleClearSelection();
          return;
        }

        // Case 1c: Attempt to move to the square
        const toSquare = square;

        // Delegate move validation and execution to makeMoveCallback
        const moveSuccessful = makeMoveCallback(fromSquare, toSquare);
        if (moveSuccessful) {
          handleClearSelection(); // Clear selection only after a successful move
        } else {
        }

        return;
      }

      // Case 2: No piece is selected yet
      if (pieceAtSquare) {
        // Select the piece and highlight its moves
        if (pieceAtSquare.color === game.turn() && !isComputerTurn) {
          setSelectedSquare(square);
          getPossibleMoves(square);
        } else {
          // Clear selection if the piece doesn't belong to the current player
          handleClearSelection();
        }
      } else {
        // No piece on the clicked square; clear selection
        handleClearSelection();
      }
    },
    [
      chessGame,
      selectedSquare,
      setSelectedSquare,
      getPossibleMoves,
      handleClearSelection,
      makeMoveCallback,
      isAtCurrentMove,
    ]
  );

  const handlePieceDrop = useCallback(
    (fromSquare: Square, toSquare: Square) => {
      if (!isAtCurrentMove) return false;

      return makeMoveCallback(fromSquare, toSquare);
    },
    [makeMoveCallback, isAtCurrentMove]
  );

  const handleDragEnd = useCallback(
    () => handleClearSelection(),
    [handleClearSelection]
  );

  const handlePieceClick = useCallback(
    (piece: Piece, square: Square) => handleSquareClickCallback(square),
    [handleSquareClickCallback]
  );

  const handleDragBegin = useCallback(
    (piece: string, square: string) => {
      setSelectedSquare(square as Square);
      getPossibleMoves(square as Square);
    },
    [getPossibleMoves]
  );

  const handleSquareRightClick = useCallback((square: Square) => {
    setHighlightedSquares(
      (prev) =>
        prev.includes(square)
          ? prev.filter((s) => s !== square) // Remove square if already highlighted
          : [...prev, square] // Add square if not highlighted
    );
  }, []);

  const customSquareStyles = useMemo(() => {
    return highlightedSquares.reduce((acc, square) => {
      acc[square] = { backgroundColor: "rgb(255, 5, 5, 0.25)" }; // Correctly type the styles
      return acc;
    }, {} as Record<string, Record<string, string | number>>); // Match the expected type
  }, [highlightedSquares]);

  const resetPuzzleHandler = useCallback(() => {
    chessGame.reset(); // Reset the chess game instance
    resetPuzzle(); // Clear the current puzzle state
    setCurrentMoveIndex(0); // Reset the move index
    setMoveProcessed(false); // Reset move processing state
    setGameEnded(false); // Reset the game-ended state
  }, [resetPuzzle, setFenHistory, setCurrentMoveIndex]);

  const getNextPuzzleHandler = useCallback(() => {
    chessGame.reset(); // Reset the chess game instance
    setCurrentMoveIndex(0); // Reset the move index
    setMoveProcessed(false); // Reset move processing state
    setGameEnded(false); // Reset the game-ended state
    getNextPuzzle(); // Proceed to the next puzzle
  }, [setFenHistory, setCurrentMoveIndex, getNextPuzzle]);

  const isComputerTurn = currentMoveIndex % 2 === 0;

  useEffect(() => {
    // Ensure computer only moves at the latest position
    if (gameEnded) return; // Exit if the game has ended
    if (!isComputerTurn || moveProcessed) return; // Exit if not the computer's turn or move already processed

    // Check if we're at the end of the move history
    const isAtCurrentMove = currentMoveIndex === fenHistory.length - 1;
    if (!isAtCurrentMove) return; // Prevent move execution if not at the latest move

    const move = puzzleMoves[currentMoveIndex];
    if (move) {
      const fromSquare = move.slice(0, 2) as Square;
      const toSquare = move.slice(2, 4) as Square;

      const delay = setTimeout(() => {
        const moveResult = makeMoveCallback(fromSquare, toSquare);
        if (moveResult) {
          setMoveProcessed(true); // Mark move as processed only after success
        }
      }, 2000); // 2-second delay for move execution

      return () => clearTimeout(delay); // Cleanup timeout on re-render or dependency change
    }
  }, [
    currentMoveIndex,
    fenHistory.length, // Track changes in fenHistory length
    puzzleMoves,
    gameEnded,
    isComputerTurn,
    makeMoveCallback,
    moveProcessed,
  ]);

  useEffect(() => {
    // Reset moveProcessed only after the player's turn is processed
    if (currentMoveIndex % 2 !== 0 && moveProcessed) {
      setMoveProcessed(false);
    }
  }, [currentMoveIndex, moveProcessed]);

  useEffect(() => {
    if (!chessGame.isGameOver() && !gameEnded) {
      setActivePlayer(chessGame.turn() === "w" ? "white" : "black");
    }
  }, [position, gameEnded]);
  const handlePreviousMove = () =>
    navigateToMove(Math.max(currentMoveIndex - 1, 0));
  const handleNextMove = () =>
    navigateToMove(Math.min(currentMoveIndex + 1, fenHistory.length - 1));
  useEffect(() => {
    fillMovement();
  }, [position, chessGame]);
  const fillMovement = () => {
    let capturedPiecesBlack: {
      captured: string | null;
      capturedTheme: string | null;
      piece: string | null;
      color: string;
      from: Square;
      to: Square;
      lan: string;
      san: string;
    }[] = [];
    let capturedPiecesWhite: {
      captured: string | null;
      capturedTheme: string | null;
      piece: string | null;
      color: string;
      from: Square;
      to: Square;
      lan: string;
      san: string;
    }[] = [];
    chessGame.history({ verbose: true }).forEach((move) => {
      console.log("move fillMovement", move);
      if (move.color == "w") {
        capturedPiecesWhite.push({
          captured: changeNameFull(move.captured ?? null),
          piece: changeNameFull(move.piece),
          capturedTheme: "b" + changeNamePiece(move.captured ?? null),
          color: "white",
          from: move.from,
          to: move.to,
          lan: move.lan,
          san: move.san,
        });
      } else {
        capturedPiecesBlack.push({
          captured: changeNameFull(move.captured ?? null),
          piece: changeNameFull(move.piece),
          capturedTheme: "w" + changeNamePiece(move.captured ?? null),
          color: "black",
          from: move.from,
          to: move.to,
          lan: move.lan,
          san: move.san,
        });
      }
    });
    console.log("capturedPiecesWhite", capturedPiecesWhite);
    console.log("capturedPiecesBlack", capturedPiecesBlack);
    setCapturedBlack(capturedPiecesBlack);
    setCapturedWhite(capturedPiecesWhite);
  };
  const changeNameFull = (piece: string | null) => {
    switch (piece) {
      case "p":
        return "pawn";
        break;
      case "n":
        return "knight";
        break;
      case "b":
        return "bishop";
        break;

      case "r":
        return "rook";
        break;

      case "q":
        return "queen";
        break;

      case "k":
        return "king";
        break;

      default:
        return null;
        break;
    }
  };
  const { isLoading } = useApiClient();
  const { user } = useUser();
  const { sessionId } = useAuth();
  const { hideDiv, username } = usePgnStore();
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { PieceChoosed, StyleChoosed } = useChessBoardThemeStore();
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>("current");
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [myColor, setMyColor] = useState<string>(AIChoosed.color);
  const [currentTurn, setCurrentTurn] = useState<string>("White");
  const [boardSize, setBoardSize] = useState<number>(700);
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [heightScreen, setHeightScreen] = useState<number>(0);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState<number>(2);
  const [bestLine, setBestline] = useState<string | null>(null);
  const [positionEvaluation, setPositionEvaluation] = useState<number>(0);
  const [depth, setDepth] = useState<number>(10);
  const [hintClicked, setHintClicked] = useState<boolean>(false);
  const [possibleMate, setPossibleMate] = useState<string>("");
  const [statusGame, setStatusGame] = useState<string>("Ongoing");
  const [winnerColor, setWinnerColor] = useState<string>("");
  const [loserColor, setLoserColor] = useState<string>("");
  const [capturedWhite, setCapturedWhite] = useState<any[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<any[]>([]);
  const [moveFrom, setMoveFrom] = useState<string>("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<
    Record<string, CSSProperties>
  >({});
  const [moveSquares, setMoveSquares] = useState<Record<string, CSSProperties>>(
    {}
  );
  const [optionSquares, setOptionSquares] = useState<
    Record<string, CSSProperties>
  >({});
  const [currentSquare, setCurrentSquare] = useState<Square | undefined>(
    undefined
  );
  const [previousSquare, setPreviousSquare] = useState<Square | undefined>(
    undefined
  );
  const prevCurrentColor = {
    ...(previousSquare && {
      [previousSquare]: { backgroundColor: "#B9CA43" }, // Yellow for previous
    }),
    ...(currentSquare && {
      [currentSquare]: { backgroundColor: "#F5F682" }, // Green for current
    }),
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted, hideDiv, is3DMode]);

  const handleResize = () => {
    setHeightScreen(window?.innerHeight);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 2.4 : 480;
    console.log("Resizing board...", isPortrait, window.innerWidth);

    if (isPortrait) {
      // In portrait mode, use screen width as the primary constraint
      const availableWidth = width - minPadding * 2;
      // Use 85% of available width for mobile, 90% for tablets
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
      console.log(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      // In landscape, use height as the primary constraint
      const availableHeight = height - minPadding * 2;
      // Use 80% of available height
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
      console.log("size board...", Math.min(maxSize, availableHeight * 0.8));
    }
  };

  const cardPlayer = () => {
    return (
      <div
        className={`flex flex-row min-h-[80px] items-center justify-between rounded-[8px] bg-white border ${"border-[#DEDEDE]"} p-2 gap-2 mb-2`}
      >
        <div className="flex flex-row items-center gap-2">
          {user && (
            <Image
              src={user?.imageUrl}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[48px] h-[48px] rounded-full object-contain"
            />
          )}

          <span className={`text-[17.23px] font-medium ${"text-[#040404]"}`}>
            {user?.fullName}
          </span>
          {/* {user?.flag && (
            <ReactCountryFlag
              countryCode={user?.flag}
              svg
              className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
              title={user?.flag}
            />
          )} */}
        </div>
      </div>
    );
  };
  const renderButtonPuzzleGame = () => {
    return (
      <motion.div
        variants={fadeInUp}
        className="flex w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-2 p-2 -mx-[16px]"
      >
        <button
          disabled={currentTurn.toLowerCase() != myColor}
          onClick={onGetHint}
          className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#C0CED4] bg-white text-[#364152] rounded-[8px] hover:bg-blue-100 gap-1"
        >
          <Image
            src={"/images/puzzle/hint-icon.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[16px] h-[20px] object-contain "
          />

          <span className="font-medium text-[14px] mt-1 ">Hint</span>
        </button>
        <button
          onClick={onChangeTopic}
          className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1 "
        >
          <RefreshCcw size={20} />

          <span className="font-medium text-[14px] mt-1 ">
            Change Puzzle Topic
          </span>
        </button>
        <button
          onClick={getNextPuzzleHandler}
          className="flex flex-row items-center justify-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
        >
          <span className="font-medium text-[14px] mt-1">Next Puzzle</span>
          <ArrowRight size={20} />
        </button>
      </motion.div>
    );
  };
  const renderButtonFinish = () => {
    return (
      <motion.div
        variants={fadeInUp}
        className="flex flex-col w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-3 p-4"
      >
        {renderCommentaryGame()}
        <div className="flex flex-row w-full items-center gap-2 lg:gap-4">
          <button onClick={resetPuzzleHandler} className="btn-secondary w-full md:w-1/3 rounded-full h-[40px]">
            <div className="flex flex-row items-center justify-center gap-2">
              <RotateCcw size={20} color="#221AE9" />
              <span>Retry</span>
            </div>
          </button>
          <button onClick={getNextPuzzleHandler} className="btn-primary w-full md:w-2/3 rounded-full h-[40px]">
            <div className="flex flex-row items-center justify-center gap-2">
              <span>Next Puzzle </span>
              <ArrowRight size={20} color="#fff" />
            </div>
          </button>
        </div>
      </motion.div>
    );
  };
  const renderCommentaryGame = () => {
    let gradColor = `bg-[linear-gradient(to_right,_#A0E2CD,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#A0E2CD)]`;
    let color = "#00B427";
    let icon = "you-win";
    let sparks = "sparks-win";

    let content =
      "Congratulations, you solved this Puzzle! Let's see if you can also solve the next one.";

    return (
      <motion.div
        variants={fadeInUp}
        className={`relative w-full rounded-[8px] ${gradColor} border border-dashed border-white p-[1px]`}
      >
        <div
          className={`flex h-[56px] flex-row items-center rounded-[8px] gap-2`}
        >
          <Image
            src={`/images/puzzle/${icon}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[30px] h-[30px] object-contain m-4 mr-0"
          />
          <span className="font-medium text-[14px] z-10">{content}</span>
          <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
            <Image
              src={`/images/play-vs-ai/${sparks}.png`}
              alt="icon"
              width={1000}
              height={1000}
              className="w-full h-[56px] object-cover"
            />
          </div>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="flex flex-col xl:flex-row w-full bg-white p-2 sm:p-4 gap-4 lg:mt-8 xl:mt-0">
      
      <div className="flex flex-col w-full gap-4 ">
        <div className="xl:hidden flex flex-row items-center justify-between mb-2">
          <button>
            <ArrowLeft color="black" size={24} />
          </button>
          <div className="flex flex-1 flex-row justify-center items-center gap-2">
            <Image
              src={"/images/play-vs-ai/icon-play-vs-ai.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[22px] h-[21px] object-contain"
            />
            <span className="font-semibold text-[18px]">Puzzle</span>
          </div>
          <div className="flex " />
        </div>

        <div className="xl:border xl:border-[#DEDEDE] xl:p-4 xl:rounded-[16px]">
          {cardPlayer()}
          <div className="flex flex-col justify-center items-center gap-3 ">
            {/* {buttonBoard()} */}
            <motion.div
              initial={{ rotateX: 180 }}
              animate={
                !is3DMode
                  ? { opacity: 0, display: "hidden" }
                  : { opacity: 1, rotateX: !is3DMode ? 180 : 360 }
              }
              transition={{
                duration: 0.6,
                stiffness: 500,
                damping: 30,
                ease: [0.4, 0.0, 0.2, 1],
                type: "tween",
              }}
              style={{
                width: boardSize,
                display: is3DMode ? "flex" : "none",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              {is3DMode && (
                <ThreeDBoard
                  showPromotionDialog={showPromotionDialog}
                  onPromotionPieceSelect={function (
                    piece?: PromotionPieceOption,
                    promoteFromSquare?: Square,
                    promoteToSquare?: Square
                  ): boolean {
                    throw new Error("Function not implemented.");
                  }}
                  onPieceDrop={handlePieceDrop}
                  position={position}
                  orientation={boardOrientation === "white" ? "white" : "black"}
                  boardWidth={boardSize}
                  onSquareClick={
                    !isComputerTurn && gameEnded
                      ? undefined
                      : handleSquareClickCallback
                  }
                  arePiecesDraggable={false}
                  // arePiecesDraggable={!isComputerTurn && !gameEnded}
                  onPieceClick={
                    !isComputerTurn && gameEnded
                      ? undefined
                      : (piece: string, sourceSquare: string) =>
                          handlePieceClick(
                            { type: piece as PieceSymbol, color: "w" }, // Adjust the piece type
                            sourceSquare as Square
                          )
                  }
                  onSquareRightClick={handleSquareRightClick}
                  customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                    ...prevCurrentColor,
                    ...customSquareStyles,
                  }}
                  arePremovesAllowed={true}
                  customArrows={
                    bestLine && bestLine.length > 0 && bestLine?.split(" ")?.[0]
                      ? [
                          [
                            bestLine?.split(" ")?.[0].substring(0, 2) as Square,
                            bestLine?.split(" ")?.[0].substring(2, 4) as Square,
                          ],
                        ]
                      : null
                  }
                  customArrowColor={hintClicked ? "#1C16C2" : "transparent"}
                  promotionToSquare={moveTo}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ rotateX: 180 }}
              animate={
                is3DMode
                  ? { opacity: 0, display: "none" }
                  : { opacity: 1, rotateX: is3DMode ? 180 : 360 }
              }
              transition={{
                duration: 0.5,
                stiffness: 500,
                damping: 35,
                ease: [0.4, 0.0, 0.2, 1],
                type: "tween",
              }}
              style={{
                width: boardSize,
                display: !is3DMode ? "flex" : "none",
                backfaceVisibility: "hidden",
              }}
            >
              {!is3DMode && (
                <TwoDChessboard
                  onPieceDrop={handlePieceDrop}
                  position={position}
                  orientation={boardOrientation === "white" ? "white" : "black"}
                  boardWidth={boardSize}
                  onSquareClick={
                    !isComputerTurn && gameEnded
                      ? undefined
                      : handleSquareClickCallback
                  }
                  arePiecesDraggable={false}
                  // arePiecesDraggable={!isComputerTurn && !gameEnded}
                  onPieceClick={
                    !isComputerTurn && gameEnded
                      ? undefined
                      : (piece: string, sourceSquare: string) =>
                          handlePieceClick(
                            { type: piece as PieceSymbol, color: "w" }, // Adjust the piece type
                            sourceSquare as Square
                          )
                  }
                  onSquareRightClick={handleSquareRightClick}
                  customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                    ...prevCurrentColor,
                    ...customSquareStyles,
                  }}
                  arePremovesAllowed={true}
                  customArrows={
                    bestLine && bestLine.length > 0 && bestLine?.split(" ")?.[0]
                      ? [
                          [
                            bestLine?.split(" ")?.[0].substring(0, 2) as Square,
                            bestLine?.split(" ")?.[0].substring(2, 4) as Square,
                          ],
                        ]
                      : null
                  }
                  customArrowColor={hintClicked ? "#1C16C2" : "transparent"}
                  promotionToSquare={moveTo}
                  showPromotionDialog={showPromotionDialog}
                  onPromotionPieceSelect={function (
                    piece?: PromotionPieceOption,
                    promoteFromSquare?: Square,
                    promoteToSquare?: Square
                  ): boolean {
                    throw new Error("Function not implemented.");
                  }}
                />
              )}
              <div
                style={{
                  width: Math.round(boardSize - boardSize / 8.4),
                  height: Math.round(boardSize - boardSize / 8.4),
                  // background: "rgba(225,0,0,0.5)",
                  margin: Math.round(boardSize / 16.5),
                  pointerEvents: "none",
                }}
                className="flex items-center justify-center rounded-lg shadow-lg absolute"
              >
                {lastMove && isAtCurrentMove && (
                  <>
                    <div
                      style={getLastMoveHighlightStyle(
                        lastMove.from,
                        boardOrientation,
                        "rgba(185, 202, 67, 0.5)"
                      )}
                    />
                    <div
                      style={getLastMoveHighlightStyle(
                        lastMove.to,
                        boardOrientation,
                        "rgba(245, 246, 130, 0.5)"
                      )}
                    />
                  </>
                )}

                {hint && isAtCurrentMove && !isComputerTurn && (
                  <div
                    style={getHintHighlightStyle(
                      hint,
                      boardOrientation,
                      "#221AE950"
                    )}
                  />
                )}

                {isAtCurrentMove &&
                  selectedSquare &&
                  highlightStyles.map((style, index) => (
                    <div
                      key={`${possibleMoves[index].square}-${index}`}
                      style={style}
                    />
                  ))}
                {invalidMoveSquares.map((square) => (
                  <div
                    key={square}
                    style={getInvalidMoveHighlightStyle(
                      square,
                      boardOrientation
                    )}
                  >
                    ❌
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-row flex-wrap items-center justify-center gap-2 mb-2">
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="w-[14px] h-[14px] bg-[#B9CA43]" />
                <span className="h-[14px] font-normal text-[11px]">
                  Previous Place
                </span>
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="w-[14px] h-[14px] bg-[#F5F682]" />
                <span className="h-[14px] font-normal text-[11px]">
                  Current Place
                </span>
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="w-[14px] h-[14px] rounded-full bg-[#25CEDA]" />
                <span className="h-[14px] font-normal text-[11px]">
                  Possible Move
                </span>
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <MoveRightIcon color="#221AE950" size={16} />
                <span className="h-[14px] font-normal text-[11px]">
                  Move Recommendation
                </span>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      {/* {buttonBoardColumn()} */}

      <div
        style={{ height: heightScreen * 0.965 }}
        className="flex flex-col w-full relative items-center rounded-[16px] bg-white border border-[#DEDEDE] gap-3"
      >
        <div className="flex flex-row p-[16px] w-full items-center gap-2">
          <ArrowLeft className="w-[32px] h-[30px]" color="#000" />
          <Image
            src={"/images/puzzle/icon-puzzle.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[34px] h-[32px]"
          />
          <span className="font-semibold text-[20px]">Puzzles</span>
        </div>
        <div className="w-[94%] mx-[16px] p-[16px] shadow-md flex flex-row items-center justify-center rounded-[8px] bg-[#221AE910] border border-[#221AE9] gap-2">
          <Info className="w-[24px] h-[24px]" color="#221AE9" />
          <span className="font-medium text-[16px]">
            You are {boardOrientation === "white" ? "white" : "black"}
          </span>
        </div>
        <div className="w-[94%] mx-[16px] h-full overflow-y-auto rounded-[8px]">
          <table className="w-full table-auto border-separate border-spacing-0 rounded-[8px] overflow-hidden border-collapse border-[#BDD0F9]">
            <thead>
              <tr className="bg-[#D7E3FB] ">
                <th className="p-2 border font-normal text-xs border border-[#BDD0F9] border-b-0 border-r-0"></th>
                <th className="gap-2 p-2 border font-normal text-xs border border-[#BDD0F9]">
                  <span className="block font-semibold text-[14px]">White</span>
                  <span className="block font-normal text-[11px] text-[#364152]">
                    ({username})
                  </span>
                </th>
                <th className="gap-2 p-2 border font-normal text-xs border border-[#BDD0F9]">
                  <span className="block font-semibold text-[14px]">Black</span>
                  <span className="block font-normal text-[11px] text-[#364152]">
                    (Bot)
                  </span>
                </th>
              </tr>
              <tr className="bg-[#D7E3FB] ">
                <th className="p-2 font-normal text-xs border border-[#D7E3FB] border-t-0 border-r-0"></th>
                <th className="gap-1 p-2 border font-normal text-xs border border-[#BDD0F9] border-t-0">
                  <span className="block font-normal text-[12px]">
                    Movement
                  </span>
                </th>
                <th className="gap-1 p-2 border font-normal text-xs border border-[#BDD0F9] border-t-0">
                  <span className="block font-normal text-[12px]">
                    Movement
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {capturedWhite &&
                capturedWhite.length > 0 &&
                capturedWhite.map((captured, index) => {
                  let move = captured.san;
                  let icon = captured.capturedTheme;
                  return (
                    <tr className="text-center" key={index}>
                      <td className="p-2 border font-normal text-xs border-[#BDD0F9]">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle p-2 border border-[#BDD0F9] ">
                        {icon.length == 2 && (
                          <Image
                            src={`/pieces/${PieceChoosed}/${icon}.png`}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="w-[16px] h-[16px] object-contain inline-block"
                          />
                        )}
                        <span className="h-[16px] font-normal text-xs">
                          {" "}
                          {move}
                        </span>
                      </td>
                      <td className="text-center align-middle p-2 border border-[#BDD0F9] ">
                        {capturedBlack[index] != null &&
                          capturedBlack[index].capturedTheme.length == 2 && (
                            <Image
                              src={`/pieces/${PieceChoosed}/${capturedBlack[index].capturedTheme}.png`}
                              alt="icon"
                              width={1000}
                              height={1000}
                              className="w-[16px] h-[16px] object-contain inline-block"
                            />
                          )}
                        {capturedBlack[index] != null && (
                          <span className="h-[16px] font-normal text-xs">
                            {" "}
                            {capturedBlack[index].san}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="flex flex-row justify-center items-center gap-2 my-4">
            <button
              onClick={handlePreviousMove}
              className="rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
            >
              <ChevronLeft size={24} color="#000" />
            </button>
            <button
              onClick={handleNextMove}
              className="rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
            >
              <ChevronRight size={24} color="#000" />
            </button>
            <button
              onClick={resetPuzzleHandler}
              className="rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
            >
              <RotateCw size={20} color="#000" />
            </button>
          </div>
        </div>
        {!isGameOver
          ? renderButtonPuzzleGame()
          : renderButtonFinish()}
      </div>
    </div>
  );
};
