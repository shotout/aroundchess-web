"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePgnStore } from "../store/zustandStore";
import { useChessMoveStore } from "../store/chessMoveStore";
import NoData from "@/components/NoData/NoData";
interface ThreatsProps {
  next: () => void;
  prev: () => void;
}
const Threats: React.FC<ThreatsProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
    const { chessMove, setChessMove } = useChessMoveStore();
  
  const { threats } = dataAnalysis ?? {};
  const handleOnClickMovement = (move: any) => {
    console.log("move",move)
    setChessMove(move);
  };
  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 bg-white px-4 lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
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
            {threats.length==0&&(<NoData/>)}
            {threats.map((item: any, index: number) => {
              return (
                <div key={index} className="border border-input rounded-md p-4">
                  <div className="flex flex-row justify-between items-center gap-2 mb-2">
                    <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[10px] sm:text-sm md:text-md lg:text-xs font-normal border border-primary rounded-[4px] p-1">
                      Move {item?.moveNumber}: <span className="font-bold">{item?.move}</span>
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
          className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#000] text-xs sm:text-sm md:text-md lg:text-md ">
            <ArrowLeft color="#000" className="mr-2 h-4 w-4 sm:h-6 w-6" />
            Movement Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-md ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Opening
            <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Threats;
