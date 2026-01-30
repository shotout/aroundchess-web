"use client";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import GameCard from "@/components/playground/play-vs-ai/GameCard";
import { Engine } from "@/components/playground/src/lib/stockfish";
import { motion } from "@/utils/motion";
import { useGameEndStatus } from "@/app/store/gameEndStatus";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useShareGame } from "@/app/store/shareGame";
import { usePgnStore } from "@/app/store/zustandStore";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import DotSpinner from "@/components/game-history/Spinner";
import { GameEndStatus } from "@/components/modal/GameEndStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiClient } from "@/functions/api-client";
import { changeNamePiece } from "@/functions/change-name-piece";
import { formatDatePgn, formatTimePgn } from "@/functions/format-date";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { Chess, Square } from "chess.js";
import { CustomChessArrows } from "@/components/game-history/components/CustomChessArrows";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  ChartNoAxesColumn,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import { toast } from "sonner";
import { BlackPlayer } from "./BlackPlayer";
import { ButtonBoard } from "./ButtonBoard";
import { ButtonFinish } from "./ButtonFinish";
import { ButtonPlaying } from "./ButtonPlaying";
import { CommentarGame } from "./CommentaryGame";
import { CommentaryMove } from "./CommentaryMove";
import { TableMovement } from "./TableMovement";
import { WhitePlayer } from "./WhitePlayer";
import { playSound } from "@/utils/play-audio";
import { classifyMove } from "../src/lib/classifyMove";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { usePollingManager } from "@/components/game-history/hooks/usePollingManager";
import { createPgnHash } from "@/utils/crypto-utils";
import { AnalyzeGameHistory } from "@/components/game-history/components/AnalyzeGameHistory";
import ChooseAnalysisMode from "@/components/game-history/components/ChooseAnalysisMode";
import ProcessingAnalysisMode from "@/components/game-history/components/ProcessingAnalysisMode";
import GameAnalysis from "@/components/game-history/components/GameAnalysis";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { useGames } from "@/components/game-history/hooks/useGameData";
import { useTutorial } from "@/components/TutorialProvider";
import { StartPlayVSAI } from "@/components/modal/StartPlayVSAI";

interface MobileCapturedPiecesProps {
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
  PieceChoosed: string;
}

const MobileCapturedPieces = ({
  capturedWhite,
  capturedBlack,
  PieceChoosed,
}: MobileCapturedPiecesProps) => {
  const whiteCapturedPieces = capturedWhite
    .filter((move) => move.captured !== null)
    .map((move) => move.capturedTheme)
    .filter((theme) => theme && theme.length === 2);

  const blackCapturedPieces = capturedBlack
    .filter((move) => move.captured !== null)
    .map((move) => move.capturedTheme)
    .filter((theme) => theme && theme.length === 2);

  return (
    <div className="sm:hidden flex justify-between items-center w-full px-4 py-2 ">
      <div className="flex items-center flex-1">
        {whiteCapturedPieces.map((pieceTheme, index) => (
          <Image
            key={`white-captured-${index}`}
            src={`/pieces/${PieceChoosed}/${pieceTheme}.png`}
            alt="captured piece"
            width={1000}
            height={1000}
            className={`w-[25px] h-[25px] object-contain ${
              index > 0 ? "-ml-3" : ""
            }`}
            style={{ zIndex: whiteCapturedPieces.length - index }}
          />
        ))}
      </div>

      <div className="w-px mx-2" />

      <div className="flex items-center flex-1 justify-end">
        {blackCapturedPieces.map((pieceTheme, index) => (
          <Image
            key={`black-captured-${index}`}
            src={`/pieces/${PieceChoosed}/${pieceTheme}.png`}
            alt="captured piece"
            width={1000}
            height={1000}
            className={`w-[25px] h-[25px] object-contain ${
              index > 0 ? "-ml-3" : ""
            }`}
            style={{ zIndex: blackCapturedPieces.length - index }}
          />
        ))}
      </div>
    </div>
  );
};

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
                  <div className="text-center text-[14px] --xs font-medium text-gray-600 px-2 py-1 h-[25px] flex items-center justify-center">
                    Move {moveNumber}
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    <span className="text-[14px] --sm font-medium">
                      {whiteMove ? whiteMove.san : ""}
                    </span>
                  </div>

                  <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 text-center min-h-[40px] flex items-center justify-center">
                    <span className="text-[14px] --sm font-medium">
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

