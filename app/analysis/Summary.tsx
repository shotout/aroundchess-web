"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp, Watch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";

interface SummaryProps {
  next: () => void;
}

const Summary: React.FC<SummaryProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store

  const { whiteSide, blackSide, overallGameAssessment, bestMoves } =
    dataAnalysis?.summary ??{};
  const { whiteWin, blackWin } = dataAnalysis?.gameInfo ??{};
  const [openBestMoves, setOpenBestMoves] = useState<boolean>(false);
  const [openCriticalMoves, setOpenCriticalMoves] = useState<boolean>(false);
  return (
    <div className="flex flex-col justify-center gap-4 bg-white px-4">
      <div className="flex flex-col gap-2 w-full py-2 rounded-md border-b border-b-input">
        <span className="text-xs sm:hidden text-center">
          <span className="text-[#00B427]">
            {whiteSide?.profileInfo.username}
          </span>{" "}
          (White) vs
          {whiteSide?.profileInfo.username} (Black)
        </span>
        <div className="hidden sm:flex flex-row items-center justify-between gap-4">
          <div className="w-full border border-[#00B427] bg-[#D3FFDD] p-3 rounded-md flex flex-row justify-between items-center gap-2">
            <div className="flex flex-row gap-2">
              <Image
                alt="avatar"
                src={blackSide?.profileInfo.photo}
                className="w-10 h-10 rounded-full"
                width={1000}
                height={1000}
              />
              {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <span
                    className={`text-xs sm:text-sm md:text-md lg:text-lg font-medium ${
                      !whiteWin ? "text-black" : "text-[#00B427]"
                    }`}
                  >
                    {whiteSide?.profileInfo.username}
                  </span>
                </div>

                <div className="flex flex-row gap-1">
                  <Image
                    src={"/icons/pawn-icon-alt-white.png"}
                    alt="pawn"
                    width={1000}
                    height={1000}
                    className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                  />
                  <Image
                    src={"/icons/rook-icon-alt-white.png"}
                    alt="rook"
                    width={1000}
                    height={1000}
                    className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                  />

                  <Image
                    src={"/icons/queen-icon-alt-white.png"}
                    alt="queen"
                    width={1000}
                    height={1000}
                    className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                  />
                </div>
              </div>
            </div>
            <Image
              src={"/icons/switzerland-flag.png"}
              alt="flag"
              width={1000}
              height={1000}
              className="w-7 h-5 sm:w-8 sm:h-6 lg:w-10 lg:h-8"
            />
          </div>
          <div className="w-full border border-input p-3 rounded-md flex flex-row justify-between items-center gap-2">
            <div className="flex flex-row gap-2">
              <Image
                alt="avatar"
                src={blackSide?.profileInfo.photo}
                className="w-10 h-10 rounded-full"
                width={1000}
                height={1000}
              />
              {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <span
                    className={`text-xs sm:text-sm md:text-md lg:text-lg font-medium ${
                      whiteWin ? "text-black" : "text-[#00B427]"
                    }`}
                  >
                    {blackSide?.profileInfo.username}
                  </span>
                </div>

                <div className="flex flex-row gap-1">
                  <Image
                    src={"/icons/pawn-icon-alt-white.png"}
                    alt="pawn"
                    width={1000}
                    height={1000}
                    className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                  />
                  <Image
                    src={"/icons/rook-icon-alt-white.png"}
                    alt="rook"
                    width={1000}
                    height={1000}
                    className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                  />

                  <Image
                    src={"/icons/queen-icon-alt-white.png"}
                    alt="queen"
                    width={1000}
                    height={1000}
                    className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                  />
                </div>
              </div>
            </div>
            <Image
              src={"/icons/switzerland-flag.png"}
              alt="flag"
              width={1000}
              height={1000}
              className="w-7 h-5 sm:w-8 sm:h-6 lg:w-10 lg:h-8"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex flex-col items-end justify-around gap-2">
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Accuracy:
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Game Rating:
            </span>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="flex flex-row items-center justify-around gap-2">
              <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-primary border border-primary rounded-sm p-1">
                {whiteSide?.analysis.accuracy}
              </span>
              <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#F65240] border border-[#F65240] bg-[#FFE5E2] rounded-sm p-1">
                {blackSide?.analysis.accuracy}
              </span>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
              <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-primary border border-primary rounded-sm p-1">
                {whiteSide?.profileInfo.gameRating}
              </span>
              <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#F65240] border border-[#F65240] bg-[#FFE5E2] rounded-sm p-1">
                {blackSide?.profileInfo.gameRating}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* move quality */}
      <div className="flex flex-col gap-2 w-full rounded-md border-b border-b-input">
        <span className="text-sm sm:text-sm md:text-md lg:text-lg font-semibold text-center">Move Quality</span>
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex flex-col items-end justify-around gap-2">
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Brilliant:
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">Great:</span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">Best:</span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Mistake:
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">Miss:</span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Blunder:
            </span>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="flex flex-row items-center justify-around gap-2">
              <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#27C2A3] p-1 min-w-[32px]">
                {whiteSide?.analysis.moveQuality.brilliant}
              </span>
              <Image
                alt=""
                src={"/icons/brilliant-moves-icon.png"}
                width={1000}
                height={1000}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
              />
              <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#27C2A3] p- min-w-[32px]1">
                {blackSide?.analysis.moveQuality.brilliant}
              </span>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-row items-center justify-around gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#749BBF] p-1 min-w-[32px]">
                  {whiteSide?.analysis.moveQuality.great}
                </span>
                <Image
                  alt=""
                  src={"/icons/great-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#749BBF] p-1 min-w-[32px]">
                  {blackSide?.analysis.moveQuality.great}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-row items-center justify-around gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#80B64D] p-1 min-w-[32px]">
                  {whiteSide?.analysis.moveQuality.best}
                </span>
                <Image
                  alt=""
                  src={"/icons/best-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#80B64D] p-1 min-w-[32px]">
                  {blackSide?.analysis.moveQuality.best}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-row items-center justify-around gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#FFA459] p-1 min-w-[32px]">
                  {whiteSide?.analysis.moveQuality.mistake}
                </span>
                <Image
                  alt=""
                  src={"/icons/mistake-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#FFA459] p-1 min-w-[32px]">
                  {blackSide?.analysis.moveQuality.mistake}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-row items-center justify-around gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#FF7769] p-1 min-w-[32px]">
                  {whiteSide?.analysis.moveQuality.miss}
                </span>
                <Image
                  alt=""
                  src={"/icons/miss-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#FF7769] p-1 min-w-[32px]">
                  {blackSide?.analysis.moveQuality.miss}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-row items-center justify-around gap-2 ">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#FF7769] p-1 min-w-[32px]">
                  {whiteSide?.analysis.moveQuality.blunder}
                </span>
                <Image
                  alt=""
                  src={"/icons/blunder-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center text-[#FF7769] p-1 min-w-[32px]">
                  {blackSide?.analysis.moveQuality.blunder}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full rounded-md border-b border-b-input pb-2">
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex flex-col items-end justify-around gap-2">
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Opening:
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Middlegame:
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-lg text-right font-semibold p-1">
              Endgame:
            </span>
          </div>
          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-col items-center w-16">
                <Image
                  alt=""
                  src={`/icons/${whiteSide?.analysis.opening.toLowerCase()}-moves-icon.png`}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center p-1">
                  {whiteSide?.analysis.opening}
                </span>
              </div>
              <div className="flex flex-col items-center w-16">
                <Image
                  alt=""
                  src={`/icons/${blackSide?.analysis.opening.toLowerCase()}-moves-icon.png`}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center p-1">
                  {blackSide?.analysis.opening}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-col items-center w-16">
                <Image
                  alt=""
                  src={`/icons/${whiteSide?.analysis.middleGame.toLowerCase()}-moves-icon.png`}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center p-1">
                  {whiteSide?.analysis.middleGame}
                </span>
              </div>
              <div className="flex flex-col items-center w-16">
                <Image
                  alt=""
                  src={`/icons/${blackSide?.analysis.middleGame.toLowerCase()}-moves-icon.png`}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center p-1">
                  {blackSide?.analysis.middleGame}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-around gap-2">
              <div className="flex flex-col items-center w-16">
                <Image
                  alt=""
                  src={`/icons/${whiteSide?.analysis.endGame.toLowerCase()}-moves-icon.png`}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center p-1">
                  {whiteSide?.analysis.endGame}
                </span>
              </div>
              <div className="flex flex-col items-center w-16">
                <Image
                  alt=""
                  src={`/icons/${blackSide?.analysis.endGame.toLowerCase()}-moves-icon.png`}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg text-center p-1">
                  {blackSide?.analysis.endGame}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* overall assessment */}
      <div className="border border-input sm:border-primary sm:border-t-4 rounded-md p-4">
        <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold">Overall Game Assessment</span>
        <div className="flex flex-row gap-2 mt-2">
          <Image
            alt=""
            src={"/icons/target.png"}
            width={1000}
            height={1000}
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
          />
          <span className="text-xs sm:text-sm md:text-md lg:text-lg font-light">
            Game Accuracy:
          </span>
          <span className="text-xs sm:text-sm md:text-md lg:text-lg font-bold">
            {overallGameAssessment?.gameAccuracy}
          </span>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-sm sm:text-md md:text-lg lg:text-xl font-light">
            {overallGameAssessment?.analysis}
          </span>
        </div>
      </div>
      {/* best moves  */}
      <div className="border border-primary border-t-4 rounded-md p-3">
        <div className="flex flex-row items-center gap-2">
          <Image
            alt=""
            src={"/icons/check.png"}
            width={1000}
            height={1000}
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
          />
          <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold w-full">Best Moves</span>
          <div onClick={() => setOpenBestMoves(!openBestMoves)}>
            {openBestMoves ? (
              <ChevronUp size={24} color="black" />
            ) : (
              <ChevronDown size={24} color="black" />
            )}
          </div>
        </div>
        {openBestMoves && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="border border-input rounded-md p-4">
              <div className="flex flex-row justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal border border-primary rounded-[4px] p-1">
                  Move 2: <span className="font-bold">e5</span>
                </span>
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal text-[#B08503] border border-[#B08503] rounded-[4px] p-1">
                  [TYPE OF THROAT]
                </span>
              </div>
              <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal">
                [EXPLANATION OF THROAT]
              </span>
              <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal text-primary">
                  [HOW THE THREAT COULD HAVE BEEN AVOIDED]
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* critical mistakes moves  */}
      <div className="border border-primary border-t-4 rounded-md p-3">
        <div className="flex flex-row items-center gap-2">
          <Image
            alt=""
            src={"/icons/alert-triangle.png"}
            width={1000}
            height={1000}
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
          />
          <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold w-full">Critical Mistakes</span>
          <div onClick={() => setOpenCriticalMoves(!openCriticalMoves)}>
            {openCriticalMoves ? (
              <ChevronUp size={24} color="black" />
            ) : (
              <ChevronDown size={24} color="black" />
            )}
          </div>
        </div>
        {openCriticalMoves && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="border border-input rounded-md p-4">
              <div className="flex flex-row justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal border border-primary rounded-[4px] p-1">
                  Move 2: <span className="font-bold">e5</span>
                </span>
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal text-[#B08503] border border-[#B08503] rounded-[4px] p-1">
                  [TYPE OF THROAT]
                </span>
              </div>
              <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal">
                [EXPLANATION OF THROAT]
              </span>
              <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal text-primary">
                  [HOW THE THREAT COULD HAVE BEEN AVOIDED]
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Button
        onClick={props.next}
        size="lg"
        variant="default"
        className="whitespace-nowrap sm:mt-2 text-xs sm:py-4 md:py-6 lg:py-8"
      >
        <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
          Movement Details
          <ArrowRight color="#FFF" className="ml-2 h-4 w-4" />
        </div>
      </Button>
    </div>
  );
};

export default Summary;
