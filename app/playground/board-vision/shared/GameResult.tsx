import React from "react";
import { Trophy, Medal, Frown } from "lucide-react";
import { GameResultProps, PerformanceValuation } from "../types/default-pgn";

const GameResult: React.FC<GameResultProps> = ({
  gameCorrects,
  gameMaxQuestions,
  isGameEnd,
}) => {
  if (!isGameEnd) return null;

  // Determine performance valuation
  const getPerformanceValuation = (): PerformanceValuation => {
    if (gameCorrects >= 7) {
      return {
        label: "Amazing",
        description: "Your board vision skills are exceptional!",
        icon: <Trophy className="h-10 w-10 text-yellow-500" />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      };
    } else if (gameCorrects >= 4) {
      return {
        label: "Good",
        description: "You have solid board vision skills. Keep practicing!",
        icon: <Medal className="h-10 w-10 text-blue-500" />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      };
    } else {
      return {
        label: "Needs Improvement",
        description: "Keep practicing to enhance your board vision skills.",
        icon: <Frown className="h-10 w-10 text-gray-500" />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
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
        <h2 className={`text-2xl font-bold mb-1 ${valuation.textColor}`}>
          {valuation.label}
        </h2>
        <p className={`mb-2 ${valuation.textColor}`}>{valuation.description}</p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
        <p className="text-lg">
          You got{" "}
          <span className="font-bold text-teal-600">{gameCorrects}</span> out of{" "}
          <span className="font-bold">{gameMaxQuestions}</span> questions
          correct.
        </p>
      </div>
    </div>
  );
};

export default GameResult;
