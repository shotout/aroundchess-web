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
  const fixedGradient = "linear-gradient(to right, #4776E6, #8E54E9)";

  return (
    <div
      className="w-full flex relative overflow-hidden items-center h-14 justify-between bg-gradient-to-br from-[#C7DEE9]/10 via-[#BAE2F4]/10 to-[#56B8E9]/10
     border border-[#C0CED4] p-2 rounded-md"
    >
      {isCheckmateMode ? (
        <>
          <div className="flex items-center w-14">
            <button onClick={goBackToSelection}>
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="absolute xl:block left-[45%] -translate-x-1/2 top-0 pointer-events-none h-16 flex items-center justify-center">
            <Image
              src="/endgame-training/crown.png"
              alt="chess board"
              width={100}
              height={50}
              style={{ maxHeight: "50px", width: "auto", objectFit: "contain" }}
            />
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center h-16 flex items-center justify-center">
            <div className="text-xl flex justify-center items-center h-10">
              {categoryData.name ? (
                (() => {
                  const match = categoryData.name.match(/(.*\sin\s)(\d+)/i);
                  if (match) {
                    const [_, prefix, number] = match;
                    return (
                      <div className="flex items-center gap-x-2">
                        <div className="font-semibold text-base relative z-10">
                          {prefix}
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-b from-[#017BFF] via-[#5DDEFF] to-[#5DDEFF] inline-block text-transparent bg-clip-text relative z-10">
                          {number}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="h-10 flex items-center">
                        {categoryData.name}
                      </div>
                    );
                  }
                })()
              ) : (
                <div className="h-10 flex items-center justify-center">
                  <DotSpinner />
                </div>
              )}
            </div>
          </div>
          <div className="w-14"></div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <div className="flex gap-x-3">
              <button onClick={goBackToSelection}>
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-x-3">
                <div className="h-10 w-10 flex items-center justify-center">
                  <Image
                    src={`/endgame-training/${
                      isCheckmateMode ? "check.png" : categoryData.icons
                    }`}
                    alt={`${categoryData.name} icon`}
                    width={40}
                    height={40}
                    style={{ objectFit: "contain", maxHeight: "40px" }}
                  />
                </div>
                <span className="font-bold text-lg h-10 flex items-center">
                  {categoryData.name || "Loading..."}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute xl:block left-1/2 -translate-x-1/2 top-0 pointer-events-none h-14 flex items-center justify-center z-0">
            <Image
              src="/endgame-training/board-stage.png"
              alt="chess board"
              width={250}
              height={50}
              style={{
                maxHeight: "50px",
                width: "auto",
                objectFit: "contain",
                opacity: 0.5,
              }}
            />
          </div>

          <div className="absolute xl:block top-0 right-0 pointer-events-none h-16 flex items-center justify-center">
            <Image
              src="/endgame-training/sword-stage.png"
              alt="sword bg"
              width={100}
              height={50}
              style={{ maxHeight: "50px", width: "auto", objectFit: "contain" }}
            />
          </div>

          <div className="flex items-center gap-x-3">
            <div className="flex justify-center h-10">
              {pieceConfig && pieceConfig.pieces ? (
                <div
                  className="flex w-[100px] xl:w-[200px] items-center justify-center border border-[#E7F1F6] overflow-hidden rounded-md h-10 bg-gradient-to-b from-[#E7F1F6] to-[#FFFFFF]"
                  style={{
                    padding: "3px",
                    position: "relative",
                    zIndex: 10,
                  }}
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
                <div className="h-10 flex items-center justify-center">
                  <DotSpinner />
                </div>
              )}
            </div>

            {isCheckmateMode ? null : (
              <div
                className="xl:flex h-10 items-center justify-center hidden"
                style={{
                  position: "relative",
                  zIndex: 10,
                  minWidth: "100px",
                }}
              >
                {subcategoryName || (
                  <div className="flex items-center justify-center">
                    <DotSpinner />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {isCheckmateMode ? (
        <div className="w-14"></div>
      ) : (
        <div className="flex items-center xl:mr-32 h-10 gap-x-3">
          <div className="font-semibold text-xl relative z-10 h-10 flex items-center">
            Stage
          </div>
          <div className="text-3xl font-bold bg-gradient-to-b from-[#017BFF] via-[#5DDEFF] to-[#5DDEFF] inline-block text-transparent bg-clip-text relative z-10 h-10 flex items-center">
            {stageNum}
          </div>
        </div>
      )}
    </div>
  );
}
