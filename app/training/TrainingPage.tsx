import React, { useState, useEffect } from "react";
import TrainingPlanCard from "./components/TrainingCard";
import UserProfileCard from "./components/UserProfileCard";
import TrainingPlanDisplay from "./components/TrainingDisplay";
import ProgressDisplay from "./components/ProgressDisplay";
import { useAuth } from "@clerk/nextjs";
import DotSpinner from "@/components/game-history/Spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import { useTrainingPlanStore, useScheduleStore, useUserStore } from "./store";
import { Button } from "@/components/ui/button";
import ChessTrainingPlanDialog from "./components/TrainingDialog";

const ChessProgressionUI: React.FC = () => {
  const { sessionId } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  const states = ["My Training Plan", "My Progress"];
  const [activeState, setActiveState] = useState(states[0]);

  const {
    userProfile: storeUserProfile,
    fetchTopics,
    error: topicsError,
  } = useTrainingPlanStore();

  const {
    schedule,
    isLoading: isScheduleLoading,
    error: scheduleError,
    fetchSchedule,
  } = useScheduleStore();

  const {
    profile: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    fetchUserProfile,
  } = useUserStore();

  useEffect(() => {
    if (sessionId) {
      fetchUserProfile(sessionId);
      fetchTopics(sessionId);
    }
  }, [sessionId, fetchUserProfile, fetchTopics]);

  useEffect(() => {
    if (sessionId) {
      setIsCheckingPlan(true);
      fetchSchedule(sessionId)
        .then(() => {
          setIsCheckingPlan(false);
        })
        .catch(() => {
          setIsCheckingPlan(false);
        });
    }
  }, [sessionId, fetchSchedule]);

  useEffect(() => {
    if (schedule && Object.keys(schedule).length > 0) {
      const hasContent =
        schedule.topics &&
        (schedule.topics.openings?.length > 0 ||
          schedule.topics.middlegames?.length > 0 ||
          schedule.topics.endgames?.length > 0);

      setHasPlan(hasContent);
    } else {
      setHasPlan(false);
    }
  }, [schedule]);

  const handlePlanCreated = () => {
    if (sessionId) {
      setIsCheckingPlan(true);
      fetchSchedule(sessionId)
        .then(() => {
          setHasPlan(true);
          setIsCheckingPlan(false);
        })
        .catch(() => {
          setIsCheckingPlan(false);
        });
    }
  };

  const hasError = profileError || topicsError || scheduleError;
  const isLoading = isProfileLoading || isCheckingPlan;

  if (hasError) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {profileError || topicsError || scheduleError}
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:gap-6 lg:gap-4 lg:p-4 xl:p-8">
      <div className="lg:flex items-center hidden">
        <h1 className="font-bold text-2xl p-4 lg:p-0">My Training Plan</h1>
        <p className="xl:hidden">
          ({userProfile?.username || storeUserProfile?.username || "User"})
        </p>
      </div>
      <div className="xl:border xl:p-4 xl:rounded-md flex flex-col gap-y-2 xl:gap-y-4">
        <UserProfileCard
          schedule={schedule}
          userProfile={{
            username: userProfile?.username || storeUserProfile?.username || "",
            currentElo: userProfile?.elo || storeUserProfile?.elo || 0,
            avatar: userProfile?.avatar || storeUserProfile?.avatar || "",
          }}
          avatar={userProfile?.avatar || storeUserProfile?.avatar || ""}
        />

        {isLoading ? (
          <div className="flex items-center justify-center p-12 border border-gray-200 rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <DotSpinner />
              <p className="text-gray-600">Checking your training plan...</p>
            </div>
          </div>
        ) : hasPlan ? (
          <>
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
              <div className="lg:flex justify-center items-center hidden">
                <Button
                  className="btn-secondary rounded-full"
                  onClick={() => setDialogOpen(true)}
                >
                  Adjust Training Plan
                </Button>
              </div>
            </div>

            {activeState === "My Training Plan" ? (
              <TrainingPlanDisplay
                schedule={schedule}
                isLoading={isScheduleLoading}
                error={scheduleError}
              />
            ) : (
              <ProgressDisplay />
            )}
          </>
        ) : (
          <TrainingPlanCard
            onCreatePlan={() => setDialogOpen(true)}
            hasPlan={hasPlan}
          />
        )}
      </div>

      <ChessTrainingPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userProfile={{
          username: userProfile?.username || storeUserProfile?.username || "",
          currentElo: userProfile?.elo || storeUserProfile?.elo || 0,
          avatar: userProfile?.avatar || storeUserProfile?.avatar || "",
        }}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

export default ChessProgressionUI;
