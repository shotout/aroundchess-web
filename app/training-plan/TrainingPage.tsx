import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useApiClient } from "@/functions/api-client";
import { usePgnStore } from "../store/zustandStore";

const ChessProgressionUI: React.FC = () => {
  const { sessionId } = useProfileStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "adjust">("create");
  const [hasPlan, setHasPlan] = useState(false);
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const states = ["My Training Plan", "My Progress"];
  const [activeState, setActiveState] = useState(states[0]);
  const { GameHistoryOpenings } = useApiClient();
  const { setOpeningPlayed } = usePgnStore();

  const fetchingRefs = useRef({
    topics: false,
    schedule: false,
    profile: false,
    openings: false,
  });

  const {
    userProfile: storeUserProfile,
    fetchTopics,
    error: topicsError,
    setAdjustMode,
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

  const fetchAllData = useCallback(
    async (sessionId: string) => {
      if (!sessionId || initialLoadComplete) return;

      const promises = [];

      if (!fetchingRefs.current.profile) {
        fetchingRefs.current.profile = true;
        promises.push(
          fetchUserProfile(sessionId).finally(() => {
            fetchingRefs.current.profile = false;
          })
        );
      }

      // Fetch topics if not already fetching
      if (!fetchingRefs.current.topics) {
        fetchingRefs.current.topics = true;
        promises.push(
          fetchTopics(sessionId).finally(() => {
            fetchingRefs.current.topics = false;
          })
        );
      }

      if (!fetchingRefs.current.openings) {
        fetchingRefs.current.openings = true;
        promises.push(
          fetchGameHistoryOpenings().finally(() => {
            fetchingRefs.current.openings = false;
          })
        );
      }

      await Promise.allSettled(promises);
      setInitialLoadComplete(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchUserProfile, fetchTopics, initialLoadComplete]
  );

  const fetchScheduleData = useCallback(
    async (sessionId: string) => {
      if (!sessionId || fetchingRefs.current.schedule) return;

      fetchingRefs.current.schedule = true;
      setIsCheckingPlan(true);

      try {
        await fetchSchedule(sessionId);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsCheckingPlan(false);
        fetchingRefs.current.schedule = false;
      }
    },
    [fetchSchedule]
  );

  const fetchGameHistoryOpenings = useCallback(async () => {
    try {
      const data = await GameHistoryOpenings();
      setOpeningPlayed(data.data);
    } catch (error) {
      console.log("Error fetching game history openings:", error);
    }
  }, [GameHistoryOpenings, setOpeningPlayed]);

  // Single useEffect for initial data loading
  useEffect(() => {
    if (sessionId && !initialLoadComplete) {
      fetchAllData(sessionId);
    }
  }, [sessionId, fetchAllData, initialLoadComplete]);

  // Separate useEffect for schedule data
  useEffect(() => {
    if (sessionId && initialLoadComplete) {
      fetchScheduleData(sessionId);
    }
  }, [sessionId, fetchScheduleData, initialLoadComplete]);

  // Effect to determine if user has a plan
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

  // Effect to reset expired status when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      resetExpiredStatus();
    }
  }, [dialogOpen, resetExpiredStatus]);

  const handleCreatePlan = useCallback(() => {
    setDialogMode("create");
    setAdjustMode(false);
    setDialogOpen(true);
  }, [setAdjustMode]);

  const handleAdjustPlan = useCallback(() => {
    setDialogMode("adjust");
    setAdjustMode(true);
    setDialogOpen(true);
  }, [setAdjustMode]);

  const handlePlanCreated = useCallback(() => {
    if (sessionId) {
      setIsCheckingPlan(true);
      resetExpiredStatus();
      CacheUtil.clearAll();

      // Reset the initial load to allow refetching
      setInitialLoadComplete(false);

      // Reset fetching refs
      Object.keys(fetchingRefs.current).forEach((key) => {
        fetchingRefs.current[key as keyof typeof fetchingRefs.current] = false;
      });

      fetchScheduleData(sessionId).then(() => {
        setHasPlan(true);
      });
    }
  }, [sessionId, resetExpiredStatus, fetchScheduleData]);

  const isPlanExpired =
    planExpired || (scheduleError && scheduleError.includes("expired"));
  const isLoading = isProfileLoading || isCheckingPlan || !initialLoadComplete;
  const shouldShowCreatePlan = !hasPlan || isPlanExpired;

  return (
    <div className="flex flex-col xl:gap-4 lg:gap-4 lg:p-4 xl:p-4 2xl:p-8">
      <div className="lg:flex items-center hidden">
        <h1 className="font-bold text-2xl xl:text-3xl p-4 lg:p-0">
          My Training Plan
        </h1>
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
          <TrainingPlanCard onCreatePlan={handleCreatePlan} hasPlan={false} />
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
                  onClick={handleAdjustPlan}
                >
                  Adjust Training Plan
                </Button>
              </div>
            </div>

            {activeState === "My Training Plan" ? (
              <TrainingPlanDisplay
                onAdjustPlan={handleAdjustPlan}
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
        mode={dialogMode}
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
