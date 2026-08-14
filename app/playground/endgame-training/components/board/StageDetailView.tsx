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

  const [containerWidth, setContainerWidth] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  useEffect(() => {
    const updateContainerDimensions = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const isOverflowing = scrollWidth > clientWidth;

        setShouldUseProximity(isOverflowing);
        setContainerWidth(clientWidth);
      }
    };

    updateContainerDimensions();

    window.addEventListener('resize', updateContainerDimensions);
    return () => window.removeEventListener('resize', updateContainerDimensions);
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
              <span className="text-[14px] --sm font-medium text-black">White</span>
            </div>
            <div className="bg-[#E6F7FE] border border-light-60 rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
              <span className="text-[14px] --sm font-medium text-black">Black</span>
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
                const fadeZone = 120;

                if (scrollLeft > 0 && relativePosition < fixedColumnWidth) {
                  const overlap = fixedColumnWidth - relativePosition;
                  opacity = Math.max(0.2, 1 - overlap / fadeZone);
                }

                const rightEdge = scrollLeft + containerWidth;
                const columnRightEdge = columnPosition + columnWidth;
                const distanceFromRight = rightEdge - columnRightEdge;

                console.log("distanceFromRight", distanceFromRight, fadeZone);

                if (distanceFromRight < (fadeZone / 2) && distanceFromRight > 0) {
                  const rightOpacity = Math.max(0.2, distanceFromRight / fadeZone);
                  opacity = Math.min(0.2, rightOpacity);
                }
              }

              return (
                <div
                  key={moveNumber}
                  className="flex flex-col gap-1 min-w-[60px] transition-opacity duration-150"
                  style={{ opacity }}
                >
                  <div className="text-center text-[14px] --xs font-medium text-gray-600 px-2 py-1 h-[25px] flex items-center justify-center">
                    Move {moveNumber}
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    {whiteMove ? (
                      <div className="flex items-center justify-center">
                        <span className="text-[14px] --xs font-medium truncate">
                          {whiteMove.san}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] --sm font-medium"></span>
                    )}
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    {blackMove ? (
                      <div className="flex items-center justify-center">
                        <span className="text-[14px] --xs font-medium truncate">
                          {blackMove.san}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] --sm font-medium"></span>
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

  const handleMoveWithSound = useCallback(
    (move: any) => {
      if (move) {
        playSound(game, move);

        setMoveHistory((prev) => [...prev, move]);

        setCurrentMoveIndex((prev) => prev + 1);

        setPosition(game.fen());
      }
    },
    [game]
  );

  const handlePreviousMove = useCallback(() => {
    if (currentMoveIndex > 0) {
      const newIndex = currentMoveIndex - 1;
      setCurrentMoveIndex(newIndex);

      if (newIndex === 0) {
        game.load(initialFen || game.fen());
        setPosition(initialFen);
      } else {
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

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0) return;

    try {
      const lastMove = game.undo();
      if (!lastMove) return;

      const newMoveHistory = moveHistory.slice(0, -1);
      setMoveHistory(newMoveHistory);
      setPosition(game.fen());
      setCurrentMoveIndex(newMoveHistory.length);

      setIsSolved(false);
      setShowGameEndDialog(false);
      setShowHint(false);
      setBestMove(null);
      setOptionSquares({});
      setMoveSquares({});

      updateSyzygyAnalysis();
    } catch (e) {
      console.error("Error undoing move:", e);
    }
  }, [game, moveHistory, updateSyzygyAnalysis]);

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

  const handleSwitch = useCallback(() => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  }, []);

  const handleToggle3DMode = useCallback(() => {
    const newMode = !is3DMode;
    setIs3DMode(newMode);

    const { setStyleChoosed } = useChessBoardThemeStore.getState();
    setStyleChoosed(newMode ? "3d" : "2d");
  }, [is3DMode]);

  const renderMobileButtons = () => {
    return (
      <div className="sm:hidden px-4 py-2 border-b">
        <div className="sm:hidden">
          {renderMobileNavigation()}
        </div>

        <div className="space-y-2">
          {!isSolved && (
            <div className="flex gap-x-[6px] w-full justify-center">
              <button
                className={`${showHint ? 'text-blue-base' : 'text-[#2E3133]'} flex gap-x-1 text-[14px] --10px items-center justify-center px-[20px] py-2 rounded-full border border-primary-gray whitespace-nowrap flex-shrink-0`}
                onClick={() => setShowHint(true)}
              >
                <Image
                  src={"/endgame-training/hint.png"}
                  alt="hint icon"
                  width={10}
                  height={10}
                  className={showHint ? "" : "grayscale"}
                />
                Hint
              </button>

              <button
                className={`flex gap-x-[2px] items-center justify-center px-[20px] py-2 rounded-full border whitespace-nowrap flex-shrink-0 ${
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
                  width={16}
                  height={16}
                />
                <span className="text-[14px] --10px">
                  {isAutoSolution ? "Solving..." : "Show Solution"}
                </span>
              </button>

              <button
                onClick={navigateNext}
                className="flex gap-x-[4px] items-center justify-center px-3 py-2 btn-primary rounded-full border whitespace-nowrap flex-shrink-0"
              >
                <span className="text-[14px] --10px">Next Stage</span>
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_681_310758)">
                    <path d="M0.875 6H13.2134" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.69531 0.75L13.2078 6L7.69531 11.25" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_681_310758">
                    <rect width="14" height="12" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          )}
          {isSolved && (
            <div className="flex gap-x-1 w-full justify-between">
              <button
                className="flex flex-1 gap-x-1 text-[14px] --xs items-center justify-center px-3 py-2 text-blue-base rounded-full border border-primary-gray whitespace-nowrap flex-shrink-0"
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
      <div className="px-4 mb-3 flex flex-row justify-center items-center gap-2">
        <button
          disabled={moveHistory.length === 0}
          onClick={handleUndo}
          className={`rounded-[4px] flex-1 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.182858 7.31768L6.43286 13.5677C6.52027 13.6552 6.63168 13.7148 6.75298 13.7389C6.87428 13.7631 7.00003 13.7507 7.11429 13.7034C7.22855 13.656 7.3262 13.5759 7.39487 13.473C7.46354 13.3701 7.50014 13.2492 7.50005 13.1255V10.0185C11.961 10.2716 15.0196 13.1646 15.8782 14.081C16.013 14.2249 16.1898 14.3227 16.3834 14.3604C16.577 14.3981 16.7776 14.3737 16.9566 14.2908C17.1355 14.2079 17.2838 14.0707 17.3803 13.8986C17.4767 13.7266 17.5164 13.5285 17.4938 13.3325C17.204 10.8122 15.8235 8.38799 13.6063 6.50674C11.7649 4.94424 9.52661 3.95284 7.50005 3.7794V0.625492C7.50014 0.501807 7.46354 0.380875 7.39487 0.278003C7.3262 0.175132 7.22855 0.0949484 7.11429 0.0476031C7.00003 0.000257809 6.87428 -0.0121201 6.75298 0.0120364C6.63168 0.0361929 6.52027 0.0957976 6.43286 0.183305L0.182858 6.4333C0.124748 6.49135 0.0786476 6.56028 0.0471954 6.63615C0.0157433 6.71203 -0.000444412 6.79336 -0.000444412 6.87549C-0.000444412 6.95763 0.0157433 7.03896 0.0471954 7.11483C0.0786476 7.1907 0.124748 7.25963 0.182858 7.31768Z" fill="black"/>
          </svg>
        </button>
        <button
          onClick={resetPosition}
          className="rounded-[4px] flex-1 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_852_113922)">
              <path d="M3.41941 3V7.5H8.15625" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.35153 12.2485C4.86472 13.6285 5.8361 14.8126 7.1193 15.6224C8.40251 16.4323 9.92801 16.824 11.4659 16.7385C13.0039 16.653 14.4709 16.095 15.6459 15.1486C16.821 14.2021 17.6404 12.9185 17.9807 11.4911C18.321 10.0637 18.1638 8.56994 17.5327 7.23485C16.9016 5.89976 15.8308 4.79569 14.4818 4.08903C13.1327 3.38236 11.5784 3.11137 10.0531 3.3169C8.52786 3.52244 7.11421 4.19335 6.02522 5.22855L4.20888 6.99854" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_852_113922">
                <rect width="20" height="20" fill="white" transform="matrix(-1 0 0 1 20 0)"/>
              </clipPath>
            </defs>
          </svg>
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

        <div className="grid grid-cols-1 xl:grid-cols-10  xl:gap-5">
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

            </div>
            <div className="xl:border bg-white border-gray-200 p-0 sm:mb-2 lg:mb-0 rounded-md flex flex-col">
              <div className="relative w-full flex flex-col justify-center items-center">
                <div className=" flex items-center justify-center w-full xl:p-10 2xl:p-12 overflow-hidden">
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

            {renderMobileButtons()}
            
            <div className="px-4 py-2 flex flex-col gap-y-1">
              {!isSolved && (
                <div className="flex sm:hidden flex-col items-center justify-center gap-y-3 bg-blue-base/10 border border-blue-base rounded-[4px] p-0">
                  <div className="flex  flex-col items-center py-1 justify-center gap-x-3 gap-y-2">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-blue-base" />
                      <h1 className="text-[14px] --sm text-black">
                        {isCheckmateMode
                          ? `Find the ${movesToCheckmate} ${
                              movesToCheckmate === 1 ? "move" : "moves"
                            } to checkmate`
                          : playerColor === "w"
                          ? "White to Checkmate"
                          : "Black to Checkmate"}
                      </h1>
                    </div>
                    <div className="truncate text-[14px] --xs">{position}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:hidden px-4 py-3">
              <MobileMoveBoxes moveHistory={moveHistory} />
            </div>
          </div>

          <div className="hidden bg-white sm:flex border border-gray-200 rounded-md flex-col xl:col-span-4">
            <div className="flex justify-between flex-col h-full">
              <div className="w-full">
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
                    <div className="bg-white text-[14px] --xs xl:text-base rounded-md border border-gray-200 text-center p-2 w-full">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">{position}</div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[500px] break-all">
                            <p className="text-[14px] --xs">{position}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <MoveHistory moveHistory={moveHistory} />

                <div className="hidden sm:block">
                  {renderMobileNavigation()}
                </div>
              </div>

              <div className="w-full">
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
        </div>
      </main>
    </div>
  );
}
