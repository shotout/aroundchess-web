"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ArrowLeft,
  Settings,
  AlertCircle,
  RotateCcw,
  Download,
} from "lucide-react";
import { Chessboard } from "react-chessboard";
import { useEndgametraining } from "../../store/EndgameTrainingStore";
import { useCheckmateTraining } from "../../store/CheckmateStore";
import { Chess, Square } from "chess.js";
import { Engine } from "@/components/playground/src/lib/stockfish";
import Image from "next/image";
import {
  ChessPiece,
  ChessPieceType,
  getPieceConfig,
} from "../../utils/ChessPieceUtils";
import { useEndgameNavigation } from "../../store/NavigationStore";

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
  const [position, setPosition] = useState<string | null>(null);
  const [initialFen, setInitialFen] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<string | any>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [pieceConfig, setPieceConfig] = useState<any>(null);
  const [isCheckmateMode, setIsCheckmateMode] = useState<boolean>(false);
  const [movesToCheckmate, setMovesToCheckmate] = useState<number | null>(null);

  const [gameStatus, setGameStatus] = useState<string>("ongoing");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertClass, setAlertClass] = useState<string>("");

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

  const [bestMove, setBestMove] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const stageNum = parseInt(stageNumber);
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
  const fetchInProgress = React.useRef(false);

  const game = useMemo(() => new Chess(), []);
  const engine = useMemo(() => new Engine(), []);

  const isMounted = React.useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (engine) {
        engine.destroy();
      }
    };
  }, [engine]);

  // Check if this is checkmate mode
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

  const findBestMove = useCallback(() => {
    if (game.isGameOver() || gameStatus !== "ongoing") return;
    engine.evaluatePosition(game.fen(), 1);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        try {
          game.move({
            from: bestMove.substring(0, 2) as Square,
            to: bestMove.substring(2, 4) as Square,
            promotion: bestMove.substring(4, 5) || undefined,
          });

          setMoveHistory(game.history({ verbose: true }));
          setPosition(game.fen());
          setMoveSquares({
            [bestMove.substring(0, 2)]: {
              background: "rgba(255, 255, 0, 0.4)",
            },
            [bestMove.substring(2, 4)]: {
              background: "rgba(255, 255, 0, 0.4)",
            },
          });

          checkGameStatus();
        } catch (e) {
          console.error("Error making Stockfish move:", e);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, engine, gameStatus]);

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

    // If game isn't over and it's black's turn, make the AI move
    if (game.turn() === "b" && gameStatus === "ongoing") {
      findBestMove();
    }

    return false;
  }, [game, gameStatus, findBestMove]);

  const getMoveOptions = useCallback(
    (square: Square) => {
      const moves = game.moves({
        square,
        verbose: true,
      });

      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }

      const newSquares: Record<string, { background: string }> = {};
      moves.forEach((move) => {
        newSquares[move.to] = {
          background:
            game.get(move.to) &&
            game.get(move.to)?.color !== game.get(square)?.color
              ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        };
      });

      newSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };

      setOptionSquares(newSquares);
      return true;
    },
    [game]
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      if (game.turn() !== "w" || gameStatus !== "ongoing") return;

      setShowHint(false);

      if (!moveFrom) {
        const piece = game.get(square);
        if (piece && piece.color !== "w") return;

        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) {
          setMoveFrom(square);
        }
        return;
      }

      if (!moveTo) {
        const moves = game.moves({
          square: moveFrom as Square,
          verbose: true,
        });
        const foundMove = moves.find(
          (m) => m.from === moveFrom && m.to === square
        );

        if (!foundMove) {
          const piece = game.get(square);
          if (piece && piece.color === "w") {
            const hasMoveOptions = getMoveOptions(square);
            setMoveFrom(hasMoveOptions ? square : "");
          } else {
            setMoveFrom("");
            setOptionSquares({});
          }
          return;
        }

        setMoveTo(square);

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

        const move = game.move({
          from: moveFrom,
          to: square,
        });

        if (move === null) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }

        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen());
        setMoveSquares({
          [moveFrom]: { background: "rgba(255, 255, 0, 0.4)" },
          [square]: { background: "rgba(255, 255, 0, 0.4)" },
        });

        setMoveFrom("");
        setMoveTo(null);
        setOptionSquares({});

        checkGameStatus();

        return;
      }
    },
    [moveFrom, moveTo, game, getMoveOptions, checkGameStatus, gameStatus]
  );

  const onPromotionPieceSelect = useCallback(
    (piece?: string, fromSquare?: Square, toSquare?: Square) => {
      if (!piece || !fromSquare || !toSquare) return false;

      const promotionPiece = piece?.charAt(1)?.toLowerCase() || "q";

      const move = game.move({
        from: fromSquare,
        to: toSquare,
        promotion: promotionPiece,
      });

      if (move) {
        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen());
        checkGameStatus();
        setMoveSquares({
          [fromSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          [toSquare]: { background: "rgba(255, 255, 0, 0.4)" },
        });
      }

      setMoveFrom("");
      setMoveTo(null);
      setShowPromotionDialog(false);
      setOptionSquares({});

      return true;
    },
    [game, checkGameStatus]
  );

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      if (game.turn() !== "w" || gameStatus !== "ongoing") return false;

      setShowHint(false);

      try {
        const piece = game.get(sourceSquare as Square);
        const isPromotion =
          piece?.type === "p" &&
          ((piece.color === "w" && targetSquare[1] === "8") ||
            (piece.color === "b" && targetSquare[1] === "1"));

        if (isPromotion) {
          const move = game.move({
            from: sourceSquare as Square,
            to: targetSquare as Square,
            promotion: "q",
          });

          if (move === null) return false;
        } else {
          const move = game.move({
            from: sourceSquare as Square,
            to: targetSquare as Square,
          });

          if (move === null) return false;
        }

        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen());
        setMoveSquares({
          [sourceSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          [targetSquare]: { background: "rgba(255, 255, 0, 0.4)" },
        });

        checkGameStatus();

        return true;
      } catch (e) {
        console.error("Move error:", e);
        return false;
      }
    },
    [game, checkGameStatus, gameStatus]
  );

  const handleHint = useCallback(() => {
    if (!position) return;

    setShowHint(true);
    engine.evaluatePosition(game.fen(), 5);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        setBestMove(bestMove);
        setMoveSquares({
          [bestMove.substring(0, 2)]: { background: "rgba(0, 0, 255, 0.4)" },
          [bestMove.substring(2, 4)]: { background: "rgba(0, 0, 255, 0.4)" },
        });
      }
    });
  }, [game, engine, position]);

  const showSolution = useCallback(() => {
    if (!position) return;
    engine.evaluatePosition(game.fen(), 5);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        setBestMove(bestMove);
        setMoveSquares({
          [bestMove.substring(0, 2)]: { background: "rgba(0, 0, 255, 0.4)" },
          [bestMove.substring(2, 4)]: { background: "rgba(0, 0, 255, 0.4)" },
        });
      }
    });
  }, [position, engine, game]);

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
        <div
          className="w-full flex items-center h-[59px] justify-between bg-gradient-to-br from-[#C7DEE9]/10 via-[#BAE2F4]/10 to-[#56B8E9]/10
         border-b border-gray-200 p-4 rounded-md"
        >
          <div className="flex items-center space-x-4">
            <button onClick={goBackToSelection} className="p-2">
              <ArrowLeft className="h-6 w-h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Image
                src={`/endgame-training/${
                  isCheckmateMode ? "check.png" : categoryData.icons
                }`}
                alt={`${categoryData.name} icon`}
                width={45}
                height={45}
              />
              <span className="font-bold text-lg">
                {categoryData.name || "Loading..."}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-3 rounded-md flex justify-center">
              {pieceConfig && pieceConfig.pieces ? (
                <div
                  className="flex space-x-2 items-end overflow-visible border border-gray-200 bg-gradient-to-b from-[#E7F1F6] to-[#FFFFFF] p-2 rounded-md"
                  style={{ minHeight: "40px", display: "inline-flex" }}
                >
                  {pieceConfig.pieces.map(
                    (
                      piece: {
                        type: string;
                        color: string | undefined;
                        count: number | undefined;
                      },
                      i: React.Key | null | undefined
                    ) => (
                      <ChessPiece
                        key={i}
                        type={piece.type as ChessPieceType}
                        color={piece.color}
                        count={piece.count}
                        width={20}
                        height={20}
                        vsWidth={22}
                        vsHeight={22}
                      />
                    )
                  )}
                </div>
              ) : (
                <div>Loading pieces...</div>
              )}
            </div>
            <div className="mx-4">{subcategoryName || "Loading..."}</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="font-bold text-lg">
              {isCheckmateMode ? `Position ${stageNum}` : `Stage ${stageNum}`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-10 min-h-0 flex-grow bg-white xl:gap-5">
          <div className="xl:border border-gray-200 p-4 rounded-md flex flex-col xl:col-span-6">
            <div className="relative w-full flex  justify-center items-center">
              <div className="aspect-square  bg-white flex items-center justify-center w-full xl:p-12 overflow-hidden max-w-[700px] max-h-[650px]">
                {showAlert && (
                  <div
                    className={`absolute top-0 left-0 right-0 z-10 p-4 text-center text-white font-bold ${alertClass}`}
                  >
                    {alertMessage}
                  </div>
                )}

                <div className="w-full h-full">
                  <Chessboard
                    position={position}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    onPromotionPieceSelect={onPromotionPieceSelect}
                    customSquareStyles={{
                      ...optionSquares,
                      ...moveSquares,
                    }}
                    promotionToSquare={moveTo}
                    showPromotionDialog={showPromotionDialog}
                  />
                </div>
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

              <div className="flex-grow ">
                <div className="max-h-[250px] overflow-y-auto ">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-100 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 text-left border border-gray-200 border-r">
                          #
                        </th>
                        <th className="p-4 text-center border border-gray-200 border-r">
                          White (You)
                        </th>
                        <th className="p-4 text-center border border-gray-200">
                          Black (Engine)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {moveHistory.length === 0 ? (
                        <tr>
                          <td
                            className="p-4 text-center border border-gray-200"
                            colSpan={3}
                          >
                            No moves yet
                          </td>
                        </tr>
                      ) : (
                        Array.from({
                          length: Math.ceil(moveHistory.length / 2),
                        }).map((_, i) => {
                          const whiteIdx = i * 2;
                          const blackIdx = i * 2 + 1;

                          return (
                            <tr key={i}>
                              <td className="p-4 text-center border border-gray-200 border-r">
                                {i + 1}
                              </td>
                              <td className="p-4 text-center border border-gray-200 border-r">
                                {moveHistory[whiteIdx]?.san || ""}
                              </td>
                              <td className="p-4 text-center border border-gray-200">
                                {blackIdx < moveHistory.length
                                  ? moveHistory[blackIdx]?.san || ""
                                  : ""}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-auto p-4 grid grid-cols-3 gap-4">
                <button
                  className="flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-md border border-blue-200"
                  onClick={handleHint}
                  disabled={gameStatus !== "ongoing"}
                >
                  <span className="mr-2">💡</span> Hint
                </button>
                <button
                  className="flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-md border border-gray-200"
                  onClick={showSolution}
                  disabled={gameStatus !== "ongoing"}
                >
                  <span className="mr-2">➡️</span> Solution
                </button>
                <button
                  onClick={resetPosition}
                  className="flex items-center justify-center p-3 bg-blue-50 text-blue-base font-semibold rounded-md border border-blue-200"
                >
                  <RotateCcw className="h-4 w-4 mr-2 text-blue-base" />
                  Rematch
                </button>
                <button
                  onClick={navigateNext}
                  className="col-span-3 flex items-center justify-center p-3 bg-white text-blue-600 rounded-md border border-blue-600"
                >
                  <span className="mr-2">➡️</span>
                  {isCheckmateMode ? "Next Position" : "Next Stage"}
                </button>
                <div className="col-span-1 flex items-center justify-center p-3 bg-white text-blue-600 rounded-md border border-gray-200">
                  <Download
                    className="h-6 w-6 mr-2 text-blue-base"
                    fill="#3871EC29"
                    fillOpacity={16}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-center p-3 bg-white text-blue-600 rounded-md border border-gray-200">
                  <Settings
                    className="h-6 w-6 mr-2 text-blue-base"
                    fill="#3871EC29"
                    fillOpacity={16}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
