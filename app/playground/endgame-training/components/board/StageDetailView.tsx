"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
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

interface StageDetailViewProps {
  categorySlug: string;
  subcategorySlug: string;
  stageNumber: string;
}

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
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");

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

  // Update Syzygy analysis when position changes
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
        setIsSolved(false);
        setMoveSquares({});
        setOptionSquares({});
        setRightClickedSquares({});
        setBestMove(null);
        setShowHint(false);
        setGameStartTime(Date.now());
        setGameEndTime(undefined);
        setSyzygyMateDistance(null); // Reset Syzygy mate distance

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
        game.load(initialFen);
        setPosition(initialFen);
        setMoveHistory([]);
        setIsSolved(false);
        setShowGameEndDialog(false);
        setShowHint(false);
        setBestMove(null);
        setOptionSquares({});
        setMoveSquares({});
        setRightClickedSquares({});
        setGameStartTime(Date.now());
        setGameEndTime(undefined);
        setSyzygyMateDistance(null); // Reset Syzygy mate distance

        setPlayerColorFromFen(initialFen);

        // After reset, update Syzygy analysis for the initial position
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
    <div className="w-full h-auto xl:h-[calc(100vh-97px)] flex justify-center items-center">
      <GameAlertDialog
        open={showGameEndDialog}
        game={game || null}
        playerColor={playerColor}
        onRematch={resetPosition}
        onClose={handleCloseAlert}
      />
      <main className="w-full h-full p-4 xl:p-8 flex flex-col space-y-4">
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
            <div className="flex flex-row self-end justify-end items-center gap-x-2 mb-2">
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
            <div className="xl:border border-gray-200 p-4 rounded-md flex flex-col">
              <div className="relative w-full flex flex-col justify-center items-center">
                <div className="aspect-square bg-white flex items-center justify-center w-full xl:p-12 overflow-hidden max-w-[700px] max-h-[650px]">
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md flex flex-col xl:col-span-4">
            <div className="flex flex-col h-full">
              <div className="w-full p-4 h-auto">
                <div className="flex flex-col items-center justify-center gap-y-3 bg-blue-base/10 border border-blue-base rounded-xl p-6">
                  <div className="flex flex-row items-center justify-center gap-x-3">
                    <AlertCircle className="h-8 w-8 text-blue-base" />
                    <h1 className="text-lg xl:text-xl text-black">
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
                    {position}
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
              />

              <GameControls
                game={game}
                gameStatus={isSolved ? "solved" : "ongoing"}
                handleHint={() => setShowHint(true)}
                resetPosition={resetPosition}
                navigateNext={navigateNext}
                isCheckmateMode={isCheckmateMode}
                playerColor={playerColor}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
