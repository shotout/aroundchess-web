"use client";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { fadeInUp, motion } from "@/utils/motion";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { getMaterialDifferences } from "@/app/utils/calculateMaterialDifference";
import { clearSelection } from "@/app/utils/gameUtils";
import { getMoveHighlightStyle } from "@/app/utils/highlightStyles2D";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { playIncorrectMoveSound } from "../src/utils/playSound";
import { playSound } from "@/utils/play-audio";
import InitialAvatar from "@/components/avatar/InitialAvatar";
import ReactCountryFlag from "react-country-flag";
import { RelativeTooltip } from "../tooltip/RelativeTooltip";
import { useRouter } from "next/navigation";
import { ButtonBoard } from "../play-vs-ai/ButtonBoard";

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
  arrow: any[] | null;
  onChangeTopic: () => void;
  onBackToPuzzleInitialize: () => void;
}

// Mobile Move Boxes Component (adapted from playing page)
interface MobileMoveBoxesProps {
  capturedWhite: Array<{
    captured: string | null;
    capturedTheme: string | null;
    piece: string | null;
    color: string;
    from: Square;
    to: Square;
    lan: string;
    san: string;
  }>;
  capturedBlack: Array<{
    captured: string | null;
    capturedTheme: string | null;
    piece: string | null;
    color: string;
    from: Square;
    to: Square;
    lan: string;
    san: string;
  }>;
  statusGame: string;
}

