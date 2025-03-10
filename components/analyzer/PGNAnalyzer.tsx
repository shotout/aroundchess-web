"use client";

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import pgnParser from "pgn-parser";
import { getStockfishService } from "@/lib/stockfish/stockfish-service";

const PGNAnalyzer: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [headers, setHeaders] = useState<{ name: string; value: string }[]>([]);
  const [currentFen, setCurrentFen] = useState(game.fen());
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const pgn = e.target?.result as string;
        const parsed = pgnParser.parse(pgn);

        const parsedMoves = parsed[0].moves.map(
          (move: { move: string }) => move.move
        );

        setMoves(parsedMoves);
        setGame(new Chess());
        setCurrentMoveIndex(0);
        setHeaders(parsed[0].headers || []);
      };

      reader.readAsText(file);
    }
  };

  const handleNextMove = () => {
    if (currentMoveIndex < moves.length) {
      game.move(moves[currentMoveIndex]);
      setCurrentMoveIndex(currentMoveIndex + 1);
      setGame(new Chess(game.fen()));
      setCurrentFen(game.fen());
    }
  };

  const handlePreviousMove = () => {
    if (currentMoveIndex > 0) {
      const newGame = new Chess();
      for (let i = 0; i < currentMoveIndex - 1; i++) {
        newGame.move(moves[i]);
      }

      setCurrentMoveIndex(currentMoveIndex - 1);
      setGame(newGame);
      setCurrentFen(game.fen());
    }
  };

  const fetchStockfishData = async (fen: string) => {
    const stockfishService = getStockfishService();

    try {
      await stockfishService.waitReady();

      const bestMove = await stockfishService.getBestMove(fen, 20, 0.1);
      setBestMove(bestMove);

      const evaluation = await stockfishService.getEvaluation(fen, 20);
      setEvaluation(evaluation);
    } catch (error) {
      console.error("Error using StockfishService:", error);
    } finally {
      stockfishService.destroy();
    }
  };

  useEffect(() => {
    fetchStockfishData(currentFen);
  }, [currentFen]);

  useEffect(() => {
    console.log("Best move:", bestMove);
    console.log("Evaluation:", evaluation);
  }, [bestMove, evaluation]);

  return (
    <div className="flex justify-center gap-4">
      <div className="flex flex-col gap-4">
        <Chessboard position={game.fen()} boardWidth={500} />
        <div className="flex mt-4 space-x-2 justify-center">
          <button
            type="button"
            onClick={handlePreviousMove}
            disabled={currentMoveIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextMove}
            disabled={currentMoveIndex >= moves.length}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {headers.length > 0 && (
          <div className="p-4 border rounded bg-gray-100 w-full max-w-4xl">
            <h2 className="text-lg font-bold mb-2">Game Information:</h2>
            <div className="flex flex-wrap gap-2">
              {headers.map((header) => (
                <button
                  type="button"
                  key={header.name}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {header.name}: {header.value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="pgn-upload" className="block mb-2">
            Upload PGN file:
          </label>
          <input
            id="pgn-upload"
            type="file"
            accept=".pgn"
            onChange={handleFileUpload}
            className="p-2 border rounded"
          />
        </div>
        <div>
          {bestMove && (
            <div className="p-4 border rounded bg-gray-100 w-full max-w-4xl">
              <h2 className="text-lg font-bold mb-2">Best Move:</h2>
              <p>{bestMove}</p>
            </div>
          )}
          {evaluation !== null && (
            <div className="p-4 border rounded bg-gray-100 w-full max-w-4xl">
              <h2 className="text-lg font-bold mb-2">Evaluation:</h2>
              <p>{evaluation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PGNAnalyzer;
