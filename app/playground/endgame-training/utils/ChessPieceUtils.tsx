import React from "react";

export type ChessPieceType = "king" | "queen" | "rook" | "vs";

export interface ChessPieceProps {
  type: ChessPieceType;
  color?: string;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color = "text-blue-500",
}) => {
  const pieceMap: Record<ChessPieceType, string> = {
    king: "♚",
    queen: "♛",
    rook: "♜",
    vs: "⚔️",
  };

  return <span className={`text-2xl ${color}`}>{pieceMap[type] || "♟"}</span>;
};

export interface PieceConfig {
  text: string;
  pieces: { type: ChessPieceType; color: string }[];
}

export const getPieceConfig = (subcategoryName: string): PieceConfig => {
  const configs: Record<string, PieceConfig> = {
    "Queen and King": {
      text: "Queen, King VS King",
      pieces: [
        { type: "queen", color: "text-blue-500" },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    "Rook and King": {
      text: "Rook, King VS King",
      pieces: [
        { type: "rook", color: "text-blue-500" },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    "Two Rooks and King": {
      text: "Rook, Rook, King VS King",
      pieces: [
        { type: "rook", color: "text-blue-500" },
        { type: "rook", color: "text-blue-500" },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    default: {
      text: subcategoryName,
      pieces: [
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
  };

  return configs[subcategoryName] || configs.default;
};
