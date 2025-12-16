"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import NoData from "@/components/NoData/NoData";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";

interface ThreatsProps {
  next: () => void;
  prev: () => void;
}

const Threats: React.FC<ThreatsProps> = (props) => {
  const { pgn: storePgn, dataAnalysis, capturedWhite } = usePgnStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const { PieceChoosed } = useChessBoardThemeStore();
  const [showAllThreats, setShowAllThreats] = useState<boolean>(false);
  const ITEMS_TO_SHOW = 5;
  // Safe destructuring with defaults
  const { threats = [] } = dataAnalysis ?? {};

  const handleOnClickMovement = (move: any) => {
    console.log("move", move);
    setChessMove(move);
  };

  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <div className="w-full border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md py-3 md:px-3">
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
            {threats.length === 0 && <NoData />}
            {(showAllThreats ? threats : threats.slice(0, ITEMS_TO_SHOW)).map(
              (item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`border ${
                      chessMove.move == item.move
                        ? `border-2 border-[#221AE9] bg-[#221AE910]`
                        : `border-input`
                    } rounded-md p-4`}
                  >
                    <div className="flex flex-row justify-between items-center gap-2 mb-2">
                      <div className="flex gap-[8px]">
                        <span
                          onClick={() => handleOnClickMovement(item)}
                          className="flex items-center justify-center cursor-pointer text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] py-1 px-[14px]"
                        >
                          Move {item?.moveNumber}:&nbsp;
                          {capturedWhite &&
                            capturedWhite
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

                        {item.evaluation && (
                          <span className={`${item.evaluation > 0 ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} flex items-center justify-center cursor-pointer text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal border rounded-full py-1 px-[14px]`}>
                            {item.evaluation > 0 ? '+' : ''}{item.evaluation}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-[10px]">
                        <span className="flex items-center justify-center text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal text-[#FFA459] border border-[#FFA459] rounded-[4px] py-1 px-[14px]">
                          {item?.threatType}
                        </span>

                        <button type="button" className="relative w-[36px] h-[36px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] shadow-[0px_0px_1px_2px_rgba(230,247,254,.2)] rounded-[8px] before:content-[''] before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:absolute before:top-[1px] before:left-[1px] before:shadow-inset before:rounded-[6px] before:shadow-[0px_0px_0px_1px_rgba(255,255,255,1)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-[6px] after:shadow-[inset_0px_-2px_2px_0px_rgba(141,215,246,1)]">
                          <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.4167 15.75L6.58333 11.5833L0.75 15.75V2.41667C0.75 1.97464 0.925595 1.55072 1.23816 1.23816C1.55072 0.925595 1.97464 0.75 2.41667 0.75H10.75C11.192 0.75 11.616 0.925595 11.9285 1.23816C12.2411 1.55072 12.4167 1.97464 12.4167 2.41667V15.75Z" stroke="#221AE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal">
                      <span className="font-bold">Analysis:</span> {item?.explanation}
                    </span>
                    <div className="border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                      <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                        <span className="font-bold">Recommendation:</span> {item?.solution}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
            {threats.length > ITEMS_TO_SHOW && (
              <button
                onClick={() => setShowAllThreats(!showAllThreats)}
                className="w-full flex flex-row items-center justify-center mt-2 py-2 gap-[4px] h-[40px] bg-[#FAFDFF] rounded-[100px] border-[0.5px] border-[#C0CED4]"
              >
                <span className="text-center text-[14px] text-[#221AE9] font-medium">
                  {showAllThreats
                    ? "See Less"
                    : `See More (${threats.length - ITEMS_TO_SHOW})`}
                </span>
                <Image
                  src="/icons/chevron-down.png"
                  alt="arrow down"
                  width={16}
                  height={16}
                  className={`ml-1 ${showAllThreats ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-[8px] md:gap-[16px] mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Movement Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Opening
            <ArrowRight color="#e6f7fe" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Threats;
