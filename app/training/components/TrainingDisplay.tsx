// components/TrainingPlanDisplay.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainingPlanDisplayProps } from "./types";
import DaySelector from "./DaySelector";
import TrainingSection from "./TrainingSection";
import Image from "next/image";

const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({
  weekDays,
  activeDay,
  onDaySelect,
  trainingPlan,
}) => {
  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <CardContent className="p-6 flex w-full flex-col gap-y-4">
        {/* Week day selector */}
        <h1 className="font-bold text-lg">Your Training Plan</h1>
        <div className="flex gap-2 w-full">
          {weekDays.map((day) => (
            <DaySelector
              key={day.id}
              day={day}
              isActive={day.id === activeDay}
              onSelect={() => onDaySelect(day.id)}
            />
          ))}
        </div>

        <TrainingSection
          icon="/training-plan/oc.png"
          title="Opening Concepts"
          duration="~50 minutes"
          instruction={`For today's practice, select one of your selected Opening Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Opening Concepts regularly until you can apply them perfectly.`}
          topics={trainingPlan.openingTopics}
        />

        <TrainingSection
          icon="/training-plan/mc.png"
          title="Middlegame Concepts"
          duration="~50 minutes"
          instruction={`For today's practice, select one of your selected Middlegame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Middlegame Concepts regularly until you can apply them perfectly.`}
          topics={trainingPlan.middlegameTopics}
        />

        <TrainingSection
          icon="/training-plan/ec.png"
          title="Endgame Concepts"
          duration="~50 minutes"
          instruction={`For today's practice, select one of your selected Endgame Concepts and practice it by playing 5 Chess Games using the selected Concept. Practice all of your chosen Endgame Concepts regularly until you can apply them perfectly.`}
          topics={trainingPlan.endgameTopics}
        />

        <div className="mb-6 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Image
                src={"/training-plan/tt.png"}
                alt=""
                width={50}
                height={50}
              />
              <h3 className="text-lg font-semibold">Tactical Training</h3>
            </div>
            <div className="text-blue-700 text-sm font-medium">
              Estimated total duration per day:{" "}
              <span className="text-blue-800 font-bold">~50 minutes</span>
            </div>
          </div>

          <div className="border-lightsky-blue-base border bg-[#E6F7FE] p-3 rounded-lg mb-4 text-gray-800">
            For today's practice, <strong>solve 10 Puzzles</strong>.
          </div>

          <div className="flex justify-center">
            <Button className="btn-primary rounded-full py-2 px-6 w-72">
              Start Puzzles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingPlanDisplay;
