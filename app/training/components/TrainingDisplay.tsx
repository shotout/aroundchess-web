// components/TrainingPlanDisplay.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainingPlanDisplayProps } from "./types";
import DaySelector from "./DaySelector";
import TrainingSection from "./TrainingSection";

const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({
  weekDays,
  activeDay,
  onDaySelect,
  trainingPlan,
}) => {
  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <CardContent className="p-6">
        {/* Week day selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {weekDays.map((day) => (
            <DaySelector
              key={day.id}
              day={day}
              isActive={day.id === activeDay}
              onSelect={() => onDaySelect(day.id)}
            />
          ))}
        </div>

        {/* Opening Concepts Section */}
        <TrainingSection
          icon="♘"
          title="Opening Concepts"
          duration="~50 minutes"
          instruction={`For today's practice, select one of your selected Opening Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Opening Concepts regularly until you can apply them perfectly.`}
          topics={trainingPlan.openingTopics}
        />

        {/* Middlegame Concepts Section */}
        <TrainingSection
          icon="♗"
          title="Middlegame Concepts"
          duration="~50 minutes"
          instruction={`For today's practice, select one of your selected Middlegame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Middlegame Concepts regularly until you can apply them perfectly.`}
          topics={trainingPlan.middlegameTopics}
        />

        {/* Endgame Concepts Section */}
        <TrainingSection
          icon="♔"
          title="Endgame Concepts"
          duration="~50 minutes"
          instruction={`For today's practice, select one of your selected Endgame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Endgame Concepts regularly until you can apply them perfectly.`}
          topics={trainingPlan.endgameTopics}
        />

        {/* Tactical Training Section */}
        <div className="mb-6 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 flex items-center justify-center rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6H4v10h5" />
                  <path d="M9 6v10" />
                  <path d="M15 6h5v10h-5" />
                  <path d="M15 11h4" />
                  <path d="M15 8h4" />
                  <path d="M15 16V6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Tactical Training</h3>
            </div>
            <div className="text-blue-700 text-sm font-medium">
              Estimated total duration per day:{" "}
              <span className="text-blue-800 font-bold">~50 minutes</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-blue-800">
            <p>
              For today's practice, <strong>solve 10 Puzzles</strong>.
            </p>
          </div>

          <div className="flex justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 w-72">
              Start Puzzles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingPlanDisplay;
