import React from "react";
import Image from "next/image";

interface GoalsSectionProps {
  goals: { id: string; text: string }[];
  duration: { text: string; value: string };
}

const GoalsSection = ({ goals, duration }: GoalsSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-[#D7EBFF] to-[#FFFFFF00] rounded-lg p-4 border border-[#3871EC33]/30 md:flex">
      {/* Mobile: stacked layout / Desktop: horizontal layout */}
      <div className="flex-1">
        {/* Mobile: Icon & goals side by side */}
        <div className="flex items-start md:items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Image
              src={"/training-plan/checklist.png"}
              alt="check icon"
              width={50}
              height={50}
            />
          </div>

          {/* Goals section */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-[14px] --sm md:text-[16px] mb-2 md:mb-0">
              What you will get if you reach your Next Goals?
            </h3>
            {/* Goals list - vertical on mobile, horizontal on desktop */}
            <ul className="text-blue-800 text-[14px] --xs md:text-base flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:gap-x-3">
              {goals.map((goal, index) => (
                <li key={goal.id} className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium flex items-center justify-center w-5 md:w-auto">
                    {/* Numbers on mobile, bullets on desktop */}
                    <span className="md:hidden">{index + 1}.</span>
                    <span className="hidden md:inline">•</span>
                  </span>
                  <span>{goal.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Duration section - below on mobile, right side on desktop */}
      <div className="mt-4 md:mt-0 md:flex-shrink-0 pl-16 md:pl-0">
        <div className="flex flex-col md:items-end md:justify-center">
          <div className="text-[14px] --xs md:text-[14px] --sm text-gray-600">
            {duration.text}
          </div>
          <div className="flex items-center gap-1 text-blue-800 text-[14px] --sm md:text-base font-semibold">
            {duration.value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;
