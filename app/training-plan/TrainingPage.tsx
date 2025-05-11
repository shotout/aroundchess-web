import React, { useState, useEffect } from "react";
import TrainingPlanCard from "./components/TrainingCard";
import UserProfileCard from "./components/UserProfileCard";
import TrainingPlanDisplay from "./components/TrainingDisplay";
import ProgressDisplay from "./components/ProgressDisplay";
import DotSpinner from "@/components/game-history/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import { useTrainingPlanStore, useScheduleStore, useUserStore } from "./store";
import { Button } from "@/components/ui/button";
import ChessTrainingPlanDialog from "./components/TrainingDialog";
import CacheUtil from "./api/cacheUtils";
import { useProfileStore } from "../store/profile";

const ChessProgressionUI: React.FC = () => {
  const { sessionId } = useProfileStore();
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
    planExpired,
    fetchSchedule,
    resetExpiredStatus,
  } = useScheduleStore();

  const {
    profile: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    fetchUserProfile,
  } = useUserStore();

  useEffect(() => {
    if (sessionId != "") {
      fetchUserProfile(sessionId);
      fetchTopics(sessionId);
    }
  }, [sessionId, fetchUserProfile, fetchTopics]);

  useEffect(() => {
    if (sessionId != "") {
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

  useEffect(() => {
    if (dialogOpen) {
      resetExpiredStatus();
    }
  }, [dialogOpen, resetExpiredStatus]);

  const handlePlanCreated = () => {
    if (sessionId != "") {
      setIsCheckingPlan(true);
      resetExpiredStatus(); // Reset expired status when a new plan is created

      CacheUtil.clearAll();

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

  const isPlanExpired =
    planExpired || (scheduleError && scheduleError.includes("expired"));
  const isLoading = isProfileLoading || isCheckingPlan;

  const shouldShowCreatePlan = !hasPlan || isPlanExpired;

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

        {/* Plan Expired Error Alert - Always show this if the plan is expired */}
        {isPlanExpired && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your training plan has expired. Please create a new one.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-12 border border-gray-200 rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <DotSpinner />
              <p className="text-gray-600">Checking your training plan...</p>
            </div>
          </div>
        ) : shouldShowCreatePlan ? (
          <TrainingPlanCard
            onCreatePlan={() => setDialogOpen(true)}
            hasPlan={false}
          />
        ) : (
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
