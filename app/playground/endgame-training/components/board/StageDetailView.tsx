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
import { Chess } from "chess.js";
import { getPieceConfig } from "../../utils/ChessPieceUtils";
import { Square } from "react-chessboard/dist/chessboard/types";
import GameAlert from "../GameAlert";
import ChessboardWrapper from "../ChessboardWrapper";
import MoveHistory from "../MoveHistory";
import StockfishEngine from "../SF";
import GameControls from "../GameControl";
import GameHeader from "../GameHeader";

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

  // Game state
  const [position, setPosition] = useState<string | null>(null);
  const [initialFen, setInitialFen] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // UI state
  const [categoryData, setCategoryData] = useState<string | any>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [pieceConfig, setPieceConfig] = useState<any>(null);

  // Mode state
  const [isCheckmateMode, setIsCheckmateMode] = useState<boolean>(false);
  const [movesToCheckmate, setMovesToCheckmate] = useState<number | null>(null);

  // Game status
  const [gameStatus, setGameStatus] = useState<string>("ongoing");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertClass, setAlertClass] = useState<string>("");

  // Move highlighting
  const [optionSquares, setOptionSquares] = useState<
    Record<string, { background: string }>
  >({});
  const [moveSquares, setMoveSquares] = useState<
    Record<string, { background: string }>
  >({});
  const [moveFrom, setMoveFrom] = useState<string>("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] =
    useState<boolean>(false);

  // Engine state
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Data fetching
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

  // Effect for cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Determine if we're in checkmate mode
  useEffect(() => {
    if (categorySlug.startsWith("checkmate-")) {
      setIsCheckmateMode(true);
      const moves = parseInt(categorySlug.replace("checkmate-", ""));
      setMovesToCheckmate(moves);

      // Set the active tab if we're in checkmate mode
      const { setActiveTab } = useEndgameNavigation.getState();
      if (setActiveTab) setActiveTab("move");
    } else {
      setIsCheckmateMode(false);
      setMovesToCheckmate(null);

      // Set the active tab if we're in board mode
      const { setActiveTab } = useEndgameNavigation.getState();
      if (setActiveTab) setActiveTab("board");
    }
  }, [categorySlug]);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      if (fetchInProgress.current) return;

      fetchInProgress.current = true;
      try {
        // Load both data sources - we'll determine which to use based on the mode
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

  // Initialize game position based on mode
  useEffect(() => {
    if (isCheckmateMode) {
      // Handle checkmate mode
      if (!checkmateData || !Array.isArray(checkmateData) || !movesToCheckmate)
        return;

      // Get positions for this checkmate-in-X category
      const moveIndex = movesToCheckmate - 1;
      if (moveIndex < 0 || moveIndex >= checkmateData.length) return;

      const positions = checkmateData[moveIndex];
      if (!positions || !Array.isArray(positions)) return;

      // Get specific position
      const posIndex = stageNum - 1;
      if (posIndex < 0 || posIndex >= positions.length) return;

      const fen = positions[posIndex];

      try {
        game.load(fen);
        setPosition(fen);
        setInitialFen(fen);
        setTargetPosition(null); // Checkmate positions don't have explicit targets
        setGameStatus("ongoing");
        setShowAlert(false);
        setMoveHistory([]);
        setIsSolved(false);
        setMoveSquares({});
        setOptionSquares({});

        // Set display information
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
      // Handle standard endgame mode
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
          setGameStatus("ongoing");
          setShowAlert(false);
          setMoveHistory([]);
          setIsSolved(false);
          setMoveSquares({});
          setOptionSquares({});
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
  ]);

  // Navigate to different stage
  const navigateToStage = useCallback(
    (direction: "next" | "previous") => {
      const newStageNum =
        direction === "next" ? stageNum + 1 : Math.max(1, stageNum - 1);

      // Create the appropriate path based on the mode
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

  // Back to selection screen
  const goBackToSelection = useCallback(() => {
    // Update the navigation state to reflect the correct tab
    const { setActiveTab, setViewState } = useEndgameNavigation.getState();

    if (isCheckmateMode) {
      setActiveTab("move");
      if (movesToCheckmate) {
        setViewState({
          view: "subcategories",
          movesToCheckmate: movesToCheckmate,
        });
      } else {
        setViewState({ view: "categories" });
      }
    } else {
      setActiveTab("board");
      setViewState({
        view: "subcategories",
        category: categorySlug,
      });
    }

    router.push(`/playground/endgame-training/`);
  }, [router, isCheckmateMode, movesToCheckmate, categorySlug]);

  // Retry fetch if there was an error
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
  const navigatePrevious = useCallback(
    () => navigateToStage("previous"),
    [navigateToStage]
  );

  // Reset position to initial state
  const resetPosition = useCallback(() => {
    if (initialFen) {
      try {
        game.load(initialFen);
        setPosition(initialFen);
        setMoveHistory([]);
        setIsSolved(false);
        setGameStatus("ongoing");
        setShowAlert(false);
        setShowHint(false);
        setBestMove(null);
        setOptionSquares({});
        setMoveSquares({});
      } catch (e) {
        console.error("Error resetting position:", e);
      }
    }
  }, [game, initialFen]);

  // Check game status and handle AI move if needed
  const checkGameStatus = useCallback(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        const winner = game.turn() === "w" ? "black" : "white";
        if (winner === "white") {
          setGameStatus("win");
          setAlertMessage("Checkmate! You won!");
          setAlertClass("bg-green-500");
        } else {
          setGameStatus("lose");
          setAlertMessage("You lost the game.");
          setAlertClass("bg-red-500");
        }
        setIsSolved(true);
      } else if (game.isDraw()) {
        setGameStatus("draw");
        setAlertMessage("Game ended in a draw.");
        setAlertClass("bg-blue-500");
        setIsSolved(true);
      }
      setShowAlert(true);
      return true;
    }

    // If game isn't over and it's black's turn, trigger AI move
    if (game.turn() === "b" && gameStatus === "ongoing") {
      // We'll use the StockfishEngine component to handle this
      // The actual AI move will be triggered via a useEffect in that component
      return false; // Return false to indicate game is not over
    }

    return false;
  }, [game, gameStatus]);

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
    <div className="w-full h-[calc(100vh-56px)] xl:h-[calc(100vh-97px)] flex justify-center items-center">
      <main className="w-full h-full p-4 xl:p-8 flex flex-col space-y-4">
        <GameHeader
          categoryData={categoryData}
          subcategoryName={subcategoryName}
          pieceConfig={pieceConfig}
          stageNum={stageNum}
          isCheckmateMode={isCheckmateMode}
          goBackToSelection={goBackToSelection}
        />

        <div className="grid grid-cols-1 xl:grid-cols-10 min-h-0 flex-grow bg-white xl:gap-5">
          <div className="xl:border border-gray-200 p-4 rounded-md flex flex-col xl:col-span-6">
            <div className="relative w-full flex justify-center items-center">
              <div className="aspect-square bg-white flex items-center justify-center w-full xl:p-12 overflow-hidden max-w-[700px] max-h-[650px]">
                <GameAlert
                  showAlert={showAlert}
                  alertMessage={alertMessage}
                  alertClass={alertClass}
                />

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
                  gameStatus={gameStatus}
                  setMoveHistory={setMoveHistory}
                  setPosition={setPosition}
                  checkGameStatus={checkGameStatus}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md flex flex-col xl:col-span-4 mt-4 xl:mt-0">
            <div className="flex flex-col space-y-5 h-full p-6">
              <div className="bg-blue-base/10 p-6 border border-blue-base rounded-md flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <div className="text-blue-base mr-2">
                    <AlertCircle className="h-6 w-6 text-blue-base" />
                  </div>
                  <h1 className="text-xl">
                    {isCheckmateMode
                      ? `Find the ${movesToCheckmate} ${
                          movesToCheckmate === 1 ? "move" : "moves"
                        } to checkmate`
                      : "White to Checkmate"}
                  </h1>
                </div>
                <div className="bg-white w-full p-4 rounded-md border border-gray-200 text-center">
                  {position}
                </div>
              </div>

              <MoveHistory moveHistory={moveHistory} />

              <StockfishEngine
                game={game}
                position={position}
                gameStatus={gameStatus}
                setMoveHistory={setMoveHistory}
                setPosition={setPosition}
                setMoveSquares={setMoveSquares}
                checkGameStatus={checkGameStatus}
                setBestMove={setBestMove}
                showHint={showHint}
              />

              <GameControls
                game={game}
                gameStatus={gameStatus}
                handleHint={() => setShowHint(true)}
                showSolution={() => setShowHint(true)}
                resetPosition={resetPosition}
                navigateNext={navigateNext}
                navigatePrevious={navigatePrevious}
                isCheckmateMode={isCheckmateMode}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
