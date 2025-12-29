import React, { useState } from "react";
import { X, Plus, Brain, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  DifficultyLevel,
  goalTypes,
  durationTypes,
  trainingTopics,
} from "../data/TrainingData";
import AIGeneratedView from "./AIGeneratedView";
import ManualSelectionView from "./ManualSelectionView";

interface DialogPlanProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogPlan: React.FC<DialogPlanProps> = ({ open, setOpen }) => {
  // State variables
  // const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [goalTitle, setGoalTitle] = useState<string>("");
  const [selectedGoalType, setSelectedGoalType] = useState<string>("elo");
  const [selectedDurationType, setSelectedDurationType] =
    useState<string>("target");
  const [targetElo, setTargetElo] = useState<string>("2000");
  const [currentElo, setCurrentElo] = useState<string>("1800");
  const [targetAccuracy, setTargetAccuracy] = useState<string>("85");
  const [currentAccuracy, setCurrentAccuracy] = useState<string>("78");
  const [targetPuzzles, setTargetPuzzles] = useState<string>("1500");
  const [currentPuzzles, setCurrentPuzzles] = useState<string>("1200");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("");
  const [customTimeframe, setCustomTimeframe] = useState<{
    duration: number;
    unit: "days" | "weeks" | "months";
  }>({ duration: 1, unit: "months" });
  const [activeTopicFilter, setActiveTopicFilter] =
    useState<DifficultyLevel>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Handler functions
  const toggleTopicSelection = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleGeneratePlan = () => {
    // Logic for generating AI plan
    console.log("Generating AI plan...");
    setOpen(false);
  };

  const handleCreateCustomPlan = () => {
    // Logic for creating custom plan
    console.log("Creating custom plan...");
    setOpen(false);
  };

  return (
    <div>
      {/* Dialog Trigger Button */}
      <Button
        className="bg-blue-600 text-white rounded-full px-4 py-2 md:flex items-center justify-center gap-2 hidden"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        <span>Create a Training Plan</span>
      </Button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full sm:max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-4 border-b">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold text-center">
                Create a Training Plan
              </h2>
              <p className="text-[14px] --sm text-center text-gray-600 mt-1">
                Choose between an AI-generated plan or customize your own
                training path
              </p>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Mode Selection */}
              <RadioGroup
                value={mode}
                onValueChange={(value: "ai" | "manual") => setMode(value)}
                className="grid grid-cols-2 gap-4 mb-4"
              >
                <Label
                  htmlFor="ai-mode"
                  className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer ${
                    mode === "ai"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="ai"
                      id="ai-mode"
                      className="sr-only"
                    />
                    <Brain className="w-5 h-5" />
                    <span>AI Generated</span>
                  </div>
                </Label>
                <Label
                  htmlFor="manual-mode"
                  className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer ${
                    mode === "manual"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="manual"
                      id="manual-mode"
                      className="sr-only"
                    />
                    <AlignJustify className="w-5 h-5" />
                    <span>Manual Selection</span>
                  </div>
                </Label>
              </RadioGroup>

              {/* AI Info Banner - Only show in AI mode */}
              {mode === "ai" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <p className="text-[14px] --sm text-blue-800">
                    Our AI will generate a Training Plan to help you achieve
                    your Goal based on your Strengths and Weaknesses.
                  </p>
                </div>
              )}

              {/* Content for AI Generated Mode */}
              {mode === "ai" ? (
                <AIGeneratedView
                  goalTitle={goalTitle}
                  setGoalTitle={setGoalTitle}
                  goalTypes={goalTypes}
                  selectedGoalType={selectedGoalType}
                  setSelectedGoalType={setSelectedGoalType}
                  durationTypes={durationTypes}
                  selectedDurationType={selectedDurationType}
                  setSelectedDurationType={setSelectedDurationType}
                  targetElo={targetElo}
                  setTargetElo={setTargetElo}
                  currentElo={currentElo}
                  targetAccuracy={targetAccuracy}
                  setTargetAccuracy={setTargetAccuracy}
                  currentAccuracy={currentAccuracy}
                  targetPuzzles={targetPuzzles}
                  setTargetPuzzles={setTargetPuzzles}
                  currentPuzzles={currentPuzzles}
                  selectedTimeframe={selectedTimeframe}
                  setSelectedTimeframe={setSelectedTimeframe}
                  customTimeframe={customTimeframe}
                  setCustomTimeframe={setCustomTimeframe}
                  trainingTopics={trainingTopics}
                  selectedTopics={selectedTopics}
                  toggleTopicSelection={toggleTopicSelection}
                  activeTopicFilter={activeTopicFilter}
                  setActiveTopicFilter={setActiveTopicFilter}
                  onGeneratePlan={handleGeneratePlan}
                />
              ) : (
                <ManualSelectionView
                  goalTitle={goalTitle}
                  setGoalTitle={setGoalTitle}
                  trainingTopics={trainingTopics}
                  selectedTopics={selectedTopics}
                  toggleTopicSelection={toggleTopicSelection}
                  activeTopicFilter={activeTopicFilter}
                  setActiveTopicFilter={setActiveTopicFilter}
                  selectedTimeframe={selectedTimeframe}
                  setSelectedTimeframe={setSelectedTimeframe}
                  onCreatePlan={handleCreateCustomPlan}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogPlan;
