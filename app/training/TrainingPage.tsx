import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import TrainingPlanCard from "./components/TrainingCard";
import ChessTrainingPlanDialog from "./components/TrainingDialog";
import UserProfileCard from "./components/UserProfileCard";
import TrainingPlanDisplay from "./components/TrainingDisplay";
import {
  durationData,
  goalsData,
  progressData,
  skillLevelsData,
  topicCategoryInfo,
  trainingPlanData,
  trainingPlanKeyInfo,
  trainingTopicsData,
  userProfileData,
  weekDaysData,
} from "./components/mockData";
import ProgressDisplay from "./components/ProgressDisplay";
import { Button } from "@/components/ui/button";

const ChessProgressionUI: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillLevels, _] = useState(skillLevelsData);
  const [userProfile, setUserProfile] = useState({ ...userProfileData });
  const [hasPlan, setHasPlan] = useState(false);
  const [activeDay, setActiveDay] = useState("tue");
  const states = ["My Training Plan", "My Progress"];
  const [activeState, setActiveState] = useState(states[0]);

  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      avatar: <Brain className="text-blue-500" />,
    }));
  }, []);

  const handleDaySelect = (dayId: string) => {
    setActiveDay(dayId);
  };

  const handlePlanCreated = () => {
    setHasPlan(true);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="font-bold text-2xl">My Training Plan</h1>
      <div className="border p-4 rounded-md flex flex-col gap-y-4">
        <UserProfileCard
          userProfile={userProfile}
          skillLevels={skillLevels}
          goals={goalsData}
          duration={durationData}
        />

        {/* Tab buttons */}
        <div className="flex w-full justify-between">
          <div className="p-2 flex-1 flex bg-[#F9FAFC] rounded-lg border h-auto items-center max-w-96">
            {states.map((tab, i) => (
              <button
                key={i}
                className={`flex-1 p-[10px] font-medium text-center  transition-all ${
                  activeState === tab
                    ? "bg-white rounded-lg   shadow-md text-black font-bold"
                    : "text-gray-600 font-normal hover:bg-gray-100"
                }`}
                onClick={() => setActiveState(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex justify-center items-center">
            <Button className="btn-secondary rounded-full">
              Adjust Training Plan
            </Button>
          </div>
        </div>

        {activeState === "My Training Plan" ? (
          hasPlan ? (
            <TrainingPlanDisplay
              weekDays={weekDaysData}
              activeDay={activeDay}
              onDaySelect={handleDaySelect}
              trainingPlan={trainingPlanData as any}
            />
          ) : (
            <TrainingPlanCard
              onCreatePlan={() => setDialogOpen(true)}
              hasPlan={hasPlan}
            />
          )
        ) : (
          <ProgressDisplay
            currentLevel={progressData.currentLevel}
            currentElo={progressData.currentElo}
            accuracyPercentage={progressData.accuracyPercentage}
            accuracyImprovement={progressData.accuracyImprovement}
          />
        )}
      </div>

      <ChessTrainingPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userProfile={userProfile}
        skillLevels={skillLevels}
        trainingTopics={trainingTopicsData}
        topicCategoryInfo={topicCategoryInfo}
        keyInfo={trainingPlanKeyInfo}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

export default ChessProgressionUI;
