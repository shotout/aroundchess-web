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

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color = "text-blue-500",
  count = 1,
  width = 30,
  height = 30,
  vsWidth = 50,
  vsHeight = 50,
}) => {
  if (type === "vs") {
    return (
      <div className="inline-block">
        <Image
          src="/endgame-training/duel.png"
          alt="vs"
          width={vsWidth}
          height={vsHeight}
          className={`inline-block w-[${60}px] h-[${60}px] md:w-[${100}px] md:h-[${100}px] object-contain`}
        />
      </div>
    );
  }

  const isBlackPiece = color === "text-indigo-700";
  const imagePath = `/endgame-training/${
    isBlackPiece ? "black-" : ""
  }${type}-icon.png`;

  if (count > 1) {
    return (
      <div
        className="flex space-x-0"
        style={{
          display: "inline-flex",
          alignItems: "flex-end",
          margin: "0 2px",
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="inline-block px-0.5">
            {" "}
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
    <div className="inline-block px-0.5">
      {" "}
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

  const configs: Record<string, PieceConfig> = {
    "Queen": {
      text: "Queen, King <span class='font-bold'>VS</span> King",
      pieces: [
        { type: "queen", color: "text-blue-500" },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    "Rook": {
      text: "Rook, King <span class='font-bold'>VS</span> King",
      pieces: [
        { type: "rook", color: "text-blue-500" },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    "Two Rooks": {
      text: "Rook, Rook, King <span class='font-bold'>VS</span> King",
      pieces: [
        { type: "rook", color: "text-blue-500", count: 2 },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    "Queen and Pawn vs King": {
      text: "Queen, Pawn, King <span class='font-bold'>VS</span> King",
      pieces: [
        { type: "queen", color: "text-blue-500" },
        { type: "pawn", color: "text-blue-500" },
        { type: "king", color: "text-blue-500" },
        { type: "vs", color: "text-blue-500" },
        { type: "king", color: "text-indigo-700" },
      ],
    },
    "Bishop and Knight vs King": {
      text: "Bishop, Knight, King <span class='font-bold'>VS</span> King",
      pieces: [
        { type: "bishop", color: "text-blue-500" },
        { type: "knight", color: "text-blue-500" },
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

  if (parsedPieces.length > 0) {
    const vsIndex = parsedPieces.findIndex((p) => p.type === "vs");

    const finalPieces: {
      type: ChessPieceType;
      color: string;
      count?: number;
    }[] = [];

    if (vsIndex >= 0) {
      const leftPieces = parsedPieces.slice(0, vsIndex);

      const leftWithoutKing = leftPieces.filter((p) => p.type !== "king");

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
      text: configs[subcategoryName]?.text || subcategoryName,
      pieces: finalPieces,
    };
  }

  return configs[subcategoryName] || configs.default;
};
