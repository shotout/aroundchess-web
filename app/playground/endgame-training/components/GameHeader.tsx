"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { ChessPiece, ChessPieceType } from "../utils/ChessPieceUtils";
import DotSpinner from "@/components/game-history/Spinner";

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
      className="w-full flex relative overflow-hidden items-center h-[59px] justify-between bg-gradient-to-br from-[#C7DEE9]/10 via-[#BAE2F4]/10 to-[#56B8E9]/10
     border border-[#C0CED4] p-4 rounded-md"
    >
      {isCheckmateMode ? (
        <>
          <div className="absolute hidden xl:block left-[45%] -translate-x-1/2 top-0 pointer-events-none">
            <Image
              src="/endgame-training/crown.png"
              alt="chess board"
              width={100}
              height={100}
            />
          </div>
          <div className="flex items-center">
            <button onClick={goBackToSelection} className="p-2">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xl flex justify-center items-center space-x-2">
              {categoryData.name ? (
                (() => {
                  const match = categoryData.name.match(/(.*\sin\s)(\d+)/i);
                  if (match) {
                    const [_, prefix, number] = match;
                    return (
                      <>
                        <div className="font-semibold text-base relative z-10">
                          {prefix}
                        </div>
                        <div
                          className={`text-[33px] xl:text-4xl font-bold bg-gradient-to-b from-[#017BFF] via-[#5DDEFF] to-[#5DDEFF] inline-block text-transparent bg-clip-text relative z-10`}
                        >
                          {number}
                        </div>
                      </>
                    );
                  } else {
                    return categoryData.name;
                  }
                })()
              ) : (
                <DotSpinner />
              )}
            </div>
          </div>
          <div></div>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <button onClick={goBackToSelection} className="p-2">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Image
                src={`/endgame-training/${
                  isCheckmateMode ? "check.png" : categoryData.icons
                }`}
                alt={`${categoryData.name} icon`}
                width={isCheckmateMode ? 30 : 45}
                height={45}
              />
              <span className="font-bold text-lg">
                {categoryData.name || "Loading..."}
              </span>
            </div>
          </div>

          <div className="absolute hidden xl:block left-1/2 -translate-x-1/2 top-0 pointer-events-none">
            <Image
              src="/endgame-training/board-stage.png"
              alt="chess board"
              width={250}
              height={250}
            />
          </div>

          <div className="absolute hidden xl:block  top-0 right-0 pointer-events-none">
            <Image
              src="/endgame-training/sword-stage.png"
              alt="sword bg"
              width={100}
              height={100}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md flex justify-center">
              {pieceConfig && pieceConfig.pieces ? (
                <div
                  className="flex space-x-1 items-center overflow-hidden  rounded-md"
                  style={{ maxHeight: "36px", maxWidth: "160px" }}
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
                        width={16}
                        height={16}
                        vsWidth={18}
                        vsHeight={18}
                      />
                    )
                  )}
                </div>
              ) : (
                <DotSpinner />
              )}
            </div>

            {isCheckmateMode ? null : (
              <div className="mx-4 hidden xl:block">
                {subcategoryName || <DotSpinner />}
              </div>
            )}
          </div>
        </>
      )}

      {isCheckmateMode ? (
        <div></div>
      ) : (
        <div className="flex items-center space-x-4 xl:mr-32">
          <div className="font-semibold text-xl relative z-10">Stage</div>
          <div
            className={`text-[33px] xl:text-[45px] font-bold bg-gradient-to-b from-[#017BFF] via-[#5DDEFF] to-[#5DDEFF] inline-block text-transparent bg-clip-text relative z-10`}
          >
            {stageNum}
          </div>
        </div>
      )}
    </div>
  );
}
