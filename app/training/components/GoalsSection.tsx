import React from "react";
import { Trophy } from "lucide-react";
import Image from "next/image";

interface GoalsSectionProps {
  goals: { id: string; text: string }[];
  duration: { text: string; value: string };
}

const GoalsSection = ({ goals, duration }: GoalsSectionProps) => {
  return (
    <div className=" bg-gradient-to-r from-[#D7EBFF] to-[#FFFFFF00] rounded-lg p-4 flex border border-[#3871EC33]/30">
      <div className="flex-1">
        <div className="flex items-center gap-x-3">
          <div className="flex-shrink-0">
            <Image
              src={"/training-plan/checklist.png"}
              alt="check icon"
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl">
              What you will get if you reach your Next Goals?
            </h3>
            <ul className=" text-blue-800 flex gap-x-3">
              {goals.map((goal) => (
                <li key={goal.id} className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium">•</span>{" "}
                  {goal.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        <div className="text-sm text-gray-600">{duration.text}</div>
        <div className="flex items-center gap-1 text-blue-800 font-semibold">
          {duration.value}
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;
