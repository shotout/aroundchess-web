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
import { useAuth } from "@/context/AuthContext";
import { useApiClient } from "@/functions/api-client";
import { changeNamePiece } from "@/functions/change-name-piece";
import { formatDatePgn, formatTimePgn } from "@/functions/format-date";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { Chess, Square } from "chess.js";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
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

export default function PlayingPage() {
  const router = useRouter();
  const { setFen, setPGN, setOpen } = useShareGame();
  const { proceedAnalysis } = useStockfishAnalysis();
  const { isMember, token } = useProfileStore();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const [beforeFen, setBeforeFen] = useState<string>("");
  const [afterFen, setAfterFen] = useState<string>("");
  const { getVSAILogs, postVSAILogs, isLoading } = useApiClient();
  const {
    setIsLoading,
    setPgn,
    setDataAnalysis,
    setDataGamesImport,
    setError,
    username,
    hideDiv,
  } = usePgnStore();
  const hasRun = useRef(false);

  const [depthLevel] = useState(14);
  const { user } = useAuth();
  const { AIChoosed } = usePlayVSAIStore();
  const { setOpen: setOpenGameStatus } = useGameEndStatus();
  const refBoard = useRef<HTMLDivElement | null>(null);
  const { PieceChoosed, StyleChoosed, setStyleChoosed } =
    useChessBoardThemeStore();
  const [selectedTab, setSelectedTab] = useState<string>("current");
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
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

  // Simple navigation state like PuzzleGame
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fenHistory, setFenHistory] = useState<string[]>([game.fen()]);

  const isYourTurn = myColor === "white" ? "w" : "b";

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Simple navigation functions like PuzzleGame
  const navigateToMove = (index: number) => {
    if (index >= 0 && index < fenHistory.length) {
      setCurrentMoveIndex(index);
      const fen = fenHistory[index];
      setGamePosition(fen);

      // Create a temporary game to load the position
      const tempGame = new Chess();
      const moves = game.history();
      tempGame.reset();

      // Replay moves to get to this position
      for (let i = 0; i < index; i++) {
        if (moves[i]) {
          tempGame.move(moves[i]);
        }
      }

      setGamePosition(tempGame.fen());
    }
  };

  const handlePreviousMove = () => {
    const newIndex = Math.max(currentMoveIndex - 1, 0);
    navigateToMove(newIndex);
  };

  const handleNextMove = () => {
    const newIndex = Math.min(currentMoveIndex + 1, fenHistory.length - 1);
    navigateToMove(newIndex);
  };

  const resetToBeginning = () => {
    navigateToMove(0);
  };

  // Update fenHistory when moves are made
  useEffect(() => {
    const moves = game.history();
    const newFenHistory = [game.fen()]; // Start with initial position

    const tempGame = new Chess();
    moves.forEach((move) => {
      tempGame.move(move);
      newFenHistory.push(tempGame.fen());
    });

    setFenHistory(newFenHistory);
    if (currentMoveIndex >= newFenHistory.length) {
      setCurrentMoveIndex(newFenHistory.length - 1);
    }
  }, [gamePosition]);

  const isAtCurrentMove = useMemo(
    () => currentMoveIndex === fenHistory.length - 1,
    [currentMoveIndex, fenHistory]
  );

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
          game?.get(move.to)?.color !== game?.get(square)?.color
            ? "radial-gradient(circle, rgba(34,26,233) 30%, transparent 30%)"
            : "radial-gradient(circle, rgba(34,26,233) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = { background: "#F5F682" };
    setOptionSquares(newSquares);
    return true;
  };

  const onSquareClick = (square: Square) => {
    // Don't allow moves when viewing history
    if (!isAtCurrentMove) {
      // If viewing history, return to current position
      navigateToMove(fenHistory.length - 1);
      return;
    }

    setRightClickedSquares({} as Record<string, CSSProperties>);
    setBestline("");

    if (!moveFrom) {
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
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : "");
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
      setMoveData(move);
      playSound(game, move);
      setMoveClassification("");

      if (!isMobile) {
        getClassificationMove(move);
      } else {
        setTimeout(() => {
          findEnemyMove();
        }, 500);
      }

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGamePosition(game.fen());
      setAfterFen(game.fen());
      setCurrentTurn((turnColor) =>
        turnColor !== "White" ? "White" : "Black"
      );
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
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
        setTimeout(() => {
          findEnemyMove();
        }, 500);
        return;
      }

      if (classificationTimeoutRef.current) {
        clearTimeout(classificationTimeoutRef.current);
      }

      classificationTimeoutRef.current = setTimeout(async () => {
        try {
          const moveUserClassification = await handleClassify(move);
          setMoveClassification(moveUserClassification);

          setTimeout(() => {
            findEnemyMove();
          }, 500);
        } catch (error) {
          findEnemyMove();
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
        setGamePosition(game.fen());
        setAfterFen(game.fen());
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
          setTimeout(() => {
            findEnemyMove();
          }, 500);
        }
      }
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  };

  const onSquareRightClick = (square: Square) => {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: {
        backgroundColor:
          rightClickedSquares[square]?.backgroundColor === colour ? "" : colour,
      },
    });
  };

  const prevCurrentColor = {
    ...(previousSquare && {
      [previousSquare]: { backgroundColor: "#B9CA43" },
    }),
    ...(currentSquare && {
      [currentSquare]: { backgroundColor: "#F5F682" },
    }),
  };

  const findEnemyMove = () => {
    const isYourTurnLocal = myColor === "white" ? "w" : "b";
    if (game.turn() === isYourTurnLocal) return false;

    engine.getStockfishMove(game.fen(), AIChoosed.opponent.elo).then((pv) => {
      const move = game.move({
        from: pv.substring(0, 2),
        to: pv.substring(2, 4),
        promotion: pv.substring(4, 5),
      });
      setMoveData(move);
      playSound(game, move);
      setBeforeFen(game.fen());
      setPreviousSquare(pv.substring(0, 2) as Square);
      setCurrentSquare(pv.substring(2, 4) as Square);
      setBestline("");
      setHintClicked(false);
      setGamePosition(game.fen());
      setCurrentTurn((turnColor) =>
        turnColor !== "White" ? "White" : "Black"
      );
    });
  };

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
    if (hasRun.current) return;
    hasRun.current = true;
    getVSAILogs({ limit: 30, page: 1 }).then((res: any) => {
      setPastGames(res.data);
    });
  }, []);

  const setHeaderGameStart = () => {
    const date = formatDatePgn();
    const time = formatTimePgn();
    const whiteName =
      AIChoosed.color === "white"
        ? AIChoosed.opponent.name + " (AI)"
        : username;
    const blackName =
      AIChoosed.color !== "white"
        ? AIChoosed.opponent.name + " (AI)"
        : username;

    game.header("Event", "Play vs AI (" + AIChoosed.opponent.elo + ")");
    game.header("Site", "aroundchess.com");
    game.header("Date", date);
    game.header("White", whiteName);
    game.header("Black", blackName);
    game.header("Timezone", "UTC");
    game.header("UTCDate", date);
    game.header("UTCTime", time);
  };

  const setHeaderGameFinish = () => {
    const date = formatDatePgn();
    const time = formatTimePgn();
    const isWhiteWin = winnerColor === "white" ? "1" : "0";
    const isBlackWin = winnerColor !== "white" ? "1" : "0";
    const winResult = isWhiteWin + "-" + isBlackWin;

    game.header("Result", winResult);
    game.header("EndDate", date);
    game.header("EndTime", time);
  };

  useEffect(() => {
    setMyColor(AIChoosed.color);
    setHeaderGameStart();
    setBeforeFen(game.fen());
    if (AIChoosed.color === "black") {
      setTimeout(() => {
        findEnemyMove();
      }, 1000);
    }
    setHeightScreen(window?.innerHeight);
    setHeightBoard(refBoard.current?.clientHeight);
  }, [isLoading]);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;
    handleResize();
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted, hideDiv, is3DMode]);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.9 : 480;

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
    }
  };

  useEffect(() => {
    if (AIChoosed.color === "black") {
      setOrientation("black");
    } else {
      setOrientation("white");
    }
  }, []);

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
    setTimeout(() => {
      setOpenGameStatus(true);
    }, 1000);
    setHeaderGameFinish();
    const loserColorLocal = myColor;
    const winnerColorLocal = loserColorLocal === "white" ? "black" : "white";
    const losserColorLocal = loserColorLocal !== "white" ? "black" : "white";
    setWinnerColor(winnerColorLocal);
    setLoserColor(losserColorLocal);
  };

  const handleAnalyzeGame = () => {
    if (token.balance > 0) {
      fetchPgnLocal();
    } else {
      setOpenPricing(true);
    }
  };

  const handleRematch = () => {
    setStatusGame("Ongoing");
    game.reset();
    setGamePosition(game.fen());
    setHeaderGameStart();
    setLoserColor("");
    setWinnerColor("");
    setPreviousSquare(undefined);
    setCurrentSquare(undefined);
    setCurrentMoveIndex(0);
    setFenHistory([game.fen()]);
  };

  const handleNewGame = () => {
    router.back();
  };

  const handleSaveLog = async () => {
    const body = {
      enemyTag: AIChoosed.opponent.name,
      eloRating: AIChoosed.opponent.elo + "",
      totalMoves: game.history().length,
      totalTime: "10 Minutes",
      status: statusGame,
      pgn: game.pgn(),
    };
    await postVSAILogs(body);
  };

  const checkStatusGame = () => {
    if (game.isGameOver()) {
      setHeaderGameFinish();
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
        setTimeout(() => {
          setOpenGameStatus(true);
        }, 1000);
      } else {
        setStatusGame("Draw");
        setTimeout(() => {
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
      // Don't allow moves when viewing history
      if (!isAtCurrentMove) {
        // If viewing history, return to current position
        navigateToMove(fenHistory.length - 1);
        return false;
      }

      const isYourTurnLocal = myColor === "white" ? "w" : "b";
      if (game.turn() !== isYourTurnLocal || statusGame !== "Ongoing") {
        return false;
      }

      setRightClickedSquares({} as Record<string, CSSProperties>);
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

      if (!isMobile) {
        getClassificationMove(move);
      } else {
        setTimeout(() => {
          findEnemyMove();
        }, 500);
      }

      setGamePosition(game.fen());
      setAfterFen(game.fen());
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
      navigateToMove,
      fenHistory,
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
    const is3D = StyleChoosed === "3d";
    setIs3DMode(is3D);
  }, [StyleChoosed]);

  return (
    <div className="flex flex-col xl:flex-row w-full bg-white p-0 sm:p-4 gap-4 lg:mt-8 xl:mt-0">
      <GameEndStatus gameStatus={statusGame.toLowerCase()} />
      <div className="flex flex-col w-full gap-y-2 ">
        <div className="xl:hidden flex flex-row items-center justify-between sm:mb-2 p-4 sm:p-0 border-b sm:border-none">
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
            <span className="font-semibold text-[18px]">Play VS AI</span>
          </div>
          <div className="flex " />
        </div>

        {/* Hide current turn on mobile, show on tablet and desktop */}
        <div className="hidden sm:block rounded-[8px] min-h-[54px] bg-[#FAFDFF] border border-[#DEDEDE] p-4">
          <div className="flex items-center justify-center rounded-[6px] bg-white shadow-md border border-[#DEDEDE] px-4 py-2">
            <span className="text-xs font-normal">
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
                user={user}
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
                user={user}
                PieceChoosed={PieceChoosed}
              />
            </div>
          )}

          <div className="flex items-center justify-between mb-2 px-5 sm:px-0">
            {/* Hide CommentaryMove on mobile */}
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
          {/* Mobile Captured Pieces - Only show on mobile */}
          <MobileCapturedPieces
            capturedWhite={capturedWhite}
            capturedBlack={capturedBlack}
            PieceChoosed={PieceChoosed}
          />

          <div className="flex flex-col justify-center items-center gap-3">
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
            </motion.div>

            <motion.div
              style={{
                width: boardSize,
                display: !is3DMode ? "flex" : "none",
                backfaceVisibility: "hidden",
              }}
            >
              {!is3DMode && (
                <TwoDChessboard
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
              <div className="hidden sm:flex flex-row items-center justify-center gap-1">
                <ArrowRight color="#221AE950" size={16} />
                <span className="h-[14px] font-normal text-[11px]">
                  Move Recommendation
                </span>
              </div>
            </div>
          </div>

          <div className="sm:hidden flex flex-col gap-4 mt-4">
            {statusGame !== "Ongoing" && (
              <div className="flex justify-center items-center">
                <CommentarGame statusGame={statusGame} />
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
              />
            )}

            {/* Mobile tabs */}
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
                  className={`text-sm font-semibold ${
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
                  className={`text-sm font-semibold ${
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

                {!game.isGameOver() && (
                  <div className="flex flex-row justify-center items-center gap-2 px-4">
                    <button
                      disabled={currentMoveIndex === 0}
                      onClick={handlePreviousMove}
                      className={`rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                        currentMoveIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
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
                      onClick={resetToBeginning}
                      className="rounded-[4px] flex-1 py-2 flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
                    >
                      <RotateCw size={20} color="#000" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Past games content */
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
            {/* Hide CommentaryMove on mobile */}
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
                user={user}
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
                user={user}
                PieceChoosed={PieceChoosed}
              />
            </div>
          )}
        </div>
      </div>

      {/* Desktop/tablet tabs - hidden on mobile */}
      <div className="hidden sm:block w-full">
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
              className="flex flex-col items-center justify-between rounded-[16px] border border-[#DEDEDE] gap-2 mt-4 "
              style={{ height: heightBoard }}
            >
              <div className="flex flex-col px-4 w-full overflow-y-auto ">
                <span className="font-semibold text-center text-[16px] my-2 xl:my-4">
                  Movement Details
                </span>
                <TableMovement
                  myColor={myColor}
                  capturedWhite={capturedWhite}
                  capturedBlack={capturedBlack}
                  PieceChoosed={PieceChoosed}
                />
              </div>
              <div className="flex flex-col items-center w-full gap-2">
                {/* Desktop navigation buttons */}
                {!game.isGameOver() && (
                  <div className="flex flex-row justify-center items-center gap-2 my-2">
                    <button
                      disabled={currentMoveIndex === 0}
                      onClick={handlePreviousMove}
                      className={`rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9] ${
                        currentMoveIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
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
                      onClick={resetToBeginning}
                      className="rounded-[4px] w-[80px] h-[32px] flex justify-center items-center bg-[#221AE916] border border-[#221AE9]"
                    >
                      <RotateCw size={20} color="#000" />
                    </button>
                  </div>
                )}

                {statusGame !== "Ongoing" && (
                  <CommentarGame statusGame={statusGame} />
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
