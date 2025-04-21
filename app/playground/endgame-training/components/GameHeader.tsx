"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { ChessPiece, ChessPieceType } from "../utils/ChessPieceUtils";

interface GameHeaderProps {
  categoryData: any;
  subcategoryName: string;
  pieceConfig: any;
  stageNum: number;
  isCheckmateMode: boolean;
  goBackToSelection: () => void;
}

export default function GameHeader({
  categoryData,
  subcategoryName,
  pieceConfig,
  stageNum,
  isCheckmateMode,
  goBackToSelection,
}: GameHeaderProps) {
  return (
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
  );
}
