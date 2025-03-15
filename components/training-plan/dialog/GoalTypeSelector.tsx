import React from "react";
import { Label } from "@/components/ui/label";
import DynamicIcon from "./DynamicIcon";
import { GoalType } from "../data/TrainingData";
import { Target } from "lucide-react";

interface GoalTypeSelectorProps {
  goalTypes: GoalType[];
  selectedGoalType: string;
  setSelectedGoalType: (id: string) => void;
}

const GoalTypeSelector: React.FC<GoalTypeSelectorProps> = ({
  goalTypes,
  selectedGoalType,
  setSelectedGoalType,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs" />
        <Label className="font-medium">Choose your Goal Type</Label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {goalTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedGoalType(type.id)}
            className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center text-center relative min-h-40 ${
              selectedGoalType === type.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                selectedGoalType === type.id ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <DynamicIcon name={type.iconName} className="w-full h-full" />
            </div>
            <span className="text-sm font-medium">{type.name}</span>
            {selectedGoalType === type.id && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalTypeSelector;
