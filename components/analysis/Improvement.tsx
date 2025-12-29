"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
interface ImprovementProps {
  next: () => void;
  prev: () => void;
}
const Improvement: React.FC<ImprovementProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
  const { keyWeaknesses, gameAnalysis, nextStepImprovement } =
    dataAnalysis?.improvementRecommendation;

  const Section: React.FC<{ title: string; content: string[] }> = ({
    title,
    content,
  }) => {
    return (
      <div className="px-[16px] py-[8px]">
        <h3 className="font-semibold text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md mb-[16px]">
          {title}
        </h3>
        <ul className="list-disc list-inside text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md text-gray-700">
          {content.map((item, index) => (
            <li
              className="px-[16px] -indent-[16px]"
              key={index}
              dangerouslySetInnerHTML={{
                __html: item.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
              }}
            ></li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col justify-center gap-2 bg-white rounded-xl shadow-md border border-t-4 border-[#221AE9] lg:justify-start xl:max-h-[800px] overflow-auto">
        <div className="flex flex-row border-b p-4 items-center gap-2">
          <Image
            alt=""
            src={"/icons/improvement-recommendation-icon.png"}
            width={24}
            height={24}
            className="w-6 h-6 sm:w-8 sm:h-[24px] md:w-[24px]"
          />
          <h3 className="text-[16px] sm:text-[18px] md:text-xl lg:text-md  font-semibold flex items-center">
            Improvement Recommendation
          </h3>
        </div>

        <div className="border-b">
          <Section
            title="Key Weaknesses:"
            content={[
              `**<strong class="font-bold">Tactical Awareness:</strong>** <br />${keyWeaknesses.tacticalAwareness}.`,
              `**<strong class="font-bold">Opening Preparation:</strong>** <br />${keyWeaknesses.openingPreparation}.`,
              `**<strong class="font-bold">Middlegame Technique:</strong>** <br />${keyWeaknesses.middleGameTechnique}.`,
              `**<strong class="font-bold">Endgame Technique:</strong>** <br />${keyWeaknesses.endGameTechnique}.`,
            ]}
          />
        </div>

        <Section
          title="Current Game Analysis:"
          content={[
            `**<strong class="font-bold">Strengths:</strong>** <br />${gameAnalysis.strength}`,
            `**<strong class="font-bold">Weaknesses:</strong>** <br />${gameAnalysis.weaknesses}`,
          ]}
        />
        {/* 
        <Section
          title="Comparison to Past Games:"
          content={[
            "**Better:** Stronger piece coordination, fewer outright blunders.",
            "**Worse:** Slight regression in time management, hesitation in executing tactical sequences.",
          ]}
        /> */}

        <div className="border-[#221AE9] border-t-4 p-4 bg-[#F6F9FF] rounded-b-lg">
          <h3 className="text-[#254B9D] font-semibold mb-2">
            Next Steps for Improvement:
          </h3>
          <span className="text-[14px] --sm md:text-md text-[#254B9D] whitespace-pre-line">
            {nextStepImprovement}
          </span>
        </div>
        {/* <div className="flex flex-row bg-gradient rounded-md p-2 sm:p-4">
          <Image
            alt=""
            src={"/icons/info-banner-icon.png"}
            width={1000}
            height={1000}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
          />
          <span className="text-[14px] --xs sm:text-md md:text-lg lg:text-md font-normal text-primary ml-4">
            We have added Exercises to your Training Plan to improve your
            Strategy for the analyzed weaknesses.
          </span>
        </div> */}
      </div>

      <div className="flex flex-col md:flex-row gap-[8px] md:gap-[16px] mt-2 mb-2 px-[4px]">
        <button
          onClick={props.prev}
          className="btn-secondary flex items-center justify-center justify-self-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Endgame&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-white font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            Back to Summary
          </div>
        </button>
        {/* <button
          onClick={props.next}
         className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Training
            <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button> */}
      </div>
    </>
  );
};

export default Improvement;
