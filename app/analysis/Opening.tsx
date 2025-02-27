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
      <div className="text-center mb-1 ">
        <h2 className="text-sm ">
          <span className="text-[#00B427]">blitzmystic</span> (White) vs
          Guest1234 (Black)
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm text-right">White Opening: </p>
          <div className="flex flex-row justify-end items-center gap-2 mt-1">
            <span className="block font-semibold text-sm text-blue-600">
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
          <p className="text-sm text-left">Black Opening: </p>
          <div className="flex flex-row justify-start items-center gap-2 mt-1">
            <span className="block font-semibold text-sm text-blue-600">
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
      <div className="grid grid-cols-2 gap-2">
        {opening.map((move: any, index: number) => (
          <div
            key={index}
            className="border border-t-4 border-[#3871EC] rounded-lg p-2 bg-white shadow"
          >
            <div className="flex flex-row justify-between items-center mb-2">
              <span className="text-[10px] rounded-[4px] border border-primary p-1">
                Moves: <span className="text-[10px] font-bold">{move.moves}</span>
              </span>
              <span
                className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[10px] ${getBadgeClass(
                  move.classification
                )}`}
              >
                {move.classification}
              </span>
            </div>
            <ul className="list-disc list-inside text-xs">
              {move.details.map((detail: any, i: number) => (
                <li key={i} className="mb-1">
                  <span className="font-bold">{detail.split(" ")[0]}</span>{" "}
                  {detail.substring(detail.indexOf(" "))}
                </li>
              ))}
            </ul>
            <div className="mt-2 p-2 border border-l-4 border-[#3871EC] text-[#254B9D] text-xs bg-[#F6F9FF] rounded-md">
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
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-xs text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Threats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Button>
        <div className="w-8" />
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Middlegame
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Opening;
