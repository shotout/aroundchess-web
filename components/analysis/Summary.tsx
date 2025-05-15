"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp, Watch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import ReactCountryFlag from "react-country-flag";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import { CardPlayer } from "@/components/player/CardPlayer";
import { useAuth } from "@clerk/nextjs";
import { FamousGameCard } from "@/components/famous-game-button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfileStore } from "@/app/store/profile";
import { useConfirmLogin } from "@/app/store/confirmLogin";

interface SummaryProps {
  next: () => void;
}

const Summary: React.FC<SummaryProps> = (props) => {
  const {
    pgn: storePgn,
    dataAnalysis,
    capturedWhite,
    capturedBlack,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { open, setOpen: setOpenConfirmLogin } = useConfirmLogin();

  useEffect(() => {
    const checkSession = () => {
      if (sessionId != "") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);

  const {
    whiteSide,
    blackSide,
    overallGameAssessment,
    bestMoves,
    criticalMistakes,
  } = dataAnalysis?.summary ?? {};
  const { whiteWin, blackWin } = dataAnalysis?.gameInfo ?? {};
  const blackCountry = blackSide?.profileInfo?.chessAccountInfo?.country
    ? blackSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";

  const whiteCountry = whiteSide?.profileInfo?.chessAccountInfo?.country
    ? whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";
  const [openBestMoves, setOpenBestMoves] = useState<boolean>(true);
  const [openCriticalMoves, setOpenCriticalMoves] = useState<boolean>(true);
  const handleOnClickMovement = (move: any) => {
    console.log(move);
    setChessMove(move);
  };
  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <div className="flex flex-col gap-2 w-full py-2 border-b border-b-input">
          <span className="text-xs sm:hidden text-center line-clamp-1">
            <span
              className={`text-xs ${
                whiteWin ? `text-[#00B427]` : `text-black`
              } `}
            >
              {whiteSide?.profileInfo.username}
            </span>{" "}
            (White) vs{" "}
            <span
              className={`text-xs ${
                blackWin ? `text-[#00B427]` : `text-black`
              }`}
            >
              {blackSide?.profileInfo.username}{" "}
            </span>
            (Black)
          </span>
          {isSignedIn ? (
            <div className="hidden sm:flex flex-row items-center justify-between gap-4">
              <CardPlayer
                isWin={whiteWin}
                profilePhoto={whiteSide?.profileInfo.photo}
                username={whiteSide?.profileInfo.username}
                country={whiteCountry}
                capturedPieces={capturedWhite}
              />

              <CardPlayer
                isWin={blackWin}
                profilePhoto={blackSide?.profileInfo.photo}
                username={blackSide?.profileInfo.username}
                country={blackCountry}
                capturedPieces={capturedBlack}
              />
            </div>
          ) : (
            <FamousGameCard />
          )}

          <div className="flex flex-row items-center justify-start py-2">
            <div
              className={`w-full xl:pr-3 rounded-md flex flex-row justify-end items-center`}
            >
              <div className="flex flex-col items-end justify-around gap-2">
                <div className="flex flex-row items-center justify-center min-w-[80px] xl:min-w-[132px] gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-semibold p-1">
                    Accuracy:
                  </span>
                  <span className="text-xs min-w-[50px] sm:text-sm md:text-md lg:text-md text-center text-primary border border-primary rounded-sm p-1">
                    {whiteSide?.analysis?.accuracy}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center min-w-[80px] xl:min-w-[132px] gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[182px] sm:text-sm md:text-md lg:text-md text-right font-semibold p-1">
                    Game Rating:
                  </span>
                  <span className="text-xs min-w-[50px] sm:text-sm md:text-md lg:text-md text-center text-[#F65240] border border-[#F65240] bg-[#FFE5E2] rounded-sm p-1">
                    {whiteSide?.profileInfo.gameRating}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`w-full pl-2 flex flex-row justify-between items-center `}
            >
              <div className="flex flex-col items-start justify-center gap-2">
                <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-primary border border-primary rounded-sm p-1">
                  {blackSide?.analysis?.accuracy}
                </span>
                <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#F65240] border border-[#F65240] bg-[#FFE5E2] rounded-sm p-1">
                  {blackSide?.profileInfo.gameRating}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* move quality */}
        <div className="flex flex-col gap-2 w-full border-b border-b-input pb-2">
          <span className="text-sm sm:text-sm md:text-md lg:text-md font-semibold text-center">
            Move Quality
          </span>
          <div className="flex flex-row items-center justify-start py-2">
            <div
              className={`w-full pr-3 rounded-md flex flex-row justify-end items-center`}
            >
              <div className="flex flex-col items-end justify-around gap-2">
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-normal p-1">
                    Brilliant:
                  </span>
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#27C2A3] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.brilliant}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-normal p-1">
                    Great:
                  </span>
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#749BBF] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.great}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-normal p-1">
                    Best:
                  </span>
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#80B64D] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.best}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-normal p-1">
                    Mistake:
                  </span>
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#FFA459] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.mistake}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-normal p-1">
                    Miss:
                  </span>
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.miss}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-around gap-2 ">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-md text-right font-normal p-1">
                    Blunder:
                  </span>

                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.blunder}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mt-1 sm:gap-3 sm:-mt-[8px] w-[40px]">
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/brilliant-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/great-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/best-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/mistake-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/miss-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/blunder-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
            </div>
            <div className={`w-full pl-2 flex flex-row items-center`}>
              <div className="flex flex-col items-start justify-center gap-2">
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#27C2A3] p-1 min-w-[32px]">
                    {blackSide?.analysis?.moveQuality.brilliant}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#749BBF] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.great}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#80B64D] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.best}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#FFA459] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.mistake}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.miss}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[44px] sm:text-sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                    {blackSide?.analysis?.moveQuality.blunder}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full border-b border-b-input pb-2">
          <div className="flex flex-row items-center justify-center gap-4">
            <div
              className={`w-full pr-3 rounded-md flex flex-row justify-end items-center`}
            >
              <div className="flex flex-col items-end justify-around gap-2 ">
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] text-center sm:text-sm md:text-md lg:text-xs text-right font-normal p-1 ">
                    Opening:
                  </span>
                  <div className="flex max-w-[44px] flex-col items-center w-16">
                    <Image
                      alt=""
                      src={`/icons/${whiteSide?.analysis?.opening.toLowerCase()}-moves-icon.png`}
                      width={1000}
                      height={1000}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                    />
                    <span className="text-[11px]  font-normal sm:text-sm md:text-md lg:text-xs text-center p-1">
                      {whiteSide?.analysis?.opening}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-xs text-right font-normal p-1 ">
                    Middlegame:
                  </span>
                  <div className="flex max-w-[44px] flex-col items-center w-16">
                    <Image
                      alt=""
                      src={`/icons/${whiteSide?.analysis?.middleGame.toLowerCase()}-moves-icon.png`}
                      width={1000}
                      height={1000}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                    />
                    <span className="text-[11px]  font-normal sm:text-sm md:text-md lg:text-xs text-center p-1">
                      {whiteSide?.analysis?.middleGame}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-xs min-w-[40px] xl:min-w-[194px] sm:text-sm md:text-md lg:text-xs text-right font-normal p-1 ">
                    Endgame:
                  </span>
                  <div className="flex max-w-[44px] flex-col items-center w-16">
                    <Image
                      alt=""
                      src={`/icons/${whiteSide?.analysis?.endGame.toLowerCase()}-moves-icon.png`}
                      width={1000}
                      height={1000}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                    />
                    <span className="text-[11px] font-normal sm:text-sm md:text-md lg:text-xs text-center p-1">
                      {whiteSide?.analysis?.endGame}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`w-full pl-2 flex flex-col items-start gap-2`}>
              <div className="flex flex-row items-center justify-around gap-2">
                <div className="flex max-w-[44px] flex-col items-center w-16">
                  <Image
                    alt=""
                    src={`/icons/${blackSide?.analysis?.opening.toLowerCase()}-moves-icon.png`}
                    width={1000}
                    height={1000}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                  <span className="text-[11px] font-normal sm:text-sm md:text-md lg:text-xs text-center p-1">
                    {blackSide?.analysis?.opening}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-around gap-2">
                <div className="flex max-w-[44px] flex-col items-center w-16">
                  <Image
                    alt=""
                    src={`/icons/${blackSide?.analysis?.middleGame.toLowerCase()}-moves-icon.png`}
                    width={1000}
                    height={1000}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                  <span className="text-[11px] font-normal sm:text-sm md:text-md lg:text-xs text-center p-1">
                    {blackSide?.analysis?.middleGame}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-around gap-2">
                <div className="flex max-w-[44px] flex-col items-center w-16">
                  <Image
                    alt=""
                    src={`/icons/${blackSide?.analysis?.endGame.toLowerCase()}-moves-icon.png`}
                    width={1000}
                    height={1000}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                  <span className="text-[11px] font-normal sm:text-sm md:text-md lg:text-xs text-center p-1">
                    {blackSide?.analysis?.endGame}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* overall assessment */}
        <div className="border border-input sm:border-primary sm:border-t-4 rounded-md p-4">
          <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold">
            Overall Game Assessment
          </span>
          <div className="flex flex-row gap-2 mt-2">
            <Image
              alt=""
              src={"/icons/target.png"}
              width={1000}
              height={1000}
              className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="text-xs sm:text-sm md:text-md lg:text-md font-light">
              Game Accuracy:
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-md font-bold">
              {overallGameAssessment?.gameAccuracy}
            </span>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <span className="text-sm sm:text-md md:text-lg lg:text-md font-light">
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
              className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold w-full">
              Best Moves
            </span>
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
              {bestMoves != null &&
                bestMoves.middleGame &&
                bestMoves.middleGame.map((middle: any, i: number) => {
                  return (
                    <div className="border border-input rounded-md p-4" key={i}>
                      <div className="flex flex-row justify-between gap-2 mb-2">
                        <span
                          onClick={() => handleOnClickMovement(middle)}
                          className="cursor-pointer text-[10px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1"
                        >
                          Move {middle.moveNumber}:{" "}
                          <span className="font-bold">{middle.move}</span>
                        </span>
                        <span className="text-[10px] sm:text-sm md:text-md lg:text-md font-normal text-[#FFA459] border border-[#FFA459] rounded-[4px] p-1">
                          {middle.classification}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-sm md:text-md lg:text-md font-normal">
                        {middle.analysis}
                      </span>
                      <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                        <span className="text-[10px] sm:text-sm md:text-md lg:text-md font-normal text-primary">
                          {/* [HOW THE THREAT COULD HAVE BEEN AVOIDED] */}
                          Evaluation: {middle.evaluation}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
              className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold w-full">
              Critical Mistakes
            </span>
            <div onClick={() => setOpenCriticalMoves(!openCriticalMoves)}>
              {openCriticalMoves ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {openCriticalMoves &&
            criticalMistakes &&
            criticalMistakes.length > 0 &&
            criticalMistakes.map((item: any, index: number) => {
              return (
                <div className="flex flex-col gap-2 mt-2" key={index}>
                  <div className="border border-input rounded-md p-4">
                    <div className="flex flex-row justify-between gap-2 mb-2">
                      <span
                        onClick={() => handleOnClickMovement(item)}
                        className="cursor-pointer text-[10px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1"
                      >
                        Move {item.moveNumber}:{" "}
                        <span className="font-bold">{item.move}</span>
                      </span>
                      <span className="text-[10px] sm:text-sm md:text-md lg:text-md font-normal text-[#FFA459] border border-[#FFA459] rounded-[4px] p-1">
                        {item.type}
                      </span>
                    </div>
                    {item.analysis && (
                      <span className="text-[10px] sm:text-sm md:text-md lg:text-md font-normal">
                        {item.analysis}
                      </span>
                    )}
                    <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                      <span className="text-[10px] sm:text-sm md:text-md lg:text-md font-normal text-primary">
                        {item.solution}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <button
        onClick={isSignedIn ? props.next : () => setOpenConfirmLogin(true)}
        className="btn-primary flex w-full justify-center items-center h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
      >
        <div className="flex flex-row justify-center items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
          Movement Details
          <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
        </div>
      </button>
    </>
  );
};

export default Summary;
