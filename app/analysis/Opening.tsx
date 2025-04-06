"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePgnStore } from "../store/zustandStore";
import { useChessMoveStore } from "../store/chessMoveStore";
import ReactCountryFlag from "react-country-flag";
import { CardPlayer } from "@/components/player/CardPlayer";
interface OpeningProps {
  next: () => void;
  prev: () => void;
}
const Opening: React.FC<OpeningProps> = (props) => {
  const { pgn: storePgn, dataAnalysis,capturedWhite,capturedBlack } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();

  const { whiteSide, blackSide, overallGameAssessment, bestMoves } =
    dataAnalysis?.summary ?? {};
    const blackCountry =blackSide?.profileInfo?.chessAccountInfo?.country?
    blackSide?.profileInfo?.chessAccountInfo?.country?.substr(-2):"XX";

  const whiteCountry =whiteSide?.profileInfo?.chessAccountInfo?.country?
    whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2):"XX";
  const { whiteWin, blackWin, openings } = dataAnalysis?.gameInfo ?? {};
  const { whiteOpening, blackOpening } = dataAnalysis?.opening ?? {};
  const [opening, setOpening] = React.useState<any>([
    {
      moves: "e4, c5",
      classification: "Brilliant",
      details: [
        "Whites open with 1.e4, aiming to control the center and freeing pieces.",
        "Black responds with 1...c5, challenging White’s central control and contesting the center.",
      ],
    },
    {
      moves: "f5, e5",
      classification: "Great",
      details: [
        "Whites open with 1.e4, controlling the center and freeing pieces.",
        "Black responds with 1...e5, contesting the center.",
      ],
    },
  ]);
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "border border-[#27C2A3] text-[#27C2A3]";
      case "Great":
        return "border border-[#749BBF] text-[#134472]";
      case "Best":
        return "border border-[#80B64D] text-[#80B64D]";
      case "Miss":
        return "border border-[#FF7769] text-[#FF7769]";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D]";
      case "Mistake":
        return "border border-[#FFA459] text-[#FFA459]";
      default:
        return "border border-[#80B64D] text-[#FFA459]";
    }
  };
  const handleOnClickMovement = (move: any) => {
    console.log(move);
    setChessMove(move);
  };
  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 bg-white px-4 lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <span className="text-xs sm:hidden text-center">
          <span className="line-clamp-1 text-[#00B427]">
            {whiteSide?.profileInfo.username}
          </span>{" "}
          (White) vs {blackSide?.profileInfo.username}
          (Black)
        </span>
        <div className="hidden sm:flex flex-row items-center justify-between gap-4 sm:gap-6">
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
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm sm:text-sm md:text-md lg:text-xs text-right sm:text-left">
              White Opening:{" "}
            </p>
            <div className="flex flex-row justify-end sm:justify-start items-center gap-2 mt-1">
              <span className="block font-semibold text-sm sm:text-sm md:text-md lg:text-xs text-blue-600">
                {openings.white.name}
              </span>
              <Image
                alt=""
                src={`/icons/${whiteOpening.classification.toLowerCase()}-moves-icon.png`}
                width={20}
                height={20}
              />
              {whiteOpening.classification}
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-sm md:text-md lg:text-xs text-left">
              Black Opening:{" "}
            </p>
            <div className="flex flex-row justify-start items-center gap-2 mt-1">
              <span className="block font-semibold text-sm sm:text-sm md:text-md lg:text-xs text-blue-600">
                {openings.black.name}
              </span>
              <Image
                alt=""
                src={`/icons/${blackOpening.classification.toLowerCase()}-moves-icon.png`}
                width={20}
                height={20}
              />
              {blackOpening.classification}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-6">
          <div className="border border-t-4 border-[#221AE9] rounded-lg p-2 sm:p-4 bg-white shadow">
            <div className="flex flex-row justify-between items-center mb-2 sm:mb-3">
              <span
                onClick={() => handleOnClickMovement(whiteOpening)}
                className="cursor-pointer text-[10px] sm:text-xs md:text-md lg:text-xs rounded-[4px] border border-primary p-1"
              >
                Moves:{" "}
                <span className="text-[10px] sm:text-xs md:text-md lg:text-xs font-bold">
                  {whiteOpening.moves}
                </span>
              </span>
              <span
                className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[10px] sm:text-sm md:text-md lg:text-xs ${getBadgeClass(
                  whiteOpening.classification
                )}`}
              >
                {whiteOpening.classification}
              </span>
            </div>
            {/* <ul className="list-disc list-inside text-xs"> */}
            <ul className="list-inside text-xs">
              {whiteOpening.description.map((detail: any, i: number) => (
                <li key={i} className="mb-1">
                  <span className="font-bold text-[#585858] sm:text-sm md:text-md lg:text-xs">
                    {detail.split(" ")[0]}
                  </span>{" "}
                  {detail.substring(detail.indexOf(" "))}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 sm:p-4 font-semibold border-l-4 border-[#221AE9] text-[#254B9D] text-xs sm:text-sm md:text-md lg:text-xs xl:text-md bg-[#F6F9FF] rounded-md">
              {whiteOpening.explanation}
            </div>
          </div>
          <div className="border border-t-4 border-[#221AE9] rounded-lg p-2 sm:p-4 bg-white shadow">
            <div className="flex flex-row justify-between items-center mb-2 sm:mb-3">
              <span
                onClick={() => handleOnClickMovement(blackOpening)}
                className="cursor-pointer text-[10px] sm:text-xs md:text-md lg:text-xs rounded-[4px] border border-primary p-1"
              >
                Moves:{" "}
                <span className="text-[10px] sm:text-xs md:text-md lg:text-xs font-bold">
                  {blackOpening.moves}
                </span>
              </span>
              <span
                className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[10px] sm:text-sm md:text-md lg:text-xs ${getBadgeClass(
                  blackOpening.classification
                )}`}
              >
                {blackOpening.classification}
              </span>
            </div>
            {/* <ul className="list-disc list-inside text-xs"> */}
            <ul className="list-inside text-xs">
              {blackOpening.description.map((detail: any, i: number) => (
                <li key={i} className="mb-1">
                  <span className="font-bold text-[#585858] sm:text-sm md:text-md lg:text-xs">
                    {detail.split(" ")[0]}
                  </span>{" "}
                  {detail.substring(detail.indexOf(" "))}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 sm:p-4 font-semibold border-l-4 border-[#221AE9] text-[#254B9D] text-xs sm:text-sm md:text-md lg:text-xs xl:text-md bg-[#F6F9FF] rounded-md">
              {blackOpening.explanation}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#000] text-xs sm:text-sm md:text-md lg:text-lg ">
            <ArrowLeft color="#000" className="mr-2 h-4 w-4 sm:h-6 w-6" />
            Threats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Middlegame
            <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Opening;
