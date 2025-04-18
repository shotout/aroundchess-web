import Image from "next/image";
import React from "react";

export type ChessPieceType =
  | "king"
  | "queen"
  | "rook"
  | "pawn"
  | "knight"
  | "bishop"
  | "vs";

export interface ChessPieceProps {
  type: ChessPieceType;
  color?: string;
  count?: number;
  width?: number;
  height?: number;
  vsWidth?: number;
  vsHeight?: number;
  alignBottom?: boolean;
}

// Helper function to get vertical adjustment for each piece type
const getVerticalAdjustment = (
  type: ChessPieceType,
  height: number
): number => {
  // Adjustments relative to piece height (proportional to size)
  const adjustmentFactor = height / 30; // Based on original height of 30px

  switch (type) {
    case "king":
      return 0;
    case "queen":
      return 0;
    case "rook":
      return 0;
    case "bishop":
      return 1 * adjustmentFactor;
    case "knight":
      return 1 * adjustmentFactor;
    case "pawn":
      return 3 * adjustmentFactor;
    case "vs":
      return 0;
    default:
      return 0;
  }
};

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color = "text-blue-500",
  count = 1,
  width = 30,
  height = 30,
  vsWidth = 50,
  vsHeight = 50,
  alignBottom = true,
}) => {
  // Calculate VS transform based on size
  const vsTransform =
    vsHeight < 30
      ? `translateY(-${Math.max(2, vsHeight * 0.15)}px)`
      : "translateY(-15px)";

  if (type === "vs") {
    return (
      <div
        className="inline-block"
        style={{
          verticalAlign: "bottom",
          transform: alignBottom ? vsTransform : "none",
        }}
      >
        <Image
          src="/endgame-training/duel.png"
          alt="vs"
          width={vsWidth}
          height={vsHeight}
          style={{ display: "inline-block" }}
        />
      </div>
    );
  }

  const isBlackPiece = color === "text-indigo-700";
  const imagePath = `/endgame-training/${
    isBlackPiece ? "black-" : ""
  }${type}-icon.png`;

  // Get vertical adjustment for this piece type to align them at the bottom
  const verticalAdjustment = alignBottom
    ? getVerticalAdjustment(type, height)
    : 0;

  if (count > 1) {
    return (
      <div
        className="flex space-x-1"
        style={{
          display: "inline-flex",
          alignItems: "flex-end",
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="inline-block"
            style={{
              verticalAlign: "bottom",
              transform: `translateY(${verticalAdjustment}px)`,
            }}
          >
            <Image
              src={imagePath}
              alt={`${type} chess piece`}
              width={width}
              height={height}
              style={{ display: "inline-block" }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="inline-block"
      style={{
        verticalAlign: "bottom",
        transform: `translateY(${verticalAdjustment}px)`,
      }}
    >
      <Image
        src={imagePath}
        alt={`${type} chess piece`}
        width={width}
        height={height}
        style={{ display: "inline-block" }}
      />
    </div>
  );
};

const parsePiece = (
  name: string
): { type: ChessPieceType; count: number }[] => {
  const pieces: { type: ChessPieceType; count: number }[] = [];
  const lowerName = name.toLowerCase();

  const hasSplit = lowerName.includes(" vs ");
  let leftSide = lowerName;
  let rightSide = "";

  if (hasSplit) {
    const parts = lowerName.split(" vs ");
    leftSide = parts[0];
    rightSide = parts.length > 1 ? parts[1] : "";
  }

  const numberWords: Record<string, number> = {
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };

  const pieceTypes: ChessPieceType[] = [
    "king",
    "queen",
    "rook",
    "pawn",
    "knight",
    "bishop",
  ];

  const extractPieces = (
    text: string
  ): { type: ChessPieceType; count: number }[] => {
    const extractedPieces: { type: ChessPieceType; count: number }[] = [];

    for (const pieceType of pieceTypes) {
      if (text.includes(pieceType)) {
        let count = 1;

        for (const [word, value] of Object.entries(numberWords)) {
          const regex = new RegExp(`${word}\\s+${pieceType}s?`, "i");
          if (regex.test(text)) {
            count = value;
            break;
          }
        }

        const pluralRegex = new RegExp(`${pieceType}s\\b`, "i");
        if (
          count === 1 &&
          pluralRegex.test(text) &&
          !text.includes(`${pieceType}s and`)
        ) {
          count = 2;
        }

        extractedPieces.push({ type: pieceType as ChessPieceType, count });
      }
    }

    return extractedPieces;
  };

  const leftPieces = extractPieces(leftSide);
  for (const piece of leftPieces) {
    pieces.push(piece);
  }

  if (hasSplit) {
    pieces.push({ type: "vs", count: 1 });

    const rightPieces = extractPieces(rightSide);
    for (const piece of rightPieces) {
      pieces.push(piece);
    }
  }

  return pieces;
};

export interface PieceConfig {
  text: string;
  pieces: { type: ChessPieceType; color: string; count?: number }[];
}

export const getPieceConfig = (subcategoryName: string): PieceConfig => {
  const parsedPieces = parsePiece(subcategoryName);

  if (parsedPieces.length > 0) {
    const vsIndex = parsedPieces.findIndex((p) => p.type === "vs");

    let finalPieces: { type: ChessPieceType; color: string; count?: number }[] =
      [];

    if (vsIndex >= 0) {
      let leftPieces = parsedPieces.slice(0, vsIndex);
      let rightPieces = parsedPieces.slice(vsIndex + 1);

      const leftWithoutKing = leftPieces.filter((p) => p.type !== "king");
      const rightWithoutKing = rightPieces.filter((p) => p.type !== "king");
      const leftHasKing = leftPieces.some((p) => p.type === "king");
      const rightHasKing = rightPieces.some((p) => p.type === "king");

      for (const piece of leftWithoutKing) {
        finalPieces.push({
          type: piece.type,
          color: "text-blue-500",
          count: piece.count,
        });
      }

      finalPieces.push({
        type: "king",
        color: "text-blue-500",
        count: 1,
      });

      finalPieces.push({ type: "vs", color: "text-blue-500" });

      finalPieces.push({
        type: "king",
        color: "text-indigo-700",
        count: 1,
      });

      for (const piece of rightWithoutKing) {
        finalPieces.push({
          type: piece.type,
          color: "text-indigo-700",
          count: piece.count,
        });
      }
    } else {
      const nonKingPieces = parsedPieces.filter((p) => p.type !== "king");

      for (const piece of nonKingPieces) {
        finalPieces.push({
          type: piece.type,
          color: "text-blue-500",
          count: piece.count,
        });
      }

      finalPieces.push({ type: "king", color: "text-blue-500" });
      finalPieces.push({ type: "vs", color: "text-blue-500" });
      finalPieces.push({ type: "king", color: "text-indigo-700" });
    }

    return {
      text: subcategoryName,
      pieces: finalPieces,
    };
  }

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
      text: "Two Rooks, King VS King",
      pieces: [
        { type: "rook", color: "text-blue-500", count: 2 },
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
