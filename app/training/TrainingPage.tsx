import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ChessProgressionUI: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillLevels, setSkillLevels] = useState(skillLevelsData);
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

    setSkillLevels((prevLevels) =>
      prevLevels.map((level) => {
        let icon;

        switch (level.title) {
          case "Novice":
            icon = (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
              </div>
            );
            break;
          case "Beginner":
            icon = (
              <div className="w-10 h-14 bg-blue-600 flex items-end justify-center pb-1 rounded-t-lg">
                <div className="w-6 h-4 bg-blue-400 rounded-full"></div>
              </div>
            );
            break;
          case "Intermediate":
            icon = (
              <div className="w-10 h-14 bg-amber-400 flex flex-col items-center justify-end rounded-t-sm">
                <div className="w-5 h-6 bg-amber-300 rounded-full mt-1"></div>
                <div className="w-8 h-4 bg-amber-500 rounded-sm mt-auto"></div>
              </div>
            );
            break;
          case "Expert":
            icon = (
              <div className="w-10 h-14 bg-gray-500 flex items-end justify-center pb-1 rounded-sm">
                <div className="w-3 h-8 bg-gray-400 rounded-t-lg"></div>
              </div>
            );
            break;
          case "Master":
            icon = (
              <div className="w-10 h-14 bg-gray-500 flex items-center justify-center">
                <div className="w-6 h-7 bg-gray-400 rounded-t-lg"></div>
              </div>
            );
            break;
          case "Grand Master":
            icon = (
              <div className="w-10 h-14 bg-gray-500 flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-400 rotate-45 translate-y-1"></div>
              </div>
            );
            break;
          default:
            icon = <div className="w-10 h-14 bg-gray-300"></div>;
        }

        return {
          ...level,
          icon,
        };
      })
    );
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
      <UserProfileCard
        userProfile={userProfile}
        skillLevels={skillLevels}
        goals={goalsData}
        duration={durationData}
      />

      {/* Tab buttons */}
      <div className="p-2 flex bg-[#F9FAFC] rounded-lg border h-auto items-center max-w-96">
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
