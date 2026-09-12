"use client";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import {
  clearSavedVsAiGame,
  usePlayVSAIStore,
  VS_AI_CURRENT_GAME_KEY,
} from "@/app/store/playVSAI";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import GameCard from "@/components/playground/play-vs-ai/GameCard";
import { Engine } from "@/components/playground/src/lib/stockfish";
import { motion } from "@/utils/motion";
import { useGameEndStatus } from "@/app/store/gameEndStatus";
import {
  getLocalDateStamp,
  recordStreakPlayOnce,
  useStreakStore,
} from "@/app/store/streak";
import {
  CELEBRATION_LOTTIE,
  REWARD_LOTTIE,
  DayStreakModal,
} from "@/components/v2/day-streak-modal";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { refreshTokenBalance, useProfileStore } from "@/app/store/profile";
import { useShareGame } from "@/app/store/shareGame";
import { usePgnStore } from "@/app/store/zustandStore";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import DotSpinner from "@/components/game-history/Spinner";
import { GameEndStatus } from "@/components/modal/GameEndStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiClient } from "@/functions/api-client";
import { invalidateRatingCaches } from "@/app/training-plan/store";
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
import { PlayVsAiConfirmModal } from "@/components/v2/play-vs-ai-confirm-modal";
import { PlayVsAiLeaveGuardModal } from "@/components/v2/play-vs-ai-leave-guard-modal";
import { OfflineModal } from "@/components/v2/offline-modal";
import { isOfflineError } from "@/components/v2/offline-status";
import { useOnlineStatus } from "@/components/v2/hooks/useOnlineStatus";
import { useOfflineGate } from "@/app/store/offlineGate";
import {
  claimPendingSave,
  releasePendingSave,
  usePendingGameSaves,
} from "@/app/store/pendingGameSaves";
import { useGameLeaveGuard } from "@/app/store/gameLeaveGuard";
import { PlayVsAiWinModal, WIN_LOTTIE } from "@/components/v2/play-vs-ai-win-modal";
import { PlayVsAiLoseModal, LOSE_LOTTIE } from "@/components/v2/play-vs-ai-lose-modal";
import { PlayVsAiDrawModal, DRAW_LOTTIE } from "@/components/v2/play-vs-ai-draw-modal";
import { preloadLottie } from "@/components/v2/hooks/useLottieData";
import { AiRosterOpponent } from "@/components/v2/play-vs-ai-roster-data";
import { usePlayPageStore } from "@/app/store/playPage";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";
import { CommentarGame } from "./CommentaryGame";
import { CommentaryMove } from "./CommentaryMove";
import { TableMovement } from "./TableMovement";
import { WhitePlayer } from "./WhitePlayer";
import { playSound } from "@/utils/play-audio";
import {
  classifyMove,
  preloadClassificationEngine,
} from "../src/lib/classifyMove";
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
  /** Mobile board back arrow. This page is reached from more than just the Play
   *  VS AI lobby — e.g. "Play against this Opponent" on the opponent stats page
   *  — so return to wherever the user actually came from, and only fall back to
   *  the lobby when there is no history (deep link, fresh tab). */
  const {
    pending: leaveGuard,
    request: requestLeave,
    open: openLeaveGuard,
    setArmed: setLeaveGuardArmed,
    confirm: confirmLeaveGuard,
    dismiss: dismissLeaveGuard,
  } = useGameLeaveGuard();
  /** Both leave paths run this first: the guard modal promises the current game
   *  ends and the progress is not saved, so the resume snapshot goes with it.
   *  Clearing isGameInitialized too because saveGameState is keyed off it — it
   *  stops a re-render between here and the route change from writing the
   *  position straight back out. */
  const discardCurrentGame = useCallback(() => {
    isGameInitialized.current = false;
    clearSavedVsAiGame();
  }, []);
  const handleMobileBack = useCallback(() => {
    requestLeave("leave", () => {
      discardCurrentGame();
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
      }
      router.push("/playground/play-vs-ai");
    });
  }, [router, requestLeave, discardCurrentGame]);
  const handleBackToLobby = useCallback(() => {
    requestLeave("leave", () => {
      discardCurrentGame();
      router.push("/playground/play-vs-ai");
    });
  }, [router, requestLeave, discardCurrentGame]);
  const { setFen, setPGN, setOpen } = useShareGame();
  const { proceedAnalysis } = useStockfishAnalysis();
  const { isMember, isMemberMonthly, token } = useProfileStore();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const [beforeFen, setBeforeFen] = useState<string>("");
  const [afterFen, setAfterFen] = useState<string>("");
  const {
    getVSAILogs,
    postVSAILogs,
    getTokenBalance,
    getLeaderboardData,
    getLeaderboardMe,
    recordStreakPlay,
    postLeaderboardGameResult,
    isLoading,
  } = useApiClient();
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
  const isOnline = useOnlineStatus();
  const requestOnline = useOfflineGate((state) => state.request);
  /** Set when the end-of-game save could not reach the server because the
   *  connection is gone. It holds back the rest of the end-of-game flow so
   *  that flow can run *once*, intact, after the save lands — see
   *  handleSaveLog and retryOfflineSave. */
  const [offlineSaveBlocked, setOfflineSaveBlocked] = useState<boolean>(false);
  /** The player closed the offline modal. Retries carry on in the background;
   *  this only stops the modal from standing in front of the result. */
  const [offlineModalDismissed, setOfflineModalDismissed] =
    useState<boolean>(false);
  const [isRetryingOfflineSave, setIsRetryingOfflineSave] =
    useState<boolean>(false);
  const offlineSaveBlockedRef = useRef(false);
  offlineSaveBlockedRef.current = offlineSaveBlocked;
  const isRetryingOfflineSaveRef = useRef(false);
  const retryQueuedRef = useRef(false);
  const enqueuePendingSave = usePendingGameSaves((state) => state.enqueue);
  const removePendingSave = usePendingGameSaves((state) => state.remove);
  /** The queued entry for the game on this board, while it is this board's to
   *  retry. Claimed so PendingGameSavesHost leaves it alone until we are done
   *  with it — two senders would log the game twice. */
  const pendingSaveIdRef = useRef<string | null>(null);

  const releasePendingSaveClaim = () => {
    if (!pendingSaveIdRef.current) return;
    releasePendingSave(pendingSaveIdRef.current);
    pendingSaveIdRef.current = null;
  };

  // Leaving the board hands the game to the background flush rather than
  // taking it down with the page — the failure this whole queue exists for.
  useEffect(() => releasePendingSaveClaim, []);

  /** A new game must not inherit the previous one's unsaved-offline state, or
   *  the modal sits over a board that has nothing left to sync.
   *
   *  The three result flags go with it, and must. showWinModal and friends are
   *  set when the game ends but only *rendered* when endModalHeldOffline is
   *  false, so a held modal leaves its flag stuck true — nothing ever calls
   *  the onClose that would clear it. Clearing the hold here without clearing
   *  the flag would fire the previous game's result modal over the new board.
   *  handleChallengeNext and handleLoseRematch already do this for the paths
   *  that start from inside a modal; rematch and New Game never had to before,
   *  because until now a result modal was always dismissed by hand. */
  const resetOfflineSaveState = () => {
    setOfflineSaveBlocked(false);
    setOfflineModalDismissed(false);
    setIsRetryingOfflineSave(false);
    isRetryingOfflineSaveRef.current = false;
    setShowWinModal(false);
    setShowLoseModal(false);
    setShowDrawModal(false);
    // Starting another game hands the last one's unsent save over to the
    // background flush. It stays in the queue — this only stops the board from
    // claiming a game it is no longer showing, which is what lets a player
    // finish several games offline and have all of them land later.
    releasePendingSaveClaim();
  };
  const [analysisPgn, setAnalysisPgn] = useState<string | null>(null);
  const [depthLevel] = useState(14);
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { open: gameEndOpen, setOpen: setOpenGameStatus } = useGameEndStatus();
  const { leaderboard, setLeaderboard, leaderboardMe, setLeaderboardMe } =
    usePlayPageStore();
  // Onboarding-based rating, used when neither leaderboard endpoint has one.
  const effectiveElo = useEffectiveElo();

  /** The rating the end-of-game modals should show, in the same order the play
   *  page's top bar uses: the rated leaderboard ELO, then the provisional one
   *  from /leaderboard/me (an account still calibrating isn't on the
   *  leaderboard, so my_elo is 0 there), then the onboarding ELO. Without the
   *  fallbacks a calibrating player saw "Your Current ELO 0" and a 0 change. */
  const readElo = (lb: any, me: any): number =>
    Number(lb?.my_elo) || Number(me?.elo) || effectiveElo || 0;

  // Modal states for analysis dialogs
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  // Skip-depth-dialog flow: makes AnalyzeGameHistory auto-run the Standard
  // analysis headlessly (the depth dialog only ever opens in the tutorial).
  const [autoStartAnalyze, setAutoStartAnalyze] = useState(false);
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

  // Warm the win/lose/streak celebration animations while the game is being
  // played so the result modals render them instantly instead of fetching on
  // open.
  useEffect(() => {
    preloadLottie(WIN_LOTTIE);
    preloadLottie(LOSE_LOTTIE);
    preloadLottie(DRAW_LOTTIE);
    preloadLottie(CELEBRATION_LOTTIE);
    preloadLottie(REWARD_LOTTIE);
    // Same idea for the move classifier's engine: it is a second Stockfish
    // worker, and building it lazily meant fetching its script on the first
    // move — long after a connection may have dropped. Read the viewport
    // directly rather than the isMobile state, which a later effect only
    // fills in after this one has already run.
    if (window.innerWidth >= 640) {
      preloadClassificationEngine();
    }
  }, []);

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
  // Whether the player used a hint or undo at any point in the current game;
  // reported to the leaderboard with the game result.
  const usedHintRef = useRef<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<"undo" | "hint" | null>(
    null
  );
  const [confirmDontShowAgain, setConfirmDontShowAgain] =
    useState<boolean>(true);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showLoseModal, setShowLoseModal] = useState<boolean>(false);
  const [showDrawModal, setShowDrawModal] = useState<boolean>(false);
  // Day-streak celebration: armed when the streak increments after a game
  // save, shown only once the win/loss/draw end-modal has been shown and
  // closed — and, for lost/drawn games that go into analysis, only after the
  // analysis flow is done (see analysisFlowActive below).
  const [pendingCelebration, setPendingCelebration] = useState<number | null>(
    null
  );
  // Whether the pending celebration is a reward (free-token) day. Driven by
  // the backend's `isGem` flag on the current streak day rather than a fixed
  // 7-day cycle, so configurable gem days show the reward modal correctly.
  const [pendingCelebrationReward, setPendingCelebrationReward] =
    useState<boolean>(false);
  const [endModalShown, setEndModalShown] = useState<boolean>(false);
  const [winElo, setWinElo] = useState<{
    oldElo: number;
    newElo: number;
    delta: number;
  } | null>(null);
  const [loseElo, setLoseElo] = useState<{
    oldElo: number;
    newElo: number;
    delta: number;
  } | null>(null);
  const [drawElo, setDrawElo] = useState<{
    oldElo: number;
    newElo: number;
    delta: number;
  } | null>(null);
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
  /** Set while an engine request is out — see findEnemyMove. */
  const aiMoveInFlightRef = useRef(false);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fenHistory, setFenHistory] = useState<string[]>([game.fen()]);
  const hasMoved = game.history().length > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const movementDetailsRef = useRef<HTMLDivElement>(null);
  // By gameId, not by count — see the matching note in GameList: clearOldJobs()
  // prunes finished jobs, and a count-based high-water mark then stayed above
  // the shrunken list, so later completions never triggered the token refresh.
  const seenCompletedJobIdsRef = useRef<Set<string>>(new Set());

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
    usedHintRef.current = true;

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

  const confirmSkipKey = (type: "undo" | "hint") =>
    type === "undo" ? "playVsAiSkipUndoConfirm" : "playVsAiSkipHintConfirm";

  const requestUndo = () => {
    if (
      isTutorialPlay ||
      localStorage.getItem(confirmSkipKey("undo")) === "true"
    ) {
      handleUndo();
      return;
    }
    setConfirmDontShowAgain(true);
    setConfirmAction("undo");
  };

  const requestHint = () => {
    if (
      hintClicked ||
      isTutorialPlay ||
      localStorage.getItem(confirmSkipKey("hint")) === "true"
    ) {
      handleHint();
      return;
    }
    setConfirmDontShowAgain(true);
    setConfirmAction("hint");
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmDontShowAgain) {
      localStorage.setItem(confirmSkipKey(confirmAction), "true");
    }
    const action = confirmAction;
    setConfirmAction(null);
    if (action === "undo") {
      handleUndo();
    } else {
      handleHint();
    }
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

  // The board's reset (round arrow) throws the current position away just like
  // "New Game" does, so it takes the same "restart" warning. request() runs the
  // rematch straight away when the guard is not armed — no moves played yet, or
  // the game is already over, so there is no progress to lose.
  const requestReset = () => {
    requestLeave("restart", handleReset);
  };

  const LOCAL_STORAGE_KEY = VS_AI_CURRENT_GAME_KEY;

  /** `vs-ai-<name>-<elo>-` — the prefix every gameId for this matchup carries.
   *  currentGameId is only ever set when a board is actually built, so it says
   *  which opponent the position in `game` belongs to. */
  const matchupPrefix = `vs-ai-${AIChoosed.opponent.name}-${AIChoosed.opponent.elo}-`;

  const saveGameState = useCallback(() => {
    if (!isGameInitialized.current) return;
    // Never relabel a game that belongs to a different matchup.
    //
    // Picking a new opponent updates AIChoosed immediately, but the board is
    // rebuilt by the [AIChoosed] effect further down the file — which React
    // runs AFTER this one in the same commit, because effects fire in
    // declaration order. So without this guard the previous opponent's PGN and
    // gameId got written out stamped with the NEW opponent's name and elo, and
    // the restore check below then accepted that snapshot as "the same
    // matchup" and reloaded the old game — headers and all.
    if (currentGameId && !currentGameId.startsWith(matchupPrefix)) return;
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
  }, [game, AIChoosed, statusGame, currentGameId, matchupPrefix]);

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

  useEffect(() => {
    setLeaveGuardArmed(statusGame === "Ongoing" && !isTutorialPlay && hasMoved);
    return () => {
      setLeaveGuardArmed(false);
      dismissLeaveGuard();
    };
  }, [statusGame, isTutorialPlay, hasMoved, setLeaveGuardArmed, dismissLeaveGuard]);

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
    // One engine request at a time. The guards below are evaluated when the
    // call is made, but the move is applied a round trip later, so two calls
    // landing inside that window both pass and both play a move — the second
    // one for the player's own side. Reachable now that a rematch and the
    // opponent picker can each arm the AI's opening move within a second of
    // each other.
    if (aiMoveInFlightRef.current) return false;
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

    aiMoveInFlightRef.current = true;
    engine.getStockfishMove(game.fen(), AIChoosed.opponent.elo).then((pv) => {
      aiMoveInFlightRef.current = false;
      // Guard the UCI parse: anything that isn't a square pair (a terminal
      // position answers "(none)") would otherwise be sliced into nonsense
      // like {from:"(n", to:"on"} and make chess.js throw.
      if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(pv ?? "")) return;

      let move;
      try {
        move = game.move({
          from: pv.substring(0, 2),
          to: pv.substring(2, 4),
          promotion: pv.substring(4, 5) || undefined,
        });
      } catch {
        // Position moved on under us (takeback, resign, rematch) — the
        // engine's reply no longer applies, so just skip it.
        return;
      }

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
    })
    .catch((error) => {
      // getStockfishMove rejects on timeout, worker error, or a finished
      // position. None of these should surface as an unhandled rejection.
      aiMoveInFlightRef.current = false;
      console.warn("Skipping AI move:", error);
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
        if (bestMove) usedHintRef.current = true;
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
            parsed.myColor === AIChoosed.color &&
            // aiName/elo describe whoever last wrote the snapshot, so they
            // cannot on their own prove the PGN is this matchup's. The gameId
            // was minted when the board was built, so it can. Snapshots from
            // before gameId was stored are accepted on the old test alone.
            (typeof parsed.gameId !== "string" ||
              parsed.gameId.startsWith(matchupPrefix))
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

            // Same arming as a fresh game: reloading the page mid-game while
            // the AI is on the clock (refresh straight after your own move)
            // restored the position with nothing due to move it. The trigger
            // no-ops when it is the player's turn.
            setShouldTriggerAI(true);

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

      usedHintRef.current = false;
      setMyColor(AIChoosed.color);
      game.reset();
      setHeaderGameStart();
      setBeforeFen(game.fen());
      setGamePosition(game.fen());
      setFenHistory([game.fen()]);
      setCurrentMoveIndex(0);
      
      // Arm the shared trigger rather than calling findEnemyMove on a timer.
      // The timer captured THIS render's closure, where statusGame is still the
      // finished game's ("Loss"/"Win") on a challenge-next — findEnemyMove's own
      // `statusGame !== "Ongoing"` guard then threw the opening move away and a
      // black player was left with white to move and nothing moving it. The
      // effect below re-reads the fresh state and owns the turn check, so it
      // does not need the colour condition that used to be here.
      setShouldTriggerAI(true);
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
      if (!isTutorialPlay) {
        setShowLoseModal(true);
      } else {
        setOpenGameStatus(true);
      }
    }, 1000);
    const loserColorLocal = myColor;
    const winnerColorLocal = loserColorLocal === "white" ? "black" : "white";
    const losserColorLocal = loserColorLocal !== "white" ? "black" : "white";
    setHeaderGameFinish(winnerColorLocal);
    setWinnerColor(winnerColorLocal);
    setLoserColor(losserColorLocal);
  };

  const requestResign = () => {
    openLeaveGuard("resign", handleResign);
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

    usedHintRef.current = false;
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
    resetOfflineSaveState();
    setHasAnalysis(false); // Reset analysis state for new game
    // A rematch rebuilds the board without touching AIChoosed, so the effect
    // that normally opens for a black player never ran: the lose modal's
    // "Start Game", the draw modal's rematch and the win modal's
    // challenge-next all left white to move with nothing to move it. This is
    // the whole fix for "the AI does not make its move" — the trigger checks
    // the turn itself, so it is a no-op when the player is white.
    setShouldTriggerAI(true);
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

    usedHintRef.current = false;
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
    resetOfflineSaveState();
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

    // The board is already reset here, before the picker opens. Choosing an
    // opponent re-arms this through the [AIChoosed] effect, but DISMISSING the
    // picker does not — and that left a black player on a fresh board with
    // white to move. Double-arming is safe: the trigger is one-shot and
    // findEnemyMove holds a single engine request at a time.
    setShouldTriggerAI(true);

    // Open dialog for new game selection
    setShowPlayVSAIModal(true);
  };

  // "New Game" mid-game throws away the current position, so it has to go
  // through the leave guard's "restart" warning. request() runs the reset
  // straight away when the guard is not armed (no moves played yet, or the
  // game is already over) — there is no progress to lose then.
  const requestNewGame = () => {
    requestLeave("restart", handleNewGame);
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

  // Always call the latest handleRematch: after the win modal swaps the
  // opponent in the store, the board reset must read the fresh AIChoosed
  // (a direct call would run the stale closure from the previous render).
  const latestHandleRematch = useRef<() => void>(() => {});
  useEffect(() => {
    latestHandleRematch.current = handleRematch;
  });

  const handleChallengeNext = (opponent: AiRosterOpponent) => {
    setAIChoosed({
      ...AIChoosed,
      opponent: {
        id: opponent.id,
        name: opponent.name,
        elo: opponent.elo,
        img: opponent.img,
      },
    });
    setShowWinModal(false);
    setWinElo(null);
    setShowLoseModal(false);
    setLoseElo(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setTimeout(() => latestHandleRematch.current(), 0);
  };

  // Lose modal's "Start Game" is a straight rematch against the same
  // opponent (no opponent picker), unlike the win modal's challenge-next.
  const handleLoseRematch = () => {
    setShowLoseModal(false);
    setLoseElo(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setTimeout(() => latestHandleRematch.current(), 0);
  };

  // Demo/testing hook: /playground/play-vs-ai/playing?winDemo=1 shows the
  // win modal without having to finish a game (?loseDemo=1 for the lose
  // modal). ?streakDemo=3 shows the day streak celebration (7, 14, ... shows
  // the reward variant); combine with winDemo=1 to preview the
  // win-modal-then-streak chaining.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("winDemo") === "1") {
      const base = readElo(leaderboard, leaderboardMe) || 2385;
      setWinElo({ oldElo: base, newElo: base + 15, delta: 15 });
      setShowWinModal(true);
    }
    if (params.get("loseDemo") === "1") {
      const base = readElo(leaderboard, leaderboardMe) || 2385;
      setLoseElo({ oldElo: base, newElo: base - 15, delta: -15 });
      setShowLoseModal(true);
    }
    // ?drawDemo=1 previews the draw modal with a -15 change; any other
    // number is used as the signed delta (e.g. ?drawDemo=15, ?drawDemo=-8).
    const drawDemo = params.get("drawDemo");
    if (drawDemo !== null) {
      const parsed = parseInt(drawDemo, 10);
      const delta = !Number.isFinite(parsed) || parsed === 1 ? -15 : parsed;
      const base = readElo(leaderboard, leaderboardMe) || 2385;
      setDrawElo({ oldElo: base, newElo: base + delta, delta });
      setShowDrawModal(true);
    }
    const streakDemo = parseInt(params.get("streakDemo") ?? "", 10);
    if (streakDemo > 0) {
      setPendingCelebrationReward(streakDemo % 7 === 0);
      setPendingCelebration(streakDemo);
      setEndModalShown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** The signed ELO change the save response reported, or null when it carried
   *  none (0 counts as "none" so the leaderboard difference below can speak). */
  const readSavedDelta = (saveRes: any): number | null => {
    // Both spellings: the game-history payload uses elo_change, and other
    // endpoints in this API answer camelCase (see useEffectiveElo).
    // Absent and zero are different answers — `raw !== 0` used to throw away a
    // genuine "no rating movement" and fall through to the leaderboard diff.
    const src = (saveRes as any)?.data ?? {};
    const value = src.elo_change ?? src.eloChange;
    if (value === undefined || value === null || value === "") return null;
    const raw = Number(String(value).replace("+", ""));
    return Number.isFinite(raw) ? raw : null;
  };

  /** Rating before and after the finished game, from both leaderboard endpoints
   *  so a calibrating account (no rated my_elo yet) still reports a real number
   *  — see readElo. Also pushes the fresh payloads into the store. */
  const refreshElo = async (saveRes: any, resultRes?: any) => {
    const before = readElo(leaderboard, leaderboardMe);
    // The leaderboard's own game-result response is the authority on the
    // change it just applied; the save log is the second choice.
    const apiDelta = readSavedDelta(resultRes) ?? readSavedDelta(saveRes);
    let after = before;
    try {
      const [lb, me]: any[] = await Promise.all([
        getLeaderboardData().catch(() => null),
        getLeaderboardMe().catch(() => null),
      ]);
      if (lb?.success && lb.data) setLeaderboard(lb.data);
      if (me?.data) setLeaderboardMe(me.data);
      after = readElo(lb?.data ?? leaderboard, me?.data ?? leaderboardMe);
    } catch {
      // keep `before`: the save response's delta below is then the only signal
    }
    return { before, after, apiDelta };
  };

  const refreshWinElo = async (saveRes: any, resultRes?: any) => {
    const { before, after, apiDelta } = await refreshElo(saveRes, resultRes);
    // A win never shows a drop: trust the reported change, else the rise the
    // leaderboard recorded.
    const delta = apiDelta ?? Math.max(0, after - before);
    const newElo = after > before ? after : before + delta;
    setWinElo({ oldElo: newElo - delta, newElo, delta });
  };

  const refreshLoseElo = async (saveRes: any, resultRes?: any) => {
    const { before, after, apiDelta } = await refreshElo(saveRes, resultRes);
    const delta = apiDelta ?? Math.min(0, after - before);
    const newElo = after < before ? after : before + delta;
    setLoseElo({ oldElo: newElo - delta, newElo, delta });
  };

  // Unlike win/lose, a draw's ELO delta can go either way, so it's taken
  // as-is with no clamping.
  const refreshDrawElo = async (saveRes: any, resultRes?: any) => {
    const { before, after, apiDelta } = await refreshElo(saveRes, resultRes);
    const delta = apiDelta ?? after - before;
    const newElo = apiDelta !== null ? before + apiDelta : after;
    setDrawElo({ oldElo: newElo - delta, newElo, delta });
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
    // The save can fail on its own (401 "Session expired or inactive", offline,
    // a 5xx) and it must not take the rest of the end-of-game flow with it: the
    // result modal, the streak and the analysis all work off the local game. It
    // used to reject straight out of this fire-and-forget call, which surfaced
    // as an unhandled rejection instead of anything the player could act on.
    //
    // A lost connection is the exception, and it is handled rather than
    // reported: nothing below this line can succeed without the network, and
    // running it anyway would spend the one end-of-game flow the player gets
    // on a save that never happened — a result modal reporting no rating
    // change for a game the backend has not seen. So bail out here, put the
    // offline modal up, and let retryOfflineSave call this function again from
    // the top once the connection is back. That replay IS the online flow;
    // there is no separate offline path to keep in step with it.
    let res: any = null;
    let saveFailed = false;
    try {
      res = await postVSAILogs(body);
      setOfflineSaveBlocked(false);
      // Sent from here, so the queued copy must go before the background host
      // can send it a second time.
      if (pendingSaveIdRef.current) {
        removePendingSave(pendingSaveIdRef.current);
        releasePendingSaveClaim();
      }
    } catch (error) {
      if (isOfflineError(error)) {
        // Queue it before anything else. From here the game is safe even if
        // this component is gone a second later: the queue is persisted and
        // PendingGameSavesHost sends it from wherever the player ends up.
        const pendingId = enqueuePendingSave({
          body,
          usedHint: usedHintRef.current,
          isTutorial: isTutorialPlay,
        });
        pendingSaveIdRef.current = pendingId;
        claimPendingSave(pendingId);
        setOfflineSaveBlocked(true);
        setIsSaved(false);
        setIsSaving(false);
        // Reported, not just recorded in state: retryOfflineSave decides
        // whether to queue a follow-up attempt on this return value rather
        // than on offlineSaveBlockedRef, which is only refreshed on render and
        // so can still read "blocked" for a save that has just succeeded —
        // which would send a second POST and log the game twice.
        return false;
      }
      saveFailed = true;
      toast.error("Couldn't save this game — please check your connection or sign in again.");
    }
    try {
      const vsAiPgn =
        (res as any)?.data?.pgn && typeof (res as any).data.pgn === "string"
          ? (res as any).data.pgn
          : null;
      setAnalysisPgn(vsAiPgn ?? game.pgn());
    } catch {
      setAnalysisPgn(game.pgn());
    }
    handleForceRefresh();
    // The finished game moves the player's ELO, so the training plan's cached
    // rating and progress are now stale.
    invalidateRatingCaches();
    setIsSaved(!saveFailed);
    setIsSaving(false);
    loadLogs();
    // Report the finished game to the leaderboard, flagging whether the player
    // leaned on a hint or undo at any point.
    //
    // AWAITED, and ahead of the refresh*Elo calls below, because THIS is the
    // call that moves the rating. It used to run after them, so refreshElo
    // refetched the leaderboard before the new rating existed, measured
    // `after - before` as 0, and the win modal reported "0" for a game that
    // game history then showed as +7. Its own response is the first choice for
    // the delta; the leaderboard diff is only the fallback.
    let resultRes: any = null;
    if (!isTutorialPlay) {
      const savedGameId =
        (res as any)?.data?.game_id ?? (res as any)?.data?.id ?? null;
      if (savedGameId) {
        resultRes = await postLeaderboardGameResult({
          game_id: String(savedGameId),
          used_hint: usedHintRef.current,
        }).catch(() => null);
      }
    }
    if (statusGame === "Win") {
      refreshWinElo(res, resultRes);
    }
    if (statusGame === "Loss") {
      refreshLoseElo(res, resultRes);
    }
    if (statusGame === "Draw") {
      refreshDrawElo(res, resultRes);
    }
    if (!isTutorialPlay) {
      // Only the first finished game of the (local) day advances the streak:
      // it records the play with the backend and can show the celebration
      // modal. Later games that day skip the whole flow. lastPlayDate is
      // only stamped after record-play succeeds so a failed call retries on
      // the next game instead of silently losing the day.
      const today = getLocalDateStamp();
      if (useStreakStore.getState().lastPlayDate !== today) {
        // record-play returns the full updated streak status, so it is the
        // single source for the store sync and the celebration decision —
        // no follow-up status fetch needed.
        recordStreakPlayOnce(() => recordStreakPlay())
          .then((res: any) => {
            if (!res?.success) return;
            const store = useStreakStore.getState();
            store.setLastPlayDate(today);
            const newStreak = res.data?.currentStreak ?? 0;
            const prev = store.lastSeenStreak;
            store.setStatus(res.data);
            // Advance at detection time so a lost/unclosed celebration can
            // never re-fire on the next game (and syncs down after a reset).
            store.setLastSeenStreak(newStreak);
            usePlayPageStore.getState().setStreak(newStreak);
            if (newStreak > prev) {
              // A reward day is one the backend marks with `isGem` on the
              // current streak day; fall back to the fixed 7-day cycle when
              // no streakDays entry is provided.
              const days = res.data?.streakDays;
              const gemEntry = Array.isArray(days)
                ? days.find((d: any) => Number(d?.day) === newStreak)
                : null;
              const isReward =
                gemEntry && typeof gemEntry.isGem === "boolean"
                  ? gemEntry.isGem === true
                  : newStreak > 0 && newStreak % 7 === 0;
              setPendingCelebrationReward(isReward);
              setPendingCelebration(newStreak);
            }
          })
          .catch(() => {});
      }
    }
  };

  // handleSaveLog is redefined on every render, so the retry paths below reach
  // it through a ref instead of capturing whichever copy existed at the moment
  // the game ended (and with it that render's stale game/ELO state).
  const latestHandleSaveLog = useRef(handleSaveLog);
  latestHandleSaveLog.current = handleSaveLog;

  /** One more attempt at the end-of-game save, replaying the whole flow.
   *
   *  Guarded against overlap because three things can ask for a retry at once
   *  — the modal's countdown, its button, and the `online` event — and each
   *  attempt is a POST that creates a game log on the way through.
   *
   *  A request that arrives mid-attempt is remembered rather than dropped.
   *  Without that, reconnecting during the second or two an attempt is in
   *  flight (that attempt having been made while still offline, so doomed)
   *  swallowed the one signal that the network was back, and the player waited
   *  out a full two-minute countdown next to a working connection. Only the
   *  three explicit triggers can queue, never a failure, so this cannot become
   *  a retry loop. */
  const retryOfflineSave = useCallback(() => {
    if (!offlineSaveBlockedRef.current) return;
    if (isRetryingOfflineSaveRef.current) {
      retryQueuedRef.current = true;
      return;
    }
    isRetryingOfflineSaveRef.current = true;
    retryQueuedRef.current = false;
    setIsRetryingOfflineSave(true);
    const finish = (succeeded: boolean) => {
      isRetryingOfflineSaveRef.current = false;
      setIsRetryingOfflineSave(false);
      const queued = retryQueuedRef.current;
      retryQueuedRef.current = false;
      if (!succeeded && queued) retryOfflineSaveRef.current();
    };
    latestHandleSaveLog.current().then(
      (result) => finish(result !== false),
      () => finish(false)
    );
  }, []);

  // Self-reference for the queued follow-up above, which cannot name the
  // callback it lives inside.
  const retryOfflineSaveRef = useRef(retryOfflineSave);
  retryOfflineSaveRef.current = retryOfflineSave;

  // A restored connection retries straight away rather than waiting out the
  // modal's countdown.
  //
  // Watches the offline -> online *edge*, not the plain condition: behind a
  // captive portal navigator.onLine reads true while every request still
  // fails, so an effect on `isOnline && offlineSaveBlocked` would re-satisfy
  // itself after each failed attempt and spin.
  const wasOnlineRef = useRef(true);
  useEffect(() => {
    const cameBackOnline = isOnline && !wasOnlineRef.current;
    wasOnlineRef.current = isOnline;
    if (cameBackOnline) retryOfflineSave();
  }, [isOnline, retryOfflineSave]);

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
          if (isUserWin) {
            if (!isTutorialPlay) {
              setShowWinModal(true);
            } else {
              setOpenGameStatus(true);
            }
          } else {
            if (!isTutorialPlay) {
              setShowLoseModal(true);
            } else {
              setOpenGameStatus(true);
            }
          }
        }, 1000);
      } else {
        setLossReason(null);
        setStatusGame("Draw");
        setTimeout(() => {
          setHeaderGameFinish("draw");
          if (!isTutorialPlay) {
            setShowDrawModal(true);
          } else {
            setOpenGameStatus(true);
          }
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
      // Nothing awaits this, so a rejection anywhere inside would land as an
      // unhandled rejection (a full-screen error in dev) rather than a message.
      handleSaveLog().catch(() => {});
    }
  }, [statusGame]);

  useEffect(() => {
    if (showWinModal || showLoseModal || showDrawModal || gameEndOpen) {
      setEndModalShown(true);
    }
  }, [showWinModal, showLoseModal, showDrawModal, gameEndOpen]);

  const handleCelebrationClose = () => {
    const isReward = pendingCelebration !== null && pendingCelebrationReward;
    setPendingCelebration(null);
    setPendingCelebrationReward(false);
    setEndModalShown(false);
    if (isReward) {
      // The streak backend grants the analysis token; refresh the balance.
      getTokenBalance({}).then((response) => {
        if (response.data != null) {
          setToken(response.data);
        }
      });
    }
  };

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

  // Start analysis for the current game. Outside the tutorial this skips the
  // depth dialog and auto-runs the Standard analysis; the tutorial keeps
  // showing the dialog as part of its scripted steps.
  /** @param onProceed anything the caller wants done only if the analysis
   *  actually starts — a progress dialog, typically. Callers must not do that
   *  work themselves before calling: offline the gate defers the run, and a
   *  dialog opened up front would be left spinning behind the offline modal
   *  with nothing ever coming to close it. */
  const triggerAnalyzeGame = (onProceed?: () => void) => {
    if (isTutorialPlay) {
      setIsAnalyzeOpen(true);
      return;
    }
    // Analysis is a backend job, so offline this raises the offline modal and
    // holds the request rather than opening a progress dialog that can only
    // sit there and fail. The tutorial's scripted dialog above is deliberately
    // left alone — it is not a real analysis run.
    requestOnline(() => {
      onProceed?.();
      setAutoStartAnalyze(true);
    });
  };

  // Handle "Show Analysis" click
  const runShowAnalysis = async () => {
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

      if (v3Analysis?.success && v3Analysis.data?.summary) {
        console.log("✅ [handleShowAnalysis] V3 analysis found, opening GameAnalysis directly");
        // Skip ChooseAnalysisMode — show the mistakes result right away
        setV3AnalysisResult({
          ...v3Analysis.data,
          analysisId: v3Analysis.data.analysisId || v3Analysis.data.id,
        });
        setGameAnalysisOpen(true);
      } else if (v3Analysis?.success && v3Analysis.data) {
        // v3 data without a summary — the choose dialog still handles this shape
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
          triggerAnalyzeGame();
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

  /** Reads a stored analysis off the backend, so it is gated the same way as
   *  starting one. Its own fallbacks reach for a cached job result, but every
   *  path that leads anywhere begins with a request. */
  const handleShowAnalysis = () => {
    requestOnline(() => {
      void runShowAnalysis();
    });
  };

  useEffect(() => {
    const isCompleted = Object.values(analysisJobs).filter(
      (gameData) => gameData.status == "completed"
    );

    const freshlyCompleted = isCompleted.filter(
      (job) => !seenCompletedJobIdsRef.current.has(String(job.gameId))
    );

    if (freshlyCompleted.length > 0) {
      freshlyCompleted.forEach((job) =>
        seenCompletedJobIdsRef.current.add(String(job.gameId))
      );
      refreshTokenBalance(sessionId, () => getTokenBalance({}));
    }
  }, [analysisJobs, sessionId, getTokenBalance]);
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

            if (v3Analysis?.success && v3Analysis.data?.summary) {
              // Skip ChooseAnalysisMode — show the mistakes result right away
              setV3AnalysisResult({
                ...v3Analysis.data,
                analysisId: v3Analysis.data.analysisId || v3Analysis.data.id,
              });
              setGameAnalysisOpen(true);
            } else if (v3Analysis?.success && v3Analysis.data) {
              // v3 data without a summary — the choose dialog still handles this shape
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
                triggerAnalyzeGame();
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
              triggerAnalyzeGame();
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
            onClick: () => triggerAnalyzeGame(),
            disabled: false,
          };
      }
    }

    return {
      text: "Analyze now",
      icon: <ChartNoAxesColumn className="h-4 w-4 mr-1" />,
      className: "btn-primary text-white",
      onClick: () => triggerAnalyzeGame(),
      disabled: false,
    };
  };

  // Lost/drawn games can flow straight into analysis (the draw modal's
  // "Discover Mistakes", the page's "Analyze now"): hold the streak
  // celebration while that flow runs so it shows after the analysis is
  // closed, not on top of it. Wins are exempt — their streak always shows
  // right after the win modal closes (or a new game starts).
  const analysisFlowActive =
    statusGame !== "Win" &&
    (autoStartAnalyze ||
      isAnalyzeOpen ||
      isChooseAnalysisModeOpen ||
      processingAnalysisModeOpen ||
      gameAnalysisOpen);

  /** The finished game has not reached the backend yet, so the result modal
   *  waits. Holding it keeps the end-of-game flow to a single run: once the
   *  save lands it opens with the real rating change, exactly as it does
   *  online, instead of having already claimed "no change" for a game the
   *  backend never recorded.
   *
   *  Dismissing the offline modal does NOT release it, and keeps it held for
   *  the rest of this game even after the save eventually lands. The player
   *  closed a dialog to get back to their board; answering that with a second
   *  dialog — immediately, carrying a rating change that is not real, or
   *  minutes later when the connection returns and they have long moved on —
   *  is the same intrusion they just dismissed. The result is on the page
   *  either way: the win/loss banner, the move list, Analyze Mistakes. The
   *  rating still syncs in the background and shows up in the top bar and in
   *  game history; only the modal is suppressed.
   *
   *  Both flags are cleared by resetOfflineSaveState, so the next game starts
   *  with the normal end-of-game flow. */
  const endModalHeldOffline = offlineSaveBlocked || offlineModalDismissed;

  return (
    <div className="flex flex-col xl:flex-row w-full bg-white gap-4">
      {!isTutorialPlay && <GameEndStatus gameStatus={statusGame.toLowerCase()} />}
      {leaveGuard && (
        <PlayVsAiLeaveGuardModal
          type={leaveGuard.type}
          onCancel={dismissLeaveGuard}
          onConfirm={confirmLeaveGuard}
        />
      )}
      {confirmAction && (
        <PlayVsAiConfirmModal
          type={confirmAction}
          dontShowAgain={confirmDontShowAgain}
          onDontShowAgainChange={setConfirmDontShowAgain}
          onCancel={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
        />
      )}
      {showWinModal && !isTutorialPlay && !endModalHeldOffline && (
        <PlayVsAiWinModal
          oldElo={winElo?.oldElo ?? readElo(leaderboard, leaderboardMe)}
          newElo={winElo?.newElo ?? readElo(leaderboard, leaderboardMe)}
          delta={winElo?.delta ?? 0}
          opponentName={AIChoosed?.opponent?.name}
          opponentElo={AIChoosed?.opponent?.elo}
          onClose={() => setShowWinModal(false)}
          onStartGame={handleChallengeNext}
        />
      )}
      {showLoseModal && !isTutorialPlay && !endModalHeldOffline && (
        <PlayVsAiLoseModal
          oldElo={loseElo?.oldElo ?? readElo(leaderboard, leaderboardMe)}
          newElo={loseElo?.newElo ?? readElo(leaderboard, leaderboardMe)}
          delta={loseElo?.delta ?? 0}
          opponentName={AIChoosed?.opponent?.name}
          opponentElo={AIChoosed?.opponent?.elo}
          onClose={() => setShowLoseModal(false)}
          onDiscoverMistakes={() => {
            setShowLoseModal(false);
            // Show the loading chess animation right away; the autoStart flow
            // starts the analysis + polling that this dialog reads for
            // progress. Passed to triggerAnalyzeGame rather than opened here
            // so that offline — where the run is deferred until there is a
            // connection — it does not appear at all.
            triggerAnalyzeGame(() => {
              if (!isTutorialPlay) setProcessingAnalysisModeOpen(true);
            });
          }}
        />
      )}
      {showDrawModal && !isTutorialPlay && !endModalHeldOffline && (
        <PlayVsAiDrawModal
          oldElo={drawElo?.oldElo ?? readElo(leaderboard, leaderboardMe)}
          newElo={drawElo?.newElo ?? readElo(leaderboard, leaderboardMe)}
          delta={drawElo?.delta ?? 0}
          opponentName={AIChoosed?.opponent?.name}
          opponentElo={AIChoosed?.opponent?.elo}
          onClose={() => setShowDrawModal(false)}
          onDiscoverMistakes={() => {
            setShowDrawModal(false);
            triggerAnalyzeGame();
          }}
        />
      )}
      {offlineSaveBlocked && !offlineModalDismissed && !isTutorialPlay && (
        <OfflineModal
          variant="sync"
          isRetrying={isRetryingOfflineSave}
          onRetry={retryOfflineSave}
          onClose={() => setOfflineModalDismissed(true)}
        />
      )}
      {pendingCelebration !== null &&
        endModalShown &&
        !endModalHeldOffline &&
        !showWinModal &&
        !showLoseModal &&
        !showDrawModal &&
        !gameEndOpen &&
        !analysisFlowActive &&
        !isTutorialPlay && (
          <DayStreakModal
            variant={pendingCelebrationReward ? "reward" : "celebration"}
            streak={pendingCelebration}
            onClose={handleCelebrationClose}
          />
        )}
      <AnalyzeGameHistory
        open={isAnalyzeOpen}
        onOpenChange={(open) => {
          setIsAnalyzeOpen(open);
        }}
        game={gameFromPgn}
        autoStart={autoStartAnalyze}
        onAutoStartComplete={() => setAutoStartAnalyze(false)}
        onAnalysisStarted={() => {
          // Tutorial keeps its scripted ChooseAnalysisMode step; real runs go
          // straight to the loading dialog.
          if (isTutorialPlay) {
            setIsChooseAnalysisModeOpen(true);
          } else {
            setProcessingAnalysisModeOpen(true);
          }
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
          <button onClick={handleBackToLobby}>
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
                <button onClick={handleMobileBack}>
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
                      {(customArrowsConfig.length > 0 || userDrawnArrows.length > 0) && (
                        <CustomChessArrows
                          arrows={[...customArrowsConfig, ...userDrawnArrows]}
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
                  isAnalyzing={autoStartAnalyze}
                  onAnalyzeClick={() => {
                    triggerAnalyzeGame();
                  }}
                  onShowAnalysisClick={handleShowAnalysis}
                />
              </>
              
            )}

            {/* Undo/reset only while a game is actually running. isGameOver() is
                false after a resignation (and any other non-board ending), so
                these two stayed on the finished screen — statusGame is the same
                flag that swaps ButtonPlaying for ButtonFinish below. */}
            {statusGame === "Ongoing" && (
                  // <div className="flex flex-row justify-center items-center gap-2 px-4">
                  <div className="flex flex-row justify-center items-center gap-[12px] px-[16px]">
                    <button
                      disabled={game.history().length === 0}
                      // disabled={true}
                      onClick={requestUndo}
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
                      onClick={requestReset}
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
                      onClick={requestUndo}
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
                handleHint={requestHint}
                handleNewGame={requestNewGame}
                handleResign={requestResign}
                canResign={hasMoved}
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
                isAnalyzing={autoStartAnalyze}
                onAnalyzeClick={() => {
                  triggerAnalyzeGame();
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
          <button onClick={handleBackToLobby}>
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

                {/* Same rule as the mobile row above. */}
                {statusGame === "Ongoing" && (
                  <div className="flex flex-row justify-center items-center gap-[12px] my-[16px]">
                    <button
                      disabled={game.history().length === 0}
                      // disabled={true}
                      onClick={requestUndo}
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
                      onClick={requestReset}
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
                    handleHint={requestHint}
                    handleNewGame={requestNewGame}
                    handleResign={requestResign}
                    canResign={hasMoved}
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
                    isAnalyzing={autoStartAnalyze}
                    onAnalyzeClick={() => {
                      triggerAnalyzeGame();
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