const MobileMoveBoxes = ({
  capturedWhite,
  capturedBlack,
  statusGame,
}: MobileMoveBoxesProps) => {
  const whiteMoves = capturedWhite;
  const blackMoves = capturedBlack;
  const maxMoves = Math.max(whiteMoves.length, blackMoves.length);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [shouldUseProximity, setShouldUseProximity] = useState(false);
  const prevMaxMovesRef = useRef(-1);

  const getStatusDisplay = () => {
    if (statusGame === "Win") return "WIN";
    if (statusGame === "Loss") return "LOSE";
    if (statusGame === "Draw") return "DRAW";
    return null;
  };

  const statusDisplay = getStatusDisplay();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const isOverflowing = scrollWidth > clientWidth;

      setShouldUseProximity(isOverflowing);
    }
  }, [maxMoves, statusDisplay]);

  const autoScrollToLatest = useCallback(() => {
    if (scrollContainerRef.current && maxMoves > 5) {
      const container = scrollContainerRef.current;
      const columnWidth = 65;
      const visibleColumns = Math.floor(container.clientWidth / columnWidth);

      const targetMoveToShow = Math.max(0, maxMoves - visibleColumns + 1);
      const targetScroll = targetMoveToShow * columnWidth;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [maxMoves]);

  useEffect(() => {
    const prevMaxMoves = prevMaxMovesRef.current;

    if (prevMaxMoves === -1) {
      prevMaxMovesRef.current = maxMoves;
      return;
    }

    if (maxMoves > prevMaxMoves && maxMoves > 5) {
      autoScrollToLatest();
    }

    prevMaxMovesRef.current = maxMoves;
  }, [maxMoves, autoScrollToLatest]);

  const movesToShow = Math.max(maxMoves, 1);

  return (
    <div className="sm:hidden w-full">
      <div className="relative">
        <div className="absolute left-0 top-0 z-20">
          <div className="flex flex-col gap-1 min-w-[60px]">
            <div className="h-[25px] bg-white"></div>
            <div className="bg-[#E6F7FE] border border-light-60 rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
              <span className="text-sm font-medium text-black">White</span>
            </div>
            <div className="bg-[#E6F7FE] border border-light-60 rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
              <span className="text-sm font-medium text-black">Black</span>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pl-[70px] scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          <div className="flex gap-1 min-w-max pb-2">
            {Array.from({ length: movesToShow }, (_, index) => {
              const moveNumber = index + 1;
              const whiteMove = whiteMoves[index];
              const blackMove = blackMoves[index];
              let opacity = 1;
              if (shouldUseProximity) {
                const columnWidth = 65;
                const columnPosition = index * columnWidth;
                const fixedColumnWidth = 70;
                const relativePosition = columnPosition - scrollLeft;

                if (relativePosition < fixedColumnWidth) {
                  const overlap = fixedColumnWidth - relativePosition;
                  const fadeZone = 80;
                  opacity = Math.max(0.2, 1 - overlap / fadeZone);
                }
              }

              return (
                <div
                  key={moveNumber}
                  className="flex flex-col gap-1 min-w-[60px] transition-opacity duration-150"
                  style={{ opacity }}
                >
                  <div className="text-center text-xs font-medium text-gray-600 px-2 py-1 h-[25px] flex items-center justify-center">
                    Move {moveNumber}
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {whiteMove ? whiteMove.san : ""}
                    </span>
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {blackMove ? blackMove.san : ""}
                    </span>
                  </div>
                </div>
              );
            })}

            {statusDisplay && (
              <div className="flex flex-col gap-1 min-w-[60px]">
                <div className="h-[25px]"></div>
                <div
                  className={`rounded-lg bg-white border px-3 py-2 text-center min-h-[40px] flex items-center justify-center font-bold  ${
                    statusGame === "Win"
                      ? "text-green-500"
                      : statusGame === "Loss"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {statusDisplay}
                </div>
                <div className="min-h-[40px]"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  boardOrientation,
  onGameOver,
  isGameOver,
  currentMoveIndex,
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
  onGetHint,
  arrow,
  onChangeTopic,
  onBackToPuzzleInitialize,
}) => {
  const router = useRouter();
  const chessGame = useMemo(() => new Chess(), []);
  const refBoard = useRef<HTMLDivElement | null>(null);
  const { profile } = useProfileStore();
  const { hideDiv, username } = usePgnStore();
  const { PieceChoosed, setStyleChoosed } = useChessBoardThemeStore();
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
    { square: Square; isCapture: boolean }[]
  >([]);
  const [highlightedSquares, setHighlightedSquares] = useState<Square[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [moveProcessed, setMoveProcessed] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [countInvalid, setCountInvalid] = useState<number>(0);
  const [invalidMoveSquares, setInvalidMoveSquares] = useState<string[]>([]);
  const [orientation, setOrientation] =
    useState<BoardOrientation>(boardOrientation);
  const [showTooltip, setShowTooltip] = useState(false);

  const prevFenHistory = useRef<string[]>([]);

  useEffect(() => {
    const board = chessGame.board();
    getMaterialDifferences(board);

    if (!chessGame.isGameOver() && !gameEnded) {
      setActivePlayer(chessGame.turn() === "w" ? "white" : "black");
    }

    if (!gameEnded && chessGame.isGameOver()) {
      setGameEnded(true);
      onGameOver();
    }
  }, [position, gameEnded, onGameOver]);

  useEffect(() => {
    if (fenHistory.length < prevFenHistory.current.length) {
      setLastMove(null);
    }

    if (currentMoveIndex >= 0 && currentMoveIndex < fenHistory.length) {
      const newFen = fenHistory[currentMoveIndex];
      setPosition(newFen);
      chessGame.load(newFen);
      setActivePlayer(chessGame.turn() === "w" ? "white" : "black");
    }

    localStorage.setItem("fenHistory", JSON.stringify(fenHistory));

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

  useEffect(() => {
    setOrientation(boardOrientation);
  }, [boardOrientation]);

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
        return false;
      }

      const expectedFrom = expectedMove.slice(0, 2);
      const expectedTo = expectedMove.slice(2, 4);

      const legalMoves = game.moves({ square: fromSquare, verbose: true });
      const isMoveLegal = legalMoves.some((m) => m.to === toSquare);

      if (!isMoveLegal) {
        playIncorrectMoveSound();
        return false;
      }

      if (fromSquare !== expectedFrom || toSquare !== expectedTo) {
        setInvalidMoveSquares([toSquare]);
        setTimeout(() => setInvalidMoveSquares([]), 500);
        return false;
      }

      const move = game.move({ from: fromSquare, to: toSquare });
      fillMovement(move);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handlePieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square, piece: string) => {
      if (!isAtCurrentMove) return false;
      return makeMoveCallback(sourceSquare, targetSquare);
    },
    [makeMoveCallback, isAtCurrentMove]
  );

  useEffect(() => {
    handleShowTooltip();
  }, [invalidMoveSquares]);

  const handleShowTooltip = () => {
    const counting = countInvalid + 1;
    setCountInvalid(counting);
    if (counting >= 3) {
      setShowTooltip(true);
      setCountInvalid(0);
    }
  };

  const isComputerTurn = currentMoveIndex % 2 === 0;

  const handleSquareClickCallback = useCallback(
    (square: Square) => {
      if (!isAtCurrentMove) return;

      const game = chessGame;
      const pieceAtSquare = game.get(square);

      if (selectedSquare) {
        const fromSquare = selectedSquare;

        if (
          pieceAtSquare &&
          pieceAtSquare.color === game.turn() &&
          !isComputerTurn
        ) {
          setSelectedSquare(square);
          getPossibleMoves(square);
          return;
        }

        if (fromSquare === square) {
          handleClearSelection();
          return;
        }

        const toSquare = square;
        const moveSuccessful = makeMoveCallback(fromSquare, toSquare);
        if (moveSuccessful) {
          handleClearSelection();
        }

        return;
      }

      if (pieceAtSquare) {
        if (pieceAtSquare.color === game.turn() && !isComputerTurn) {
          setSelectedSquare(square);
          getPossibleMoves(square);
        } else {
          handleClearSelection();
        }
      } else {
        handleClearSelection();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setHighlightedSquares((prev) =>
      prev.includes(square)
        ? prev.filter((s) => s !== square)
        : [...prev, square]
    );
  }, []);

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, Record<string, string | number>> = {};

    highlightedSquares.forEach((square) => {
      styles[square] = { backgroundColor: "rgb(255, 5, 5, 0.25)" };
    });

    if (lastMove && isAtCurrentMove) {
      styles[lastMove.from] = { backgroundColor: "#B9CA4390" };
      styles[lastMove.to] = { backgroundColor: "#F5F68290" };
    }

    if (selectedSquare && isAtCurrentMove) {
      styles[selectedSquare] = { backgroundColor: "#F5F682" };
    }

    if (isAtCurrentMove && possibleMoves.length > 0) {
      possibleMoves.forEach(({ square, isCapture }) => {
        if (!styles[square]) {
          styles[square] = {};
        }
        styles[square].background = isCapture
          ? "radial-gradient(transparent 0%, transparent 80%, rgba(0,0,0,0.7) 80%)"
          : "radial-gradient(circle, rgba(28,22,194) 25%, transparent 25%)";
      });
    }

    if (hint && isAtCurrentMove && !isComputerTurn) {
      const hintTo = hint.slice(2, 4);
      if (!styles[hintTo]) {
        styles[hintTo] = {};
      }
      styles[hintTo].backgroundColor = "#221AE950";
    }

    invalidMoveSquares.forEach((square) => {
      styles[square] = { backgroundColor: "rgba(255, 0, 0, 0.5)" };
    });

    return styles;
  }, [
    highlightedSquares,
    lastMove,
    isAtCurrentMove,
    selectedSquare,
    possibleMoves,
    hint,
    isComputerTurn,
    invalidMoveSquares,
  ]);

  const resetPuzzleHandler = useCallback(() => {
    setCapturedBlack([]);
    setCapturedWhite([]);
    chessGame.reset();
    resetPuzzle();
    setCurrentMoveIndex(0);
    setMoveProcessed(false);
    setGameEnded(false);
  }, [resetPuzzle, setCurrentMoveIndex]);

  const getNextPuzzleHandler = useCallback(() => {
    setCapturedBlack([]);
    setCapturedWhite([]);
    chessGame.reset();
    setCurrentMoveIndex(0);
    setMoveProcessed(false);
    setGameEnded(false);
    getNextPuzzle();
  }, [setCurrentMoveIndex, getNextPuzzle]);

  useEffect(() => {
    if (gameEnded) return;
    if (!isComputerTurn || moveProcessed) return;

    const isAtCurrentMove = currentMoveIndex === fenHistory.length - 1;
    if (!isAtCurrentMove) return;

    const move = puzzleMoves[currentMoveIndex];
    if (move) {
      const fromSquare = move.slice(0, 2) as Square;
      const toSquare = move.slice(2, 4) as Square;

      const delay = setTimeout(() => {
        const moveResult = makeMoveCallback(fromSquare, toSquare);
        if (moveResult) {
          setMoveProcessed(true);
        }
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [
    currentMoveIndex,
    fenHistory.length,
    puzzleMoves,
    gameEnded,
    isComputerTurn,
    makeMoveCallback,
    moveProcessed,
  ]);

  useEffect(() => {
    if (currentMoveIndex % 2 !== 0 && moveProcessed) {
      setMoveProcessed(false);
    }
  }, [currentMoveIndex, moveProcessed]);

  const handlePreviousMove = () =>
    navigateToMove(Math.max(currentMoveIndex - 1, 0));
  const handleNextMove = () =>
    navigateToMove(Math.min(currentMoveIndex + 1, fenHistory.length - 1));

  const fillMovement = (move: any) => {
    const capturedPiecesBlack = [...capturedBlack];
    const capturedPiecesWhite = [...capturedWhite];

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
    setCapturedBlack(capturedPiecesBlack);
    setCapturedWhite(capturedPiecesWhite);
  };

  const changeNameFull = (piece: string | null) => {
    switch (piece) {
      case "p":
        return "pawn";
      case "n":
        return "knight";
      case "b":
        return "bishop";
      case "r":
        return "rook";
      case "q":
        return "queen";
      case "k":
        return "king";
      default:
        return null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();
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

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
    }
  };

  const handleSwitch = () => {
    setOrientation((prev) => (prev == "white" ? "black" : "white"));
  };

  const handleThreeD = () => {
    setIs3DMode(!is3DMode);
    const style = !is3DMode ? "3d" : "2d";
    setStyleChoosed(style);
  };

  // const buttonBoard = () => {
  //   return (
  //     <div
  //       style={{ width: boardSize }}
  //       className="flex flex-row self-end sm:self-center justify-end items-center gap-3 mt-2"
  //     >
  //       <button onClick={handleSwitch}>
  //         <Image
  //           src={"/images/play-vs-ai/switch.png"}
  //           alt="icon"
  //           width={1000}
  //           height={1000}
  //           className="w-[20px] h-[20px] rounded-full object-contain"
  //         />
  //       </button>
  //     </div>
  //   );
  // };

  const cardPlayer = () => {
    return (
      <div
        className={`flex flex-row h-[60px] md:min-h-[80px] items-center justify-between rounded-[8px] bg-white border border-[#DEDEDE] p-2 gap-2 mb-2`}
      >
        <div className="flex flex-row items-center gap-2">
          <InitialAvatar
            name={profile?.name != "" ? profile?.name : username}
            size="sm"
          />
          <span className={`text-[17.23px] font-medium text-[#040404]`}>
            {profile?.name != "" ? profile?.name : username}
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

  const handleOnGetHint = () => {
    if (is3DMode) {
      setIs3DMode(false);
      onGetHint();
    } else {
      onGetHint();
    }
  };

  // Mobile buttons component (only show on mobile)
  const renderMobileButtons = () => {
    return (
      <div className="flex flex-col gap-y-3">
        <motion.div
          variants={fadeInUp}
          className="sm:hidden relative flex w-full  gap-2 px-5 py-2 border-b"
        >
          {showTooltip && (
            <RelativeTooltip onClose={() => setShowTooltip(false)} />
          )}
          <button
            onClick={handleOnGetHint}
            className={`flex flex-row justify-center items-center w-1/4 min-h-[40px] px-4 py-2 border ${
              hint
                ? `border-[#221AE9] bg-[#221AE908] text-[#221AE9]`
                : `border-[#DEDEDE] bg-white`
            } rounded-[8px] hover:bg-blue-100 gap-1`}
          >
            {hint ? (
              <Image
                src={"/images/play-vs-ai/hint.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain "
              />
            ) : (
              <Image
                src={"/images/play-vs-ai/hint-icon.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain "
              />
            )}
            <span className="font-medium text-[11px] lg:text-[14px] xl:mt-1 ">
              Hint
            </span>
          </button>
          <button
            onClick={onChangeTopic}
            className="flex flex-row justify-center items-center w-2/4 min-h-[40px]  px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1 "
          >
            <RefreshCcw size={20} />
            <span className="font-medium text-[11px] md:text-[12px] lg:text-[14px] xl:mt-1 ">
              Change Puzzle Topic
            </span>
          </button>
          <button
            onClick={getNextPuzzleHandler}
            className="flex flex-row items-center justify-center w-1/4 min-h-[40px] p-0 sm:px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
          >
            <span className="font-medium text-[11px] lg:text-[14px] xl:mt-1">
              Next Puzzle
            </span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
        <div className="px-5">
          <div className="flex sm:hidden flex-row items-center justify-center py-1 rounded-sm  bg-[#221AE910] border border-[#221AE9] gap-2">
            <Info className="w-[18px] h-[18px]" color="#221AE9" />
            <span className="font-medium text-sm">
              You are {boardOrientation === "white" ? "white" : "black"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderButtonPuzzleGame = () => {
    return (
      <motion.div
        variants={fadeInUp}
        className="hidden  relative sm:flex w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-2 p-2 -mx-[16px]"
      >
        {showTooltip && (
          <RelativeTooltip onClose={() => setShowTooltip(false)} />
        )}
        <button
          onClick={handleOnGetHint}
          className={`flex flex-row justify-center items-center w-1/6 min-h-[40px] w-1/3 px-4 py-2 border ${
            hint
              ? `border-[#221AE9] bg-[#221AE908] text-[#221AE9]`
              : `border-[#DEDEDE] bg-white`
          } rounded-[8px] hover:bg-blue-100 gap-1`}
        >
          {hint ? (
            <Image
              src={"/images/play-vs-ai/hint.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain "
            />
          ) : (
            <Image
              src={"/images/play-vs-ai/hint-icon.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain "
            />
          )}
          <span className="font-medium text-[11px] lg:text-[14px] xl:mt-1 ">
            Hint
          </span>
        </button>
        <button
          onClick={onChangeTopic}
          className="flex flex-row justify-center items-center w-3/6 min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1 "
        >
          <RefreshCcw size={20} />
          <span className="font-medium text-[11px] md:text-[12px] lg:text-[14px] xl:mt-1 ">
            Change Puzzle Topic
          </span>
        </button>
        <button
          onClick={getNextPuzzleHandler}
          className="flex flex-row items-center justify-center w-2/6 min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
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
        {/* Hide congratulations message on mobile (xl:block) since it's now shown above */}
        <div className="hidden xl:block">{renderCommentaryGame()}</div>
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
    const gradColor = `bg-[linear-gradient(to_right,_#A0E2CD,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#1BC08C,_#A0E2CD)]`;
    const icon = "you-win";
    const sparks = "sparks-win";
    const content =
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
            className="max-w-[20px] max-h-[20px] md:max-w-[30px] md:max-h-[30px] object-contain m-4 mr-0"
          />
          <span className="font-medium text-xs md:text-[14px] z-10">
            {content}
          </span>
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

  // New function to render mobile game completion section
  const renderMobileGameCompletion = () => {
    return (
      <motion.div
        variants={fadeInUp}
        className="flex flex-col w-full gap-3 sm:hidden px-5"
      >
        {renderCommentaryGame()}
        <div className="flex flex-row w-full items-center gap-2">
          <button
            onClick={resetPuzzleHandler}
            className="btn-tertiary w-1/3 rounded-full h-[40px]"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <RotateCcw size={20} color="#221AE9" />
              <span>Retry</span>
            </div>
          </button>
          <button
            onClick={getNextPuzzleHandler}
            className="btn-primary w-2/3 rounded-full h-[40px]"
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

  const firstTurn = boardOrientation == "white" ? capturedBlack : capturedWhite;

  return (
    <div className="flex flex-col xl:flex-row w-full bg-white p-0 sm:p-4 gap-2 xl:gap-4 lg:mt-8 xl:mt-0">
      <div
        className="flex flex-col w-full"
        style={{
          minHeight:
            widthScreen > 1024 ? heightScreen * 0.86 : heightScreen * 0.6,
        }}
      >
        <div className="xl:hidden flex flex-row items-center justify-between mb-2 p-4 sm:p-0 border-b">
          <button onClick={onBackToPuzzleInitialize}>
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
          <div className="hidden sm:block">{cardPlayer()}</div>
          <div className="flex items-center justify-end px-5 sm:px-0 mb-2">
            <ButtonBoard
              handleSwitch={handleSwitch}
              handleThreeD={handleThreeD}
              is3DMode={is3DMode}
              boardSize={boardSize}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-3 ">
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
                  onPieceClick={
                    !isComputerTurn && gameEnded
                      ? undefined
                      : (piece: string, sourceSquare: string) =>
                          handlePieceClick(
                            { type: piece as PieceSymbol, color: "w" },
                            sourceSquare as Square
                          )
                  }
                  onSquareRightClick={handleSquareRightClick}
                  customSquareStyles={customSquareStyles}
                  customArrows={arrow}
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
            </motion.div>

            <motion.div
              style={{
                width: boardSize,
                display: !is3DMode ? "flex" : "none",
                backfaceVisibility: "hidden",
                position: "relative",
              }}
            >
              {!is3DMode && (
                <TwoDChessboard
                  arePiecesClickable={true}
                  arePiecesDraggable={true}
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
                  onPieceDrop={handlePieceDrop}
                  customSquareStyles={customSquareStyles}
                  customArrowColor={arrow ? "#221AE950" : "transparent"}
                  customArrows={arrow}
                  areArrowsAllowed={true}
                  promotionToSquare={moveTo}
                  showPromotionDialog={false}
                />
              )}
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

          {/* Mobile buttons below board (only show when game is not over) */}
          {!isGameOver && renderMobileButtons()}
          {isGameOver && (
            <div className="sm:hidden">{renderMobileGameCompletion()}</div>
          )}

          {/* Mobile moves section */}
          <div className="sm:hidden px-5 py-4">
            <MobileMoveBoxes
              capturedWhite={capturedWhite}
              capturedBlack={capturedBlack}
              statusGame={isGameOver ? "Win" : "Ongoing"}
            />
          </div>

          {/* Mobile navigation buttons */}
          <div className="sm:hidden px-5 flex flex-row justify-center items-center gap-2">
            <button
              disabled={currentMoveIndex === 0}
              onClick={handlePreviousMove}
              className={`rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                currentMoveIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft size={20} color="#000" />
            </button>
            <button
              disabled={currentMoveIndex >= fenHistory.length - 1}
              onClick={handleNextMove}
              className={`rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                currentMoveIndex >= fenHistory.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronRight size={20} color="#000" />
            </button>
            <button
              onClick={resetPuzzleHandler}
              className="rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
            >
              <RotateCw size={20} color="#000" />
            </button>
          </div>

          {/* Mobile game completion section - banner + buttons grouped together */}
        </div>
      </div>

      <div
        style={{ maxHeight: heightBoard }}
        className="hidden sm:flex flex-col w-full relative items-center rounded-[16px] bg-white border border-[#DEDEDE] gap-3"
      >
        <div className="flex flex-row p-[16px] w-full items-center gap-2 hidden xl:flex">
          <button onClick={onBackToPuzzleInitialize}>
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

        <div className="w-[94%] mx-[16px] xl:mt-0 mt-[16px] flex flex-col gap-3">
          <div className="p-[16px] shadow-md flex flex-row items-center justify-center rounded-[8px] bg-[#221AE910] border border-[#221AE9] gap-2">
            <Info className="w-[24px] h-[24px]" color="#221AE9" />
            <span className="font-medium text-[16px]">
              You are {boardOrientation === "white" ? "white" : "black"}
            </span>
          </div>
        </div>
        <div className="w-[94%] mx-[16px] h-full overflow-y-auto rounded-[8px]">
          <table className="w-full table-auto border-separate border-spacing-0 rounded-[8px] overflow-hidden border-[#BDD0F9]">
            <thead>
              <tr className="bg-[#D7E3FB] ">
                <th className="p-2 border font-normal text-xs border-[#BDD0F9] border-b-0 border-r-0"></th>
                <th className="gap-2 p-2 w-[45%] border font-normal text-xs border-[#BDD0F9]">
                  <span className="block font-semibold text-[14px]">White</span>
                  <span className="block font-normal text-[11px] text-[#364152]">
                    {boardOrientation == "black"
                      ? "(Bot)"
                      : username
                      ? username
                      : profile?.name}
                  </span>
                </th>
                <th className="gap-2 p-2 w-[45%] border font-normal text-xs border-[#BDD0F9]">
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
                <th className="gap-1 p-2 font-normal text-xs border border-[#BDD0F9] border-t-0">
                  <span className="block font-normal text-[12px]">
                    Movement
                  </span>
                </th>
                <th className="gap-1 p-2 border font-normal text-xs border-[#BDD0F9] border-t-0">
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
        {!isGameOver ? (
          renderButtonPuzzleGame()
        ) : (
          <div className="hidden xl:block w-full">{renderButtonFinish()}</div>
        )}
      </div>
    </div>
  );
};
