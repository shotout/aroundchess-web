import React from "react";
import { Label } from "@/components/ui/label";
import DifficultyFilter from "./DifficultyFilter";
import TopicCategory from "./TopicCategory";
import { DifficultyLevel, TrainingTopic } from "../data/TrainingData";
import TimeframeSelector from "./TimeFrameSelector";

interface TrainingTopicsSectionProps {
  trainingTopics: TrainingTopic[];
  selectedTopics: string[];
  toggleTopicSelection: (id: string) => void;
  activeTopicFilter: DifficultyLevel;
  setActiveTopicFilter: (filter: DifficultyLevel) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
  customTimeframe: { duration: number; unit: "days" | "weeks" | "months" };
  setCustomTimeframe: (value: {
    duration: number;
    unit: "days" | "weeks" | "months";
  }) => void;
}

const TrainingTopicsSection: React.FC<TrainingTopicsSectionProps> = ({
  trainingTopics,
  selectedTopics,
  toggleTopicSelection,
  activeTopicFilter,
  setActiveTopicFilter,
  selectedTimeframe,
  setSelectedTimeframe,
  customTimeframe,
  setCustomTimeframe,
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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
          4
        </div>
        <Label className="font-medium">Topics</Label>
      </div>

      <DifficultyFilter
        activeFilter={activeTopicFilter}
        setActiveFilter={setActiveTopicFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopicCategory
          categoryNumber="1"
          title="Opening Repertoire"
          topics={openingTopics}
          selectedTopics={selectedTopics}
          toggleTopicSelection={toggleTopicSelection}
          activeFilter={activeTopicFilter}
        />

        <TopicCategory
          categoryNumber="2"
          title="Middlegame Topics"
          topics={middlegameTopics}
          selectedTopics={selectedTopics}
          toggleTopicSelection={toggleTopicSelection}
          activeFilter={activeTopicFilter}
        />

        <TopicCategory
          categoryNumber="3"
          title="Endgame Topics"
          topics={endgameTopics}
          selectedTopics={selectedTopics}
          toggleTopicSelection={toggleTopicSelection}
          activeFilter={activeTopicFilter}
        />
      </div>

      <div className="mt-6">
        <Label className="block mb-2">
          In which timeframe would you like to achieve your Goal?
        </Label>
        <TimeframeSelector
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          customTimeframe={customTimeframe}
          setCustomTimeframe={setCustomTimeframe}
        />
      </div>
    </div>
  );
};

export default TrainingTopicsSection;
