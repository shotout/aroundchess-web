"use client";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import ThreeDChessboard from "@/components/chessboard/3d/ThreeDChessboard";
import WoodBoard from "@/components/chessboard/wood/WoodBoard";
import { SettingBoard } from "@/components/modal/SettingBoard";
import Navigation from "@/components/navigator/navigation";
import { Engine } from "@/components/playground/src/lib/stockfish";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { postVSAILogs } from "@/functions/api-client";
import { changeNamePiece } from "@/functions/change-name-piece";
import { useAuth, useUser } from "@clerk/nextjs";
import { Chess, PieceSymbol, Square } from "chess.js";
import { ArrowLeft, HistoryIcon, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
export default function Playing() {
  const router = useRouter();
  const { user } = useUser();
  const { sessionId } = useAuth();
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { PieceChoosed } = useChessBoardThemeStore();
  const [selectedTab, setSelectedTab] = useState<string>("current"); // Default size
  const [orientation, setOrientation] = useState<BoardOrientation>("white"); // Default size
  const [myColor, setMyColor] = useState<string>(AIChoosed.color); // Default size
  const [currentTurn, setCurrentTurn] = useState<string>("White"); // Default size
  const [is3DMode, setIs3DMode] = useState<boolean>(false); // Default size
  const [boardSize, setBoardSize] = useState<number>(700); // Default size
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [heightScreen, setHeightScreen] = useState<number>(0);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState<number>(2);
  const [bestLine, setBestline] = useState<string | null>(null);
  const [positionEvaluation, setPositionEvaluation] = useState<number>(0);
  const [depth, setDepth] = useState<number>(10);
  const [hintClicked, setHintClicked] = useState<boolean>(false);
  const [possibleMate, setPossibleMate] = useState<string>("");
  const [statusGame, setStatusGame] = useState<string>("");
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
      // background:"#25CEDA"
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
      if (hasMoveOptions) setMoveFrom(square);
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
      setTimeout(() => {
        findBestMove();
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
      }
    });
  };
  const handleHint = () => {
    setHintClicked(true);
    let depthHint = depth;
    engine.evaluatePosition(game.fen(), depthHint);
    engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
      if (depth && depth < 10) return;
      positionEvaluation &&
        setPositionEvaluation(
          ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
        );
      possibleMate && setPossibleMate(possibleMate);
      depth && setDepth(depth);
      pv && setBestline(pv);
    });
  };

  useEffect(() => {
    fillMovement();
    checkStatusGame()
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
    localStorage.setItem("token", sessionId + "");

    setStockfishLevel(getStockfishDepth(AIChoosed.opponent.elo));
    setMyColor(AIChoosed.color);
    console.log("AIChoosed.color", AIChoosed.color);
    if (AIChoosed.color == "black") {
      setTimeout(() => {
        findBestMove();
      }, 1000);
    }
    setHeightScreen(window?.innerHeight);
    handleResize();
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
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth > 1024 ? window.innerWidth / 2.9 : 453;
    // const maxSize = window.innerWidth > 1300 ? 453 : window.innerWidth/1.5;
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
  const handleSetting = () => {};
  const handleThreeD = () => {
    setIs3DMode(!is3DMode);
  };
  const handleResign = () => {
    router.replace("/playground/play-vs-ai");
    handleSaveLog();
  };
  const handleNewGame = () => {
    handleSaveLog();
  };
  const handleSaveLog = async () => {
    let body = {
      enemyTag: AIChoosed.opponent.name,
      eloRating: AIChoosed.opponent.elo,
      totalMoves: game.history().length,
      totalTime: "10 Minutes",
      status: statusGame,
      pgn: game.pgn(),
    };
    await postVSAILogs(body);
    game.reset();
    setGamePosition(game.fen());
  };
  const checkStatusGame = () => {
    let isUserWin = false;
    let isDraw = false;
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        console.log("Game Over! Checkmate!");
        // Determine the winner based on the player who was in checkmate
        let loserColor = game.turn(); // 'w' for white, 'b' for black
        let winnerColor = loserColor === "w" ? "black" : "white";
        isUserWin = myColor === winnerColor;
        console.log(`The ${winnerColor} player wins!`);
      } else {
        isDraw = true;
        console.log("Game Over! Stalemate or Draw.");
      }
    }
    let gameStatus = isUserWin
      ? "Win"
      : !isUserWin
      ? "Loss"
      : isDraw
      ? "Draw"
      : "Ongoing";
      setStatusGame(gameStatus);
  };
  const buttonBoard = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="xl:hidden flex flex-row self-end sm:self-center justify-end items-center gap-3"
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
        {/* <button onClick={handleThreeD}>
          <Image
            src={"/images/play-vs-ai/3d.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button> */}
      </div>
    );
  };
  const buttonBoardColumn = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="hidden xl:flex max-w-[20px]  flex-col justify-start items-center gap-3"
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

        {/* <button onClick={handleThreeD}>
          <Image
            src={"/images/play-vs-ai/3d.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button> */}
      </div>
    );
  };
  const blackPlayer = () => {
    return (
      <div className="flex flex-row min-h-[80px] items-center justify-between rounded-[8px] bg-white border border-[#DEDEDE] p-2 gap-2 mb-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={myColor != "white" ? user?.imageUrl : AIChoosed.opponent.img}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] rounded-full object-contain"
          />

          <span className="text-[17.23px] font-medium">
            {myColor != "white" ? "You" : AIChoosed.opponent.name}
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
    return (
      <div className="flex flex-row min-h-[80px] items-center justify-between rounded-[8px] bg-white border border-[#DEDEDE] p-2 gap-2 mb-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={myColor == "white" ? user?.imageUrl : AIChoosed.opponent.img}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] rounded-full object-contain"
          />

          <span className="text-[17.23px] font-medium">
            {myColor == "white" ? "You" : AIChoosed.opponent.name}
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
            <div className="flex flex-col justify-center items-center gap-3 ">
              {buttonBoard()}
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

              {/* {is3DMode ? (
                <ThreeDChessboard
                  onPieceDrop={onDrop}
                  orientation={orientation}
                  boardWidth={boardSize}
                  position={gamePosition}
                />
              ) : (
                <TwoDChessboard
                  orientation={orientation}
                  boardWidth={boardSize}
                  position={gamePosition}
                  onPieceDrop={onDrop}
                />
              )} */}
              <div className="flex flex-row flex-wrap items-center justify-center gap-2 xl:mb-2">
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
        {buttonBoardColumn()}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 min-h-[54px] rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-2 gap-2">
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
            <div className="flex flex-col items-center justify-center rounded-[16px] bg-white border border-[#DEDEDE] gap-2">
              <span className="font-semibold text-[16px] my-1">
                Movement Details
              </span>
              <div
                style={{ height: heightScreen * 0.8 }}
                className="px-2 w-full xl:max-h-[70vh] overflow-y-auto"
              >
                <table className="w-full border-collapse rounded-[4px] border-[#BDD0F9]">
                  <thead>
                    <tr className="bg-[#D7E3FB]">
                      <th className="p-2 border font-normal text-xs">#</th>
                      <th className="p-2 border font-normal text-xs">
                        {myColor == "white" ? "You" : "Computer"} (White)
                      </th>
                      <th className="p-2 border font-normal text-xs">
                        {myColor != "white" ? "You" : "Computer"} (Black)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {capturedWhite &&
                      capturedWhite.length > 0 &&
                      capturedWhite.map((captured, index) => {
                        let move = captured.san;
                        let icon = captured.captured;
                        return (
                          <tr className="text-center" key={index}>
                            <td className="p-2 border font-normal text-xs">
                              {index + 1}
                            </td>
                            <td className="text-center align-middle p-2 border ">
                              {icon && (
                                <Image
                                  src={`/images/play-vs-ai/${icon}-white.png`}
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
                            <td className="text-center align-middle p-2 border  ">
                              {capturedBlack[index] != null &&
                                capturedBlack[index].captured != null && (
                                  <Image
                                    src={`/images/play-vs-ai/${capturedBlack[index].captured}-black.png`}
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
              <div className="flex w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-2 p-2">
                <button
                  disabled={currentTurn.toLowerCase() != myColor}
                  onClick={handleHint}
                  className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#221AE9] bg-[#221AE908] text-[#221AE9] rounded-[8px] hover:bg-blue-100 gap-1"
                >
                  <Image
                    src={"/images/play-vs-ai/hint.png"}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[11px] h-[16px] object-contain "
                  />

                  <span className="font-medium text-xs mt-1 ">Hint</span>
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past" className="gap-2"></TabsContent>
        </Tabs>
      </div>
    </Navigation>
  );
}
