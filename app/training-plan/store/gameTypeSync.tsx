import React, { useEffect } from 'react';
import { useProfileStore } from "@/app/store/profile";
import { usePlayerStatsStore } from '@/components/analysis/onboarding/store/usePlayerStatsStore';
import { useProgressStore, useScheduleStore, useTrainingPlanStore, useUserStore } from '.';

export const useGameTypeSync = () => {
  const { selectedGameType } = usePlayerStatsStore();
  const { setGameType: setTrainingGameType, refetchForGameType: refetchTraining, currentGameType } = useTrainingPlanStore();
  const { setGameType: setScheduleGameType, refetchForGameType: refetchSchedule } = useScheduleStore();
  const { setGameType: setUserGameType, refetchForGameType: refetchUser } = useUserStore();
  const { setGameType: setProgressGameType, refetchForGameType: refetchProgress } = useProgressStore();
  const { sessionId } = useProfileStore();

  useEffect(() => {
    if (selectedGameType && sessionId) {
      const isGameTypeChanging = currentGameType && currentGameType !== selectedGameType;
      
      setTrainingGameType(selectedGameType);
      setScheduleGameType(selectedGameType);
      setUserGameType(selectedGameType);
      setProgressGameType(selectedGameType);
      
      if (isGameTypeChanging) {
        refetchTraining(sessionId, selectedGameType);
        refetchSchedule(sessionId, selectedGameType);
        refetchUser(sessionId, selectedGameType);
        refetchProgress(sessionId, selectedGameType);
      }
    }
  }, [selectedGameType, sessionId, currentGameType, setTrainingGameType, setScheduleGameType, setUserGameType, setProgressGameType, refetchTraining, refetchSchedule, refetchUser, refetchProgress]);
};