export default function PlayingPage() {
  const { sessionId, setToken } = useProfileStore();
  const { setCallFetch } = useProfileFetch();
  const { addOtherImportedGame } = usePgnStore();
  const { isTutorialPlay, stepFocused } = useTutorial();
  const router = useRouter();
  const pathname = usePathname();
  const { setFen, setPGN, setOpen } = useShareGame();
  const { proceedAnalysis } = useStockfishAnalysis();
  const { isMember, isMemberMonthly, token } = useProfileStore();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const [beforeFen, setBeforeFen] = useState<string>("");
  const [afterFen, setAfterFen] = useState<string>("");
  const { getVSAILogs, postVSAILogs, getTokenBalance, isLoading } =
    useApiClient();
  const { handleForceRefresh } = useGames({ sources: ["vs_ai", "pgn_upload"] });
  const {
    setIsLoading,
    setPgn,
    setDataAnalysis,
    setDataGamesImport,
    setError,
    username,
    hideDiv,
    setIsFromGameHistory,
  } = usePgnStore();
  const hasRun = useRef(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [analysisPgn, setAnalysisPgn] = useState<string | null>(null);
  const [depthLevel] = useState(14);
  const { AIChoosed } = usePlayVSAIStore();
  const { setOpen: setOpenGameStatus } = useGameEndStatus();

  // Modal states for analysis dialogs
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [isChooseAnalysisModeOpen, setIsChooseAnalysisModeOpen] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [shortAnalysisData, setShortAnalysisData] = useState<any>(null);
  const [v2AnalysisData, setV2AnalysisData] = useState<any>(null);
  const [processingAnalysisModeOpen, setProcessingAnalysisModeOpen] = useState(false);
  const [gameAnalysisOpen, setGameAnalysisOpen] = useState(false);
  const [v3AnalysisResult, setV3AnalysisResult] = useState<any>(null);
  
  // New Game dialog state
  const [showPlayVSAIModal, setShowPlayVSAIModal] = useState<boolean>(false);

  useEffect(() => {
    // Track modal states
  }, [isAnalyzeOpen, isChooseAnalysisModeOpen, processingAnalysisModeOpen, gameAnalysisOpen, hasAnalysis]);

  const isGameInitialized = useRef(false);

  const { getJobByGameId, analysisJobs, clearOldJobs } =
    useBackgroundAnalysisStore();
  const { startBackgroundPolling, restorePollingJobs } = usePollingManager();
  const [currentGameId, setCurrentGameId] = useState<string>("");
  const refBoard = useRef<HTMLDivElement | null>(null);
  const { PieceChoosed, StyleChoosed, setStyleChoosed } =
    useChessBoardThemeStore();
  const [selectedTab, setSelectedTab] = useState<string>("current");
  const [orientation, setOrientation] = useState<BoardOrientation>(
    AIChoosed.color as BoardOrientation
  );
  const [myColor, setMyColor] = useState<string>(AIChoosed.color);
  const [currentTurn, setCurrentTurn] = useState<string>("White");
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [mounted] = useState<boolean>(true);
  const [boardSize, setBoardSize] = useState<number>(700);
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [heightScreen, setHeightScreen] = useState<number>(0);
  const [heightBoard, setHeightBoard] = useState<number | undefined>(0);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [bestLine, setBestline] = useState<string | null>("");
  const [positionEvaluation, setPositionEvaluation] = useState<number>(0);
  const [moveClassification, setMoveClassification] = useState<string>("");
  const [depth] = useState<number>(20);
  const [hintClicked, setHintClicked] = useState<boolean>(false);
  const [possibleMate, setPossibleMate] = useState<string>("");
  const [statusGame, setStatusGame] = useState<string>("Ongoing");
  const [winnerColor, setWinnerColor] = useState<string>("");
  const [loserColor, setLoserColor] = useState<string>("");
  const [capturedWhite, setCapturedWhite] = useState<any[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<any[]>([]);
  const [moveFrom, setMoveFrom] = useState<string>("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [moveData, setMoveData] = useState<any>();
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<
    Record<string, CSSProperties>
  >({});
  const [lossReason, setLossReason] = useState<"checkmate" | "resign" | null>(
    null
  );
  const [moveSquares] = useState<Record<string, CSSProperties>>({});
  const [optionSquares, setOptionSquares] = useState<
    Record<string, CSSProperties>
  >({});
  const [currentSquare, setCurrentSquare] = useState<Square | undefined>(
    undefined
  );
  const [previousSquare, setPreviousSquare] = useState<Square | undefined>(
    undefined
  );
  const [isClassifying, setIsClassifying] = useState(false);
  const classificationTimeoutRef = useRef<NodeJS.Timeout>();
  const [isMobile, setIsMobile] = useState(false);

  const [shouldTriggerAI, setShouldTriggerAI] = useState(false);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fenHistory, setFenHistory] = useState<string[]>([game.fen()]);
  const containerRef = useRef<HTMLDivElement>(null);
  const movementDetailsRef = useRef<HTMLDivElement>(null);
  const [totalCompletedJobs, setTotalCompletedJobs] = useState(0);

  const [redoStack, setRedoStack] = useState<string[]>([]);

  // User-drawn arrows state (for right-click drag arrow drawing)
  const [userDrawnArrows, setUserDrawnArrows] = useState<{
    from: string;
    to: string;
    color: string;
    isKnightMove: boolean;
  }[]>([]);
  const [arrowDrawStart, setArrowDrawStart] = useState<string | null>(null);

  // Pre-move queue state
  const [preMoveQueue, setPreMoveQueue] = useState<Array<{
    from: string;
    to: string;
    promotion?: string;
  }>>([]);
  const [isProcessingPreMove, setIsProcessingPreMove] = useState(false);

  const isYourTurn = myColor === "white" ? "w" : "b";

  // Helper function to detect if a move is a knight move (L-shaped)
  const isKnightMove = useCallback((from: string, to: string): boolean => {
    const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankFrom = parseInt(from[1]) - 1;
    const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankTo = parseInt(to[1]) - 1;

    const fileDiff = Math.abs(fileTo - fileFrom);
    const rankDiff = Math.abs(rankTo - rankFrom);

    // Knight moves: 2 squares in one direction, 1 in perpendicular
    return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
  }, []);

  // Convert hint arrows to ArrowConfig format for CustomChessArrows
  const customArrowsConfig = useMemo(() => {
    if (!bestLine || bestLine.length === 0 || !bestLine.split(" ")?.[0] || !hintClicked) {
      return [];
    }

    const move = bestLine.split(" ")[0];
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);

    return [{
      from,
      to,
      color: "rgba(28, 22, 194, 0.5)", // Purple hint color with opacity
      isKnightMove: isKnightMove(from, to)
    }];
  }, [bestLine, hintClicked, isKnightMove]);

  // Generate pre-move visual arrows
  const preMoveArrows = useMemo(() => {
    return preMoveQueue.map((preMove, index) => ({
      from: preMove.from,
      to: preMove.to,
      color: index === 0
        ? "rgba(255, 100, 100, 0.8)"  // Red for next pre-move
        : "rgba(255, 150, 100, 0.6)", // Orange for subsequent
      isKnightMove: isKnightMove(preMove.from, preMove.to)
    }));
  }, [preMoveQueue, isKnightMove]);

  // Pre-move square highlights
  const preMoveSquareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    preMoveQueue.forEach((preMove, index) => {
      const color = index === 0
        ? "rgba(255, 100, 100, 0.5)"  // Red for next pre-move
        : "rgba(255, 150, 100, 0.4)"; // Orange for subsequent
      styles[preMove.from] = { backgroundColor: color };
      styles[preMove.to] = { backgroundColor: color };
    });
    return styles;
  }, [preMoveQueue]);

  const updateFenHistory = useCallback((newFen: string) => {
    setFenHistory((prev) => {
      const newHistory = [...prev, newFen];
      setCurrentMoveIndex(newHistory.length - 1);
      return newHistory;
    });
  }, []);

  const handleUndo = () => {
    if (game.history().length === 0) return;

    const isMyTurn = game.turn() === (myColor === "white" ? "w" : "b");
    const movesToUndo = isMyTurn ? 2 : 1;
    const newRedoStack = [...redoStack];

    for (let i = 0; i < movesToUndo; i++) {
      const move = game.undo();
      if (move) {
        newRedoStack.push(game.pgn()); // Or store move details to replay
      }
    }
    
    // Ideally we want to support redo, but chess.js undo is destructive. 
    // To support redo we would need to replay PGN.
    // For now, per requirement "return to previous position... to move", we focus on Undo.
    // We clear redo stack if we want strict "Takeback" behavior, or we try to manage it.
    // Given complexity, let's just focus on getting the Board State correct for moving.
    
    // Rebuild history from game state
    const newFen = game.fen();
    setGamePosition(newFen);
    
    // Reconstruct fenHistory based on current game state history
    // This is expensive but accurate. Or we can just slice the existing fenHistory.
    setFenHistory((prev) => prev.slice(0, prev.length - movesToUndo));
    setCurrentMoveIndex((prev) => Math.max(0, prev - movesToUndo));
    
    // Reset game status if it was over
    if (statusGame !== "Ongoing") {
      setStatusGame("Ongoing");
      setWinnerColor("");
      setLoserColor("");
      setLossReason(null);
    }
    
    setOptionSquares({});
    setRightClickedSquares({});
    setBestline("");
    setHintClicked(false);
    setMoveFrom("");
    setMoveTo(null);
  };

  const handleRedo = () => {
    // Redo logic is complex with chess.js without full PGN reload.
    // For now, we will disable this or keep it as navigation if we didn't truncate history?
    // But we ARE truncating history to allow moves.
    // So Right Arrow is effectively disabled after a Takeback until a new move is made.
  };

  const handleReset = () => {
    handleRematch();
  };

  const LOCAL_STORAGE_KEY = "vs-ai-current-game";

  const saveGameState = useCallback(() => {
    if (!isGameInitialized.current) return;
    if (typeof window !== "undefined") {
      const state = {
        pgn: game.pgn(),
        aiName: AIChoosed.opponent.name,
        elo: AIChoosed.opponent.elo,
        myColor: AIChoosed.color,
        statusGame: statusGame,
        gameId: currentGameId,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [game, AIChoosed, statusGame, currentGameId]);

  // Create game object from PGN with stable ID using useMemo
  const gameFromPgn = useMemo(() => {
    // Use canonical PGN from backend if available (after save), otherwise use local PGN
    const currentPgn = analysisPgn ?? game.pgn();
    const pgnHash = createPgnHash(currentPgn);
    const gameId = `play-vs-ai-${pgnHash}`;

    const gameObj = {
      id: gameId,
      pgn: currentPgn,
      username: username || "Unknown",
      opponent: "AI",
      date: new Date().toLocaleDateString(),
      timeControl: "N/A",
      result: "Game Finished",
      rating: "N/A",
      timeClass: "You vs AI",
      moves: "N/A",
      opening: "N/A",
      source: "You vs AI",
    };
    return gameObj;
  }, [game, username, analysisPgn]);

  useEffect(() => {
    saveGameState();
  }, [gamePosition, statusGame, saveGameState]);

  useEffect(() => {
    clearOldJobs();
    restorePollingJobs();
  }, [clearOldJobs, restorePollingJobs]);

  // Check if analysis exists for this game
  useEffect(() => {
    // Skip analysis check during tutorial
    if (isTutorialPlay) {
      return;
    }
    
    const checkAnalysis = () => {
      const job = getJobByGameId(gameFromPgn.id);

      // Ensure the job is completed, has a result, AND the PGN matches this game
      const hasCompletedAnalysis =
        job?.status === "completed" &&
        !!job.result &&
        job.gamePgn === gameFromPgn.pgn;
      
      setHasAnalysis(hasCompletedAnalysis);
    };

    checkAnalysis();
    // Poll every second to check for completed analysis
    const interval = setInterval(checkAnalysis, 1000);

    return () => clearInterval(interval);
  }, [gameFromPgn.id, gameFromPgn.pgn, getJobByGameId, hasAnalysis, isTutorialPlay]);

  // Auto-open AnalyzeGameHistory modal when tutorial reaches step 4
  useEffect(() => {
    if (isTutorialPlay && stepFocused === 2) {
      setIsAnalyzeOpen(false);
    }
  }, [isTutorialPlay, stepFocused]);

  useEffect(() => {
    if (isTutorialPlay && stepFocused === 3) {
      setIsAnalyzeOpen(true);
      setIsChooseAnalysisModeOpen(false);
    }
  }, [isTutorialPlay, stepFocused]);

  // Auto-open ChooseAnalysisMode modal when tutorial reaches step 5
  useEffect(() => {
    if (isTutorialPlay && stepFocused === 4) {
      setIsAnalyzeOpen(false);
      setIsChooseAnalysisModeOpen(true);
      setGameAnalysisOpen(false);
    }
  }, [isTutorialPlay, stepFocused]);

  // Auto-open GameAnalysis modal when tutorial reaches step 6
  useEffect(() => {
    if (isTutorialPlay && stepFocused === 5) {
      // Set dummy v3Result for tutorial with complete data including FEN and arrows
      setV3AnalysisResult({
        summary: {
          criticalMistakes: [
            {
              "fen": "r4rk1/ppp2pbp/2npbqp1/4p3/1P2P3/P1NP1N2/2P1BPPP/R2Q1RK1 b - - 0 10",
              "move": "Nc3",
              "type": "Miss",
              "arrows": {
                "badMove": {
                  "piece": "p",
                  "endSquare": "b5",
                  "startSquare": "b7"
                },
                "goodMove": {
                  "piece": "n",
                  "endSquare": "d4",
                  "startSquare": "c6"
                }
              },
              "analysis": "This choice weakens your position quite a bit and hands your opponent more chances.",
              "fenAfter": "r4rk1/p1p2pbp/2npbqp1/1p2p3/1P2P3/P1NP1N2/2P1BPPP/R2Q1RK1 w - - 0 11",
              "solution": "Here, d5 would keep the position much healthier.",
              "moveNumber": 44,
              "keyEvaluation": -1.50,
              "mistakeLogId": "212adc63-f76f-4aba-b659-ec425134fb2b",
              "saved": false,
              "savedDate": null
            },
          ]
        },
        analysisId: "tutorial-dummy-id"
      });
      setIsChooseAnalysisModeOpen(false);
      setGameAnalysisOpen(true);
    }
  }, [isTutorialPlay, stepFocused]);

  const navigateToMove = (index: number) => {
    if (index < 0 || index >= fenHistory.length) {
      return;
    }

    setCurrentMoveIndex(index);
    const targetFen = fenHistory[index];
    setGamePosition(targetFen);

    const tempGame = new Chess();
    tempGame.load(targetFen);
    setCurrentTurn(tempGame.turn() === "w" ? "White" : "Black");
  };

  const handlePreviousMove = () => {
    const newIndex = Math.max(currentMoveIndex - 1, 0);
    navigateToMove(newIndex);
  };

  const handleNextMove = () => {
    const newIndex = Math.min(currentMoveIndex + 1, fenHistory.length - 1);
    navigateToMove(newIndex);

    if (
      newIndex === fenHistory.length - 1 &&
      !game.isGameOver() &&
      statusGame === "Ongoing"
    ) {
      const tempGame = new Chess();
      tempGame.load(fenHistory[newIndex]);
      const isMyTurn =
        (myColor === "white" && tempGame.turn() === "w") ||
        (myColor === "black" && tempGame.turn() === "b");

      if (!isMyTurn) {
        setTimeout(() => {
          findEnemyMove(newIndex);
        }, 500);
      }
    }
  };

  const resetToBeginning = () => {
    navigateToMove(0);
  };

  const goToLatestMove = () => {
    const latestIndex = fenHistory.length - 1;
    navigateToMove(latestIndex);

    if (!game.isGameOver() && statusGame === "Ongoing") {
      const tempGame = new Chess();
      tempGame.load(fenHistory[latestIndex]);
      const isMyTurn =
        (myColor === "white" && tempGame.turn() === "w") ||
        (myColor === "black" && tempGame.turn() === "b");

      if (!isMyTurn) {
        setTimeout(() => {
          findEnemyMove(latestIndex);
        }, 500);
      }
    }
  };

  const isAtCurrentMove = useMemo(
    () => currentMoveIndex === fenHistory.length - 1,
    [currentMoveIndex, fenHistory.length]
  );

  useEffect(() => {
    if (shouldTriggerAI && isAtCurrentMove && statusGame === "Ongoing") {
      const isMyTurn =
        (myColor === "white" && game.turn() === "w") ||
        (myColor === "black" && game.turn() === "b");
      if (!isMyTurn) {
        setTimeout(
          () => {
            findEnemyMove();
          },
          isMobile ? 1000 : 100
        );
      }
      setShouldTriggerAI(false);
    }
  }, [shouldTriggerAI, isAtCurrentMove, statusGame, myColor, game.turn()]);

  // Execute pre-moves when it becomes player's turn
  useEffect(() => {
    const isYourTurnLocal = myColor === "white" ? "w" : "b";
    const isMyTurn = game.turn() === isYourTurnLocal;

    if (isMyTurn && preMoveQueue.length > 0 && statusGame === "Ongoing" && isAtCurrentMove) {
      // Small delay to let board update visually
      const timer = setTimeout(() => {
        executeNextPreMove();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [gamePosition, preMoveQueue.length, myColor, statusGame, isAtCurrentMove, executeNextPreMove, game]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Set dummy data when tutorial is active to show "Analyze Now" button
  useEffect(() => {
    if (isTutorialPlay && pathname.includes("/playground/play-vs-ai/playing")) {
      setStatusGame("Win");
      setWinnerColor(myColor);
      setLoserColor(myColor === "white" ? "black" : "white");
      setHasAnalysis(false); // Ensure "Analyze Now" button shows instead of "Show Analysis"
    }
  }, [isTutorialPlay, pathname, myColor]);

  useEffect(() => {
    const moves = game.history();

    if (moves.length === 0) {
      const initialFen = game.fen();
      setFenHistory([initialFen]);
      setCurrentMoveIndex(0);
      setGamePosition(initialFen);
    }
  }, [game.history().length === 0]);

  // Auto-scroll Movement Details to bottom when new moves are added
  useEffect(() => {
    if (movementDetailsRef.current) {
      movementDetailsRef.current.scrollTop = movementDetailsRef.current.scrollHeight;
    }
  }, [capturedWhite, capturedBlack]);

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares: {
      [key in Square]?: { background: string; borderRadius?: string };
    } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(square)?.color
            ? window.innerWidth > 768 ? "radial-gradient(circle, transparent 55%, rgba(100, 100, 100, 0.5) 55%, rgba(100, 100, 100, 0.5) 70%, transparent 70%)" : "radial-gradient(circle, transparent 55%, rgba(33, 26, 233, 0.5) 55%, rgba(33, 26, 233, 0.5) 70%, transparent 70%)"
            : window.innerWidth > 768 ? `radial-gradient(circle, rgba(100, 100, 100, 0.5) 25%, transparent 25%)` : `radial-gradient(circle, rgba(33, 26, 233, 0.5) 25%, transparent 25%)`,
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = { background: window.innerWidth > 768 ? "#F5F682" : "#25CEDA" };
    setOptionSquares(newSquares);
    return true;
  };

  const onSquareClick = (square: Square) => {
    if (!isAtCurrentMove) {
      goToLatestMove();
      return;
    }

    // Clear user-drawn arrows and pre-move queue on any left-click
    if (userDrawnArrows.length > 0) {
      setUserDrawnArrows([]);
    }
    if (preMoveQueue.length > 0) {
      setPreMoveQueue([]);
    }
    setRightClickedSquares({} as Record<string, CSSProperties>);
    setBestline("");

    if (!moveFrom) {
      // Click-to-select with dots: show legal moves and mark current square
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) {
        setPreviousSquare(square);
        setMoveFrom(square);
      }
      return;
    }

    if (!moveTo) {
      const moves = game.moves({
        square: moveFrom as Square,
        verbose: true,
      }) as Array<{
        from: string;
        to: string;
        color: string;
        piece: string;
      }>;
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );

      if (!foundMove) {
        if (moveFrom === square) {
          setMoveFrom("");
          setOptionSquares({});
          setPreviousSquare(undefined);
          return;
        }
        // Change selected piece: update dots for the new origin square
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) {
          setPreviousSquare(square);
          setMoveFrom(square);
        }
        return;
      }

      setMoveTo(square);
      setCurrentSquare(square);

      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setBeforeFen(game.fen());
        setShowPromotionDialog(true);
        return;
      }

      const move = game.move({ from: moveFrom, to: square, promotion: "q" });

      if (move) {
        setMoveData(move);
        playSound(game, move);
        setMoveClassification("");

        const newFen = game.fen();
        setGamePosition(newFen);
        updateFenHistory(newFen);
        setAfterFen(newFen);

        if (!isMobile) {
          getClassificationMove(move);
        } else {
          setShouldTriggerAI(true);
        }

        setCurrentTurn((turnColor) =>
          turnColor !== "White" ? "White" : "Black"
        );
        setMoveFrom("");
        setMoveTo(null);
        setOptionSquares({});
        setRightClickedSquares({} as Record<string, CSSProperties>);
        setUserDrawnArrows([]);
      }

      if (move === null) {
        // If move failed, try treating the clicked square as a new origin
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) {
          setPreviousSquare(square);
          setMoveFrom(square);
        }
        return;
      }
    }
  };

  const handleClassify = useCallback(
    async (move: any) => {
      try {
        setIsClassifying(true);
        const result = await classifyMove(beforeFen, game.fen(), move.to);
        return result;
      } catch (error) {
        return "good-move";
      } finally {
        setIsClassifying(false);
      }
    },
    [beforeFen]
  );

  const getClassificationMove = useCallback(
    async (move: any) => {
      if (isMobile) {
        setShouldTriggerAI(true);
        return;
      }

      if (classificationTimeoutRef.current) {
        clearTimeout(classificationTimeoutRef.current);
      }

      classificationTimeoutRef.current = setTimeout(async () => {
        try {
          const moveUserClassification = await handleClassify(move);
          setMoveClassification(moveUserClassification);
          setShouldTriggerAI(true);
        } catch (error) {
          setShouldTriggerAI(true);
        }
      }, 300);
    },
    [handleClassify, isMobile]
  );

  const onPromotionPieceSelect = (
    piece?: string,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => {
    setBestline("");
    setHintClicked(false);

    if (piece) {
      const move = game.move({
        from: promoteFromSquare || moveFrom,
        to: promoteToSquare || moveTo!,
        promotion: piece?.[1]?.toLowerCase() ?? "q",
      });

      if (move) {
        setMoveData(move);

        const newFen = game.fen();
        setGamePosition(newFen);
        updateFenHistory(newFen);
        setAfterFen(newFen);

        playSound(game, move);

        setPreviousSquare((promoteFromSquare || moveFrom) as Square);
        setCurrentSquare((promoteToSquare || moveTo) as Square);

        setCurrentTurn((turnColor) =>
          turnColor !== "White" ? "White" : "Black"
        );

        setMoveClassification("");

        if (!isMobile) {
          getClassificationMove(move);
        } else {
          setShouldTriggerAI(true);
        }
      }
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    setRightClickedSquares({} as Record<string, CSSProperties>);
    setUserDrawnArrows([]);
    return true;
  };

  const onSquareRightClick = (square: Square) => {
    // Note: This is kept for backwards compatibility but arrow drawing
    // is now handled via mouse events on the board container
    const colour = "rgba(235, 97, 80, 0.8)"; // Red like chess.com
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: {
        backgroundColor:
          rightClickedSquares[square]?.backgroundColor === colour ? "" : colour,
      },
    });
  };

  // Arrow drawing handlers for right-click drag functionality
  const onArrowDrawEnd = useCallback((fromSquare: string, toSquare: string) => {
    if (fromSquare === toSquare) {
      // Same square - no arrow
      return;
    }

    // Determine arrow color based on piece at starting square and direction
    const pieceAtFrom = game.get(fromSquare as Square);
    const playerColorCode = myColor === "white" ? "w" : "b";

    let arrowColor: string;

    if (pieceAtFrom) {
      // Starting from a piece - color based on whose piece it is
      arrowColor = pieceAtFrom.color === playerColorCode
        ? "rgba(255, 170, 0, 0.8)"  // Yellow - own piece
        : "rgba(0, 100, 255, 0.8)"; // Blue - opponent piece
    } else {
      // Starting from empty square - color based on direction
      const fromRank = parseInt(fromSquare[1]);
      const toRank = parseInt(toSquare[1]);

      // Bottom-up is "my direction", top-down is "opponent direction"
      // For white: bottom = rank 1, going up means toRank > fromRank
      // For black: bottom = rank 8 (flipped), going up means toRank < fromRank
      const isGoingUp = myColor === "white"
        ? toRank > fromRank
        : toRank < fromRank;

      arrowColor = isGoingUp
        ? "rgba(255, 170, 0, 0.8)"  // Yellow - my direction (bottom-up)
        : "rgba(0, 100, 255, 0.8)"; // Blue - opponent direction (top-down)
    }

    setUserDrawnArrows(prev => {
      // Check if arrow already exists (toggle behavior)
      const existingIndex = prev.findIndex(
        a => a.from === fromSquare && a.to === toSquare
      );

      if (existingIndex >= 0) {
        // Remove existing arrow
        return prev.filter((_, i) => i !== existingIndex);
      }

      // Add new arrow
      return [...prev, {
        from: fromSquare,
        to: toSquare,
        color: arrowColor,
        isKnightMove: isKnightMove(fromSquare, toSquare)
      }];
    });

    setArrowDrawStart(null);
  }, [isKnightMove, game, myColor]);

  // Clear user arrows on left-click
  const clearUserArrows = useCallback(() => {
    if (userDrawnArrows.length > 0) {
      setUserDrawnArrows([]);
    }
  }, [userDrawnArrows.length]);

  // Helper to get square from mouse event via data-square attribute
  const getSquareFromEvent = useCallback((e: React.MouseEvent): string | null => {
    const target = e.target as HTMLElement;
    const squareEl = target.closest('[data-square]');
    return squareEl?.getAttribute('data-square') || null;
  }, []);

  // Mouse event handlers for arrow drawing
  const handleBoardMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { // Right-click
      e.preventDefault();
      const square = getSquareFromEvent(e);
      if (square) {
        setArrowDrawStart(square);
      }
    }
  }, [getSquareFromEvent]);

  const handleBoardMouseUp = useCallback((e: React.MouseEvent) => {
    if (e.button === 2 && arrowDrawStart) { // Right-click release
      const square = getSquareFromEvent(e);
      if (square && square !== arrowDrawStart) {
        onArrowDrawEnd(arrowDrawStart, square);
      }
      setArrowDrawStart(null);
    }
  }, [arrowDrawStart, getSquareFromEvent, onArrowDrawEnd]);

  const handleBoardContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent browser context menu
  }, []);

  const prevCurrentColor = {
    ...(previousSquare && {
      [previousSquare]: { backgroundColor: window.innerWidth > 768 ? "#B9CA43" : "#C0CED4" },
    }),
    ...(currentSquare && {
      [currentSquare]: { backgroundColor: window.innerWidth > 768 ? "#F5F682" : "#25CEDA" },
    }),
  };

  const findEnemyMove = (moveIndex?: number) => {
    const isYourTurnLocal = myColor === "white" ? "w" : "b";
    const currentTurn = game.turn();
    const checkIndex = moveIndex !== undefined ? moveIndex : currentMoveIndex;
    const atCurrentMove = checkIndex === fenHistory.length - 1;

    if (currentTurn === isYourTurnLocal) {
      return false;
    }

    if (!atCurrentMove) {
      return false;
    }

    if (statusGame !== "Ongoing") {
      return false;
    }

    engine.getStockfishMove(game.fen(), AIChoosed.opponent.elo).then((pv) => {
      const move = game.move({
        from: pv.substring(0, 2),
        to: pv.substring(2, 4),
        promotion: pv.substring(4, 5),
      });

      if (move) {
        setMoveData(move);
        playSound(game, move);
        setBeforeFen(game.fen());
        setPreviousSquare(pv.substring(0, 2) as Square);
        setCurrentSquare(pv.substring(2, 4) as Square);
        setBestline("");
        setHintClicked(false);

        const newFen = game.fen();
        setGamePosition(newFen);
        updateFenHistory(newFen);

        setCurrentTurn((turnColor) =>
          turnColor !== "White" ? "White" : "Black"
        );
        setRightClickedSquares({} as Record<string, CSSProperties>);
        setUserDrawnArrows([]);
      }
    });
  };

  // Execute the next pre-move in queue if valid
  const executeNextPreMove = useCallback(() => {
    if (preMoveQueue.length === 0 || isProcessingPreMove) {
      return;
    }

    const isYourTurnLocal = myColor === "white" ? "w" : "b";
    if (game.turn() !== isYourTurnLocal || statusGame !== "Ongoing") {
      return;
    }

    setIsProcessingPreMove(true);
    const nextPreMove = preMoveQueue[0];

    // Check if move is legal
    const moves = game.moves({ square: nextPreMove.from as Square, verbose: true });
    const isLegal = moves.some((m: any) => m.from === nextPreMove.from && m.to === nextPreMove.to);

    if (!isLegal) {
      // Cascade cancellation: clear entire queue
      setPreMoveQueue([]);
      setIsProcessingPreMove(false);
      return;
    }

    // Execute the pre-move
    const move = game.move({
      from: nextPreMove.from,
      to: nextPreMove.to,
      promotion: nextPreMove.promotion || 'q'
    });

    if (move) {
      // Remove executed pre-move from queue
      setPreMoveQueue(prev => prev.slice(1));

      // Update game state (similar to onPieceDrop success path)
      setMoveData(move);
      playSound(game, move);
      setMoveClassification("");
      setBeforeFen(game.fen());

      const newFen = game.fen();
      setGamePosition(newFen);
      updateFenHistory(newFen);
      setAfterFen(newFen);

      setPreviousSquare(nextPreMove.from as Square);
      setCurrentSquare(nextPreMove.to as Square);

      setCurrentTurn(turnColor => turnColor !== "White" ? "White" : "Black");

      // Clear user arrows and highlights
      setRightClickedSquares({} as Record<string, CSSProperties>);
      setUserDrawnArrows([]);

      // Trigger AI or classification
      if (!isMobile) {
        getClassificationMove(move);
      } else {
        setShouldTriggerAI(true);
      }
    } else {
      // Move failed - cascade cancellation
      setPreMoveQueue([]);
    }

    setIsProcessingPreMove(false);
  }, [
    preMoveQueue,
    isProcessingPreMove,
    game,
    myColor,
    statusGame,
    updateFenHistory,
    getClassificationMove,
    isMobile
  ]);

  const handleHint = () => {
    const depthHint = depth;
    const isYourTurnLocal = myColor === "white" ? "w" : "b";
    setBestline(null);
    engine.evaluatePosition(game.fen(), depthHint);
    engine.onMessage(({ positionEvaluation, possibleMate, bestMove }) => {
      positionEvaluation &&
        setPositionEvaluation(
          ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
        );
      possibleMate && setPossibleMate(possibleMate);
      if (game.turn() === isYourTurnLocal) {
        !bestMove && setHintClicked(false);
        !bestMove && setBestline(null);
        bestMove && setBestline(bestMove);
        bestMove && setHintClicked(true);
      }
    });
  };

  useEffect(() => {
    fillMovement();
    checkStatusGame();
  }, [gamePosition]);

  const fillMovement = () => {
    const capturedPiecesBlack: Array<{
      captured: string | null;
      capturedTheme: string | null;
      piece: string | null;
      color: string;
      from: Square;
      to: Square;
      lan: string;
      san: string;
    }> = [];
    const capturedPiecesWhite: Array<{
      captured: string | null;
      capturedTheme: string | null;
      piece: string | null;
      color: string;
      from: Square;
      to: Square;
      lan: string;
      san: string;
    }> = [];

    game.history({ verbose: true }).forEach((move) => {
      if (move.color === "w") {
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

    // During tutorial mode, limit to first 3 move pairs (6 total moves) to keep button visible
    if (isTutorialPlay) {
      const limitedWhite = capturedPiecesWhite.slice(0, 3);
      const limitedBlack = capturedPiecesBlack.slice(0, 3);
      setCapturedBlack(limitedBlack);
      setCapturedWhite(limitedWhite);
    } else {
      setCapturedBlack(capturedPiecesBlack);
      setCapturedWhite(capturedPiecesWhite);
    }
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
    if (hasRun.current) return;
    hasRun.current = true;
    loadLogs();
  }, []);
  const loadLogs = () => {
    getVSAILogs({ limit: 30, page: 1 }).then((res: any) => {
      setPastGames(res.data);
    });
  };
  const setHeaderGameStart = () => {
    const date = formatDatePgn();
    const time = formatTimePgn();
    const whiteName =
      AIChoosed.color !== "white"
        ? AIChoosed.opponent.name + " (AI)"
        : username;
    const blackName =
      AIChoosed.color == "white" ? AIChoosed.opponent.name + " (AI)" : username;

    game.header("Event", "You vs AI (" + AIChoosed.opponent.elo + ")");
    game.header("Site", "aroundchess.com");
    game.header("Date", date);
    game.header("White", whiteName);
    game.header("Black", blackName);
    game.header("Timezone", "UTC");
    game.header("UTCDate", date);
    game.header("UTCTime", time);
  };

  const setHeaderGameFinish = (winnerColor: string) => {
    const date = formatDatePgn();
    const time = formatTimePgn();
    const isWhiteWin = winnerColor === "white" ? "1" : "0";
    const isBlackWin = winnerColor !== "white" ? "1" : "0";
    const winResult =
      winnerColor == "draw" ? "1/2-1/2" : isWhiteWin + "-" + isBlackWin;

    game.header("Result", winResult);
    game.header("EndDate", date);
    game.header("EndTime", time);
  };

  useEffect(() => {
    const timestamp = Date.now();

    // Try to restore game from local storage
    let restored = false;
    if (typeof window !== "undefined") {
      const savedGame = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedGame) {
        try {
          const parsed = JSON.parse(savedGame);

          // Check if the saved game has ended (Win/Loss/Draw)
          const gameHasEnded = parsed.statusGame === "Win" || parsed.statusGame === "Loss" || parsed.statusGame === "Draw";

          if (gameHasEnded) {
            console.log("🔄 [DEBUG] Saved game has ended, clearing localStorage and showing New Game dialog");

            // Clear the saved game from localStorage
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            // Close any open dialogs
            setOpenGameStatus(false);

            // Show New Game dialog ONLY if not coming from /playground/play-vs-ai page
            // (to avoid showing modal twice when redirected from that page)
            // const fromPlayVsAIPage = document.referrer.includes('/playground/play-vs-ai') &&
            //                           !document.referrer.includes('/playground/play-vs-ai/playing');
            // if (!fromPlayVsAIPage) {
            //   setShowPlayVSAIModal(true);
            // }

            // Don't restore the game, let it initialize as a new game below
            restored = false;
          } else if (
            parsed.aiName === AIChoosed.opponent.name &&
            parsed.elo === AIChoosed.opponent.elo &&
            parsed.myColor === AIChoosed.color
          ) {
            console.log("🔄 [DEBUG] Restoring ongoing game from localStorage");

            game.loadPgn(parsed.pgn);

            // Rebuild fen history if not saved or just to be safe
            const tempGame = new Chess();
            const fens = [tempGame.fen()];
            game.history().forEach((move) => {
              tempGame.move(move);
              fens.push(tempGame.fen());
            });
            setFenHistory(fens);
            setCurrentMoveIndex(fens.length - 1);

            setGamePosition(game.fen());
            setStatusGame(parsed.statusGame);
            setMyColor(parsed.myColor);

            if (parsed.gameId) {
              setCurrentGameId(parsed.gameId);
            } else {
              const gameId = `vs-ai-${AIChoosed.opponent.name}-${AIChoosed.opponent.elo}-${timestamp}`;
              setCurrentGameId(gameId);
            }

            restored = true;
          }
        } catch (e) {
          console.error("Error restoring game:", e);
        }
      }
    }

    if (!restored) {
      const gameId = `vs-ai-${AIChoosed.opponent.name}-${AIChoosed.opponent.elo}-${timestamp}`;
      setCurrentGameId(gameId);

      setMyColor(AIChoosed.color);
      game.reset();
      setHeaderGameStart();
      setBeforeFen(game.fen());
      setGamePosition(game.fen());
      setFenHistory([game.fen()]);
      setCurrentMoveIndex(0);
      
      if (AIChoosed.color === "black") {
        setTimeout(() => {
          findEnemyMove();
        }, 1000);
      }
    }
    
    isGameInitialized.current = true;

    setHeightScreen(window?.innerHeight);
    setHeightBoard(refBoard.current?.clientHeight);
  }, [AIChoosed]);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;
    handleResize();
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted, hideDiv, is3DMode, isTutorialPlay]);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.2 : 480;

    const containerWidth = refBoard.current?.offsetWidth || width;
    const maxBoardWidth = Math.min(containerWidth - 40, 800);

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      // Reduce size factor during tutorial to ensure button visibility
      const sizeFactor = isTutorialPlay
        ? (width <= 430 ? 0.65 : 0.7)
        : (width <= 430 ? 0.85 : 0.9);
      setBoardSize(
        Math.min(maxSize, availableWidth * sizeFactor + 20, maxBoardWidth)
      );
    } else {
      const availableHeight = height - minPadding * 2;
      // Reduce board size during tutorial to ensure button visibility
      const heightFactor = isTutorialPlay ? 0.5 : 0.8;
      setBoardSize(Math.min(maxSize, availableHeight * heightFactor, maxBoardWidth));
    }
  };

  useEffect(() => {
    if (myColor === "black") {
      setOrientation("black");
    } else {
      setOrientation("white");
    }
  }, [myColor]);

  const handleSwitch = () => {
    setOrientation((prev) => {
      if (prev === "white") {
        return "black";
      } else {
        return "white";
      }
    });
  };

  const handleShare = async () => {
    try {
      const currentPgn = game.pgn();
      const currentFen = game.fen();
      setFen(currentFen);
      setPGN(currentPgn);
      setOpen(true);
    } catch (err) {}
  };

  const handleDownload = () => {
    if (game) {
      const currentPgn = game.pgn();
      const blob = new Blob([currentPgn], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const currentEpochTimeMs = Date.now();
      const fileName =
        AIChoosed.opponent.name +
        "_" +
        AIChoosed.opponent.elo +
        "_" +
        currentEpochTimeMs;
      a.download = fileName + ".pgn";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("Current PGN Downloaded!");
    }
  };

  const handleThreeD = () => {
    setIs3DMode(!is3DMode);
    const style = !is3DMode ? "3d" : "2d";
    setStyleChoosed(style);
  };

  const handleResign = () => {
    setStatusGame("Loss");
    setLossReason("resign");
    setTimeout(() => {
      setOpenGameStatus(true);
    }, 1000);
    const loserColorLocal = myColor;
    const winnerColorLocal = loserColorLocal === "white" ? "black" : "white";
    const losserColorLocal = loserColorLocal !== "white" ? "black" : "white";
    setHeaderGameFinish(winnerColorLocal);
    setWinnerColor(winnerColorLocal);
    setLoserColor(losserColorLocal);
  };

  const handleAnalyzeGame = () => {
    if (!isMember && !isMemberMonthly && token.balance <= 0) {
      setOpenPricing(true);
      return;
    }

    const buttonContent = getAnalysisButtonContent();
    buttonContent.onClick();
  };

  const handleRematch = () => {
    const timestamp = Date.now();
    const gameId = `vs-ai-${AIChoosed.opponent.name}-${AIChoosed.opponent.elo}-${timestamp}`;
    setCurrentGameId(gameId);

    // Close game end status dialog
    setOpenGameStatus(false);

    setStatusGame("Ongoing");
    game.reset();
    const initialFen = game.fen();
    setGamePosition(initialFen);
    setFenHistory([initialFen]);
    setCurrentMoveIndex(0);
    setHeaderGameStart();
    setLoserColor("");
    setWinnerColor("");
    setPreviousSquare(undefined);
    setCurrentSquare(undefined);
    setIsSaved(false);
    setHasAnalysis(false); // Reset analysis state for new game
  };

  const handleNewGame = () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    // Close game end status dialog
    setOpenGameStatus(false);

    // Reset game state (same as handleRematch)
    const timestamp = Date.now();
    const gameId = `vs-ai-${AIChoosed.opponent.name}-${AIChoosed.opponent.elo}-${timestamp}`;
    setCurrentGameId(gameId);

    setStatusGame("Ongoing");
    game.reset();
    const initialFen = game.fen();
    setGamePosition(initialFen);
    setFenHistory([initialFen]);
    setCurrentMoveIndex(0);
    setHeaderGameStart();
    setLoserColor("");
    setWinnerColor("");
    setPreviousSquare(undefined);
    setCurrentSquare(undefined);
    setIsSaved(false);
    setHasAnalysis(false);
    
    // Reset additional states
    setCapturedWhite([]);
    setCapturedBlack([]);
    setBestline("");
    setMoveClassification("");
    setPositionEvaluation(0);
    setPossibleMate("");
    setHintClicked(false);
    setMoveFrom("");
    setMoveTo(null);
    setRightClickedSquares({});
    setOptionSquares({});
    
    // Reset to 2D mode
    setIs3DMode(false);
    setStyleChoosed("2d");
    
    // Open dialog for new game selection
    setShowPlayVSAIModal(true);
  };

  const handleClosePlayVSAI = () => {
    setShowPlayVSAIModal(false);
  };

  const handlePlayVSAILimit = (isLimit: boolean) => {
    if (isLimit) {
      toast.error(
        "You have reached your play limit. Please upgrade to premium."
      );
      setOpenPricing(true);
    }
  };

  const handleSaveLog = async () => {
    const body = {
      enemyTag: AIChoosed.opponent.name,
      eloRating: AIChoosed.opponent.elo + "",
      totalMoves: Math.ceil(game.history().length / 2),
      totalTime: "10 Minutes",
      status: statusGame,
      pgn: game.pgn(),
    };
    setIsSaving(true);
    // handleSave();
    const res = await postVSAILogs(body);
    try {
      // Prefer the canonical PGN returned by the backend VS AI log,
      // so that analysis uses the exact same PGN as the imported
      // game history entry. This ensures game_histories.is_analysis
      // can be matched reliably via PGN hash.
      const vsAiPgn =
        (res as any)?.data?.pgn && typeof (res as any).data.pgn === "string"
          ? (res as any).data.pgn
          : null;
      setAnalysisPgn(vsAiPgn ?? game.pgn());
    } catch {
      setAnalysisPgn(game.pgn());
    }
    handleForceRefresh();
    setIsSaved(true);
    setIsSaving(false);
    loadLogs();
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      const currentPgn = game.pgn();
      const totalMoves = Math.ceil(game.history().length / 2);
      formData.append("pgn", currentPgn);
      // formData.append("totalMoves", totalMoves.toString());
      const response = await gameHistoryApi.importGame(
        "vsai",
        formData,
        sessionId ?? null
      );
      if (!response?.data) {
        toast.error("Save Failed !", response.data.message);
        throw new Error("Invalid response from server");
      }
      const gameData = { ...response.data, pgn: currentPgn };
      const newGame = addOtherImportedGame(gameData);
      setIsSaved(true);
      setIsSaving(false);
    } catch (err: any) {
    } finally {
    }
  };

  const checkStatusGame = () => {
    if (game.isGameOver()) {
      const loserColorLocal = game.turn();
      const winnerColorLocal = loserColorLocal === "w" ? "black" : "white";
      const losserColorLocal = loserColorLocal !== "w" ? "black" : "white";
      const isUserWin = myColor === winnerColorLocal;

      setWinnerColor(winnerColorLocal);
      setLoserColor(losserColorLocal);

      if (game.isCheckmate()) {
        const gameStatus = isUserWin ? "Win" : !isUserWin ? "Loss" : "Ongoing";
        const commentar =
          gameStatus === "Win" ? "checkmate-you" : "checkmate-opponent";
        setMoveClassification(commentar);
        setStatusGame(gameStatus);
        setLossReason("checkmate");
        setTimeout(() => {
          setHeaderGameFinish(winnerColorLocal);
          setOpenGameStatus(true);
        }, 1000);
      } else {
        setLossReason(null);
        setStatusGame("Draw");
        setTimeout(() => {
          setHeaderGameFinish("draw");
          setOpenGameStatus(true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (
      statusGame === "Win" ||
      statusGame === "Loss" ||
      statusGame === "Draw"
    ) {
      handleSaveLog();
    }
  }, [statusGame]);

  useEffect(() => {
    return () => {
      if (classificationTimeoutRef.current) {
        clearTimeout(classificationTimeoutRef.current);
      }
    };
  }, []);

  const onPieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square, piece: string) => {
      if (!isAtCurrentMove) {
        goToLatestMove();
        return false;
      }

      const isYourTurnLocal = myColor === "white" ? "w" : "b";
      const isMyTurn = game.turn() === isYourTurnLocal;

      if (statusGame !== "Ongoing") {
        return false;
      }

      // If it's opponent's turn, queue as pre-move
      if (!isMyTurn) {
        // Max 5 pre-moves
        if (preMoveQueue.length >= 5) {
          return false;
        }

        // Check if this exact pre-move already exists (toggle off)
        const existingIndex = preMoveQueue.findIndex(
          pm => pm.from === sourceSquare && pm.to === targetSquare
        );

        if (existingIndex >= 0) {
          // Remove this pre-move and all after it (cascade)
          setPreMoveQueue(prev => prev.slice(0, existingIndex));
        } else {
          // Add to queue
          setPreMoveQueue(prev => [...prev, {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // Default to queen for pre-move promotions
          }]);
        }

        return true; // Accept visually (piece returns to original square)
      }

      // Normal move - clear pre-moves and arrows
      setRightClickedSquares({} as Record<string, CSSProperties>);
      setUserDrawnArrows([]);
      setPreMoveQueue([]);
      setBestline("");

      const moves = game.moves({
        square: sourceSquare,
        verbose: true,
      }) as Array<{
        from: string;
        to: string;
        color: string;
        piece: string;
      }>;

      const foundMove = moves.find(
        (m) => m.from === sourceSquare && m.to === targetSquare
      );

      if (!foundMove) {
        return false;
      }

      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          targetSquare[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          targetSquare[1] === "1")
      ) {
        setMoveFrom(sourceSquare);
        setMoveTo(targetSquare);
        setShowPromotionDialog(true);
        return false;
      }

      setBeforeFen(game.fen());
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        return false;
      }

      setMoveData(move);
      playSound(game, move);
      setMoveClassification("");

      const newFen = game.fen();
      setGamePosition(newFen);
      updateFenHistory(newFen);
      setAfterFen(newFen);

      if (!isMobile) {
        getClassificationMove(move);
      } else {
        setShouldTriggerAI(true);
      }

      setPreviousSquare(sourceSquare);
      setCurrentSquare(targetSquare);
      setCurrentTurn((turnColor) =>
        turnColor !== "White" ? "White" : "Black"
      );
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});

      return true;
    },
    [
      game,
      myColor,
      statusGame,
      setMoveFrom,
      setMoveTo,
      setShowPromotionDialog,
      setGamePosition,
      setCurrentTurn,
      setOptionSquares,
      getClassificationMove,
      setMoveData,
      setBeforeFen,
      setAfterFen,
      setPreviousSquare,
      setCurrentSquare,
      setMoveClassification,
      setBestline,
      setRightClickedSquares,
      isMobile,
      isAtCurrentMove,
      goToLatestMove,
      updateFenHistory,
      preMoveQueue,
    ]
  );

  const fetchPgnLocal = async () => {
    const headers = game.getHeaders();
    const dataGames = {
      white: {
        result: headers.Result === "0-1" ? "lose" : "win",
        username: headers.White,
      },
      black: {
        result: headers.Result === "0-1" ? "win" : "lose",
        username: headers.Black,
      },
      date: formatDatePgn(),
    };
    setDataGamesImport(dataGames);
    let arr = null;
    try {
      setIsLoading(true);
      setDataAnalysis(arr);
      setPgn(game.pgn());
      const responseAnalysis = await proceedAnalysis(
        game.pgn(),
        username,
        depthLevel,
        60000
      );
      setDataAnalysis(responseAnalysis.data);
      arr = responseAnalysis.data;
    } catch (err) {
      toast.error(err + "");
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      if (arr !== null) {
        router.push("/analysis");
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Always default to 2D mode for Play vs AI
    setIs3DMode(false);
    setStyleChoosed("2d");
  }, []);

  const fetchLastAnalysis = async (pgnHash: string): Promise<any> => {
    try {
      const endpoint =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
      const response = await fetch(
        `${endpoint}/v2/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch analysis: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching last analysis:", error);
      return null;
    }
  };

  const fetchLastAnalysisV3 = async (pgnHash: string): Promise<any> => {
    try {
      const endpoint =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
      const response = await fetch(
        `${endpoint}/v3/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch v3 analysis: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching v3 last analysis:", error);
      return null;
    }
  };

  // Handle "Show Analysis" click
  const handleShowAnalysis = async () => {
    try {
      const job = getJobByGameId(gameFromPgn.id);
      const pgnHash = createPgnHash(gameFromPgn.pgn);

      console.log("🔍 [handleShowAnalysis] Starting analysis fetch for game:", gameFromPgn.id);
      console.log("🔍 [handleShowAnalysis] Job from store:", job);

      // Fetch from both v2 and v3 endpoints in parallel
      const [v2Analysis, v3Analysis] = await Promise.all([
        fetchLastAnalysis(pgnHash),
        fetchLastAnalysisV3(pgnHash)
      ]);

      console.log("📥 [handleShowAnalysis] V2 Analysis response:", v2Analysis);
      console.log("📥 [handleShowAnalysis] V3 Analysis response:", v3Analysis);

      // Prioritize job result over API response for v2 analysis
      let finalV2Data = v2Analysis;
      if (job && job.result && job.status === "completed") {
        console.log("✅ [handleShowAnalysis] Using job result for v2 analysis data");
        finalV2Data = {
          success: true,
          data: job.result
        };
      }

      // Store both v2 and v3 results
      setV2AnalysisData(finalV2Data);
      setShortAnalysisData(v3Analysis);

      console.log("💾 [handleShowAnalysis] Final V2 data set:", finalV2Data);
      console.log("💾 [handleShowAnalysis] V3 data set:", v3Analysis);

      if (v3Analysis?.success && v3Analysis.data) {
        console.log("✅ [handleShowAnalysis] V3 analysis found, opening ChooseAnalysisMode");
        // Open ChooseAnalysisMode dialog with both v2 and v3 data
        setIsChooseAnalysisModeOpen(true);
      } else if (finalV2Data?.success && finalV2Data.data) {
        console.log("✅ [handleShowAnalysis] Only V2 analysis found, navigating directly to /analysis");
        setPgn(gameFromPgn.pgn);
        setDataGamesImport(gameFromPgn);
        setDataAnalysis(finalV2Data.data);
        setIsFromGameHistory(true);

        router.push("/analysis");
      } else {
        if (job && job.result) {
          console.log("✅ [handleShowAnalysis] Using job result as fallback");
          setPgn(gameFromPgn.pgn);
          setDataGamesImport(gameFromPgn);
          setDataAnalysis(job.result);
          setIsFromGameHistory(true);

          router.push("/analysis");
        } else {
          console.log("⚠️ [handleShowAnalysis] No analysis data found, opening analyze dialog");
          setIsAnalyzeOpen(true);
        }
      }
    } catch (error) {
      console.error("❌ [handleShowAnalysis] Error:", error);
      const job = getJobByGameId(gameFromPgn.id);

      if (job && job.result) {
        console.log("📦 [handleShowAnalysis] Using job result as error fallback");
        setPgn(gameFromPgn.pgn);
        setDataGamesImport(gameFromPgn);
        setDataAnalysis(job.result);
        setIsFromGameHistory(true);
        router.push("/analysis");
      } else {
        console.error("❌ [handleShowAnalysis] No fallback data available");
      }
    }
  };

  useEffect(() => {
    const isCompleted = Object.values(analysisJobs).filter(
      (gameData) => gameData.status == "completed"
    );

    if (totalCompletedJobs < isCompleted.length) {
      setTotalCompletedJobs(isCompleted.length);
      getTokenBalance({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setToken(data);
        }
      });
    }
  }, [analysisJobs]);
  const getAnalysisButtonContent = () => {
    const job = getJobByGameId(currentGameId);
    const currentPgn = analysisPgn ?? game.pgn();

    if (job && job.status === "completed") {
      return {
        text: "View Results",
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
        className: "bg-green-600 hover:bg-green-700 text-white",
        onClick: async () => {
          try {
            const pgnHash = createPgnHash(currentPgn);
            
            // Fetch from both v2 and v3 endpoints in parallel
            const [v2Analysis, v3Analysis] = await Promise.all([
              fetchLastAnalysis(pgnHash),
              fetchLastAnalysisV3(pgnHash)
            ]);

            // Store both v2 and v3 results
            setV2AnalysisData(v2Analysis);
            setShortAnalysisData(v3Analysis);

            if (v3Analysis?.success && v3Analysis.data) {
              // Open ChooseAnalysisMode dialog with both v2 and v3 data
              setIsChooseAnalysisModeOpen(true);
            } else if (v2Analysis?.success && v2Analysis.data) {
              setPgn(currentPgn);
              const gameData = {
                id: currentGameId,
                white: {
                  result:
                    game.header().Result === "0-1"
                      ? "lose"
                      : game.header().Result === "1-0"
                      ? "win"
                      : "draw",
                  username: game.header().White,
                },
                black: {
                  result:
                    game.header().Result === "1-0"
                      ? "lose"
                      : game.header().Result === "0-1"
                      ? "win"
                      : "draw",
                  username: game.header().Black,
                },
                date: formatDatePgn(),
                pgn: currentPgn,
                username: username,
              };
              setDataGamesImport(gameData);
              setDataAnalysis(v2Analysis.data);
              router.push("/analysis");
            } else {
              if (job && job.result) {
                setPgn(currentPgn);
                const gameData = {
                  id: currentGameId,
                  white: {
                    result:
                      game.header().Result === "0-1"
                        ? "lose"
                        : game.header().Result === "1-0"
                        ? "win"
                        : "draw",
                    username: game.header().White,
                  },
                  black: {
                    result:
                      game.header().Result === "1-0"
                        ? "lose"
                        : game.header().Result === "0-1"
                        ? "win"
                        : "draw",
                    username: game.header().Black,
                  },
                  date: formatDatePgn(),
                  pgn: currentPgn,
                  username: username,
                };
                setDataGamesImport(gameData);
                setDataAnalysis(job.result);
                router.push("/analysis");
              } else {
                setIsAnalyzeOpen(true);
              }
            }
          } catch (error) {
            if (job && job.result) {
              setPgn(currentPgn);
              const gameData = {
                id: currentGameId,
                white: {
                  result:
                    game.header().Result === "0-1"
                      ? "lose"
                      : game.header().Result === "1-0"
                      ? "win"
                      : "draw",
                  username: game.header().White,
                },
                black: {
                  result:
                    game.header().Result === "1-0"
                      ? "lose"
                      : game.header().Result === "0-1"
                      ? "win"
                      : "draw",
                  username: game.header().Black,
                },
                date: formatDatePgn(),
                pgn: currentPgn,
                username: username,
              };
              setDataGamesImport(gameData);
              setDataAnalysis(job.result);
              router.push("/analysis");
            } else {
              setIsAnalyzeOpen(true);
            }
          }
        },
      };
    }

    if (job) {
      switch (job.status) {
        case "pending":
        case "processing": {
          const pct =
            job.progress > 0 ? `In Progress ${job.progress}%` : "In Progress";
          return {
            text: pct,
            icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />,
            className: "bg-yellow-500 hover:bg-yellow-600 text-white",
            onClick: () => {},
            disabled: true,
          };
        }
        case "finalizing":
          return {
            text: "Finalizing...",
            icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />,
            className: "bg-blue-500 hover:bg-blue-600 text-white",
            onClick: () => {},
            disabled: true,
          };
        case "failed":
          return {
            text: "Retry",
            icon: <AlertCircle className="h-4 w-4 mr-1" />,
            className: "bg-red-600 hover:bg-red-700 text-white",
            onClick: () => setIsAnalyzeOpen(true),
            disabled: false,
          };
      }
    }

    return {
      text: "Analyze now",
      icon: <ChartNoAxesColumn className="h-4 w-4 mr-1" />,
      className: "btn-primary text-white",
      onClick: () => setIsAnalyzeOpen(true),
      disabled: false,
    };
  };

  return (
    <div className="flex flex-col xl:flex-row w-full bg-white p-0 sm:p-4 gap-4 lg:mt-8 xl:mt-0">
      {!isTutorialPlay && <GameEndStatus gameStatus={statusGame.toLowerCase()} />}
      <AnalyzeGameHistory
        open={isAnalyzeOpen}
        onOpenChange={(open) => {
          setIsAnalyzeOpen(open);
        }}
        game={gameFromPgn}
        onAnalysisStarted={() => {
          setIsChooseAnalysisModeOpen(true);
        }}
        onShortAnalysisReceived={(data) => {
          setShortAnalysisData(data);

          // Also get v2 analysis from job store if available
          const job = getJobByGameId(gameFromPgn.id);
          if (job && job.result) {
            setV2AnalysisData({ success: true, data: job.result });
          }
        }}
      />
      <ChooseAnalysisMode
        open={isChooseAnalysisModeOpen}
        onOpenChange={setIsChooseAnalysisModeOpen}
        game={gameFromPgn}
        shortAnalysisData={shortAnalysisData}
        v2AnalysisData={v2AnalysisData}
        onOpenProcessingMode={() => {
          setProcessingAnalysisModeOpen(true);
        }}
        onOpenGameAnalysis={(v3Result) => {
          setV3AnalysisResult(v3Result);
          setGameAnalysisOpen(true);
        }}
      />
      <ProcessingAnalysisMode
        open={processingAnalysisModeOpen}
        onOpenChange={setProcessingAnalysisModeOpen}
        game={gameFromPgn}
        onOpenGameAnalysis={(v3Result) => {
          setV3AnalysisResult(v3Result);
          setGameAnalysisOpen(true);
        }}
      />
      <GameAnalysis
        open={gameAnalysisOpen}
        onOpenChange={setGameAnalysisOpen}
        v3Result={v3AnalysisResult}
        isTutorialPlay={isTutorialPlay}
        playerColor={myColor as "white" | "black"}
      />
      
      {/* New Game Dialog */}
      <StartPlayVSAI
        visible={showPlayVSAIModal}
        onClose={handleClosePlayVSAI}
        onLimit={handlePlayVSAILimit}
      />

      <div className="flex flex-col w-full gap-y-2 ">
        {/* <div className="xl:hidden flex flex-row items-center justify-between sm:mb-2 pt-[32px] p-4 sm:p-0 border-b sm:border-none"> */}
        <div className="hidden flex-row items-center justify-between sm:mb-2 pt-[32px] p-4 sm:p-0 border-b sm:border-none">
          <button onClick={() => router.push("/playground/play-vs-ai")}>
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
            <span className="font-semibold text-[18px]">You vs AI</span>
          </div>
          <div className="flex " />
        </div>

        <div className="hidden sm:block rounded-[8px] min-h-[54px] bg-[#FAFDFF] border border-[#DEDEDE] p-4">
          <div className="flex items-center justify-center rounded-[6px] bg-white shadow-md border border-[#DEDEDE] px-4 py-2">
            <span className="text-[14px] --xs font-normal">
              Current Turn:{" "}
              <span className="text-[14px] font-medium">
                {game.turn() === "w" ? "White" : "Black"}
              </span>
            </span>
          </div>
        </div>

        <div
          className="xl:border xl:border-[#DEDEDE] xl:p-4 xl:rounded-[16px]"
          ref={refBoard}
        >
          {orientation !== "white" ? (
            <div className="hidden sm:block">
              <WhitePlayer
                myColor={myColor}
                statusGame={statusGame}
                capturedWhite={capturedWhite}
                winnerColor={winnerColor}
                loserColor={loserColor}
                AIChoosed={AIChoosed}
                PieceChoosed={PieceChoosed}
              />
            </div>
          ) : (
            <div className="hidden sm:block">
              <BlackPlayer
                myColor={myColor}
                statusGame={statusGame}
                capturedBlack={capturedBlack}
                winnerColor={winnerColor}
                loserColor={loserColor}
                AIChoosed={AIChoosed}
                PieceChoosed={PieceChoosed}
              />
            </div>
          )}

          
            <div className="w-full flex justify-between md:justify-end items-center px-[16px] mt-[24px] md:mt-0 md:px-0">
              <div className="flex items-center gap-[8px] md:hidden">
                <button onClick={() => router.push("/playground/play-vs-ai")}>
                  <ArrowLeft color="black" size={24} />
                </button>

                <span>{username} ({orientation}) vs {AIChoosed.opponent.name.replace(/ .*/, "")}</span>
              </div>
              <div className="flex items-center justify-between md:mb-[16px] sm:px-0">
                {(orientation as string) !== myColor &&
                  moveClassification !== "" &&
                  moveClassification !== "excellent-move" &&
                  moveClassification !== "neutral-move" &&
                  moveClassification !== "inaccuracy-move" ? (
                    <div className="hidden sm:block">
                      <CommentaryMove classify={moveClassification} />
                    </div>
                  ) : (
                    <div />
                  )}

                  <ButtonBoard
                    handleSwitch={handleSwitch}
                    handleThreeD={handleThreeD}
                    is3DMode={is3DMode}
                    boardSize={boardSize}
                  />
              </div>
            </div>

          <MobileCapturedPieces
            capturedWhite={capturedWhite}
            capturedBlack={capturedBlack}
            PieceChoosed={PieceChoosed}
          />

          <div className="flex flex-col justify-center items-center gap-3">
            {/* <motion.div
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
                  arePiecesDraggable={false}
                  arePiecesClickable={
                    statusGame === "Ongoing" && isAtCurrentMove
                  }
                  orientation={orientation}
                  boardWidth={boardSize}
                  position={gamePosition}
                  onSquareClick={
                    game.turn() === isYourTurn ? onSquareClick : () => null
                  }
                  onSquareRightClick={onSquareRightClick}
                  onPromotionPieceSelect={onPromotionPieceSelect}
                  customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                    ...preMoveSquareStyles,
                    ...prevCurrentColor,
                  }}
                  areArrowsAllowed={true}
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
                />
              )}
            </motion.div> */}

            {isTutorialPlay ? (
              <Image src={"/images/wood.png"} alt="tutorial" width={600} height={645} className="w-[80%]" />
            ) : (
              <>
                <motion.div
                  style={{
                    width: boardSize,
                    display: !is3DMode ? "flex" : "none",
                    backfaceVisibility: "hidden",
                    position: "relative",
                  }}
                  onMouseDown={handleBoardMouseDown}
                  onMouseUp={handleBoardMouseUp}
                  onContextMenu={handleBoardContextMenu}
                >
                  {/* {!is3DMode && (
                      <> */}
                        <TwoDChessboard
                          game={game}
                          gameStatus={statusGame.toLowerCase()}
                          setOptionSquares={setOptionSquares}
                          arePiecesDraggable={isAtCurrentMove}
                        onPieceDrop={onPieceDrop}
                        arePiecesClickable={
                          statusGame === "Ongoing" && isAtCurrentMove
                        }
                        orientation={orientation}
                        boardWidth={boardSize}
                        position={gamePosition}
                        onSquareClick={
                          game.turn() === isYourTurn ? onSquareClick : () => null
                        }
                        onSquareRightClick={onSquareRightClick}
                        onPromotionPieceSelect={onPromotionPieceSelect}
                        customSquareStyles={{
                          ...moveSquares,
                          ...optionSquares,
                          ...rightClickedSquares,
                          ...preMoveSquareStyles,
                          ...prevCurrentColor,
                        }}
                        areArrowsAllowed={false}
                        promotionToSquare={moveTo}
                        showPromotionDialog={showPromotionDialog}
                      />
                      {(customArrowsConfig.length > 0 || userDrawnArrows.length > 0 || preMoveArrows.length > 0) && (
                        <CustomChessArrows
                          arrows={[...customArrowsConfig, ...userDrawnArrows, ...preMoveArrows]}
                          boardSize={boardSize}
                          orientation={orientation}
                        />
                      )}
                    {/* </>
                  )} */}
                </motion.div>
              </>
            )}

          </div>

          <div className="sm:hidden flex flex-col gap-4 mt-4">
            {isTutorialPlay || statusGame !== "Ongoing" && (
              <div className="flex justify-center items-center">
                <CommentarGame
                  statusGame={statusGame}
                  lossReason={lossReason}
                />
              </div>
            )}

            {isTutorialPlay && (
              <>
                <div className="flex justify-center items-center">
                  <CommentarGame
                    statusGame={"Win"}
                    lossReason={"checkmate"}
                  />
                </div>
                <ButtonFinish
                  pgn={game.pgn()}
                  handleAnalyzeGame={handleAnalyzeGame}
                  handleNewGame={handleNewGame}
                  handleRematch={handleRematch}
                  handleShare={handleShare}
                  handleDownload={handleDownload}
                  handleSave={handleSave}
                  isSaved={isSaved}
                  isSaving={isSaving}
                  hasAnalysis={hasAnalysis}
                  onAnalyzeClick={() => {
                    setIsAnalyzeOpen(true);
                  }}
                  onShowAnalysisClick={handleShowAnalysis}
                />
              </>
              
            )}

            {!game.isGameOver() && (
                  // <div className="flex flex-row justify-center items-center gap-2 px-4">
                  <div className="flex flex-row justify-center items-center gap-[12px] px-[16px]">
                    <button
                      disabled={game.history().length === 0}
                      // disabled={true}
                      onClick={handleUndo}
                      className={`rounded-[4px] w-1/2 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.182858 7.31768L6.43286 13.5677C6.52027 13.6552 6.63168 13.7148 6.75298 13.7389C6.87428 13.7631 7.00003 13.7507 7.11429 13.7034C7.22855 13.656 7.3262 13.5759 7.39487 13.473C7.46354 13.3701 7.50014 13.2492 7.50005 13.1255V10.0185C11.961 10.2716 15.0196 13.1646 15.8782 14.081C16.013 14.2249 16.1898 14.3227 16.3834 14.3604C16.577 14.3981 16.7776 14.3737 16.9566 14.2908C17.1355 14.2079 17.2838 14.0707 17.3803 13.8986C17.4767 13.7266 17.5164 13.5285 17.4938 13.3325C17.204 10.8122 15.8235 8.38799 13.6063 6.50674C11.7649 4.94424 9.52661 3.95284 7.50005 3.7794V0.625492C7.50014 0.501807 7.46354 0.380875 7.39487 0.278003C7.3262 0.175132 7.22855 0.0949484 7.11429 0.0476031C7.00003 0.000257809 6.87428 -0.0121201 6.75298 0.0120364C6.63168 0.0361929 6.52027 0.0957976 6.43286 0.183305L0.182858 6.4333C0.124748 6.49135 0.0786476 6.56028 0.0471954 6.63615C0.0157433 6.71203 -0.000444412 6.79336 -0.000444412 6.87549C-0.000444412 6.95763 0.0157433 7.03896 0.0471954 7.11483C0.0786476 7.1907 0.124748 7.25963 0.182858 7.31768Z" fill="black"/>
                      </svg>
                      {/* <ChevronLeft size={24} color="#000" /> */}
                    </button>
                    {/* <button
                      disabled={true}
                      onClick={handleRedo}
                      className={`rounded-[4px] w-1/3 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-[1]">
                        <path d="M0.182858 7.31768L6.43286 13.5677C6.52027 13.6552 6.63168 13.7148 6.75298 13.7389C6.87428 13.7631 7.00003 13.7507 7.11429 13.7034C7.22855 13.656 7.3262 13.5759 7.39487 13.473C7.46354 13.3701 7.50014 13.2492 7.50005 13.1255V10.0185C11.961 10.2716 15.0196 13.1646 15.8782 14.081C16.013 14.2249 16.1898 14.3227 16.3834 14.3604C16.577 14.3981 16.7776 14.3737 16.9566 14.2908C17.1355 14.2079 17.2838 14.0707 17.3803 13.8986C17.4767 13.7266 17.5164 13.5285 17.4938 13.3325C17.204 10.8122 15.8235 8.38799 13.6063 6.50674C11.7649 4.94424 9.52661 3.95284 7.50005 3.7794V0.625492C7.50014 0.501807 7.46354 0.380875 7.39487 0.278003C7.3262 0.175132 7.22855 0.0949484 7.11429 0.0476031C7.00003 0.000257809 6.87428 -0.0121201 6.75298 0.0120364C6.63168 0.0361929 6.52027 0.0957976 6.43286 0.183305L0.182858 6.4333C0.124748 6.49135 0.0786476 6.56028 0.0471954 6.63615C0.0157433 6.71203 -0.000444412 6.79336 -0.000444412 6.87549C-0.000444412 6.95763 0.0157433 7.03896 0.0471954 7.11483C0.0786476 7.1907 0.124748 7.25963 0.182858 7.31768Z" fill="black"/>
                      </svg>
                      <ChevronRight size={24} color="#000" />
                    </button> */}
                    <button
                      onClick={handleReset}
                      className="rounded-[4px] w-1/2 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50"
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
                      {/* <RotateCw size={20} color="#000" /> */}
                    </button>
                    
                    {/* <button
                      disabled={game.history().length === 0}
                      onClick={handleUndo}
                      className={`rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                        game.history().length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <ChevronLeft size={20} color="#000" />
                    </button>
                    <button
                      disabled={true}
                      onClick={handleRedo}
                      className={`rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9] opacity-50 cursor-not-allowed`}
                    >
                      <ChevronRight size={20} color="#000" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
                    >
                      <RotateCw size={20} color="#000" />
                    </button> */}
                  </div>
                )}

            {statusGame === "Ongoing" ? (
              <ButtonPlaying
                handleHint={handleHint}
                handleNewGame={handleNewGame}
                handleResign={handleResign}
                myColor={myColor}
                currentTurn={currentTurn}
                bestLine={bestLine}
                hintClicked={hintClicked}
              />
            ) : (
              <ButtonFinish
                pgn={game.pgn()}
                handleAnalyzeGame={handleAnalyzeGame}
                handleNewGame={handleNewGame}
                handleRematch={handleRematch}
                handleShare={handleShare}
                handleDownload={handleDownload}
                handleSave={handleSave}
                isSaved={isSaved}
                isSaving={isSaving}
                hasAnalysis={hasAnalysis}
                onAnalyzeClick={() => {
                  setIsAnalyzeOpen(true);
                }}
                onShowAnalysisClick={handleShowAnalysis}
              />
            )}

            <div className="flex bg-[#F7FCFF] border-b border-gray-200">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 relative ${
                  selectedTab === "current" ? "" : ""
                }`}
                onClick={() => setSelectedTab("current")}
              >
                <Image
                  src={`/images/play-vs-ai/chess-king-rook${
                    selectedTab === "current" ? `-active` : ``
                  }.png`}
                  alt="icon"
                  width={19}
                  height={19}
                  className="object-contain"
                />
                <span
                  className={`text-[14px] --sm font-semibold ${
                    selectedTab === "current" ? `text-[#221AE9]` : `text-black`
                  }`}
                >
                  Current Game
                </span>
                {selectedTab === "current" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#221AE9]"></div>
                )}
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 relative ${
                  selectedTab === "past" ? "" : ""
                }`}
                onClick={() => setSelectedTab("past")}
              >
                <Image
                  src={`/images/play-vs-ai/past-games${
                    selectedTab === "past" ? `-active` : ``
                  }.png`}
                  alt="icon"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <span
                  className={`text-[14px] --sm font-semibold ${
                    selectedTab === "past" ? `text-[#221AE9]` : `text-black`
                  }`}
                >
                  Past Games
                </span>
                {selectedTab === "past" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#221AE9]"></div>
                )}
              </button>
            </div>

            {selectedTab === "current" ? (
              <>
                <div className="px-4">
                  <MobileMoveBoxes
                    capturedWhite={capturedWhite}
                    capturedBlack={capturedBlack}
                    statusGame={statusGame}
                  />
                </div>
              </>
            ) : (
              <div className="bg-white border border-[#DEDEDE] rounded-[16px] p-4">
                {isLoading && <DotSpinner />}
                <div className="max-h-[400px] overflow-y-auto">
                  {pastGames.map((past, index) => (
                    <GameCard
                      key={index}
                      result={
                        past.status.toLowerCase() === "Ongoing"
                          ? "loss"
                          : past.status.toLowerCase()
                      }
                      date={past.updatedAt}
                      opponent={past.enemyTag}
                      elo={past.eloRating}
                      moves={past.totalMoves}
                      time={past.totalTime}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            {(orientation as string) === myColor &&
            moveClassification !== "" &&
            moveClassification !== "excellent-move" &&
            moveClassification !== "neutral-move" &&
            moveClassification !== "inaccuracy-move" ? (
              <div className="hidden sm:block">
                <CommentaryMove classify={moveClassification} />
              </div>
            ) : (
              <div />
            )}
            <div />
          </div>

          {orientation === "white" ? (
            <div className="hidden sm:block">
              <WhitePlayer
                myColor={myColor}
                statusGame={statusGame}
                capturedWhite={capturedWhite}
                winnerColor={winnerColor}
                loserColor={loserColor}
                AIChoosed={AIChoosed}
                PieceChoosed={PieceChoosed}
              />
            </div>
          ) : (
            <div className="hidden sm:block">
              <BlackPlayer
                myColor={myColor}
                statusGame={statusGame}
                capturedBlack={capturedBlack}
                winnerColor={winnerColor}
                loserColor={loserColor}
                AIChoosed={AIChoosed}
                PieceChoosed={PieceChoosed}
              />
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:block w-full">
        <div className="flex justify-start gap-[14px] mb-[16px] min-h-54px rounded-[8px] min-h-[54px] bg-[#FAFDFF] border border-[#DEDEDE] p-4">
          <button onClick={() => router.push("/playground/play-vs-ai")}>
            <ArrowLeft color="black" size={24} />
          </button>

          <div className="flex flex-row justify-center items-center gap-2">
            <Image
              src={"/images/play-vs-ai/icon-play-vs-ai.png"}
              alt="icon"
              width={22}
              height={21}
              className="w-[22px] h-[21px] object-contain"
            />
            <span className="font-semibold text-[18px]">You vs AI</span>
          </div>
        </div>


        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 min-h-[68px] rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-2 gap-2">
            <TabsTrigger
              value="current"
              className={`gap-2 py-2 ${
                selectedTab === "current"
                  ? `shadow-md border border-[#DEDEDE]`
                  : ``
              }`}
              onClick={() => setSelectedTab("current")}
            >
              <Image
                src={`/images/play-vs-ai/chess-king-rook${
                  selectedTab === "current" ? `-active` : ``
                }.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[19px] h-[19px] object-contain"
              />
              <span
                className={`text-[16px] font-semibold ${
                  selectedTab === "current" ? `text-[#221AE9]` : `text-black`
                }`}
              >
                Current Game
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className={`gap-2 py-2 ${
                selectedTab === "past"
                  ? `shadow-md border border-[#DEDEDE]`
                  : ``
              }`}
              onClick={() => setSelectedTab("past")}
            >
              <Image
                src={`/images/play-vs-ai/past-games${
                  selectedTab === "past" ? `-active` : ``
                }.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] object-contain"
              />
              <span
                className={`text-[16px] font-semibold ${
                  selectedTab === "past" ? `text-[#221AE9]` : `text-black`
                }`}
              >
                Past Games
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="gap-2">
            <div
              className="lg:max-h-[625px] xxl:max-h-[675px] h-auto flex flex-col items-center justify-between rounded-[16px] border border-[#DEDEDE] gap-2 mt-4"
              // style={{ height: isTutorialPlay ? 'auto' : heightBoard }}
            >
              <div ref={movementDetailsRef} className="flex flex-col px-4 w-full overflow-y-auto ">
                <span className="font-semibold text-center text-[16px] my-2 xl:my-4">
                  Movement Details
                </span>
                <TableMovement
                  myColor={myColor}
                  capturedWhite={capturedWhite}
                  capturedBlack={capturedBlack}
                  PieceChoosed={PieceChoosed}
                />

                {!game.isGameOver() && (
                  <div className="flex flex-row justify-center items-center gap-[12px] my-[16px]">
                    <button
                      disabled={game.history().length === 0}
                      // disabled={true}
                      onClick={handleUndo}
                      className={`rounded-[4px] w-1/2 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.182858 7.31768L6.43286 13.5677C6.52027 13.6552 6.63168 13.7148 6.75298 13.7389C6.87428 13.7631 7.00003 13.7507 7.11429 13.7034C7.22855 13.656 7.3262 13.5759 7.39487 13.473C7.46354 13.3701 7.50014 13.2492 7.50005 13.1255V10.0185C11.961 10.2716 15.0196 13.1646 15.8782 14.081C16.013 14.2249 16.1898 14.3227 16.3834 14.3604C16.577 14.3981 16.7776 14.3737 16.9566 14.2908C17.1355 14.2079 17.2838 14.0707 17.3803 13.8986C17.4767 13.7266 17.5164 13.5285 17.4938 13.3325C17.204 10.8122 15.8235 8.38799 13.6063 6.50674C11.7649 4.94424 9.52661 3.95284 7.50005 3.7794V0.625492C7.50014 0.501807 7.46354 0.380875 7.39487 0.278003C7.3262 0.175132 7.22855 0.0949484 7.11429 0.0476031C7.00003 0.000257809 6.87428 -0.0121201 6.75298 0.0120364C6.63168 0.0361929 6.52027 0.0957976 6.43286 0.183305L0.182858 6.4333C0.124748 6.49135 0.0786476 6.56028 0.0471954 6.63615C0.0157433 6.71203 -0.000444412 6.79336 -0.000444412 6.87549C-0.000444412 6.95763 0.0157433 7.03896 0.0471954 7.11483C0.0786476 7.1907 0.124748 7.25963 0.182858 7.31768Z" fill="black"/>
                      </svg>
                      {/* <ChevronLeft size={24} color="#000" /> */}
                    </button>
                    {/* <button
                      disabled={true}
                      onClick={handleRedo}
                      className={`rounded-[4px] w-1/3 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-[1]">
                        <path d="M0.182858 7.31768L6.43286 13.5677C6.52027 13.6552 6.63168 13.7148 6.75298 13.7389C6.87428 13.7631 7.00003 13.7507 7.11429 13.7034C7.22855 13.656 7.3262 13.5759 7.39487 13.473C7.46354 13.3701 7.50014 13.2492 7.50005 13.1255V10.0185C11.961 10.2716 15.0196 13.1646 15.8782 14.081C16.013 14.2249 16.1898 14.3227 16.3834 14.3604C16.577 14.3981 16.7776 14.3737 16.9566 14.2908C17.1355 14.2079 17.2838 14.0707 17.3803 13.8986C17.4767 13.7266 17.5164 13.5285 17.4938 13.3325C17.204 10.8122 15.8235 8.38799 13.6063 6.50674C11.7649 4.94424 9.52661 3.95284 7.50005 3.7794V0.625492C7.50014 0.501807 7.46354 0.380875 7.39487 0.278003C7.3262 0.175132 7.22855 0.0949484 7.11429 0.0476031C7.00003 0.000257809 6.87428 -0.0121201 6.75298 0.0120364C6.63168 0.0361929 6.52027 0.0957976 6.43286 0.183305L0.182858 6.4333C0.124748 6.49135 0.0786476 6.56028 0.0471954 6.63615C0.0157433 6.71203 -0.000444412 6.79336 -0.000444412 6.87549C-0.000444412 6.95763 0.0157433 7.03896 0.0471954 7.11483C0.0786476 7.1907 0.124748 7.25963 0.182858 7.31768Z" fill="black"/>
                      </svg>
                      <ChevronRight size={24} color="#000" />
                    </button> */}
                    <button
                      onClick={handleReset}
                      className="rounded-[4px] w-1/2 h-[32px] flex justify-center items-center bg-[rgb(34,26,233,.2)] border border-[#221AE9] disabled:bg-[#c0ced4] disabled:border-[#737c7f] disabled:cursor-not-allowed disabled:opacity-50"
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
                      {/* <RotateCw size={20} color="#000" /> */}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center w-full gap-2">
                {statusGame !== "Ongoing" && (
                  <CommentarGame
                    lossReason={lossReason}
                    statusGame={statusGame}
                  />
                )}
                {statusGame === "Ongoing" && !isTutorialPlay ? (
                  <ButtonPlaying
                    handleHint={handleHint}
                    handleNewGame={handleNewGame}
                    handleResign={handleResign}
                    myColor={myColor}
                    currentTurn={currentTurn}
                    bestLine={bestLine}
                    hintClicked={hintClicked}
                  />
                ) : (
                  <ButtonFinish
                    pgn={game.pgn()}
                    handleAnalyzeGame={handleAnalyzeGame}
                    handleNewGame={handleNewGame}
                    handleRematch={handleRematch}
                    handleShare={handleShare}
                    handleDownload={handleDownload}
                    handleSave={handleSave}
                    isSaved={isSaved}
                    isSaving={isSaving}
                    hasAnalysis={hasAnalysis}
                    onAnalyzeClick={() => {
                      setIsAnalyzeOpen(true);
                    }}
                    onShowAnalysisClick={handleShowAnalysis}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past" className="gap-2">
            <div className="flex flex-col py-4 rounded-[16px] bg-white border border-[#DEDEDE] gap-2">
              {isLoading && <DotSpinner />}
              <div
                style={{ height: heightScreen * 0.75 }}
                className="px-4 w-full xl:max-h-[80vh] overflow-y-auto"
              >
                {pastGames.map((past, index) => {
                  return (
                    <GameCard
                      key={index}
                      result={
                        past.status.toLowerCase() === "Ongoing"
                          ? "loss"
                          : past.status.toLowerCase()
                      }
                      date={past.updatedAt}
                      opponent={past.enemyTag}
                      elo={past.eloRating}
                      moves={past.totalMoves}
                      time={past.totalTime}
                    />
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
