import React from "react";
import Image from "next/image";
import { GameResultProps, PerformanceValuation } from "../types/default-pgn";

const GameResult: React.FC<GameResultProps> = ({ gameCorrects, isGameEnd }) => {
  if (!isGameEnd) return null;

  const getPerformanceValuation = (): PerformanceValuation => {
    if (gameCorrects >= 7) {
      return {
        label: "Amazing",
        description: `Amazing, you have ${gameCorrects} correct answers!`,
        icon: (
          <Image
            src="/board-vision/amazing.png"
            alt="Trophy"
            width={80}
            height={80}
          />
        ),
        bgColor:
          "bg-gradient-to-r from-[#07B56A]/30 from-0% via-[#07B56A] via-50% to-[#07B56A]/30 to-100% border border-[#07B56A]",
        textColor: "text-black",
      };
    } else if (gameCorrects >= 4) {
      return {
        label: "Good",
        description: `You have ${gameCorrects} correct answers. That's a good start!`,
        icon: (
          <Image
            src="/board-vision/good.png"
            alt="Medal"
            width={80}
            height={80}
          />
        ),
        bgColor:
          "bg-gradient-to-r from-[#FFBB00]/50 from-0% via-[#FFBB00] via-50% to-[#FFBB00]/50 to-100% border-2 border-[#FFBB00]",
        textColor: "text-black",
      };
    } else {
      return {
        label: "Needs Improvement",
        description: `You have ${gameCorrects} correct answers. Let's practice a bit more to improve your Score!`,
        icon: (
          <Image
            src="/board-vision/improvement.png"
            alt="Frown"
            width={80}
            height={80}
          />
        ),
        bgColor:
          "bg-gradient-to-r from-[#C01B1B]/50 from-0% via-[#C01B1B] via-50% to-[#C01B1B]/50 to-100% border-2 border-[#C01B1B]",
        textColor: "text-white",
      };
    }
  };

  const valuation = getPerformanceValuation();

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div
        className={`${valuation.bgColor} p-6 rounded-lg mb-6 w-full text-center`}
      >
        <div className="flex justify-center mb-2">{valuation.icon}</div>

        <p className={`mb-2 ${valuation.textColor} text-base font-semibold`}>
          {valuation.description}
        </p>
      </div>
    </div>
  );
};

export default GameResult;
