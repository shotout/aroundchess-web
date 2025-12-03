import React, { useState, useEffect, useCallback, useRef } from "react";
import TrainingPlanCard from "./components/TrainingCard";
import UserProfileCard from "./components/UserProfileCard";
import TrainingPlanDisplay from "./components/TrainingDisplay";
import ProgressDisplay from "./components/ProgressDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import { useTrainingPlanStore, useScheduleStore, useUserStore } from "./store";
import { Button } from "@/components/ui/button";
import ChessTrainingPlanDialog from "./components/TrainingDialog";
import CacheUtil from "./api/cacheUtils";
import { useApiClient } from "@/functions/api-client";
import { usePgnStore } from "../store/zustandStore";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";

import {
  UserProfileCardSkeleton,
  TrainingPlanDisplaySkeleton,
  PlanCheckSkeleton,
} from "./components/SkeletonLoading";
import { useChessProfile } from "@/components/analysis/onboarding/useChessProfile";
import { useProfileStore } from "../store/profile";
import { useGameTypeSync } from "./store/gameTypeSync";
import { useTutorial } from "@/components/TutorialProvider";

const ChessProgressionUI: React.FC = () => {
  const {
    username,
    isSignedIn,
    isLoading: profileLoading,
    checkComplete,
    refetch: refetchProfile,
  } = useChessProfile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "adjust">("create");
  const [hasPlan, setHasPlan] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const states = ["My Training Plan", "My Progress"];
  const { GameHistoryOpenings } = useApiClient();
  const { sessionId } = useProfileStore();

  const {
    setOpeningPlayed,
    isLoading: pgnLoading,
    activeState,
    setActiveState,
  } = usePgnStore();

  useGameTypeSync();

  const fetchingRefs = useRef({
    openings: false,
  });

  const {
    userProfile: storeUserProfile,
    fetchTopics,
    isLoadingTopics,
    error: topicsError,
    setAdjustMode,
  } = useTrainingPlanStore();

  const {
    schedule,
    isLoadingSchedule,
    scheduleError,
    planExpired,
    fetchSchedule,
    resetExpiredStatus,
  } = useScheduleStore();

  const {
    profile: userProfile,
    isLoadingUserProfile,
    userProfileError,
    fetchUserProfile,
  } = useUserStore();

  const initializeConcurrentFetches = useCallback(async () => {
    if (!isSignedIn || initialDataLoaded) return;
    // if (!isSignedIn || !checkComplete || initialDataLoaded) return;

    const promises = [
      fetchTopics(sessionId).catch((error) => console.error(error)),
      fetchSchedule(sessionId).catch(console.error),
    ];

    if (!fetchingRefs.current.openings) {
      fetchingRefs.current.openings = true;
      promises.push(
        fetchGameHistoryOpenings().finally(() => {
          fetchingRefs.current.openings = false;
        })
      );
    }

    Promise.allSettled(promises);
    setInitialDataLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSignedIn,
    checkComplete,
    initialDataLoaded,
    fetchTopics,
    fetchSchedule,
  ]);

  const fetchGameHistoryOpenings = useCallback(async () => {
    try {
      const data = await GameHistoryOpenings();
      setOpeningPlayed(data.data);
    } catch (error) {
      console.log("Error fetching game history openings:", error);
    }
  }, [GameHistoryOpenings, setOpeningPlayed]);

  useEffect(() => {
    // if (checkComplete && isSignedIn && !initialDataLoaded) {
    if (isSignedIn && !initialDataLoaded) {
      initializeConcurrentFetches();
    }
  }, [
    checkComplete,
    isSignedIn,
    initializeConcurrentFetches,
    initialDataLoaded,
  ]);

  useEffect(() => {
    if (schedule && Object.keys(schedule).length > 0) {
      const hasContent =
        schedule.topics &&
        (schedule.topics.openings?.length > 0 ||
          schedule.topics.middlegames?.length > 0 ||
          schedule.topics.endgames?.length > 0);

      setHasPlan(hasContent);
    } else if (!isLoadingSchedule && schedule === null) {
      setHasPlan(false);
    }
  }, [schedule, isLoadingSchedule]);

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
    if (isSignedIn) {
      resetExpiredStatus();
      CacheUtil.clearAll();
      setInitialDataLoaded(false);

      Object.keys(fetchingRefs.current).forEach((key) => {
        fetchingRefs.current[key as keyof typeof fetchingRefs.current] = false;
      });

      refetchProfile();
      initializeConcurrentFetches();
    }
  }, [
    isSignedIn,
    resetExpiredStatus,
    refetchProfile,
    initializeConcurrentFetches,
  ]);

  const isPlanExpired =
    planExpired || (scheduleError && scheduleError.includes("expired"));

  const shouldShowCreatePlan = !hasPlan || isPlanExpired;
  const showExpiredAlert = isPlanExpired;
  const showUserProfileSection = true;
  const showTrainingPlanSection =
    !isLoadingSchedule && (hasPlan || (!hasPlan && !shouldShowCreatePlan));

  if (!checkComplete) {
    return (
      <div className="flex flex-col xl:gap-4 lg:gap-4 lg:p-4 xl:p-4 2xl:p-8">
        <div className="xl:border xl:p-4 xl:rounded-md flex flex-col gap-y-2 xl:gap-y-4">
          <UserProfileCardSkeleton />
          <PlanCheckSkeleton />
        </div>
      </div>
    );
  }

  const displayUsername =
    username || userProfile?.username || storeUserProfile?.username || "";
  const displayElo = userProfile?.elo || storeUserProfile?.elo || 0;
  const displayAvatar = userProfile?.avatar || storeUserProfile?.avatar || "";

  return (
    <div className="flex flex-col xl:gap-4 lg:gap-4 lg:p-4 xl:p-4 2xl:p-8">
      <ChessAccountSetup isLoading={profileLoading || pgnLoading} />

      <div className="lg:flex items-center hidden">
        <h1 className="font-bold text-2xl xl:text-3xl p-4 lg:p-0">
          My Training Plan <sub className="text-xs text-gray-500 font-normal lg:text-[18px]">({displayUsername})</sub>
        </h1>
        <p className="xl:hidden">({displayUsername || "User"})</p>
      </div>

      <div className="xl:border xl:p-4 xl:rounded-md flex flex-col gap-y-2 xl:gap-y-4">
        {showUserProfileSection && (
          <>
            {isLoadingUserProfile || profileLoading ? (
              <UserProfileCardSkeleton />
            ) : (
              <UserProfileCard
                schedule={schedule}
                userProfile={{
                  username: displayUsername,
                  currentElo: displayElo,
                  avatar: displayAvatar,
                }}
                avatar={displayAvatar}
              />
            )}
          </>
        )}

        {showExpiredAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your training plan has expired. Please create a new one.
            </AlertDescription>
          </Alert>
        )}

        {isLoadingSchedule ? (
          <PlanCheckSkeleton />
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
              isLoadingSchedule ? (
                <TrainingPlanDisplaySkeleton />
              ) : (
                <TrainingPlanDisplay
                  onAdjustPlan={handleAdjustPlan}
                  schedule={schedule}
                  isLoading={isLoadingSchedule}
                  error={scheduleError}
                />
              )
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
          username: displayUsername,
          currentElo: displayElo,
          avatar: displayAvatar,
        }}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

export default ChessProgressionUI;
