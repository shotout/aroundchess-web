"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RotateCw, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEndgametraining } from "../../store/EndgameTrainingStore";
import { useCheckmateTraining } from "../../store/CheckmateStore";
import { useEndgameNavigation } from "../../store/NavigationStore";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { Chess } from "chess.js";
import { getPieceConfig } from "../../utils/ChessPieceUtils";
import { Square } from "react-chessboard/dist/chessboard/types";
import MoveHistory from "../MoveHistory";
import StockfishEngine from "../SF";
import GameControls from "../GameControl";
import GameHeader from "../GameHeader";
import GameAlertDialog from "../GameAlertDialog";
import GameOutcomeDisplay from "../GameOutcomeDisplay";
import SyzygyAnalysis from "../SyzygyAnalysis";
import { getSyzygyMove } from "@/lib/stockfish/syzygy-positions";
import Image from "next/image";
import ChessboardWrapper from "../ChessboardWrapper";
import { SettingBoard } from "@/components/modal/SettingBoard";
import { useShareGame } from "@/app/store/shareGame";
import GameAlertDialogMobile from "../GameAlertDialogMobile";
// ADD THIS IMPORT
import { playSound } from "@/utils/play-audio";

interface StageDetailViewProps {
  categorySlug: string;
  subcategorySlug: string;
  stageNumber: string;
}

interface MobileMoveBoxesProps {
  moveHistory: any[];
}

const MobileMoveBoxes = ({ moveHistory }: MobileMoveBoxesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [shouldUseProximity, setShouldUseProximity] = useState(false);
  const prevMaxMovesRef = useRef(-1);

  const whiteMoves: any[] = [];
  const blackMoves: any[] = [];

  moveHistory.forEach((move, index) => {
    if (index % 2 === 0) {
      whiteMoves.push(move);
    } else {
      blackMoves.push(move);
    }
  });

  const maxMoves = Math.max(whiteMoves.length, blackMoves.length);

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
  }, [maxMoves]);

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
                    {whiteMove ? (
                      <div className="flex items-center justify-center">
                        <span className="text-xs font-medium truncate">
                          {whiteMove.san}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium"></span>
                    )}
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    {blackMove ? (
                      <div className="flex items-center justify-center">
                        <span className="text-xs font-medium truncate">
                          {blackMove.san}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium"></span>
                    )}
                  </div>
                </div>
              );
            })}
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

