"use client";

import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import GameAlertDialog from "./GameAlertDialog";

// FEN positions for different game end states
const POSITIONS = {
  CHECKMATE_WHITE_WINS:
    "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4", // Scholar's mate
  CHECKMATE_BLACK_WINS:
    "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3", // Fool's mate
  STALEMATE: "4k3/4P3/4K3/8/8/8/8/8 b - - 0 1", // King and pawn endgame stalemate
  INSUFFICIENT_MATERIAL: "8/8/8/8/8/8/8/4K2k b - - 0 1", // Just kings
  THREEFOLD_REPETITION:
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Setup for simulation
};

type EndState =
  | "checkmate-win"
  | "checkmate-loss"
  | "stalemate"
  | "insufficient"
  | "threefold";

const GameAlertDebug = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [endState, setEndState] = useState<EndState>("checkmate-win");
  const [game, setGame] = useState<Chess>(new Chess());
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");

  // Reset the game with a new position when endState changes
  useEffect(() => {
    const chess = new Chess();

    switch (endState) {
      case "checkmate-win":
        // Set a checkmate position where white wins
        chess.load(POSITIONS.CHECKMATE_WHITE_WINS);
        setPlayerColor("w");
        break;
      case "checkmate-loss":
        // Set a checkmate position where black wins
        chess.load(POSITIONS.CHECKMATE_BLACK_WINS);
        setPlayerColor("w");
        break;
      case "stalemate":
        // Set a stalemate position
        chess.load(POSITIONS.STALEMATE);
        setPlayerColor("w");
        break;
      case "insufficient":
        // Set an insufficient material position
        chess.load(POSITIONS.INSUFFICIENT_MATERIAL);
        setPlayerColor("w");
        break;
      case "threefold":
        // Simulate threefold repetition (in a real game this would happen naturally)
        chess.load(POSITIONS.THREEFOLD_REPETITION);
        // In a real app we'd need to simulate multiple moves to create a threefold repetition
        // This is just for demonstration purposes
        break;
    }

    setGame(chess);
  }, [endState]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleRematch = () => {
    console.log("Rematch clicked");
    // Demo only - in real app this would reset the game
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-64">
      <h3 className="font-bold text-lg mb-3">Alert Dialog Debug</h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">End State:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={endState}
            onChange={(e) => setEndState(e.target.value as EndState)}
          >
            <option value="checkmate-win">Checkmate (Win)</option>
            <option value="checkmate-loss">Checkmate (Loss)</option>
            <option value="stalemate">Stalemate</option>
            <option value="insufficient">Insufficient Material</option>
            <option value="threefold">Threefold Repetition</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Player Color:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={playerColor}
            onChange={(e) => setPlayerColor(e.target.value as "w" | "b")}
          >
            <option value="w">White</option>
            <option value="b">Black</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => setShowDialog(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
      >
        Show Dialog
      </button>

      <GameAlertDialog
        open={showDialog}
        game={game}
        playerColor={playerColor}
        onRematch={handleRematch}
        onClose={handleClose}
      />
    </div>
  );
};

export default GameAlertDebug;
