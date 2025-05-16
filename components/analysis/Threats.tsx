"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import NoData from "@/components/NoData/NoData";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";
interface ThreatsProps {
  next: () => void;
  prev: () => void;
}
const Threats: React.FC<ThreatsProps> = (props) => {
  const { pgn: storePgn, dataAnalysis, capturedWhite } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { PieceChoosed } = useChessBoardThemeStore();

  const { threats } = dataAnalysis ?? {};
  const handleOnClickMovement = (move: any) => {
    console.log("move", move);
    setChessMove(move);
  };
  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <div className="border w-full border-primary border-t-4 rounded-md p-3">
          <div className="flex flex-row items-center gap-2">
            <Image
              alt="images"
              src={"/icons/alert-triangle.png"}
              width={1000}
              height={1000}
              className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
            />
            <span className="text-md sm:text-lg lg:text-xl font-bold w-full">
              Most Critical Threats
            </span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {threats.length == 0 && <NoData />}
            {threats.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`border ${
                    chessMove.move == item.move
                      ? `border-[#221AE9] bg-[#221AE910]`
                      : `border-input`
                  } rounded-md p-4`}
                >
                  <div className="flex flex-row justify-between items-center gap-2 mb-2">
                    <span
                      onClick={() => handleOnClickMovement(item)}
                      className="cursor-pointer text-[10px] flex flex-row justify-center text-center sm:text-sm md:text-md lg:text-xs font-normal border border-primary rounded-[4px] p-1 gap-1"
                    >
                      Move {item?.moveNumber}:{" "}
                      {capturedWhite
                        .filter((wp) => wp.san == item?.move)
                        .map((item, index) => {
                          return (
                            <Image
                              key={index}
                              src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                              alt="icon"
                              width={1000}
                              height={1000}
                              className="w-[12px] h-[12px] object-contain inline-block"
                            />
                          );
                        })}
                      <span className="font-bold">{item?.move}</span>
                    </span>
                    <span className="text-[10px] sm:text-sm md:text-md lg:text-xs font-normal text-center text-[#FFA459] border border-[#FFA459] rounded-[4px] p-1 sm:p-2">
                      {item?.threatType}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-sm md:text-md lg:text-sm font-normal">
                    {item?.explanation}
                  </span>
                  <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                    <span className="text-[10px] sm:text-sm md:text-md lg:text-sm font-normal text-primary">
                      {item?.solution}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#221AE9] font-medium text-xs sm:text-sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Movement Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#e6f7fe] text-xs sm:text-sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Opening
            <ArrowRight color="#e6f7fe" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Threats;