export default function StageDetailView({
  categorySlug,
  subcategorySlug,
  stageNumber,
}: StageDetailViewProps) {
  const router = useRouter();
  const stageNum = parseInt(stageNumber);
  const { PieceChoosed, StyleChoosed } = useChessBoardThemeStore();

  const [position, setPosition] = useState<string | null>(null);
  const [initialFen, setInitialFen] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [isAutoSolution, setIsAutoSolution] = useState<boolean>(false);

  const [categoryData, setCategoryData] = useState<string | any>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [pieceConfig, setPieceConfig] = useState<any>(null);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );

  const [isCheckmateMode, setIsCheckmateMode] = useState<boolean>(false);
  const [movesToCheckmate, setMovesToCheckmate] = useState<number | null>(null);

  // New state for Syzygy analysis
  const [syzygyMateDistance, setSyzygyMateDistance] = useState<number | null>(
    null
  );
  const [isSyzygyLoading, setIsSyzygyLoading] = useState<boolean>(false);

  const [showGameEndDialog, setShowGameEndDialog] = useState<boolean>(false);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [gameEndTime, setGameEndTime] = useState<number | undefined>(undefined);

  const [optionSquares, setOptionSquares] = useState<
    Record<string, { background: string }>
  >({});
  const [moveSquares, setMoveSquares] = useState<
    Record<string, { background: string }>
  >({});
  const [rightClickedSquares, setRightClickedSquares] = useState<
    Record<string, { backgroundColor: string }>
  >({});

  const [moveFrom, setMoveFrom] = useState<string>("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] =
    useState<boolean>(false);

  const [bestMove, setBestMove] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const { setFen, setPGN, setOpen } = useShareGame();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleShare = async () => {
    try {
      const currentPgn = game.pgn();
      const currentFen = game.fen();
      setFen(currentFen);
      setPGN(currentPgn);
      setOpen(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const {
    data: endgameData,
    isLoading: isEndgameLoading,
    error: endgameError,
    fetchData: fetchEndgameData,
  } = useEndgametraining();

  const {
    data: checkmateData,
    isLoading: isCheckmateLoading,
    error: checkmateError,
    fetchData: fetchCheckmateData,
  } = useCheckmateTraining();

  const fetchInProgress = useRef(false);
  const game = useMemo(() => new Chess(), []);
  const isMounted = useRef(true);

  interface SyzygyResult {
    mateDistance?: number;
    needStockfish?: boolean;
    syzygyCandidates?: Array<{ checkmate: boolean }>;
  }

  const handleShowSolution = useCallback(() => {
    if (!position || isSolved || isAutoSolution) return;
    setIsAutoSolution(true);
  }, [position, isSolved, isAutoSolution]);

  const handleSolutionComplete = useCallback(() => {
    setIsAutoSolution(false);
  }, []);

  const updateSyzygyAnalysis = useCallback(async () => {
    if (!position || isSolved) return;

    setIsSyzygyLoading(true);
    try {
      const result = (await getSyzygyMove(position, game, {
        value: game.turn(),
      })) as SyzygyResult;

      if (result && result.mateDistance !== undefined) {
        setSyzygyMateDistance(result.mateDistance);
      } else if (result && result.needStockfish && result.syzygyCandidates) {
        const checkmateMoves = result.syzygyCandidates.filter(
          (move) => move.checkmate
        );
        if (checkmateMoves.length > 0) {
          setSyzygyMateDistance(1);
        } else {
          setSyzygyMateDistance(null);
        }
      } else {
        setSyzygyMateDistance(null);
      }
    } catch (error) {
      console.error("Error fetching Syzygy analysis:", error);
      setSyzygyMateDistance(null);
    } finally {
      setIsSyzygyLoading(false);
    }
  }, [position, game, isSolved]);

  // ADD THIS FUNCTION TO HANDLE MOVES WITH SOUND
  const handleMoveWithSound = useCallback(
    (move: any) => {
      if (move) {
        // Play sound for the move
        playSound(game, move);

        // Update move history
        setMoveHistory((prev) => [...prev, move]);

        // Update current move index
        setCurrentMoveIndex((prev) => prev + 1);

        // Update position
        setPosition(game.fen());
      }
    },
    [game]
  );

  // Move navigation functions
  const handlePreviousMove = useCallback(() => {
    if (currentMoveIndex > 0) {
      const newIndex = currentMoveIndex - 1;
      setCurrentMoveIndex(newIndex);

      if (newIndex === 0) {
        // Go to initial position
        game.load(initialFen || game.fen());
        setPosition(initialFen);
      } else {
        // Replay moves up to the new index
        game.load(initialFen || game.fen());
        const history = game.history({ verbose: true });
        for (let i = 0; i < newIndex; i++) {
          if (moveHistory[i]) {
            game.move(moveHistory[i]);
          }
        }
        setPosition(game.fen());
      }
    }
  }, [currentMoveIndex, initialFen, game, moveHistory]);

  const handleNextMove = useCallback(() => {
    if (currentMoveIndex < moveHistory.length) {
      const newIndex = currentMoveIndex + 1;
      setCurrentMoveIndex(newIndex);

      // Replay moves up to the new index
      game.load(initialFen || game.fen());
      for (let i = 0; i < newIndex; i++) {
        if (moveHistory[i]) {
          game.move(moveHistory[i]);
        }
      }
      setPosition(game.fen());
    }
  }, [currentMoveIndex, moveHistory, initialFen, game]);

  useEffect(() => {
    if (position) {
      updateSyzygyAnalysis();
    }
  }, [position, updateSyzygyAnalysis]);

  useEffect(() => {
    const is3D = StyleChoosed === "3d" ? true : false;
    setIs3DMode(is3D);
  }, [StyleChoosed]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (categorySlug.startsWith("checkmate-")) {
      setIsCheckmateMode(true);
      const moves = parseInt(categorySlug.replace("checkmate-", ""));
      setMovesToCheckmate(moves);

      const { setActiveTab } = useEndgameNavigation.getState();
      if (setActiveTab) setActiveTab("move");
    } else {
      setIsCheckmateMode(false);
      setMovesToCheckmate(null);

      const { setActiveTab } = useEndgameNavigation.getState();
      if (setActiveTab) setActiveTab("board");
    }
  }, [categorySlug]);

  useEffect(() => {
    const fetchData = async () => {
      if (fetchInProgress.current) return;

      fetchInProgress.current = true;
      try {
        if (!endgameData) {
          await fetchEndgameData();
        }

        if (!checkmateData) {
          await fetchCheckmateData();
        }
      } finally {
        fetchInProgress.current = false;
      }
    };

    fetchData();
  }, [endgameData, checkmateData, fetchEndgameData, fetchCheckmateData]);

  const setPlayerColorFromFen = useCallback((fen: string) => {
    const parts = fen.split(" ");
    if (parts.length > 1) {
      const activeColor = parts[1] as "w" | "b";
      setPlayerColor(activeColor);
      setBoardOrientation(activeColor === "w" ? "white" : "black");
    }
  }, []);

  useEffect(() => {
    if (isCheckmateMode) {
      if (!checkmateData || !Array.isArray(checkmateData) || !movesToCheckmate)
        return;

      const moveIndex = movesToCheckmate - 1;
      if (moveIndex < 0 || moveIndex >= checkmateData.length) return;

      const positions = checkmateData[moveIndex];
      if (!positions || !Array.isArray(positions)) return;

      const posIndex = stageNum - 1;
      if (posIndex < 0 || posIndex >= positions.length) return;

      const fen = positions[posIndex];

      try {
        game.load(fen);
        setPosition(fen);
        setInitialFen(fen);
        setTargetPosition(null);
        setShowGameEndDialog(false);
        setMoveHistory([]);
        setCurrentMoveIndex(0);
        setIsSolved(false);
        setMoveSquares({});
        setOptionSquares({});
        setRightClickedSquares({});
        setBestMove(null);
        setShowHint(false);
        setGameStartTime(Date.now());
        setGameEndTime(undefined);
        setSyzygyMateDistance(null);

        setPlayerColorFromFen(fen);

        setSubcategoryName(`Checkmate in ${movesToCheckmate}`);
        setPieceConfig({
          text: `Checkmate in ${movesToCheckmate}`,
          pieces: [
            { type: "king", color: "text-blue-500" },
            { type: "vs", color: "text-blue-500" },
            { type: "king", color: "text-indigo-700" },
          ],
        });

        setCategoryData({
          name: `Checkmate in ${movesToCheckmate}`,
          icons: "check.png",
        });
      } catch (e) {
        console.error("Invalid FEN position:", e);
      }
    } else {
      if (!endgameData || !endgameData.categories) return;

      const category = endgameData.categories.find(
        (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      if (!category) return;
      setCategoryData(category);

      const subcategory = category.subcategories.find(
        (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === subcategorySlug
      );
      if (!subcategory || !subcategory.games) return;
      setSubcategoryName(subcategory.name);
      setPieceConfig(getPieceConfig(subcategory.name));

      const gameData = subcategory.games[stageNum - 1];
      if (gameData) {
        try {
          game.load(gameData.fen);
          setPosition(gameData.fen);
          setInitialFen(gameData.fen);
          setTargetPosition(gameData.target || null);
          setShowGameEndDialog(false);
          setMoveHistory([]);
          setCurrentMoveIndex(0);
          setIsSolved(false);
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
          setBestMove(null);
          setShowHint(false);
          setGameStartTime(Date.now());
          setGameEndTime(undefined);
          setSyzygyMateDistance(null);

          setPlayerColorFromFen(gameData.fen);
        } catch (e) {
          console.error("Invalid FEN position:", e);
        }
      }
    }
  }, [
    endgameData,
    checkmateData,
    categorySlug,
    subcategorySlug,
    stageNum,
    game,
    isCheckmateMode,
    movesToCheckmate,
    setPlayerColorFromFen,
  ]);

  const handleCloseAlert = useCallback(() => {
    setShowGameEndDialog(false);
  }, []);

  const navigateToStage = useCallback(
    (direction: "next") => {
      const newStageNum =
        direction === "next" ? stageNum + 1 : Math.max(1, stageNum - 1);

      let path;
      if (isCheckmateMode) {
        path = `/playground/endgame-training/${categorySlug}/${subcategorySlug}/stage-${newStageNum}`;
      } else {
        path = `/playground/endgame-training/${categorySlug}/${subcategorySlug}/${newStageNum}`;
      }

      router.push(path);
    },
    [router, categorySlug, subcategorySlug, stageNum, isCheckmateMode]
  );

  const goBackToSelection = useCallback(() => {
    const { setActiveTab, setViewState } = useEndgameNavigation.getState();

    if (isCheckmateMode) {
      setActiveTab("move");
      setViewState({ view: "categories" });
    } else {
      setActiveTab("board");
      setViewState({
        view: "subcategories",
        category: categorySlug,
      });
    }

    router.push(`/playground/endgame-training/`);
  }, [router, isCheckmateMode, categorySlug]);

  const retryFetch = useCallback(() => {
    if (!fetchInProgress.current) {
      fetchInProgress.current = true;
      if (isCheckmateMode) {
        fetchCheckmateData().finally(() => {
          fetchInProgress.current = false;
        });
      } else {
        fetchEndgameData().finally(() => {
          fetchInProgress.current = false;
        });
      }
    }
  }, [fetchCheckmateData, fetchEndgameData, isCheckmateMode]);

  const navigateNext = useCallback(
    () => navigateToStage("next"),
    [navigateToStage]
  );

  const resetPosition = useCallback(() => {
    if (initialFen) {
      try {
        setIsAutoSolution(false);
        game.load(initialFen);
        setPosition(initialFen);
        setMoveHistory([]);
        setCurrentMoveIndex(0);
        setIsSolved(false);
        setShowGameEndDialog(false);
        setShowHint(false);
        setBestMove(null);
        setOptionSquares({});
        setMoveSquares({});
        setRightClickedSquares({});
        setGameStartTime(Date.now());
        setGameEndTime(undefined);
        setSyzygyMateDistance(null);

        setPlayerColorFromFen(initialFen);
        updateSyzygyAnalysis();
      } catch (e) {
        console.error("Error resetting position:", e);
      }
    }
  }, [game, initialFen, setPlayerColorFromFen, updateSyzygyAnalysis]);

  const handleNewGame = useCallback(() => {
    const { setViewState } = useEndgameNavigation.getState();

    if (isCheckmateMode && movesToCheckmate) {
      if (
        !checkmateData ||
        !Array.isArray(checkmateData) ||
        movesToCheckmate <= 0 ||
        movesToCheckmate > checkmateData.length
      ) {
        return;
      }

      const positions = checkmateData[movesToCheckmate - 1];
      if (!positions || positions.length === 0) {
        return;
      }

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * positions.length);
      } while (randomIndex === stageNum - 1 && positions.length > 1);

      router.push(
        `/playground/endgame-training/checkmate-${movesToCheckmate}/position-${
          randomIndex + 1
        }/stage-${randomIndex + 1}`
      );
    } else {
      setViewState({
        view: "subcategories",
        category: categorySlug,
      });
      router.push(`/playground/endgame-training`);
    }
  }, [
    router,
    isCheckmateMode,
    movesToCheckmate,
    categorySlug,
    checkmateData,
    stageNum,
  ]);

  const checkGameStatus = useCallback(() => {
    if (!game) return false;

    try {
      if (game.isGameOver()) {
        setIsSolved(true);
        setShowGameEndDialog(true);
        setGameEndTime(Date.now());
        return true;
      }

      if (game.turn() !== playerColor && !game.isGameOver()) {
        return false;
      }
    } catch (error) {
      console.error("Error checking game status:", error);
    }

    return false;
  }, [game, playerColor]);

  // Rotate board function
  const handleSwitch = useCallback(() => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  }, []);

  // Mobile button renderers
  const renderMobileButtons = () => {
    return (
      <div className="sm:hidden px-4 py-2 border-b">
        {/* Game control buttons */}
        <div className="space-y-2">
          {!isSolved && (
            <div className="flex gap-x-[2px] w-full justify-between sm:justify-center">
              <button
                className="flex gap-x-1 text-[10px] items-center justify-center px-3 py-2 text-blue-base rounded-full border border-primary-gray whitespace-nowrap flex-shrink-0"
                onClick={() => setShowHint(true)}
              >
                <Image
                  src={"/endgame-training/hint.png"}
                  alt="hint icon"
                  width={10}
                  height={10}
                />
                Hint
              </button>

              <button
                className={`flex gap-x-[2px]  items-center justify-center px-3 py-2 rounded-full border whitespace-nowrap flex-shrink-0 ${
                  isAutoSolution
                    ? "border-blue-base bg-blue-base/5 text-blue-base"
                    : "border-primary-gray text-black"
                }`}
                onClick={handleShowSolution}
                disabled={isAutoSolution}
              >
                <Image
                  src={"/endgame-training/show-solution.png"}
                  alt="solution icon"
                  width={10}
                  height={10}
                />
                <span className="text-[10px]">
                  {isAutoSolution ? "Solving..." : "Show Solution"}
                </span>
              </button>

              <button
                onClick={resetPosition}
                className="flex gap-x-[2px] items-center justify-center px-3 py-2 bg-white rounded-full btn-tertiary whitespace-nowrap flex-shrink-0"
              >
                <Image
                  src={"/endgame-training/rematch.png"}
                  alt="restart icon"
                  width={10}
                  height={10}
                />
                <span className="text-[10px]">Restart</span>
              </button>

              <button
                onClick={navigateNext}
                className="flex gap-x-[2px] items-center justify-center px-3 py-2 btn-primary rounded-full border whitespace-nowrap flex-shrink-0"
              >
                <span className="text-[10px]">Next Stage</span>
                <Image
                  src={"/endgame-training/Union.png"}
                  alt="arrow right icon"
                  width={10}
                  height={10}
                />
              </button>
            </div>
          )}
          {isSolved && (
            <div className="flex gap-x-1 w-full justify-between">
              <button
                className="flex flex-1 gap-x-1 text-xs items-center justify-center px-3 py-2 text-blue-base rounded-full border border-primary-gray whitespace-nowrap flex-shrink-0"
                onClick={handleShare}
              >
                <Image
                  src={"/endgame-training/share.png"}
                  alt="download icon"
                  width={12}
                  height={12}
                />
                Share PGN/FEN
              </button>

              <button
                onClick={resetPosition}
                className="flex gap-x-1 flex-1 items-center justify-center px-3 py-2 bg-white rounded-full btn-tertiary whitespace-nowrap flex-shrink-0"
              >
                <Image
                  src={"/endgame-training/rematch.png"}
                  alt="restart icon"
                  width={12}
                  height={12}
                />
                <span className="text-[11px]">Rematch</span>
              </button>

              <button
                onClick={navigateNext}
                className="flex gap-x-1 flex-1 items-center justify-center px-3 py-2 btn-primary rounded-full border whitespace-nowrap flex-shrink-0"
              >
                <span className="text-[11px]">Next Stage</span>
                <Image
                  src={"/endgame-training/Union.png"}
                  alt="arrow right icon"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobileNavigation = () => {
    return (
      <div className="sm:hidden px-4 py-3 flex flex-row justify-center items-center gap-2">
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
          disabled={currentMoveIndex >= moveHistory.length}
          onClick={handleNextMove}
          className={`rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
            currentMoveIndex >= moveHistory.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <ChevronRight size={20} color="#000" />
        </button>
        <button
          onClick={resetPosition}
          className="rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
        >
          <RotateCw size={20} color="#000" />
        </button>
      </div>
    );
  };

  const isLoading = isEndgameLoading || isCheckmateLoading;
  const error = isCheckmateMode ? checkmateError : endgameError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading stage data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={retryFetch}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">Stage not found or no position data available</p>
        <button
          onClick={goBackToSelection}
          className="mt-4 text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to stage selection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {!isMobile ? (
        <GameAlertDialog
          open={showGameEndDialog}
          game={game || null}
          playerColor={playerColor}
          onRematch={resetPosition}
          onClose={handleCloseAlert}
        />
      ) : (
        <GameAlertDialogMobile
          open={showGameEndDialog}
          game={game || null}
          playerColor={playerColor}
          onRematch={resetPosition}
          onClose={handleCloseAlert}
          navigateNext={navigateNext}
          resetPosition={resetPosition}
          handleShare={handleShare}
        />
      )}

      <main className="w-full h-full sm:p-4 flex flex-col space-y-4">
        <GameHeader
          categoryData={categoryData}
          subcategoryName={subcategoryName}
          pieceConfig={pieceConfig}
          stageNum={stageNum}
          isCheckmateMode={isCheckmateMode}
          goBackToSelection={goBackToSelection}
        />

        <div className="grid grid-cols-1 xl:grid-cols-10 bg-white xl:gap-5">
          <div className="xl:col-span-6 flex flex-col">
            <div className="flex flex-row self-end justify-end items-center px-4 sm:p-0 gap-x-2 sm:mb-2">
              <button onClick={handleSwitch}>
                <Image
                  src={"/images/play-vs-ai/switch.png"}
                  alt="icon"
                  width={20}
                  height={20}
                  className="rounded-full object-contain"
                />
              </button>
              <SettingBoard />

              <button onClick={() => setIs3DMode(!is3DMode)}>
                <Image
                  src={`/icons/${is3DMode ? `2d-icon` : `3d-icon`}.png`}
                  alt="icon"
                  width={is3DMode ? 15 : 20}
                  height={is3DMode ? 15 : 20}
                  className="object-contain"
                />
              </button>
            </div>
            <div className="xl:border border-gray-200 p-0 sm:mb-2 lg:mb-0 lg:p-4 rounded-md flex flex-col">
              <div className="relative w-full flex flex-col justify-center items-center">
                <div className=" bg-white flex items-center justify-center w-full xl:p-10 2xl:p-12 overflow-hidden xl:max-w-[600px] 2xl:min-w-[600px] 2xl:max-w-[1000px]">
                  <ChessboardWrapper
                    game={game}
                    position={position}
                    optionSquares={optionSquares}
                    moveSquares={moveSquares}
                    moveFrom={moveFrom}
                    setMoveFrom={setMoveFrom}
                    moveTo={moveTo}
                    setMoveTo={setMoveTo}
                    setOptionSquares={setOptionSquares}
                    setMoveSquares={setMoveSquares}
                    showPromotionDialog={showPromotionDialog}
                    setShowPromotionDialog={setShowPromotionDialog}
                    setShowHint={setShowHint}
                    gameStatus={isSolved ? "solved" : "ongoing"}
                    setMoveHistory={setMoveHistory}
                    setPosition={setPosition}
                    checkGameStatus={checkGameStatus}
                    boardOrientation={boardOrientation}
                    playerColor={playerColor}
                    bestMove={bestMove}
                    is3DMode={is3DMode}
                    showHint={showHint}
                    handleShare={handleShare}
                    onMovePlay={handleMoveWithSound}
                  />
                </div>
                {isSolved && (
                  <div className="w-full block sm:hidden overflow-hidden px-4">
                    <GameOutcomeDisplay
                      game={game}
                      playerColor={playerColor}
                      moveHistory={moveHistory}
                      pieceConfig={pieceConfig}
                      subcategoryName={subcategoryName}
                      startTime={gameStartTime}
                      endTime={gameEndTime}
                      isGameOver={isSolved}
                      onNewGame={handleNewGame}
                      onRematch={resetPosition}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile controls below board */}
            {renderMobileButtons()}
            <div className="px-4 py-2 flex flex-col gap-y-1">
              <div className="sm:hidden">
                <SyzygyAnalysis
                  mateDistance={syzygyMateDistance}
                  playerColor={playerColor}
                  currentTurn={game.turn()}
                  isLoading={isSyzygyLoading}
                />
              </div>
              {!isSolved && (
                <div className="flex sm:hidden flex-col items-center justify-center gap-y-3 bg-blue-base/10 border border-blue-base rounded-[4px] p-0">
                  <div className="flex  flex-col items-center py-1 justify-center gap-x-3 gap-y-2">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-blue-base" />
                      <h1 className="text-sm text-black">
                        {isCheckmateMode
                          ? `Find the ${movesToCheckmate} ${
                              movesToCheckmate === 1 ? "move" : "moves"
                            } to checkmate`
                          : playerColor === "w"
                          ? "White to Checkmate"
                          : "Black to Checkmate"}
                      </h1>
                    </div>
                    <div className="truncate text-xs">{position}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile move history */}
            <div className="sm:hidden px-4 py-3">
              <MobileMoveBoxes moveHistory={moveHistory} />
            </div>

            {/* Mobile navigation buttons */}
            {renderMobileNavigation()}
          </div>

          {/* Desktop sidebar */}
          <div className="hidden sm:flex border border-gray-200 rounded-md flex-col xl:col-span-4">
            <div className="flex flex-col h-full">
              <div className="w-full p-4 h-auto">
                <div className="flex flex-col items-center justify-center gap-y-3 bg-blue-base/10 border border-blue-base rounded-xl p-6">
                  <div className="flex flex-row items-center justify-center gap-x-3">
                    <AlertCircle className="h-8 w-8 text-blue-base" />
                    <h1 className="text-lg xl:text-base text-black">
                      {isCheckmateMode
                        ? `Find the ${movesToCheckmate} ${
                            movesToCheckmate === 1 ? "move" : "moves"
                          } to checkmate`
                        : playerColor === "w"
                        ? "White to Checkmate"
                        : "Black to Checkmate"}
                    </h1>
                  </div>
                  <div className="bg-white text-xs xl:text-base rounded-md border border-gray-200 text-center p-2 w-full">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate">{position}</div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[500px] break-all">
                          <p className="text-xs">{position}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <MoveHistory moveHistory={moveHistory} />

              <SyzygyAnalysis
                mateDistance={syzygyMateDistance}
                playerColor={playerColor}
                currentTurn={game.turn()}
                isLoading={isSyzygyLoading}
              />

              {isSolved && (
                <div className="w-full overflow-hidden p-4">
                  <GameOutcomeDisplay
                    game={game}
                    playerColor={playerColor}
                    moveHistory={moveHistory}
                    pieceConfig={pieceConfig}
                    subcategoryName={subcategoryName}
                    startTime={gameStartTime}
                    endTime={gameEndTime}
                    isGameOver={isSolved}
                    onNewGame={handleNewGame}
                    onRematch={resetPosition}
                  />
                </div>
              )}

              <StockfishEngine
                game={game}
                position={position}
                gameStatus={isSolved ? "solved" : "ongoing"}
                setMoveHistory={setMoveHistory}
                setPosition={setPosition}
                setMoveSquares={setMoveSquares}
                checkGameStatus={checkGameStatus}
                setBestMove={setBestMove}
                showHint={showHint}
                playerColor={playerColor}
                depth={15}
                isAutoSolution={isAutoSolution}
                onSolutionComplete={handleSolutionComplete}
                onMovePlay={handleMoveWithSound}
              />

              <GameControls
                game={game}
                gameStatus={isSolved ? "solved" : "ongoing"}
                handleHint={() => setShowHint(true)}
                handleShowSolution={handleShowSolution}
                resetPosition={resetPosition}
                navigateNext={navigateNext}
                isCheckmateMode={isCheckmateMode}
                playerColor={playerColor}
                isAutoSolution={isAutoSolution}
                handleShare={handleShare}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
