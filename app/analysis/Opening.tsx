"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
interface OpeningProps {
  next: () => void;
  prev: () => void;
}
const Opening: React.FC<OpeningProps> = (props) => {
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
        return "border border-[#27C2A3] text-[#0C7C65]";
      case "Great":
        return "border border-[#BDD0F9] text-[#134472]";
      case "Best":
        return "border border-[#80B64D] text-[#3A6211]";
      case "Miss":
        return "border border-[#FF7769] text-[#C23627]";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D]";
      case "Mistake":
        return "border border-[#FFA459] text-[#B08503]";
      default:
        return "border border-[#80B64D] text-[#3A6211]";
    }
  };
  return (
    <div className="flex flex-col w-full justify-center gap-4 bg-white px-4">
      <span className="text-xs sm:hidden text-center">
        <span className="text-[#00B427]">blitzmystic</span> (White) vs Guest1234
        (Black)
      </span>
      <div className="hidden sm:flex flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="w-full border border-[#00B427] bg-[#D3FFDD] p-3 rounded-md sm:rounded-lg flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row gap-2">
            {/* <Image 
                  alt="avatar"
                  src={"/images/icons/"}/> */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg font-medium text-[#00B427]">
                  Player name
                </span>
              </div>

              <div className="flex flex-row gap-1">
                <Image
                  src={"/icons/pawn-icon-alt-white.png"}
                  alt="pawn"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                <Image
                  src={"/icons/rook-icon-alt-white.png"}
                  alt="rook"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />

                <Image
                  src={"/icons/queen-icon-alt-white.png"}
                  alt="queen"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
              </div>
            </div>
          </div>
          <Image
            src={"/icons/switzerland-flag.png"}
            alt="flag"
            width={1000}
            height={1000}
            className="w-7 h-5"
          />
        </div>
        <div className="w-full border border-input p-3 rounded-md sm:rounded-lg flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row gap-2">
            {/* <Image 
                  alt="avatar"
                  src={"/images/icons/"}/> */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg font-medium text-[#00B427]">
                  Player name
                </span>
              </div>

              <div className="flex flex-row gap-1">
                <Image
                  src={"/icons/pawn-icon-alt-white.png"}
                  alt="pawn"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                <Image
                  src={"/icons/rook-icon-alt-white.png"}
                  alt="rook"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />

                <Image
                  src={"/icons/queen-icon-alt-white.png"}
                  alt="queen"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
              </div>
            </div>
          </div>
          <Image
            src={"/icons/switzerland-flag.png"}
            alt="flag"
            width={1000}
            height={1000}
            className="w-7 h-5"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm sm:text-sm md:text-md lg:text-lg text-right sm:text-left">White Opening: </p>
          <div className="flex flex-row justify-end sm:justify-start items-center gap-2 mt-1">
            <span className="block font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-blue-600">
              Sicilian Defense
            </span>
            <Image
              alt=""
              src={"/icons/brilliant-moves-icon.png"}
              width={20}
              height={20}
            />
          </div>
        </div>
        <div>
          <p className="text-sm sm:text-sm md:text-md lg:text-lg text-left">Black Opening: </p>
          <div className="flex flex-row justify-start items-center gap-2 mt-1">
            <span className="block font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-blue-600">
              Ruy Lopez Opening
            </span>
            <Image
              alt=""
              src={"/icons/great-moves-icon.png"}
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-6">
        {opening.map((move: any, index: number) => (
          <div
            key={index}
            className="border border-t-4 border-[#3871EC] rounded-lg p-2 sm:p-4 bg-white shadow"
          >
            <div className="flex flex-row justify-between items-center mb-2 sm:mb-3" >
              <span className="text-[10px] sm:text-xs md:text-md lg:text-lg rounded-[4px] border border-primary p-1">
                Moves:{" "}
                <span className="text-[10px] sm:text-xs md:text-md lg:text-lg font-bold">{move.moves}</span>
              </span>
              <span
                className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[10px] sm:text-sm md:text-md lg:text-lg ${getBadgeClass(
                  move.classification
                )}`}
              >
                {move.classification}
              </span>
            </div>
            <ul className="list-disc list-inside text-xs">
              {move.details.map((detail: any, i: number) => (
                <li key={i} className="mb-1">
                  <span className="font-bold sm:text-sm md:text-md lg:text-lg">{detail.split(" ")[0]}</span>{" "}
                  {detail.substring(detail.indexOf(" "))}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 sm:p-4 font-semibold border-l-4 border-[#3871EC] text-[#254B9D] text-xs sm:text-sm md:text-md lg:text-lg bg-[#F6F9FF] rounded-md">
              [EXPLAIN WHY MOVE IS NOT PERFECT AND WHAT WOULD BE A BETTER MOVE]
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-between ">
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-xs sm:text-sm md:text-md lg:text-lg text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Threats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Button>
        <div className="w-8" />
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Middlegame
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Opening;
