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
import { ArrowLeft, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
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
type MoveClassification =
  | "best-move"
  | "brilliant-move"
  | "excellent-move"
  | "good-move"
  | "neutral-move"
  | "inaccuracy-move"
  | "mistake-move"
  | "blunder-move"
  | "checkmate-you"
  | "checkmate-opponent";

export default function PlayingPage() {
  const router = useRouter();

  const { setFen, setPGN, setOpen } = useShareGame();
  const { proceedAnalysis, pgnToFenList } = useStockfishAnalysis();
  const { isMember } = useProfileStore();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const [beforeFen, setBeforeFen] = useState<string>("");
  const [afterFen, setAfterFen] = useState<string>("");
  const { getVSAILogs, postVSAILogs, isLoading } = useApiClient();
  const {
    setIsLoading,
    setPgn,
    setDataAnalysis,
    setDataGames,
    setError,
    username,
    setDataGamesImport,
  } = usePgnStore();
  const { user } = useAuth();
  const { hideDiv } = usePgnStore();
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { open, setOpen: setOpenGameStatus } = useGameEndStatus();
  const refBoard = useRef<HTMLDivElement | null>(null);

  const { PieceChoosed, StyleChoosed } = useChessBoardThemeStore();
  const [selectedTab, setSelectedTab] = useState<string>("current");
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [myColor, setMyColor] = useState<string>(AIChoosed.color);
  const [currentTurn, setCurrentTurn] = useState<string>("White");

  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(true);
  const [boardSize, setBoardSize] = useState<number>(700);
  const engine = useMemo(() => new Engine(), []);
  const engine2 = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [heightScreen, setHeightScreen] = useState<number>(0);
  const [heightBoard, setHeightBoard] = useState<number | undefined>(0);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [bestLine, setBestline] = useState<string | null>("");
  const [positionEvaluation, setPositionEvaluation] = useState<number>(0);
  const [moveClassification, setMoveClassification] = useState<string>("");
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
  const [moveData, setMoveData] = useState<any>();
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
      //console.log("body analysis", JSON.stringify(game.pgn()), username);
      setPgn(game.pgn());
      const responseAnalysis = await proceedAnalysis(
        game.pgn(),
        username,
        10,
        60000
      );
      setDataAnalysis(responseAnalysis.data);
      arr = responseAnalysis.data;

      //console.log("responseAnalysis:", responseAnalysis);
    } catch (err) {
      //console.log("error", err);
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
        borderRadius: "50%",
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
      setMoveData(move);

      console.log("move.san", move);
      playSound(game, move);
      getClassificationMove(move);
      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGamePosition(game.fen());
      setAfterFen(game.fen());

      setCurrentTurn((turnColor) => (turnColor != "White" ? "White" : "Black"));
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  };
  const handleClassify = async (move: any) => {
    const result = await classifyMove(beforeFen, game.fen(), move.to);
    console.log(`Move classification: ${result}`);
    return result;
  };
  const getClassificationMove = async (move: any) => {
    let moveUserClassification = await handleClassify(move);
    setMoveClassification(moveUserClassification);
    console.log("moveUserClassification", moveUserClassification);
    setTimeout(() => {
      findEnemyMove();
    }, 2500);
  };
  const onPromotionPieceSelect = (
    piece?: string,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    setBestline("");
    setHintClicked(false);
    setBeforeFen(game.fen());

    if (piece) {
      let move = game.move({
        from: promoteFromSquare || moveFrom,
        to: promoteToSquare || moveTo!,
        promotion: piece?.[1]?.toLowerCase() ?? "q",
      });
      setMoveData(move);

      setGamePosition(game.fen());
      playSound(game, move);
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
        // marginLeft: -0.5,
        // marginTop: is3DMode ? 0.5 : -1.5,
      }, // Green for previous
    }),
    ...(currentSquare && {
      [currentSquare]: {
        backgroundColor: "#F5F682",
        // marginLeft: -0.5,
        // marginTop: is3DMode ? 0 : -1.5,
      }, // Yellow for current
    }),
  };

  const findEnemyMove = () => {
    let isYourTurn = myColor == "white" ? "w" : "b";
    // //console.log("game.turn() == isYourTurn", game.turn() == isYourTurn);
    if (game.turn() == isYourTurn) return false;
    engine.getStockfishMove(game.fen(), AIChoosed.opponent.elo).then((pv) => {
      console.log("response getStockfishMove", pv);

      let move = game.move({
        from: pv.substring(0, 2),
        to: pv.substring(2, 4),
        promotion: pv.substring(4, 5),
      });
      setMoveData(move);

      playSound(game, move);
      setBeforeFen(game.fen());

      setPreviousSquare(pv.substring(0, 2) as Square);
      setCurrentSquare(pv.substring(2, 4) as Square);

      setMoveClassification("");
      setBestline("");
      setHintClicked(false);
      setGamePosition(game.fen());
      setCurrentTurn((turnColor) => (turnColor != "White" ? "White" : "Black"));
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
          //console.log("handle hint", bestMove);
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
      //console.log(move);
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
    //console.log("capturedPiecesWhite", capturedPiecesWhite);
    //console.log("capturedPiecesBlack", capturedPiecesBlack);
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
      //console.log("res getVSAILogs", res);
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
    setMyColor(AIChoosed.color);
    //console.log("AIChoosed.color", AIChoosed.color);
    setHeaderGameStart();
    setBeforeFen(game.fen());
    if (AIChoosed.color == "black") {
      setTimeout(() => {
        findEnemyMove();
      }, 1000);
    }
    setHeightScreen(window?.innerHeight);
    setHeightBoard(refBoard.current?.clientHeight);
  }, []);

   
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
    //console.log("Resizing board...", isPortrait, window.innerWidth);

    if (isPortrait) {
      // In portrait mode, use screen width as the primary constraint
      const availableWidth = width - minPadding * 2;
      // Use 85% of available width for mobile, 90% for tablets
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
      //console.log(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      // In landscape, use height as the primary constraint
      const availableHeight = height - minPadding * 2;
      // Use 80% of available height
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
      //console.log("size board...", Math.min(maxSize, availableHeight * 0.8));
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
      const currentFen = game.fen();
      setFen(currentFen);
      setPGN(currentPgn);
      setOpen(true);
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
    setTimeout(() => {
      setOpenGameStatus(true);
    }, 1000);
    setHeaderGameFinish();
    // Determine the winner based on the player who was in checkmate
    let loserColor = game.turn(); // 'w' for white, 'b' for black
    let winnerColor = loserColor === "w" ? "black" : "white";
    let losserColor = loserColor != "w" ? "black" : "white";
    let isUserWin = myColor === winnerColor;
    setWinnerColor(winnerColor);
    setLoserColor(losserColor);
    //console.log(`The ${winnerColor} player wins!`);
  };
  const handleAnalyzeGame = () => {
    if (isMember) {
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
    //console.log("game.isGameOver()", game.isGameOver(), formatTimePgn());
    if (game.isGameOver()) {
      setHeaderGameFinish();
      // Determine the winner based on the player who was in checkmate
      let loserColor = game.turn(); // 'w' for white, 'b' for black
      let winnerColor = loserColor === "w" ? "black" : "white";
      let losserColor = loserColor != "w" ? "black" : "white";
      isUserWin = myColor === winnerColor;
      setWinnerColor(winnerColor);
      setLoserColor(losserColor);
      //console.log(`The ${winnerColor} player wins!`);

      if (game.isCheckmate()) {
        //console.log("Game Over! Checkmate!");

        let gameStatus = isUserWin ? "Win" : !isUserWin ? "Loss" : "Ongoing";
        let commentar =
          gameStatus == "Win" ? "checkmate-you" : "checkmate-opponent";
        setMoveClassification(commentar);
        setStatusGame(gameStatus);
        setTimeout(() => {
          setOpenGameStatus(true);
        }, 1000);
      } else {
        isDraw = true;
        //console.log("Game Over! Stalemate or Draw.");
        setStatusGame("Draw");
        setTimeout(() => {
          setOpenGameStatus(true);
        }, 1000);
      }
    }
  };
  useEffect(() => {
    //console.log("statusGame useEffect", statusGame);
    if (statusGame == "Win" || statusGame == "Loss" || statusGame == "Draw") {
      handleSaveLog();
    }
  }, [statusGame]);

  return (
    <div className="flex flex-col xl:flex-row w-full bg-white p-2 sm:p-4 gap-4 lg:mt-8 xl:mt-0">
      <GameEndStatus gameStatus={statusGame.toLowerCase()} />
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
        <div
          className="xl:border xl:border-[#DEDEDE] xl:p-4 xl:rounded-[16px]"
          ref={refBoard}
        >
          {orientation != "white" ? (
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
          ) : (
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
          )}{" "}
          <div className="flex items-center justify-between mb-2">
            {moveClassification != "" &&
            moveClassification != "good-move" &&
            moveClassification != "excellent-move" &&
            moveClassification != "neutral-move" &&
            moveClassification != "mistake-move" &&
            moveClassification != "inaccuracy-move" ? (
              <CommentaryMove classify={moveClassification} />
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
              <div className="flex flex-row items-center justify-center gap-1">
                <MoveRightIcon color="#221AE950" size={16} />
                <span className="h-[14px] font-normal text-[11px]">
                  Move Recommendation
                </span>
              </div>
            </div>
          </div>
          {orientation == "white" ? (
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
          ) : (
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
          )}
        </div>
      </div>
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
          <div
            className="flex flex-col items-center justify-center rounded-[16px] border border-[#DEDEDE] gap-2 mt-4 "
            style={{ maxHeight: heightBoard }}
          >
            <span className="font-semibold text-[16px] my-2 xl:my-4">
              Movement Details
            </span>
            <div
              style={{
                height:
                  statusGame == "Ongoing"
                    ? (heightBoard ?? 0) * 0.65
                    : (heightBoard ?? 0) * 0.45,
              }}
              className="px-4 w-full overflow-y-auto "
            >
              <TableMovement
                myColor={myColor}
                capturedWhite={capturedWhite}
                capturedBlack={capturedBlack}
                PieceChoosed={PieceChoosed}
              />
            </div>
            {statusGame != "Ongoing" && (
              <CommentarGame statusGame={statusGame} />
            )}
            {statusGame == "Ongoing" ? (
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
                handleAnalyzeGame={handleAnalyzeGame}
                handleNewGame={handleNewGame}
                handleRematch={handleRematch}
                handleShare={handleShare}
                handleDownload={handleDownload}
              />
            )}
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
  );
}
