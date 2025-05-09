"use client";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { SettingBoard } from "@/components/modal/SettingBoard";
import { fadeInUp, motion } from "@/utils/motion";

import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { getMaterialDifferences } from "@/app/utils/calculateMaterialDifference";
import { clearSelection } from "@/app/utils/gameUtils";
import {
  getHintHighlightStyle,
  getInvalidMoveHighlightStyle,
  getLastMoveHighlightStyle,
  getMoveHighlightStyle,
} from "@/app/utils/highlightStyles2D";
import {
  getHintHighlightStyle3D,
  getInvalidMoveHighlightStyle3D,
  getLastMoveHighlightStyle3D,
  getMoveHighlightStyle3D,
} from "@/app/utils/highlightStyles3D";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import { useAuth } from "@/context/AuthContext";
import { useApiClient } from "@/functions/api-client";
import { changeNamePiece } from "@/functions/change-name-piece";
import { Chess, Piece, PieceSymbol, Square } from "chess.js";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  MoveRightIcon,
  RefreshCcw,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { playIncorrectMoveSound, playMoveSound } from "../src/utils/playSound";
import { playSound } from "@/utils/play-audio";
import InitialAvatar from "@/components/avatar/InitialAvatar";
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
  const refBoard = useRef<HTMLDivElement | null>(null);
  const { isLoading } = useApiClient();
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const { sessionId } = useProfileStore();
  const { hideDiv, username } = usePgnStore();
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { PieceChoosed, StyleChoosed } = useChessBoardThemeStore();
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(true);
  const [boardSize, setBoardSize] = useState<number>(700);
  const [heightScreen, setHeightScreen] = useState<number>(0);
  const [widthScreen, setWidthScreen] = useState<number>(0);
  const [heightBoard, setHeightBoard] = useState<number | undefined>(0);
  const [capturedWhite, setCapturedWhite] = useState<any[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<any[]>([]);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
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
  const [orientation, setOrientation] = useState<BoardOrientation>(boardOrientation);

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
            getMoveHighlightStyle(
              square,
              isCapture,
              boardOrientation,
              "#1C16C2"
            )
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
        playIncorrectMoveSound();
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
      fillMovement(move);
      console.log("move fillMovement", move);
      if (move) {
        playSound(game, move);
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
    setCapturedBlack([]);
    setCapturedWhite([]);
    chessGame.reset(); // Reset the chess game instance
    resetPuzzle(); // Clear the current puzzle state
    setCurrentMoveIndex(0); // Reset the move index
    setMoveProcessed(false); // Reset move processing state
    setGameEnded(false); // Reset the game-ended state
  }, [resetPuzzle, setFenHistory, setCurrentMoveIndex]);

  const getNextPuzzleHandler = useCallback(() => {
    setCapturedBlack([]);
    setCapturedWhite([]);
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
    console.log("puzzleMoves[currentMoveIndex]", move);
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

  const fillMovement = (move: any) => {
    let capturedPiecesBlack: {
      captured: string | null;
      capturedTheme: string | null;
      piece: string | null;
      color: string;
      from: Square;
      to: Square;
      lan: string;
      san: string;
    }[] = capturedBlack;
    let capturedPiecesWhite: {
      captured: string | null;
      capturedTheme: string | null;
      piece: string | null;
      color: string;
      from: Square;
      to: Square;
      lan: string;
      san: string;
    }[] = capturedWhite;

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

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted, hideDiv, is3DMode]);

  const handleResize = () => {
    setHeightBoard(refBoard.current?.clientHeight);
    setHeightScreen(window?.innerHeight);
    setWidthScreen(window?.innerWidth);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 2.93 : 480;
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
  const handleSwitch = () => {
    setOrientation((prev) => {
      if (prev == "white") {
        return "black";
      } else {
        return "white";
      }
    });
  };
  const handleThreeD = () => {
    setIs3DMode(!is3DMode);
  };
  const buttonBoard = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="flex flex-row self-end sm:self-center justify-end items-center gap-3 mt-2"
      >
        {/* <button onClick={handleSwitch}>
          <Image
            src={"/images/play-vs-ai/switch.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] rounded-full object-contain"
          />
        </button> */}
        <SettingBoard enable3D={true}/>
        {/* <button onClick={handleThreeD}>
          <Image
            src={`/icons/${!is3DMode ? `3d-icon` : `2d-icon`}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button> */}
      </div>
    );
  };
  const cardPlayer = () => {
    return (
      <div
        className={`flex flex-row min-h-[80px] items-center justify-between rounded-[8px] bg-white border ${"border-[#DEDEDE]"} p-2 gap-2 mb-2`}
      >
        <div className="flex flex-row items-center gap-2">
          <InitialAvatar name={profile?.name!=""?profile?.name:username} size="sm" />
          {/* {user && (
            <Image
              src={user?.imageUrl}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[48px] h-[48px] rounded-full object-contain"
            />
          )} */}

          <span className={`text-[17.23px] font-medium ${"text-[#040404]"}`}>
            {profile?.name!=""?profile?.name:username}
          </span>
          {profile?.country && (
            <ReactCountryFlag
              countryCode={profile?.country.substr(-2)}
              svg
              className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
              title={profile?.country.substr(-2)}
            />
          )}
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
          onClick={onGetHint}
          className={`flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border ${
            hint
              ? `border-[#221AE9] bg-[#221AE908] text-[#221AE9]`
              : `border-[#DEDEDE] bg-white`
          } rounded-[8px] hover:bg-blue-100 gap-1`}
        >
          <Image
            src={`${
              hint ? `/images/puzzle/hint.png` : `/images/puzzle/hint-icon.png`
            } `}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain "
          />

          <span className="font-medium text-[11px] lg:text-[14px]  xl:mt-1 ">
            Hint
          </span>
        </button>
        <button
          onClick={onChangeTopic}
          className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1 "
        >
          <RefreshCcw size={20} />

          <span className="font-medium text-[11px] md:text-[12px] lg:text-[14px] xl:mt-1 ">
            Change Puzzle Topic
          </span>
        </button>
        <button
          onClick={getNextPuzzleHandler}
          className="flex flex-row items-center justify-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
        >
          <span className="font-medium text-[11px] lg:text-[14px] xl:mt-1">
            Next Puzzle
          </span>
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
          <button
            onClick={resetPuzzleHandler}
            className="btn-secondary w-full md:w-1/3 rounded-full h-[40px]"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <RotateCcw size={20} color="#221AE9" />
              <span>Retry</span>
            </div>
          </button>
          <button
            onClick={getNextPuzzleHandler}
            className="btn-primary w-full md:w-2/3 rounded-full h-[40px]"
          >
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
  let firstTurn = boardOrientation == "white" ? capturedBlack : capturedWhite;
  return (
    <div className="flex flex-col xl:flex-row w-full bg-white p-2 sm:p-4 gap-2 xl:gap-4 lg:mt-8 xl:mt-0">
      <div
        className="flex flex-col w-full gap-4"
        style={{
          minHeight:
            widthScreen > 1024 ? heightScreen * 0.86 : heightScreen * 0.6,
        }}
      >
        <div className="xl:hidden flex flex-row items-center justify-between mb-2">
          <button onClick={resetPuzzle}>
            <ArrowLeft color="black" size={24} />
          </button>
          <div className="flex flex-1 flex-row justify-center items-center gap-2">
            <Image
              src={"/images/puzzle/icon-puzzle.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[34px] h-[32px] object-contain"
            />
            <span className="font-semibold text-[20px]">Puzzle</span>
          </div>
          <div className="flex " />
        </div>

        <div
          className="xl:border xl:border-[#DEDEDE] xl:p-4 xl:rounded-[16px]"
          ref={refBoard}
        >
          {cardPlayer()}
          <div className="flex items-center justify-end mb-2">
            {buttonBoard()}
          </div>
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
                  onPieceDrop={handlePieceDrop}
                  position={position}
                  orientation={orientation}
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
                    ...customSquareStyles,
                  }}
                  arePremovesAllowed={true}
                  promotionToSquare={moveTo}
                  showPromotionDialog={false}
                  onPromotionPieceSelect={function (
                    piece?: PromotionPieceOption,
                    promoteFromSquare?: Square,
                    promoteToSquare?: Square
                  ): boolean {
                    throw new Error("Function not implemented.");
                  }}
                />
              )}
              {lastMove && isAtCurrentMove && (
                <>
                  <div
                    style={getLastMoveHighlightStyle3D(
                      lastMove.from,
                      boardOrientation === "white" ? "white" : "black",
                      "#B9CA4390"
                    )}
                  />
                  <div
                    style={getLastMoveHighlightStyle3D(
                      lastMove.to,
                      boardOrientation === "white" ? "white" : "black",
                      "#F5F68290"
                    )}
                  />
                </>
              )}

              {hint && isAtCurrentMove && !isComputerTurn && (
                <div
                  style={getHintHighlightStyle3D(
                    hint,
                    boardOrientation === "white" ? "white" : "black",
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
                  style={getInvalidMoveHighlightStyle3D(
                    square,
                    boardOrientation
                  )}
                >
                  ❌
                </div>
              ))}
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
                  arePiecesDraggable={false}
                  orientation={orientation}
                  boardWidth={boardSize}
                  position={position}
                  onSquareClick={handleSquareClickCallback}
                  onSquareRightClick={handleSquareRightClick}
                  onPromotionPieceSelect={function (
                    piece?: PromotionPieceOption,
                    promoteFromSquare?: Square,
                    promoteToSquare?: Square
                  ): boolean {
                    throw new Error("Function not implemented.");
                  }}
                  customSquareStyles={{
                    ...customSquareStyles,
                  }}
                  areArrowsAllowed={true}
                  promotionToSquare={moveTo}
                  showPromotionDialog={false}
                />
              )}

              {lastMove && isAtCurrentMove && (
                <>
                  <div
                    style={getLastMoveHighlightStyle(
                      lastMove.from,
                      boardOrientation === "white" ? "white" : "black",
                      "#B9CA4390"
                    )}
                  />
                  <div
                    style={getLastMoveHighlightStyle(
                      lastMove.to,
                      boardOrientation === "white" ? "white" : "black",
                      "#F5F68290"
                    )}
                  />
                </>
              )}

              {hint && isAtCurrentMove && !isComputerTurn && (
                <div
                  style={getHintHighlightStyle(
                    hint,
                    boardOrientation === "white" ? "white" : "black",
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
                  style={getInvalidMoveHighlightStyle(square, boardOrientation)}
                >
                  ❌
                </div>
              ))}
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
                <div className="w-[14px] h-[14px] rounded-full bg-[#1C16C2]" />
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
      </div>
      {/* {buttonBoardColumn()} */}

      <div
        style={{ maxHeight: heightBoard }}
        className="flex flex-col w-full relative items-center rounded-[16px] bg-white border border-[#DEDEDE] gap-3"
      >
        <div className="flex flex-row p-[16px] w-full items-center gap-2 hidden xl:flex">
          <button onClick={resetPuzzle}>
            <ArrowLeft color="black" size={24} />
          </button>
          <Image
            src={"/images/puzzle/icon-puzzle.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[34px] h-[32px]"
          />
          <span className="font-semibold text-[20px]">Puzzle</span>
        </div>
        <div className="w-[94%] mx-[16px] p-[16px] xl:mt-0 mt-[16px] shadow-md flex flex-row items-center justify-center rounded-[8px] bg-[#221AE910] border border-[#221AE9] gap-2">
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
                <th className="gap-2 p-2 w-[45%] border font-normal text-xs border border-[#BDD0F9]">
                  <span className="block font-semibold text-[14px]">White</span>
                  <span className="block font-normal text-[11px] text-[#364152]">
                    {" "}
                    {boardOrientation == "black"
                      ? "(Bot)"
                      : username
                      ? username
                      : profile?.name}
                  </span>
                </th>
                <th className="gap-2 p-2 w-[45%] border font-normal text-xs border border-[#BDD0F9]">
                  <span className="block font-semibold text-[14px]">Black</span>
                  <span className="block font-normal text-[11px] text-[#364152]">
                    {boardOrientation != "black"
                      ? "(Bot)"
                      : username
                      ? username
                      : profile?.name}
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
              {firstTurn &&
                firstTurn.length > 0 &&
                firstTurn.map((captured, index) => {
                  let move = captured.san;
                  let icon = captured.capturedTheme;
                  return (
                    <tr className="text-center" key={index}>
                      <td className="p-2 border font-normal text-xs border-[#BDD0F9]">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle p-2 border border-[#BDD0F9] ">
                        {capturedWhite[index] != null &&
                          capturedWhite[index].capturedTheme.length == 2 && (
                            <Image
                              src={`/pieces/${PieceChoosed}/${capturedWhite[index].capturedTheme}.png`}
                              alt="icon"
                              width={1000}
                              height={1000}
                              className="w-[16px] h-[16px] object-contain inline-block"
                            />
                          )}
                        {capturedWhite[index] != null && (
                          <span className="h-[16px] font-normal text-xs">
                            {" "}
                            {capturedWhite[index].san}
                          </span>
                        )}
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
              disabled={currentMoveIndex === 0}
              onClick={handlePreviousMove}
              className={`rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                currentMoveIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft size={24} color="#000" />
            </button>
            <button
              disabled={currentMoveIndex >= fenHistory.length - 1}
              onClick={handleNextMove}
              className={`rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                currentMoveIndex >= fenHistory.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
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
        {!isGameOver ? renderButtonPuzzleGame() : renderButtonFinish()}
      </div>
    </div>
  );
};
