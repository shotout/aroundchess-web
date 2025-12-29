import React from "react";
import { Label } from "@/components/ui/label";
import DynamicIcon from "./DynamicIcon";
import { TrainingDurationOption } from "../data/TrainingData";
import { Target } from "lucide-react";

interface DurationTypeSelectorProps {
  durationTypes: TrainingDurationOption[];
  selectedDurationType: string;
  setSelectedDurationType: (id: string) => void;
}

const DurationTypeSelector: React.FC<DurationTypeSelectorProps> = ({
  durationTypes,
  selectedDurationType,
  setSelectedDurationType,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 rounded-full text-blue-600 flex items-center justify-center" />

        <Label className="font-medium">
          Do you have a specific target or do you prefer to set a training
          timeframe?
        </Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {durationTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedDurationType(type.id)}
            className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center text-center relative min-h-40 ${
              selectedDurationType === type.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                selectedDurationType === type.id
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <DynamicIcon name={type.iconName} className="w-full h-full" />
            </div>
            <span className="text-[14px] --sm">{type.name}</span>
            {selectedDurationType === type.id && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DurationTypeSelector;
