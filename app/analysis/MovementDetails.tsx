"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
interface MovementDetailsProps {
  next: () => void;
  prev: () => void;
}
const MovementDetails: React.FC<MovementDetailsProps> = (props) => {
  const moves = [
    {
      whiteMove: "d4",
      whiteAdv: "+0.20",
      whiteClass: "Brilliant",
      blackMove: "d4",
      blackAdv: "-0.10",
      blackClass: "Best",
    },
    {
      whiteMove: "e3",
      whiteAdv: "-0.05",
      whiteClass: "Miss",
      blackMove: "e3",
      blackAdv: "+1.25",
      blackClass: "Brilliant",
    },
    {
      whiteMove: "d3",
      whiteAdv: "+0.20",
      whiteClass: "Brilliant",
      blackMove: "g7",
      blackAdv: "-0.10",
      blackClass: "Great",
    },
    {
      whiteMove: "b3",
      whiteAdv: "+0.20",
      whiteClass: "Brilliant",
      blackMove: "b3",
      blackAdv: "-0.10",
      blackClass: "Miss",
    },
    {
      whiteMove: "c4",
      whiteAdv: "0.06",
      whiteClass: "Great",
      blackMove: "c4",
      blackAdv: "0.02",
      blackClass: "Mistake",
    },
    {
      whiteMove: "d2",
      whiteAdv: "+2.5",
      whiteClass: "Best",
      blackMove: "d2",
      blackAdv: "-1.50",
      blackClass: "Blunder",
    },
    {
      whiteMove: "f3",
      whiteAdv: "0.4",
      whiteClass: "Great",
      blackMove: "f3",
      blackAdv: "0",
      blackClass: "Best",
    },
    {
      whiteMove: "dcx5",
      whiteAdv: "0.10",
      whiteClass: "Best",
      blackMove: "dcx5",
      blackAdv: "0.05",
      blackClass: "Brilliant",
    },
    {
      whiteMove: "cxb5",
      whiteAdv: "0.5",
      whiteClass: "Great",
      blackMove: "cxb5",
      blackAdv: "0.01",
      blackClass: "Blunder",
    },
  ];

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
  const getScoreClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "text-[#01A12E]";
      case "Great":
        return "text-[#364152]";
      case "Best":
        return "text-[#364152]";
      case "Miss":
        return "text-[#FD0000]";
      case "Blunder":
        return "text-[#FD0000]";
      case "Mistake":
        return "text-[#FD0000]";
      default:
        return "text-[#364152]";
    }
  };
  return (
    <div className="w-full bg-white p-4">
      <div className="flex flex-row items-center gap-2 mb-2">
        <h2 className="text-sm font-light">
          White Opening: <span className="font-bold">Sicilian Defense</span>
        </h2>
        <Image
          alt=""
          src={"/icons/great-moves-icon.png"}
          width={20}
          height={20}
        />
      </div>
      <div className="flex flex-row items-center gap-2 mb-2">
        <h2 className="text-sm font-light">
          Black Opening:{" "}
          <span className="font-bold text-decoration-underline">
            Ruy Lopez Opening
          </span>
        </h2>
        <Image
          alt=""
          src={"/icons/brilliant-moves-icon.png"}
          width={20}
          height={20}
        />
      </div>
      <div className="mt-4 bg-white border border-[#BDD0F9] pb-2 rounded-sm">
        <div className="grid grid-cols-2 text-center border-b border-b-[#BDD0F9] h-14 ">
          <span className="block text-sm font-bold rounded-tl-sm bg-[#D7E3FB] border-r border-r-[#BDD0F9]  py-2">
            White{" "}
            <span className="block text-xs font-light">(blitzmystic)</span>
          </span>
          <span className="block text-sm font-bold rounded-tr-sm bg-[#D7E3FB] py-2 ">
            Black <span className="block text-xs font-light">(Guest1234)</span>
          </span>
        </div>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-3 text-center border-b bg-[#D7E3FB]">
            {["Movement", "Advantage", "Classification"].map((header) => (
              <span
                key={header}
                className="text-[9px] py-2 font-semibold border-r border-r-[#BDD0F9] "
              >
                {header}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 text-center border-b bg-[#D7E3FB]">
            {["Movement", "Advantage", "Classification"].map((header) => (
              <span
                key={header}
                className="text-[9px] py-2 font-semibold border-r border-r-[#BDD0F9] "
              >
                {header}
              </span>
            ))}
          </div>
        </div>

        {moves.map((move, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 divide-x border-b text-center ${
              index % 2 != 0 ? "bg-[#F6F9FF]" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-3 flex items-center h-10 border-b border-b-[#BDD0F9] ">
              <Popover>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-xs font-semibold">
                          {move.whiteMove}
                        </span>
                        <span
                          className={`rounded-2xl px-3 py-[4px] border border-input text-xs text-center font-normal py-2 ${getScoreClass(
                            move.whiteClass
                          )}`}
                        >
                          {move.whiteAdv}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <span
                          className={`mx-1 py-1 rounded-[4px] text-[11px] px-2 ${getBadgeClass(
                            move.whiteClass
                          )}`}
                        >
                          {move.whiteClass}
                        </span>
                        <PopoverClose>
                          <Image
                            alt="close"
                            src={"/icons/close-icon.png"}
                            width={1000}
                            height={1000}
                            className="w-5 h-5"
                          />
                        </PopoverClose>
                      </div>
                    </div>
                    <span className="text-xs font-normal py-1">
                      This move deviates from opening principles. Focus on
                      development and center control.
                    </span>
                    <div className="flex flex-row gap-1">
                      <InfoIcon size={16} color="#3871EC" />
                      <span className="text-xs">Type:</span>
                      <span className="text-xs font-semibold ">Middlegame</span>
                    </div>
                  </div>
                </PopoverContent>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="rounded-none hover:bg-[#9BB8F5]"
                  >
                    <span className="text-xs text-center font-semibold py-2">
                      {move.whiteMove}
                    </span>
                  </Button>
                </PopoverTrigger>
              </Popover>

              <span
                className={`text-xs text-center font-normal py-2 ${getScoreClass(
                  move.whiteClass
                )}`}
              >
                {move.whiteAdv}
              </span>
              <span
                className={`mx-1 py-1 rounded-[4px] text-[11px] ${getBadgeClass(
                  move.whiteClass
                )}`}
              >
                {move.whiteClass}
              </span>
            </div>
            <div className="grid grid-cols-3 flex items-center h-10 border-b border-b-[#BDD0F9] ">
              <span className="text-xs text-center font-semibold py-2">
                {move.blackMove}
              </span>
              <span
                className={`text-xs text-center font-normal py-2 ${getScoreClass(
                  move.blackClass
                )}`}
              >
                {move.blackAdv}
              </span>
              <span
                className={`mx-1 py-1 rounded-[4px] text-[11px] ${getBadgeClass(
                  move.blackClass
                )}`}
              >
                {move.blackClass}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between mt-4">
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-xs text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Summary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Threats
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default MovementDetails;
