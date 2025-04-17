"use client";

import React from "react";
import { Chessboard } from "react-chessboard";
import {
  EndgameDetailViewProps,
  EndgameSubcategory,
  Game,
} from "../../types/EndgameTrainingTypes";

export default function EndgameDetailView({
  endgameSubcategory,
}: EndgameDetailViewProps) {
  if (!endgameSubcategory || !endgameSubcategory.games) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {endgameSubcategory.games.length > 0 ? (
        endgameSubcategory.games.map((game: Game, index: number) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-lg mb-2">Position {index + 1}</h3>
            <p className="text-sm text-gray-600 mb-3">FEN: {game.fen}</p>
            {game.target && (
              <p className="text-sm text-gray-600 mb-3">
                Target: {game.target}
              </p>
            )}

            <div className="mb-4">
              <Chessboard position={game.fen} />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Practice
            </button>
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">No games found for this subcategory.</p>
        </div>
      )}
    </div>
  );
}
