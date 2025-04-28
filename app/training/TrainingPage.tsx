import React, { useState, useEffect } from "react";
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
  trainingPlanKeyInfo,
} from "./components/mockData";
import ProgressDisplay from "./components/ProgressDisplay";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useTrainingSchedule } from "./service/useTrainingSchedule";
import useTrainingPlanStore from "./service/TrainingPlanStore";

const ChessProgressionUI: React.FC = () => {
  const { sessionId } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillLevels] = useState(skillLevelsData);
  const [userProfile, setUserProfile] = useState({
    username: "",
    currentElo: 0,
    avatar: "",
  });
  const [hasPlan, setHasPlan] = useState(false);
  const states = ["My Training Plan", "My Progress"];
  const [activeState, setActiveState] = useState(states[0]);
  const [debugMode, setDebugMode] = useState(false);

  const {
    schedule,
    isLoading: isScheduleLoading,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useTrainingSchedule();

  const { userProfile: storeUserProfile, fetchTopics } = useTrainingPlanStore();

  useEffect(() => {
    if (sessionId) {
      fetchTopics(sessionId);
    }
  }, [sessionId, fetchTopics]);

  useEffect(() => {
    if (storeUserProfile) {
      setUserProfile({
        username: storeUserProfile.username,
        currentElo: storeUserProfile.elo,
        avatar: storeUserProfile.avatar,
      });
    }
  }, [storeUserProfile]);

  useEffect(() => {
    if (schedule) {
      setHasPlan(true);
      console.log("i", schedule);
    }
  }, [schedule]);

  const handlePlanCreated = () => {
    if (sessionId) {
      refetchSchedule();
      setHasPlan(true);
    }
  };

  return (
    <div className="flex flex-col xl:gap-6 xl:p-8">
      <div className="flex items-center">
        <h1 className="font-bold text-2xl p-4">My Training Plan</h1>
        <p className="xl:hidden">({userProfile.username})</p>
      </div>
      <div className="xl:border xl:p-4 xl:rounded-md flex flex-col gap-y-2 xl:gap-y-4">
        <UserProfileCard
          userProfile={userProfile}
          skillLevels={skillLevels}
          goals={goalsData}
          duration={durationData}
          hasPlan={hasPlan}
        />

        {hasPlan && (
          <div className="flex w-full justify-center lg:justify-between px-4 py-1 lg:p-0">
            <div className="p-2 flex-1 flex bg-[#F9FAFC] rounded-lg border h-auto items-center w-full lg:max-w-96">
              {states.map((tab, i) => (
                <button
                  key={i}
                  className={`flex-1 p-[10px] font-medium text-center transition-all ${
                    activeState === tab
                      ? "bg-white rounded-lg shadow-md text-black font-bold"
                      : "text-gray-600 font-normal hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveState(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="lg:flex justify-center items-center hidden ">
              {hasPlan && (
                <Button
                  className="btn-secondary rounded-full"
                  onClick={() => setDialogOpen(true)}
                >
                  Adjust Training Plan
                </Button>
              )}
            </div>
          </div>
        )}

        {activeState === "My Training Plan" ? (
          hasPlan ? (
            <TrainingPlanDisplay
              schedule={schedule}
              isLoading={isScheduleLoading}
              error={scheduleError}
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
            currentElo={userProfile.currentElo || progressData.currentElo}
            accuracyPercentage={progressData.accuracyPercentage}
            accuracyImprovement={progressData.accuracyImprovement}
          />
        )}
      </div>

      {/* Debug Panel */}
      {debugMode && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md z-50 shadow-lg">
          <div className="font-bold mb-2">Debug Controls</div>
          <div className="flex flex-col gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setDialogOpen(true)}
            >
              Open Training Dialog
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => setHasPlan(!hasPlan)}
            >
              Toggle Has Plan: {hasPlan ? "Yes" : "No"}
            </Button>
          </div>
        </div>
      )}
      <ChessTrainingPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userProfile={userProfile}
        skillLevels={skillLevels}
        trainingTopics={[]}
        topicCategoryInfo={topicCategoryInfo}
        keyInfo={trainingPlanKeyInfo}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

export default ChessProgressionUI;
