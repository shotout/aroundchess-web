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
import { Chess, PieceSymbol, Square } from "chess.js";
import {
  ArrowLeft,
  BarChart2,
  HistoryIcon,
  MoveRightIcon,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "@/components/game-history/Spinner";
import { usePgnStore } from "@/app/store/zustandStore";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import { toast } from "sonner";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import axios from "axios";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import {
  formatDate,
  formatDatePgn,
  formatTimePgn,
} from "@/functions/format-date";
import { ChessCountdown } from "@/utils/chessCountdown";
const AnalyticsUrl = process.env.BASE_URL! + "/chessdotcom/games";

export default function Playing() {
  const router = useRouter();
  const { proceedAnalysis } = useStockfishAnalysis();

  const { getVSAILogs, postVSAILogs, isLoading } = useApiClient();
  const {
    isLoading: loadingAnalyze,
    setIsLoading,
    setPgn,
    setDataAnalysis,
    setDataGames,
    setError,
    username,
    setDataGamesImport,
  } = usePgnStore();
  const { user } = useUser();
  const { sessionId } = useAuth();
  const { hideDiv } = usePgnStore();
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { PieceChoosed, StyleChoosed } = useChessBoardThemeStore();
  const [selectedTab, setSelectedTab] = useState<string>("current");
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [myColor, setMyColor] = useState<string>(AIChoosed.color);
  const [currentTurn, setCurrentTurn] = useState<string>("White");
  const [whiteTime, setWhiteTime] = useState("10:00");
  const [blackTime, setBlackTime] = useState("10:00");
  const whiteTimer = useRef<ChessCountdown>();
  const blackTimer = useRef<ChessCountdown>();

  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(true);
  const [boardSize, setBoardSize] = useState<number>(700);
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [heightScreen, setHeightScreen] = useState<number>(0);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState<number>(2);
  const [bestLine, setBestline] = useState<string | null>("");
  const [positionEvaluation, setPositionEvaluation] = useState<number>(0);
  const [depth, setDepth] = useState<number>(20);
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
  useEffect(() => {
    whiteTimer.current = new ChessCountdown(10, 0, {
      onTick: (time) => setWhiteTime(time),
      onEnd: () => console.log("White lost on time!"),
    });

    blackTimer.current = new ChessCountdown(10, 0, {
      onTick: (time) => setBlackTime(time),
      onEnd: () => console.log("Black lost on time!"),
    });

    whiteTimer.current.start();

    return () => {
      whiteTimer.current?.pause();
      blackTimer.current?.pause();
    };
  }, []);

  const switchTurn = (turn: string) => {
    if (turn == "w") {
      whiteTimer.current?.applyIncrement();
      whiteTimer.current?.pause();
      blackTimer.current?.resume();
    } else {
      blackTimer.current?.applyIncrement();
      blackTimer.current?.pause();
      whiteTimer.current?.resume();
    }
  };

  const fetchPgnLocal = async () => {
    let headers = game.getHeaders();
    let dataGames = {
      white: {
        result: headers.Result == "0-1" ? "lose" : "win",
        username: headers.White,
      },
      black: {
        result: headers.Result == "0-1" ? "win" : "lose",
        username: headers.Black,
      },
      date: headers.Date,
    };
    setDataGamesImport(dataGames);
    let arr = null;
    try {
      setIsLoading(true);
      setDataAnalysis(arr);
      console.log("body analysis", JSON.stringify(game.pgn()), username);
      setPgn(game.pgn());
      const responseAnalysis = await proceedAnalysis(
        game.pgn(),
        username,
        10,
        60000
      );
      setDataAnalysis(responseAnalysis.data);
      arr = responseAnalysis.data;

      console.log("responseAnalysis:", responseAnalysis);
    } catch (err) {
      console.log("error", err);
      toast.error(err + "");
      setIsLoading(false);

      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      if (arr != null) {
        router.push("/analysis");
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let is3D = StyleChoosed == "3d" ? true : false;
    setIs3DMode(is3D);
  }, [StyleChoosed]);

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({
      square,
      verbose: true,
    });
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
      };
      return move;
    });
    newSquares[square] = {
      background: "#F5F682",
    };

    setOptionSquares(newSquares);
    return true;
  };
  const onSquareClick = (square: Square) => {
    setRightClickedSquares({} as Record<string, CSSProperties>);
    setBestline("");

    console.log("onSquareClick", square);
    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) {
        setPreviousSquare(square);
        setMoveFrom(square);
      }
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        square: moveFrom as Square,
        verbose: true,
      }) as Array<{ from: string; to: string; color: string; piece: string }>;
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);
      setCurrentSquare(square);
      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGamePosition(game.fen());
      setCurrentTurn((turnColor) => (turnColor != "White" ? "White" : "Black"));
      let isYourTurn = myColor == "white" ? "w" : "b";
      setTimeout(() => {
        findBestMove();
        switchTurn(isYourTurn);
      }, 1000);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  };
  const onPromotionPieceSelect = (
    piece?: string,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    setBestline("");
    setHintClicked(false);
    console.log(
      "onPromotionPieceSelect",
      piece,
      promoteFromSquare,
      promoteToSquare
    );

    if (piece) {
      game.move({
        from: promoteFromSquare || moveFrom,
        to: promoteToSquare || moveTo!,
        promotion: piece?.[1]?.toLowerCase() ?? "q",
      });
      setGamePosition(game.fen());
      setTimeout(() => {
        findBestMove();
      }, 1000);
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
      [previousSquare]: {
        backgroundColor: "#B9CA43",
        marginLeft: -0.5,
        marginTop: is3DMode ? 0.5 : -1.5,
      }, // Green for previous
    }),
    ...(currentSquare && {
      [currentSquare]: {
        backgroundColor: "#F5F682",
        marginLeft: -0.5,
        marginTop: is3DMode ? 0 : -1.5,
      }, // Yellow for current
    }),
  };

  const findBestMove = () => {
    let isYourTurn = myColor == "white" ? "w" : "b";
    console.log("game.turn() == isYourTurn", game.turn() == isYourTurn);
    if (game.turn() == isYourTurn) return false;
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        // In latest chess.js versions you can just write ```game.move(bestMove)```
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setBestline("");
        setHintClicked(false);
        setGamePosition(game.fen());
        setCurrentTurn((turnColor) =>
          turnColor != "White" ? "White" : "Black"
        );
        let isEnemyTurn = myColor != "white" ? "w" : "b";

        switchTurn(isEnemyTurn);
      }
    });
  };
  const handleHint = () => {
    let depthHint = depth;
    let isYourTurn = myColor == "white" ? "w" : "b";
    setBestline(null);
    engine.evaluatePosition(game.fen(), depthHint);
    engine.onMessage(
      ({ positionEvaluation, possibleMate, pv, depth, bestMove }) => {
        if (depth && depth < 10) return;
        positionEvaluation &&
          setPositionEvaluation(
            ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
          );
        possibleMate && setPossibleMate(possibleMate);
        if (game.turn() == isYourTurn) {
          console.log("handle hint", bestMove);
          !bestMove && setHintClicked(false);
          !bestMove && setBestline(null);
          bestMove && setBestline(bestMove);
          bestMove && setHintClicked(true);
        }
      }
    );
  };
  useEffect(() => {
    fillMovement();
    checkStatusGame();
  }, [gamePosition]);

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
    game.history({ verbose: true }).forEach((move) => {
      console.log(move);
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
  useEffect(() => {
    getVSAILogs({ limit: 30, page: 1 }).then((res: any) => {
      console.log("res getVSAILogs", res);
      setPastGames(res.data);
    });
  }, []);
  const setHeaderGameStart = () => {
    let date = formatDatePgn();
    let time = formatTimePgn();
    let whiteName =
      AIChoosed.color == "white" ? AIChoosed.opponent.name + " (AI)" : username;
    let blackName =
      AIChoosed.color != "white" ? AIChoosed.opponent.name + " (AI)" : username;
    // set header
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
    let date = formatDatePgn();
    let time = formatTimePgn();
    let isWhiteWin = winnerColor == "white" ? "1" : "0";
    let isBlackWin = winnerColor != "white" ? "1" : "0";
    let winResult = isWhiteWin + "-" + isBlackWin;
    // set header
    game.header("Result", winResult);
    game.header("EndDate", date);
    game.header("EndTime", time);
  };
  useEffect(() => {
    setStockfishLevel(getStockfishDepth(AIChoosed.opponent.elo));
    setMyColor(AIChoosed.color);
    console.log("AIChoosed.color", AIChoosed.color);
    setHeaderGameStart();
    if (AIChoosed.color == "black") {
      setTimeout(() => {
        findBestMove();
      }, 1000);
    }
    setHeightScreen(window?.innerHeight);
  }, []);
  const getStockfishDepth = (elo: number) => {
    if (elo < 250) return 1;
    if (elo < 500) return 2;
    if (elo < 800) return 4;
    if (elo < 1000) return 6;
    if (elo < 1200) return 8;
    if (elo < 1400) return 10;
    if (elo < 1600) return 12;
    if (elo < 1800) return 14;
    if (elo < 2000) return 16;
    if (elo < 2200) return 18;
    if (elo < 2400) return 20;
    if (elo < 2600) return 22;
    if (elo < 2800) return 24;
    return 26; // 2800+ players (Super GM strength)
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.9 : 480;
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
  const handleShare = async () => {
    try {
      const currentPgn = game.pgn();

      await navigator.clipboard.writeText(JSON.stringify(currentPgn));
      toast("Current PGN copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const handleDownload = () => {
    if (game) {
      const currentPgn = game.pgn();

      // Create a blob with the PGN content
      const blob = new Blob([currentPgn], { type: "text/plain" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      const currentEpochTimeMs = Date.now();

      let fileName =
        AIChoosed.opponent.name +
        "_" +
        AIChoosed.opponent.elo +
        "_" +
        currentEpochTimeMs;
      a.download = fileName + ".pgn"; // Name of the downloaded file
      document.body.appendChild(a);
      a.click();

      // Clean up by removing the anchor and revoking the URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("Current PGN Downloaded!");
    }
  };
  const handleThreeD = () => {
    setIs3DMode(!is3DMode);
  };
  const handleResign = () => {
    setStatusGame("Loss");
    setHeaderGameFinish();
    // Determine the winner based on the player who was in checkmate
    let loserColor = game.turn(); // 'w' for white, 'b' for black
    let winnerColor = loserColor === "w" ? "black" : "white";
    let losserColor = loserColor != "w" ? "black" : "white";
    let isUserWin = myColor === winnerColor;
    setWinnerColor(winnerColor);
    setLoserColor(losserColor);
    console.log(`The ${winnerColor} player wins!`);
  };
  const handleAnalyzeGame = () => {
    fetchPgnLocal();
  };
  const handleRematch = () => {
    game.reset();
    setGamePosition(game.fen());
    setHeaderGameStart();
    setLoserColor("");
    setWinnerColor("");
    setStatusGame("Ongoing");
    setPreviousSquare(undefined);
    setCurrentSquare(undefined);
  };
  const handleNewGame = () => {
    router.back();
  };
  const handleSaveLog = async () => {
    let body = {
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
    let isUserWin = false;
    let isDraw = false;
    console.log("game.isGameOver()", game.isGameOver(), formatTimePgn());
    if (game.isGameOver()) {
      setHeaderGameFinish();
      // Determine the winner based on the player who was in checkmate
      let loserColor = game.turn(); // 'w' for white, 'b' for black
      let winnerColor = loserColor === "w" ? "black" : "white";
      let losserColor = loserColor != "w" ? "black" : "white";
      isUserWin = myColor === winnerColor;
      setWinnerColor(winnerColor);
      setLoserColor(losserColor);
      console.log(`The ${winnerColor} player wins!`);

      if (game.isCheckmate()) {
        console.log("Game Over! Checkmate!");

        let gameStatus = isUserWin ? "Win" : !isUserWin ? "Loss" : "Ongoing";
        setStatusGame(gameStatus);
      } else {
        isDraw = true;
        console.log("Game Over! Stalemate or Draw.");
        setStatusGame("Draw");
      }
    }
  };
  useEffect(() => {
    console.log("statusGame useEffect", statusGame);
    if (statusGame == "Win" || statusGame == "Loss" || statusGame == "Draw") {
      handleSaveLog();
    }
  }, [statusGame]);
  const buttonBoard = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="flex flex-row self-end sm:self-center justify-end items-center gap-3 mt-2"
      >
        <button onClick={handleSwitch}>
          <Image
            src={"/images/play-vs-ai/switch.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] rounded-full object-contain"
          />
        </button>
        <SettingBoard />
        <button onClick={handleThreeD}>
          <Image
            src={`/icons/${!is3DMode ? `3d-icon` : `2d-icon`}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button>
      </div>
    );
  };
  const buttonBoardColumn = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="hidden xl:flex max-w-[20px] flex-col justify-start items-center gap-3 mt-1"
      >
        <button onClick={handleSwitch}>
          <Image
            src={"/images/play-vs-ai/switch.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] rounded-full object-contain"
          />
        </button>
        <SettingBoard />

        <button onClick={handleThreeD}>
          <Image
            src={`/icons/${!is3DMode ? `3d-icon` : `2d-icon`}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button>
      </div>
    );
  };
  const blackPlayer = () => {
    let isWin = winnerColor == "black";
    let isDraw = statusGame == "Draw";
    let isLoss = loserColor == "black";
    return (
      <div
        className={`flex flex-row min-h-[80px] items-center justify-between rounded-[8px] border ${
          isWin
            ? "border-[#00B427] bg-[#00B42716]"
            : isDraw
            ? "border-[#221AE9] bg-[#221AE916]"
            : isLoss
            ? "border-[#FD0000] bg-[#FD000020]"
            : "border-[#DEDEDE] bg-white "
        } p-2 gap-2 mb-2`}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            src={myColor != "white" ? user?.imageUrl : AIChoosed.opponent.img}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] rounded-full object-contain"
          />

          <span
            className={`text-[17.23px] font-medium ${
              isWin
                ? "text-[#00B427] "
                : isDraw
                ? "text-[#221AE9] "
                : isLoss
                ? "text-[#FD0000]  "
                : "text-[#040404]"
            }`}
          >
            {myColor != "white" ? "You" : AIChoosed.opponent.name}
            {/* <div className="text-center">
              <h2 className="text-xl">{blackTime}</h2>
            </div> */}
          </span>
        </div>
        <div className="flex flex-row items-center ">
          {capturedBlack &&
            capturedBlack.length > 0 &&
            capturedBlack.map((captured, index) => {
              let icon = captured.capturedTheme;
              let nextIcon = capturedBlack[index + 1]
                ? capturedBlack[index + 1].capturedTheme
                : "";
              if (icon.length != 2) return null;
              return (
                <div
                  key={index}
                  className={`${icon == nextIcon ? "-mr-2" : ""}`}
                >
                  {icon && (
                    <Image
                      src={`/pieces/${PieceChoosed}/${icon}.png`}
                      alt="icon"
                      width={1000}
                      height={1000}
                      className="w-[20px] h-[28px] sm:w-[24px] sm:h-[32px] lg:w-[28px] lg:h-[36px] object-contain inline-block"
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  const whitePlayer = () => {
    let isWin = winnerColor == "white";
    let isDraw = statusGame == "Draw";
    let isLoss = loserColor == "white";
    return (
      <div
        className={`flex flex-row min-h-[80px] items-center justify-between rounded-[8px] border ${
          isWin
            ? "border-[#00B427] bg-[#00B42716]"
            : isDraw
            ? "border-[#221AE9] bg-[#221AE916]"
            : isLoss
            ? "border-[#FD0000] bg-[#FD000016]"
            : "border-[#DEDEDE] bg-white"
        } p-2 gap-2 mb-2`}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            src={myColor == "white" ? user?.imageUrl : AIChoosed.opponent.img}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] rounded-full object-contain"
          />

          <span
            className={`text-[17.23px] font-medium ${
              isWin
                ? "text-[#00B427] "
                : isDraw
                ? "text-[#221AE9] "
                : isLoss
                ? "text-[#FD0000]  "
                : "text-[#040404]"
            }`}
          >
            {myColor == "white" ? "You" : AIChoosed.opponent.name}

            {/* <div className="text-center">
              <span className="text-xl">{whiteTime}</span>
            </div> */}
          </span>
        </div>
        <div className="flex flex-row items-center ">
          {capturedWhite &&
            capturedWhite.length > 0 &&
            capturedWhite.map((captured, index) => {
              let icon = captured.capturedTheme;
              let nextIcon = capturedWhite[index + 1]
                ? capturedWhite[index + 1].capturedTheme
                : "";
              if (icon.length != 2) return null;
              return (
                <div
                  key={index}
                  className={`${icon == nextIcon ? "-mr-2" : ""}`}
                >
                  {icon && (
                    <Image
                      src={`/pieces/${PieceChoosed}/${icon}.png`}
                      alt="icon"
                      width={1000}
                      height={1000}
                      className="w-[20px] h-[28px] sm:w-[24px] sm:h-[32px] lg:w-[28px] lg:h-[36px] object-contain inline-block"
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  const renderButtonPlaying = () => {
    return (
      <motion.div
        variants={fadeInUp}
        className="flex w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-2 p-2"
      >
        <button
          disabled={
            currentTurn.toLowerCase() != myColor ||
            (!hintClicked && bestLine?.length == null)
          }
          onClick={handleHint}
          className={`flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border ${
            hintClicked
              ? `border-[#221AE9] bg-[#221AE908] text-[#221AE9]`
              : `border-[#DEDEDE] bg-white`
          } rounded-[8px] hover:bg-blue-100 gap-1`}
        >
          {!hintClicked && bestLine?.length == null ? (
            <DotSpinner size={5} />
          ) : (
            <>
              <Image
                src={`${
                  hintClicked
                    ? `/images/play-vs-ai/hint.png`
                    : `/images/play-vs-ai/hint-icon.png`
                } `}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[11px] h-[16px] object-contain "
              />
              <span className="font-medium text-xs mt-1 ">Hint</span>
            </>
          )}
        </button>
        <button
          onClick={handleResign}
          className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1 "
        >
          <Image
            src={"/images/play-vs-ai/resign.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[11px] h-[16px] object-contain "
          />

          <span className="font-medium text-xs mt-1 ">Resign</span>
        </button>
        <button
          onClick={handleNewGame}
          className="flex flex-row items-center justify-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
        >
          <Image
            src={"/images/play-vs-ai/new-game.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[16px] h-[16px] object-contain"
          />
          <span className="font-medium text-xs mt-1">New Game</span>
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
        <button
          onClick={handleAnalyzeGame}
          className="md:hidden xl:block btn-primary w-full rounded-full h-[40px]"
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <BarChart2 color="white" className="w-[20px] h-[20px]" size={20} />
            <span>Analyze Game</span>
          </div>
        </button>
        <div className="flex w-full gap-2">
          <button
            onClick={handleNewGame}
            className="btn-secondary w-full md:w-1/4 xl:w-full rounded-full h-[40px]"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <Plus color="#221AE9" className="w-[20px] h-[20px]" size={20} />
              <span className="text-[#221AE9] font-medium">New Game</span>
            </div>
          </button>
          <button
            onClick={handleRematch}
            className="btn-tertiary w-full md:w-1/4 xl:w-full rounded-full h-[40px]"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                src={"/images/play-vs-ai/rematch.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[16px] h-[16px] object-contain"
              />
              <span className="text-[#221AE9] font-medium">Rematch</span>
            </div>
          </button>
          <button
            onClick={handleAnalyzeGame}
            className="hidden md:block xl:hidden md:w-2/4 btn-primary w-full rounded-full h-[40px]"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <BarChart2
                color="white"
                className="w-[20px] h-[20px]"
                size={20}
              />
              <span>Analyze Game</span>
            </div>
          </button>
        </div>
        <div className="flex w-full gap-2">
          <button
            onClick={handleShare}
            className="flex flex-row items-center justify-center min-h-[40px] w-full px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
          >
            <Image
              src={"/images/play-vs-ai/share-filled.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[16px] h-[16px] object-contain"
            />
            <span className="font-medium text-xs mt-1">Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-row items-center justify-center min-h-[40px] w-full px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
          >
            <Image
              src={"/images/play-vs-ai/download-filled.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[16px] h-[16px] object-contain"
            />
            <span className="font-medium text-xs mt-1">Download</span>
          </button>
        </div>
      </motion.div>
    );
  };
  const renderCommentaryGame = () => {
    let gradColor =
      statusGame == "Win"
        ? `bg-[linear-gradient(to_right,_#FFFFFF58,_#00B427,_#00B427,_#00B427,_#00B427,_#00B427,_#00B427,_#FFFFFF40)]`
        : statusGame == "Draw"
        ? `bg-[linear-gradient(to_right,_#FFFFFF58,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#FFFFFF40)]`
        : `bg-[linear-gradient(to_right,_#FFFFFF58,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#FFFFFF40)]`;
    let color =
      statusGame == "Win"
        ? "#00B427"
        : statusGame == "Draw"
        ? "#221AE9"
        : "#C01B1B";
    let icon =
      statusGame == "Win"
        ? "you-win"
        : statusGame == "Draw"
        ? "you-draw"
        : "you-loss";
    let sparks =
      statusGame == "Win"
        ? "sparks-win"
        : statusGame == "Draw"
        ? "sparks-draw"
        : "sparks-loss";

    let content =
      statusGame == "Win"
        ? "Congratulations! You won this game!"
        : statusGame == "Draw"
        ? "The Game ended in a Draw."
        : "The Game ended You loss";
    return (
      <motion.div
        variants={fadeInUp}
        className={`relative justify-self-center w-[95%] mt-4 rounded-[8px] ${gradColor} border border-[${color}] p-[1px]`}
      >
        <div
          className={`flex h-[56px] flex-row items-center rounded-[8px] border-2 border-dashed border-[${color}] gap-3`}
        >
          <Image
            src={`/images/play-vs-ai/${icon}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[30px] h-[30px] object-contain m-4 mr-0"
          />
          <span className="font-medium text-[14px] text-white">{content}</span>
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
  if (loadingAnalyze) return <LoadingPage />;
  return (
    <Navigation>
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
              <span className="font-semibold text-[18px]">Play VS AI</span>
            </div>
            <div className="flex " />
          </div>

          <div className="rounded-[8px] min-h-[54px] bg-[#FAFDFF] border border-[#DEDEDE] p-4">
            <div className="flex items-center justify-center rounded-[6px] bg-white shadow-md border border-[#DEDEDE] px-4 py-2">
              <span className="text-xs font-normal">
                Current Turn:{" "}
                <span className="text-[14px] font-medium">
                  {game.turn() == "w" ? "White" : "Black"}
                </span>
              </span>
            </div>
          </div>
          <div className="xl:border xl:border-[#DEDEDE] xl:p-4 xl:rounded-[16px]">
            {orientation != "white" ? whitePlayer() : blackPlayer()}
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
                    arePiecesDraggable={true}
                    orientation={orientation}
                    boardWidth={boardSize}
                    position={gamePosition}
                    onSquareClick={onSquareClick}
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
                      bestLine &&
                      bestLine.length > 0 &&
                      bestLine?.split(" ")?.[0]
                        ? [
                            [
                              bestLine
                                ?.split(" ")?.[0]
                                .substring(0, 2) as Square,
                              bestLine
                                ?.split(" ")?.[0]
                                .substring(2, 4) as Square,
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
                    position={gamePosition}
                    onSquareClick={onSquareClick}
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
                      bestLine &&
                      bestLine.length > 0 &&
                      bestLine?.split(" ")?.[0]
                        ? [
                            [
                              bestLine
                                ?.split(" ")?.[0]
                                .substring(0, 2) as Square,
                              bestLine
                                ?.split(" ")?.[0]
                                .substring(2, 4) as Square,
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
                <div className="flex flex-row items-center justify-center gap-1">
                  <MoveRightIcon color="#221AE950" size={16} />
                  <span className="h-[14px] font-normal text-[11px]">
                    Move Recommendation
                  </span>
                </div>
              </div>
            </div>
            {orientation == "white" ? whitePlayer() : blackPlayer()}
          </div>
        </div>
        {/* {buttonBoardColumn()} */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 min-h-[68px] rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-2 gap-2">
            <TabsTrigger
              value="current"
              className={`gap-2 py-2 ${
                selectedTab == "current"
                  ? `shadow-md border border-[#DEDEDE]`
                  : ``
              }`}
              onClick={() => setSelectedTab("current")}
            >
              <Image
                src={`/images/play-vs-ai/chess-king-rook${
                  selectedTab == "current" ? `-active` : ``
                }.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[19px] h-[19px] object-contain"
              />
              <span
                className={`text-[16px] font-semibold ${
                  selectedTab == "current" ? `text-[#221AE9]` : `text-black`
                }`}
              >
                Current Game
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className={`gap-2 py-2 ${
                selectedTab == "past" ? `shadow-md border border-[#DEDEDE]` : ``
              }`}
              onClick={() => setSelectedTab("past")}
            >
              <Image
                src={`/images/play-vs-ai/past-games${
                  selectedTab == "past" ? `-active` : ``
                }.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] object-contain"
              />
              <span
                className={`text-[16px] font-semibold ${
                  selectedTab == "past" ? `text-[#221AE9]` : `text-black`
                }`}
              >
                Past Games
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="gap-2">
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#DEDEDE] gap-2 mt-4 ">
              <span className="font-semibold text-[16px] my-2 xl:my-4">
                Movement Details
              </span>
              <div
                style={{
                  height:
                    statusGame == "Ongoing"
                      ? heightScreen * 0.65
                      : heightScreen * 0.45,
                }}
                className="px-4 w-full overflow-y-auto "
              >
                <table className="w-full table-auto border-separate border-spacing-0 rounded-[8px] border-collapse border-[#BDD0F9]">
                  <thead>
                    <tr className="bg-[#D7E3FB] ">
                      <th className="p-2 border font-normal text-xs border border-[#BDD0F9]">
                        #
                      </th>
                      <th className="p-2 border font-normal text-xs border border-[#BDD0F9]">
                        {myColor == "white" ? "You" : "Computer"} (White)
                      </th>
                      <th className="p-2 border font-normal text-xs border border-[#BDD0F9]">
                        {myColor != "white" ? "You" : "Computer"} (Black)
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
                            <td
                              className={`p-2 border font-normal text-xs border-[#BDD0F9] ${
                                index + 1 == capturedWhite.length &&
                                `rounded-bl-[8px]`
                              }`}
                            >
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
                            <td
                              className={`text-center align-middle p-2 border border-[#BDD0F9] ${
                                index + 1 == capturedWhite.length &&
                                `rounded-br-[8px]`
                              }`}
                            >
                              {capturedBlack[index] != null &&
                                capturedBlack[index].capturedTheme.length ==
                                  2 && (
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
              </div>
              {statusGame != "Ongoing" && renderCommentaryGame()}
              {statusGame == "Ongoing"
                ? renderButtonPlaying()
                : renderButtonFinish()}
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
                        past.status.toLowerCase() == "Ongoing"
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
    </Navigation>
  );
}
