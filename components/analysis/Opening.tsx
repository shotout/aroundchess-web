"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import ReactCountryFlag from "react-country-flag";
import { CardPlayer } from "@/components/player/CardPlayer";
import { useTabFocusStore } from "@/app/store/tabAnalysisStore";
interface OpeningProps {
  next: () => void;
  prev: () => void;
}
const Opening: React.FC<OpeningProps> = (props) => {
  const {
    pgn: storePgn,
    dataAnalysis,
    capturedWhite,
    capturedBlack,
    movementDetails: logMovement,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { tabFocus, setTabFocus } = useTabFocusStore();

  const { chessMove, setChessMove } = useChessMoveStore();
  const { gameInfo, summary, movementDetails } = dataAnalysis ?? {};

  const { whiteSide, blackSide, overallGameAssessment, bestMoves } =
    dataAnalysis?.summary ?? {};
  const blackCountry = blackSide?.profileInfo?.chessAccountInfo?.country
    ? blackSide?.profileInfo?.chessAccountInfo?.country?.substr(-2)
    : "XX";

  const whiteCountry = whiteSide?.profileInfo?.chessAccountInfo?.country
    ? whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";
  const { whiteWin, blackWin, openings } = dataAnalysis?.gameInfo ?? {};
  let dataMovement = movementDetails != null ? movementDetails : logMovement;

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
        return "border border-[#27C2A3] text-[#27C2A3] bg-white";
      case "Excellent":
        return "border border-[#27C2A3] text-[#27C2A3] bg-white";
      case "Great":
        return "border border-[#749BBF] text-[#134472] bg-white";
      case "Good":
        return "border border-[#749BBF] text-[#134472] bg-white";
      case "Best":
        return "border border-[#80B64D] text-[#80B64D] bg-white";
      case "Miss":
        return "border border-[#FF7769] text-[#FF7769] bg-white";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D] bg-white ";
      case "Mistake":
        return "border border-[#FFA459] text-[#FFA459] bg-white";
      case "Inaccuracy":
        return "border border-[#FFA459] text-[#FFA459] bg-white";
      default:
        return "";
    }
  };
  const handleOnClickMovement = (move: any) => {
    let moveOpening =
      dataMovement != null &&
      dataMovement.black != null &&
      dataMovement.black.length > 0
        ? dataMovement.black.filter(
            (item: any) =>
              item.gamePhase.toLowerCase().replace(/ /g, "") == tabFocus
          )
        : [];
    console.log(moveOpening);
    if (moveOpening.length > 0) {
      move.move = moveOpening[moveOpening.length-2].move;
      move.type = "black";
    }
    console.log(move);
    setChessMove(move);
  };
  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <span className="text-[14px] --xs sm:hidden text-center">
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
            <p className="text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md text-right sm:text-left">
              White Opening:{" "}
            </p>
            <div className="flex flex-row justify-end sm:justify-start items-center gap-2 mt-1">
              <span className="block font-semibold text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md text-blue-600">
                {openings.white.name}
              </span>
              {whiteOpening.classification && (
                <Image
                  alt=""
                  src={`/icons/${whiteOpening.classification.toLowerCase()}-moves-icon.png`}
                  width={20}
                  height={20}
                />
              )}
              {whiteOpening.classification}
            </div>
          </div>
          <div>
            <p className="text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md text-left">
              Black Opening:{" "}
            </p>
            <div className="flex flex-row justify-start items-center gap-2 mt-1">
              <span className="block font-semibold text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md text-blue-600">
                {openings.black.name}
              </span>
              {blackOpening.classification && (
                <Image
                  alt=""
                  src={`/icons/${blackOpening.classification.toLowerCase()}-moves-icon.png`}
                  width={20}
                  height={20}
                />
              )}
              {blackOpening.classification}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-6">
          <div className="border border-t-4 border-[#221AE9] rounded-lg p-2 sm:p-4 bg-white shadow">
            <div className="flex flex-row justify-between items-center mb-2 sm:mb-3">
              <span
                onClick={() => handleOnClickMovement(whiteOpening)}
                className="max-w-1/2 cursor-pointer text-[10px] sm:text-[14px] --xs md:text-md lg:text-md rounded-[4px] border border-primary p-1"
              >
                Moves:{" "}
                <span className="text-[10px] sm:text-[14px] --xs md:text-md lg:text-md font-bold">
                  {whiteOpening.moves}
                </span>
              </span>
              <span
                className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[10px] sm:text-[14px] --sm md:text-md lg:text-md ${getBadgeClass(
                  whiteOpening.classification
                )}`}
              >
                {whiteOpening.classification}
              </span>
            </div>
            {/* <ul className="list-disc list-inside text-[14px] --xs"> */}
            <ul className="list-inside text-[14px] --xs">
              {whiteOpening.description.map((detail: any, i: number) => (
                <li key={i} className="mb-1">
                  <span className="font-bold text-[#585858] sm:text-[14px] --sm md:text-md lg:text-md">
                    {detail.split(" ")[0]}
                  </span>{" "}
                  {detail.substring(detail.indexOf(" "))}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 sm:p-4 font-semibold border-l-4 border-[#221AE9] text-[#254B9D] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-md bg-[#F6F9FF] rounded-md">
              {whiteOpening.explanation}
            </div>
          </div>
          <div className="border border-t-4 border-[#221AE9] rounded-lg p-2 sm:p-4 bg-white shadow">
            <div className="flex flex-row justify-between items-center mb-2 sm:mb-3">
              <span
                onClick={() => handleOnClickMovement(blackOpening)}
                className="w-1/2 cursor-pointer text-[10px] sm:text-[14px] --xs md:text-md lg:text-md rounded-[4px] border border-primary p-1"
              >
                Moves:{" "}
                <span className="text-[10px] sm:text-[14px] --xs md:text-md lg:text-md font-bold">
                  {blackOpening.moves}
                </span>
              </span>
              <span
                className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[10px] sm:text-[14px] --sm md:text-md lg:text-md ${getBadgeClass(
                  blackOpening.classification
                )}`}
              >
                {blackOpening.classification}
              </span>
            </div>
            {/* <ul className="list-disc list-inside text-[14px] --xs"> */}
            <ul className="list-inside text-[14px] --xs">
              {blackOpening.description.map((detail: any, i: number) => (
                <li key={i} className="mb-1">
                  <span className="font-bold text-[#585858] sm:text-[14px] --sm md:text-md lg:text-md">
                    {detail.split(" ")[0]}
                  </span>{" "}
                  {detail.substring(detail.indexOf(" "))}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 sm:p-4 font-semibold border-l-4 border-[#221AE9] text-[#254B9D] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-md bg-[#F6F9FF] rounded-md">
              {blackOpening.explanation}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Threats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Middlegame
            <ArrowRight color="#e6f7fe" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Opening;
