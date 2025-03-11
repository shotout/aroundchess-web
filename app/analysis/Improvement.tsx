"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
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
      <div className="border border-gray-300 rounded-lg p-3 ">
        <h3 className="font-semibold text-sm sm:text-sm md:text-md lg:text-lg mb-2">
          {title}
        </h3>
        <ul className="list-disc list-inside text-xs sm:text-sm md:text-md lg:text-lg text-gray-700">
          {content.map((item, index) => (
            <li
              className="ml-2"
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
      <div className="flex flex-col justify-center gap-2 bg-white mx-4 px-4 bg-white p-4 rounded-xl shadow-md border border-t-4 border-[#3871EC] lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <div className="flex flex-row items-center gap-2">
          <Image
            alt=""
            src={"/icons/improvement-recommendation-icon.png"}
            width={1000}
            height={1000}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:w-10"
          />
          <h3 className="text-lg sm:text-lg md:text-xl lg:text-xl  font-semibold flex items-center">
            Improvement Recommendation
          </h3>
        </div>

        <Section
          title="Past Games - Key Weaknesses:"
          content={[
            `**Tactical Awareness:** ${keyWeaknesses.tacticalAwareness}.`,
            `**Opening Preparation:** ${keyWeaknesses.openingPreparation}.`,
            `**Middlegame Technique:** ${keyWeaknesses.middleGameTechnique}.`,
            `**Endgame Technique:** ${keyWeaknesses.endGameTechnique}.`,
          ]}
        />

      <Section
        title="Past Games - Key Weaknesses:"
        content={[
          "**Tactical Awareness:** Frequent missed tactics, especially forks and discovered attacks.",
          "**Opening Preparation:** Struggled with unfamiliar lines, leading to early positional disadvantages.",
          "**Middlegame Technique:** Rushed key decisions in critical moments, leading to blunders.",
          "**Endgame Technique:** Missed winning conversions in simplified positions.",
        ]}
      />

      <Section
        title="Current Game Analysis:"
        content={[
          "**Strengths:** Improved decision-making in middlegame transitions, better awareness of opponent's threats.",
          "**Weaknesses:** Still vulnerable to positional sacrifices, inaccuracies in complex positions.",
        ]}
      />

      <Section
        title="Comparison to Past Games:"
        content={[
          "**Better:** Stronger piece coordination, fewer outright blunders.",
          "**Worse:** Slight regression in time management, hesitation in executing tactical sequences.",
        ]}
      />

        <div className="border border-[#3871EC] border-l-4 rounded-lg p-3 bg-[#F6F9FF]">
          <h3 className="text-[#254B9D] font-semibold mb-2">
            Next Steps for Improvement:
          </h3>
          <span className="text-sm md:text-md text-[#254B9D] whitespace-pre-line">
            {nextStepImprovement}
          </span>
          {/* <ul className="list-decimal list-inside text-sm text-[#254B9D]">
          <li>
            <b>Tactical Drills:</b> Solve puzzles daily focusing on forks, pins,
            and discovered attacks.
          </li>
          <li>
            <b>Opening Study:</b> Deepen understanding of recurring problem
            openings with targeted practice.
          </li>
          <li>
            <b>Middlegame Practice:</b> Allocate more time for complex
            positions, especially in critical middlegame transitions.
          </li>
          <li>
            <b>Endgame Practice:</b> Review key theoretical endgames and
            practice conversions.
          </li>
        </ul> */}
        </div>
        <div className="flex flex-row bg-gradient rounded-md p-2 sm:p-4">
          <Image
            alt=""
            src={"/icons/info-banner-icon.png"}
            width={1000}
            height={1000}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
          />
          <span className="text-xs sm:text-md md:text-lg lg:text-xl font-normal text-primary ml-4">
            We have added Exercises to your Training Plan to improve your
            Strategy for the analyzed weaknesses.
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4 mx-2 mb-2">
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="btn-secondary flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-xs sm:text-sm md:text-md lg:text-lg  text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Endgame&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Button>
        <div className="w-8" />
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="btn-primary flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Training
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </>
  );
};

export default Improvement;
