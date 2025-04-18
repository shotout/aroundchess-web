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
    <div className="bg-white relative overflow-hidden rounded-lg border border-gray-200 px-10 py-8 flex flex-col space-y-5">
      <div className="flex justify-center space-x-5 items-center mb-6 relative">
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

        <h4 className="text-center text-xl">Select a Stage . . . </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {[1, 2, 3, 4, 5].map((stageNum) => (
          <StageCard
            key={stageNum}
            stageNumber={stageNum}
            active={stageNum === 1}
            categorySlug={slug}
            subcategorySlug={selectedSubcategory}
            fen={
              selectedSubcategoryData?.games &&
              selectedSubcategoryData.games[stageNum - 1]?.fen
            }
            //@ts-expect-error
            onClick={() => onPositionSelect(selectedSubcategory, stageNum - 1)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[6, 7, 8, 9, 10].map((stageNum) => (
          <StageCard
            key={stageNum}
            stageNumber={stageNum}
            active={false}
            categorySlug={slug}
            subcategorySlug={selectedSubcategory}
            fen={
              selectedSubcategoryData?.games &&
              selectedSubcategoryData.games[stageNum - 1]?.fen
            }
            //@ts-expect-error
            onClick={() => onPositionSelect(selectedSubcategory, stageNum - 1)}
          />
        ))}
      </div>
    </div>
  );
}
