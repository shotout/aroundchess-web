import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import TopicCategory from "./TopicCategory";
import DifficultyFilter from "./DifficultyFilter";
import { DifficultyLevel, TrainingTopic } from "../data/TrainingData";

interface ManualSelectionViewProps {
  goalTitle: string;
  setGoalTitle: (value: string) => void;
  trainingTopics: TrainingTopic[];
  selectedTopics: string[];
  toggleTopicSelection: (id: string) => void;
  activeTopicFilter: DifficultyLevel;
  setActiveTopicFilter: (filter: DifficultyLevel) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
  onCreatePlan: () => void;
}

const ManualSelectionView: React.FC<ManualSelectionViewProps> = ({
  goalTitle,
  setGoalTitle,
  trainingTopics,
  selectedTopics,
  toggleTopicSelection,
  activeTopicFilter,
  setActiveTopicFilter,
  selectedTimeframe,
  setSelectedTimeframe,
  onCreatePlan,
}) => {
  const openingTopics = trainingTopics.filter(
    (topic) => topic.category === "opening"
  );
  const middlegameTopics = trainingTopics.filter(
    (topic) => topic.category === "middlegame"
  );
  const endgameTopics = trainingTopics.filter(
    (topic) => topic.category === "endgame"
  );

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
            1
          </div>
          <Label htmlFor="plan-name" className="font-medium">
            Name your Training Plan
          </Label>
        </div>
        <Input
          id="plan-name"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          placeholder="Master Middlegame Control"
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
            2
          </div>
          <Label className="font-medium">Select your Training Topics</Label>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search />
          </div>
          <Input type="text" placeholder="Search topics..." className="pl-10" />
        </div>

        <DifficultyFilter
          activeFilter={activeTopicFilter}
          setActiveFilter={setActiveTopicFilter}
          className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TopicCategory
            categoryNumber="1"
            title="Opening Repertoire"
            topics={openingTopics}
            selectedTopics={selectedTopics}
            toggleTopicSelection={toggleTopicSelection}
            activeFilter={activeTopicFilter}
            showLimit={true}
          />

          <TopicCategory
            categoryNumber="2"
            title="Middlegame Topics"
            topics={middlegameTopics}
            selectedTopics={selectedTopics}
            toggleTopicSelection={toggleTopicSelection}
            activeFilter={activeTopicFilter}
            showLimit={true}
          />

          <TopicCategory
            categoryNumber="3"
            title="Endgame Topics"
            topics={endgameTopics}
            selectedTopics={selectedTopics}
            toggleTopicSelection={toggleTopicSelection}
            activeFilter={activeTopicFilter}
            showLimit={true}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
            3
          </div>
          <Label htmlFor="total-duration" className="font-medium">
            Which total duration should your Training Plan have?
          </Label>
        </div>
        <div className="relative border border-gray-300 rounded-md">
          <select
            id="total-duration"
            className="w-full p-3 bg-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="1-week">1 Week</option>
            <option value="2-weeks">2 Weeks</option>
            <option value="1-month">1 Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full mt-4"
        onClick={onCreatePlan}
      >
        Create Custom Plan
      </Button>
    </>
  );
};

export default ManualSelectionView;
