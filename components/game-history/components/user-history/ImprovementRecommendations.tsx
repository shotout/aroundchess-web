import React from "react";
import { Card } from "@/components/ui/card";

interface ImprovementRecommendationsProps {
  shortTermGoals: string[];
  trainingFocus: string[];
}

const ImprovementRecommendations: React.FC<ImprovementRecommendationsProps> = ({
  shortTermGoals,
  trainingFocus,
}) => {
  return (
    <div className="lg:p-4 rounded-lg w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold mb-3">
          Improvement Recommendations
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-3 rounded-lg md:border bg-white">
          <h1 className="font-bold mb-1">Short-Term Goals</h1>
          <ul className="text-[14px] --sm text-gray-700 list-disc px-4">
            {shortTermGoals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-3 rounded-lg md:border bg-white">
          <h1 className="font-bold mb-1">Training Focus</h1>
          <ul className="text-[14px] --sm text-gray-700 list-disc px-4">
            {trainingFocus.map((focus, index) => (
              <li key={index}>{focus}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ImprovementRecommendations;
