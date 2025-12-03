import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import GoalTypeSelector from "./GoalTypeSelector";
import DurationTypeSelector from "./DurationTypeSelector";
import TargetEloSection from "./TargetEloSection";
import {
  DifficultyLevel,
  GoalType,
  TrainingDurationOption,
  TrainingTopic,
} from "../data/TrainingData";
import TimeframeSelector from "./TimeFrameSelector";
import TrainingTopicsSection from "./TrainingTopicSection";
import { Info } from "lucide-react";

interface AIGeneratedViewProps {
  goalTitle: string;
  setGoalTitle: (value: string) => void;
  goalTypes: GoalType[];
  selectedGoalType: string;
  setSelectedGoalType: (id: string) => void;
  durationTypes: TrainingDurationOption[];
  selectedDurationType: string;
  setSelectedDurationType: (id: string) => void;
  targetElo: string;
  setTargetElo: (value: string) => void;
  currentElo: string;
  targetAccuracy: string;
  setTargetAccuracy: (value: string) => void;
  currentAccuracy: string;
  targetPuzzles: string;
  setTargetPuzzles: (value: string) => void;
  currentPuzzles: string;
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
  customTimeframe: { duration: number; unit: "days" | "weeks" | "months" };
  setCustomTimeframe: (value: {
    duration: number;
    unit: "days" | "weeks" | "months";
  }) => void;
  trainingTopics: TrainingTopic[];
  selectedTopics: string[];
  toggleTopicSelection: (id: string) => void;
  activeTopicFilter: DifficultyLevel;
  setActiveTopicFilter: (filter: DifficultyLevel) => void;
  onGeneratePlan: () => void;
}

const AIGeneratedView: React.FC<AIGeneratedViewProps> = ({
  goalTitle,
  setGoalTitle,
  goalTypes,
  selectedGoalType,
  setSelectedGoalType,
  durationTypes,
  selectedDurationType,
  setSelectedDurationType,
  targetElo,
  setTargetElo,
  currentElo,
  targetAccuracy,
  setTargetAccuracy,
  currentAccuracy,
  targetPuzzles,
  setTargetPuzzles,
  currentPuzzles,
  selectedTimeframe,
  setSelectedTimeframe,
  customTimeframe,
  setCustomTimeframe,
  trainingTopics,
  selectedTopics,
  toggleTopicSelection,
  activeTopicFilter,
  setActiveTopicFilter,
  onGeneratePlan,
}) => {
  return (
    <>
      {/* Goal Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
            1
          </div>
          <Label htmlFor="goal-title" className="font-medium">
            Goal Title
          </Label>
        </div>
        <Input
          id="goal-title"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          placeholder="Reach an ELO Rating of 2,000"
          className="w-full"
        />
      </div>

      {/* Goal Type */}
      <GoalTypeSelector
        goalTypes={goalTypes}
        selectedGoalType={selectedGoalType}
        setSelectedGoalType={setSelectedGoalType}
      />

      {/* Duration Type - Only show when not in topics mode */}
      {selectedGoalType !== "topics" && (
        <DurationTypeSelector
          durationTypes={durationTypes}
          selectedDurationType={selectedDurationType}
          setSelectedDurationType={setSelectedDurationType}
        />
      )}

      {/* Conditional Sections Based on Selections */}
      {selectedGoalType === "elo" && selectedDurationType === "target" && (
        <TargetEloSection
          targetElo={targetElo}
          setTargetElo={setTargetElo}
          currentElo={currentElo}
        />
      )}

      {selectedGoalType === "accuracy" && selectedDurationType === "target" && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
              4
            </div>
            <Label htmlFor="target-accuracy" className="font-medium">
              Target
            </Label>
          </div>
          <div className="w-full flex items-center justify-between border rounded-md px-2">
            <Input
              id="target-elo"
              value={targetAccuracy}
              onChange={(e) => setTargetAccuracy(e.target.value)}
              className="w-[80%] border-none bg-transparent"
            />
            <div className="text-[14px] --xs border border-blue-base rounded-[4px] py-1 px-[6px] text-nowrap">
              % Accuracy
            </div>
          </div>
          <div className="flex items-center gap-2 text-[14px] --sm">
            <Info className="text-blue-600" />
            <span>
              Your current Accuracy:{" "}
              <span className="font-medium">{currentAccuracy}</span>
            </span>
          </div>
        </div>
      )}

      {selectedGoalType === "puzzles" && selectedDurationType === "target" && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
              4
            </div>
            <Label htmlFor="target-puzzles" className="font-medium">
              Target
            </Label>
          </div>
          <div className="w-full flex items-center justify-between border rounded-md px-2">
            <Input
              id="target-puzzles"
              value={targetPuzzles}
              onChange={(e) => setTargetPuzzles(e.target.value)}
              className="w-[80%] border-none bg-transparent"
            />
            <div className="text-[14px] --xs border border-blue-base rounded-[4px] py-1 px-[6px] text-nowrap">
              Puzzles
            </div>
          </div>
        </div>
      )}

      {selectedGoalType === "elo" && selectedDurationType === "timeframe" && (
        <TimeframeSelector
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          customTimeframe={customTimeframe}
          setCustomTimeframe={setCustomTimeframe}
          currentElo={currentElo}
        />
      )}

      {selectedGoalType === "accuracy" &&
        selectedDurationType === "timeframe" && (
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            customTimeframe={customTimeframe}
            setCustomTimeframe={setCustomTimeframe}
            currentElo={`${currentAccuracy}%`}
          />
        )}

      {selectedGoalType === "puzzles" &&
        selectedDurationType === "timeframe" && (
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            customTimeframe={customTimeframe}
            setCustomTimeframe={setCustomTimeframe}
            currentElo={currentPuzzles}
            labelText="Puzzle Rating"
          />
        )}

      {selectedGoalType === "topics" && (
        <TrainingTopicsSection
          trainingTopics={trainingTopics}
          selectedTopics={selectedTopics}
          toggleTopicSelection={toggleTopicSelection}
          activeTopicFilter={activeTopicFilter}
          setActiveTopicFilter={setActiveTopicFilter}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          customTimeframe={customTimeframe}
          setCustomTimeframe={setCustomTimeframe}
        />
      )}

      {/* Generate Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full mt-4"
        onClick={onGeneratePlan}
      >
        Generate Training Plan
      </Button>
    </>
  );
};

export default AIGeneratedView;
