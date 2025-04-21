/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import StageCard from "./StageCard";
import { StagesSectionProps } from "./type";
import Image from "next/image";

export default function StagesSection({
  slug,
  selectedSubcategory,
  selectedSubcategoryData,
  onPositionSelect,
}: StagesSectionProps) {
  return (
    <div className="xl:bg-white relative overflow-hidden rounded-lg xl:border border-gray-200 xl:px-10 xl:py-8 flex flex-col space-y-5">
      <div className="flex xl:justify-center space-x-5 items-center xl:mb-6 relative border xl:border-none rounded-md overflow-hidden xl:overflow-visible p-2">
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
            alt="sword bg"
            width={300}
            height={300}
          />
        </div>

        <div className="absolute -top-8 -right-8 pointer-events-none">
          <Image
            src="/endgame-training/sword-stage.png"
            alt="sword bg"
            width={100}
            height={100}
          />
        </div>

        <h4 className="text-center text-xl hidden xl:flex">
          Select a Stage . . .{" "}
        </h4>
        <h4 className="text-center flex xl:hidden">Select a Stage</h4>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 xl:gap-4">
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
    </div>
  );
}
