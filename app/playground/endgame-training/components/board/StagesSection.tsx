/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import StageCard from "./StageCard";
import { StagesSectionProps } from "./type";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export default function StagesSection({
  slug,
  selectedSubcategory,
  selectedSubcategoryData,
  onPositionSelect,
  onSelectSubcategory,
}: StagesSectionProps) {
  return (
    <div className="xl:bg-white relative overflow-hidden rounded-lg xl:border border-gray-200 xl:px-4 flex flex-col space-y-5 xl:space-y-4">
      <div className="border border-gray-300 rounded-md shadow-md xl:hidden overflow-hidden">
        <div className="flex items-center space-x-4 p-2 bg-primary-white relative">
          <button onClick={(e) => onSelectSubcategory(selectedSubcategory)}>
            <ChevronLeft className="h-10 w-10 text-gray-600" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="border border-[#DEDEDE] p-3 flex justify-center items-center rounded-sm bg-gradient-to-b from-[#E7F1F6] to-[#FFFFFF]">
              <Image
                src="/endgame-training/sword-full.png"
                alt="sword icon"
                width={20}
                height={20}
              />
            </div>
            <span className="font-bold text-lg">Select a Stage</span>
          </div>

          <div className="absolute right-0 top-0 pointer-events-none z-[1]">
            <Image
              src="/endgame-training/sword-stage.png"
              alt="sword bg"
              width={100}
              height={100}
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-[1]">
            <Image
              src="/endgame-training/board-stage.png"
              alt="chess board"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="hidden xl:flex justify-center space-x-5  items-center relative  p-2">
        <button
          className="hidden"
          onClick={(e) => onSelectSubcategory(selectedSubcategory)}
        >
          <ChevronLeft className="h-10 w-10 text-gray-600" />
        </button>

        <div className="border border-[#DEDEDE] p-4 flex justify-center items-center rounded-sm bg-gradient-to-b from-[#E7F1F6] to-[#FFFFFF]">
          <Image
            src="/endgame-training/sword-full.png"
            alt="sword icon"
            width={30}
            height={30}
          />
        </div>

        <div className="absolute -top-8 right-[30%] pointer-events-none">
          <Image
            src="/endgame-training/board-stage.png"
            alt="chess board"
            width={300}
            height={300}
          />
        </div>

        <div className="absolute -top-4 right-0 pointer-events-none">
          <Image
            src="/endgame-training/sword-stage.png"
            alt="sword bg"
            width={100}
            height={100}
          />
        </div>

        <h4 className="text-center text-xl">Select a Stage . . . </h4>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 xl:gap-4 ">
        {selectedSubcategoryData?.games.map((stageNum, i) => (
          <StageCard
            key={i}
            stageNumber={i + 1}
            active={false}
            categorySlug={slug}
            subcategorySlug={selectedSubcategory}
            fen={
              selectedSubcategoryData?.games &&
              selectedSubcategoryData.games[i - 1]?.fen
            }
            //@ts-expect-error
            onClick={() => onPositionSelect(selectedSubcategory, stageNum - 1)}
          />
        ))}
      </div>
      <div></div>
    </div>
  );
}
