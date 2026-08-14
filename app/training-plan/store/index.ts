import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { apiService, endpoints } from "../api/endpoints";
import CacheUtil, { CACHE_KEYS, getGameTypeCacheKey, getProgressCacheKey } from "../api/cacheUtils";

export interface UserProfile {
  username: string;
  elo: number;
  avatar: string;
  targetElo?: number;
  level?: string;
}

interface TopicRequirements {
  opening: {
    white: number;
    black: number;
    minTotal: number;
    maxTotal: number;
    availableWhite: number;
    availableBlack: number;
  };
  middlegame: {
    min: number;
    max: number;
    available: number;
  };
  endgame: {
    min: number;
    max: number;
    available: number;
  };
}

interface Config {
  eloRange: string;
  requirements: TopicRequirements;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  eloRange: string[];
  forColor?: string;
}

interface TopicsData {
  openings: {
    white: Topic[];
    black: Topic[];
  };
  middlegames: Topic[];
  endgames: Topic[];
}

interface ExistingTopicsResponse {
  trainingPlanId: number;
  createdAt: string;
  topics: {
    openings: {
      white: Topic[];
      black: Topic[];
    };
    middlegames: Topic[];
    endgames: Topic[];
  };
  summary: {
    totalTopics: number;
    openingsCount: number;
    middlegamesCount: number;
    endgamesCount: number;
  };
}

interface RecommendationsData {
  openings: {
    white: Topic[];
    black: Topic[];
  };
  middlegames: Topic[];
  endgames: Topic[];
}

interface TrainingPlanState {
  userProfile: UserProfile | null;
  config: Config | null;
  topics: TopicsData | null;
  recommendations: RecommendationsData | null;
  currentGameType: string | null;

  selectedWhiteOpenings: string[];
  selectedBlackOpenings: string[];
  selectedMiddlegames: string[];
  selectedEndgames: string[];

  isLoadingTopics: boolean;
  isLoadingProfile: boolean;
  isCreating: boolean;
  error: string | null;
  isAdjustMode: boolean;

  _fetchPromises: Map<string, Promise<any>>;

  fetchTopics: (sessionId: string) => Promise<void>;
  fetchExistingTopics: (sessionId: string) => Promise<void>;
  toggleTopic: (topicId: string, category: string) => void;
  createTrainingPlan: (sessionId: string) => Promise<boolean>;
  setAdjustMode: (mode: boolean) => void;
  setGameType: (gameType: string) => void;
  refetchForGameType: (sessionId: string, gameType: string) => Promise<void>;
  reset: () => void;
  resetPartial: () => void;
}

const autoSelectRecommendedTopics = (
  recommendations: RecommendationsData | null
) => {
  if (!recommendations) {
    return {
      selectedWhiteOpenings: [],
      selectedBlackOpenings: [],
      selectedMiddlegames: [],
      selectedEndgames: [],
    };
  }

  return {
    selectedWhiteOpenings:
      recommendations.openings?.white?.map((topic) => topic.id) || [],
    selectedBlackOpenings:
      recommendations.openings?.black?.map((topic) => topic.id) || [],
    selectedMiddlegames:
      recommendations.middlegames?.map((topic) => topic.id) || [],
    selectedEndgames: recommendations.endgames?.map((topic) => topic.id) || [],
  };
};

export const useTrainingPlanStore = create<TrainingPlanState>()(
  subscribeWithSelector((set, get) => ({
    userProfile: null,
    config: null,
    topics: null,
    recommendations: null,
    currentGameType: null,

    selectedWhiteOpenings: [],
    selectedBlackOpenings: [],
    selectedMiddlegames: [],
    selectedEndgames: [],

    isLoadingTopics: false,
    isLoadingProfile: false,
    isCreating: false,
    error: null,
    isAdjustMode: false,

    _fetchPromises: new Map(),

    setAdjustMode: (mode: boolean) => {
      set({ isAdjustMode: mode });
    },

    setGameType: (gameType: string) => {
      const currentState = get();
      if (currentState.currentGameType !== gameType) {
        set({ currentGameType: gameType });
      }
    },

    refetchForGameType: async (sessionId: string, gameType: string) => {
      if (get().currentGameType && get().currentGameType !== gameType) {
        CacheUtil.clearGameTypeCache(get().currentGameType!);
      }
      
      set({ currentGameType: gameType });
      CacheUtil.clearGameTypeCache(gameType);
      await get().fetchTopics(sessionId);
    },

    fetchTopics: async (sessionId: string) => {
      const state = get();
      const gameType = state.currentGameType;
      CacheUtil.setUserScope(sessionId);

      const cacheKey = getGameTypeCacheKey(CACHE_KEYS.TRAINING_TOPICS, gameType);
      const fetchKey = `fetchTopics_${sessionId}_${gameType || 'default'}`;

      if (state._fetchPromises.has(fetchKey)) {
        return state._fetchPromises.get(fetchKey);
      }

      const fetchPromise = (async () => {
        set({ isLoadingTopics: true, error: null });

        try {

          const response = await apiService.get(
            endpoints.trainingPlan.getTopics,
            sessionId
          );
          const { userProfile, config, topics, recommendations } = response.data;

          CacheUtil.setItem(cacheKey, response.data);

          const autoSelectedTopics = autoSelectRecommendedTopics(recommendations);

          set({
            userProfile,
            config,
            topics,
            recommendations,
            ...autoSelectedTopics,
            isLoadingTopics: false,
          });
        } catch (error) {
          console.error("Error fetching training plan topics:", error);
          set({
            error: error instanceof Error ? error.message : "Failed to fetch training plan topics",
            isLoadingTopics: false,
          });
        } finally {
          const currentState = get();
          currentState._fetchPromises.delete(fetchKey);
        }
      })();

      set((state) => ({
        _fetchPromises: new Map(state._fetchPromises).set(fetchKey, fetchPromise),
      }));

      return fetchPromise;
    },

    fetchExistingTopics: async (sessionId: string) => {
      const state = get();
      const gameType = state.currentGameType;
      const cacheKey = getGameTypeCacheKey(CACHE_KEYS.EXISTING_TRAINING_TOPICS, gameType);
      const fetchKey = `fetchExistingTopics_${sessionId}_${gameType || 'default'}`;

      if (state._fetchPromises.has(fetchKey)) {
        return state._fetchPromises.get(fetchKey);
      }

      const fetchPromise = (async () => {
        set({ isLoadingTopics: true, error: null });

        try {
          const existingResponse = await apiService.get(
            endpoints.trainingPlan.getExistingTopics,
            sessionId
          );
          const existingData: ExistingTopicsResponse = existingResponse.data;

          const selectedWhiteOpenings = existingData.topics.openings.white.map(
            (topic) => topic.id
          );
          const selectedBlackOpenings = existingData.topics.openings.black.map(
            (topic) => topic.id
          );
          const selectedMiddlegames = existingData.topics.middlegames.map(
            (topic) => topic.id
          );
          const selectedEndgames = existingData.topics.endgames.map(
            (topic) => topic.id
          );

          const allTopicsResponse = await apiService.get(
            endpoints.trainingPlan.getTopics,
            sessionId
          );
          const allTopicsData = allTopicsResponse.data;

          set({
            userProfile: allTopicsData.userProfile,
            config: allTopicsData.config,
            topics: allTopicsData.topics,
            recommendations: allTopicsData.recommendations,
            selectedWhiteOpenings,
            selectedBlackOpenings,
            selectedMiddlegames,
            selectedEndgames,
            isLoadingTopics: false,
          });
        } catch (error) {
          console.error("Error fetching existing training plan topics:", error);
          set({
            error: error instanceof Error ? error.message : "Failed to fetch existing training plan topics",
            isLoadingTopics: false,
          });
        } finally {
          const currentState = get();
          currentState._fetchPromises.delete(fetchKey);
        }
      })();

      set((state) => ({
        _fetchPromises: new Map(state._fetchPromises).set(fetchKey, fetchPromise),
      }));

      return fetchPromise;
    },

    toggleTopic: (topicId: string, category: string) => {
      if (category.includes("white")) {
        const { selectedWhiteOpenings } = get();
        const isSelected = selectedWhiteOpenings.includes(topicId);

        set({
          selectedWhiteOpenings: isSelected
            ? selectedWhiteOpenings.filter((id) => id !== topicId)
            : [...selectedWhiteOpenings, topicId],
        });
      } else if (category.includes("black")) {
        const { selectedBlackOpenings } = get();
        const isSelected = selectedBlackOpenings.includes(topicId);

        set({
          selectedBlackOpenings: isSelected
            ? selectedBlackOpenings.filter((id) => id !== topicId)
            : [...selectedBlackOpenings, topicId],
        });
      } else if (category === "middlegame") {
        const { selectedMiddlegames } = get();
        const isSelected = selectedMiddlegames.includes(topicId);

        set({
          selectedMiddlegames: isSelected
            ? selectedMiddlegames.filter((id) => id !== topicId)
            : [...selectedMiddlegames, topicId],
        });
      } else if (category === "endgame") {
        const { selectedEndgames } = get();
        const isSelected = selectedEndgames.includes(topicId);

        set({
          selectedEndgames: isSelected
            ? selectedEndgames.filter((id) => id !== topicId)
            : [...selectedEndgames, topicId],
        });
      }
    },

    createTrainingPlan: async (sessionId: string) => {
      const {
        selectedWhiteOpenings,
        selectedBlackOpenings,
        selectedMiddlegames,
        selectedEndgames,
      } = get();
      set({ isCreating: true, error: null });

      try {
        await apiService.post(endpoints.trainingPlan.createPlan, sessionId, {
          whiteOpening: selectedWhiteOpenings,
          blackOpening: selectedBlackOpenings,
          middleGame: selectedMiddlegames,
          endGame: selectedEndgames,
        });

        CacheUtil.clearAll();

        set({ isCreating: false });
        return true;
      } catch (error) {
        console.error("Error creating training plan:", error);
        set({
          error: error instanceof Error ? error.message : "Failed to create training plan",
          isCreating: false,
        });
        return false;
      }
    },

    reset: () => {
      set({
        selectedWhiteOpenings: [],
        selectedBlackOpenings: [],
        selectedMiddlegames: [],
        selectedEndgames: [],
        error: null,
        isAdjustMode: false,
        _fetchPromises: new Map(),
      });
    },

    resetPartial: () => {
      set({
        error: null,
        isAdjustMode: false,
      });
    },
  }))
);

export interface TrainingTopic {
  id: string;
  title: string;
  level: string;
  category: string;
}

export interface TrainingSchedule {
  topics: any;
  durations: any;
  date: string;
  weekDay: string;
  schedule: {
    trainingScheduleDates: never[];
    todayScheduleDate: any;
    openingTopics: TrainingTopic[];
    middlegameTopics: TrainingTopic[];
    endgameTopics: TrainingTopic[];
  };
}

interface ScheduleState {
  schedule: TrainingSchedule | null;
  isLoadingSchedule: boolean;
  scheduleError: string | null;
  planExpired: boolean;
  currentGameType: string | null;
  _fetchPromises: Map<string, Promise<any>>;
  fetchSchedule: (sessionId: string) => Promise<void>;
  resetExpiredStatus: () => void;
  setGameType: (gameType: string) => void;
  refetchForGameType: (sessionId: string, gameType: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>()(
  subscribeWithSelector((set, get) => ({
    schedule: null,
    isLoadingSchedule: false,
    scheduleError: null,
    planExpired: false,
    currentGameType: null,
    _fetchPromises: new Map(),

    setGameType: (gameType: string) => {
      set({ currentGameType: gameType });
    },

    refetchForGameType: async (sessionId: string, gameType: string) => {
      if (get().currentGameType && get().currentGameType !== gameType) {
        CacheUtil.clearGameTypeCache(get().currentGameType!);
      }
      
      set({ currentGameType: gameType });
      CacheUtil.clearGameTypeCache(gameType);
      await get().fetchSchedule(sessionId);
    },

    fetchSchedule: async (sessionId: string) => {
      if (!sessionId) return;

      CacheUtil.setUserScope(sessionId);

      const state = get();
      const gameType = state.currentGameType;
      const cacheKey = getGameTypeCacheKey(CACHE_KEYS.TRAINING_SCHEDULE, gameType);
      const fetchKey = `fetchSchedule_${sessionId}_${gameType || 'default'}`;

      if (state._fetchPromises.has(fetchKey)) {
        return state._fetchPromises.get(fetchKey);
      }

      const fetchPromise = (async () => {
        set({ isLoadingSchedule: true, scheduleError: null, planExpired: false });

        try {
          const cachedData = CacheUtil.getItem(cacheKey);
          if (cachedData) {
            set({ schedule: cachedData, isLoadingSchedule: false });
            return;
          }

          const response = await apiService.get(
            endpoints.trainingPlan.getTodaySchedule,
            sessionId
          );

          CacheUtil.setItem(cacheKey, response.data);

          set({ schedule: response.data, isLoadingSchedule: false });
        } catch (error: any) {
          console.error("Error fetching training schedule:", error);

          const errorMessage = error instanceof Error ? error.message : "";
          const responseData = error?.response?.data;

          const isExpiredPlanError =
            responseData?.message?.includes("expired") ||
            errorMessage.includes("expired") ||
            (responseData?.statusCode === 400 &&
              responseData?.message?.includes("training plan"));

          if (isExpiredPlanError) {
            set({
              planExpired: true,
              schedule: null,
              isLoadingSchedule: false,
              scheduleError:
                responseData?.message ||
                "Your training plan has expired. Please create a new one.",
            });
          } else {
            set({
              scheduleError: error instanceof Error ? error.message : "Failed to fetch training schedule",
              isLoadingSchedule: false,
            });
          }
        } finally {
          const currentState = get();
          currentState._fetchPromises.delete(fetchKey);
        }
      })();

      set((state) => ({
        _fetchPromises: new Map(state._fetchPromises).set(fetchKey, fetchPromise),
      }));

      return fetchPromise;
    },

    resetExpiredStatus: () => {
      set({ planExpired: false, scheduleError: null });
    },
  }))
);

interface UserState {
  profile: UserProfile | null;
  isLoadingUserProfile: boolean;
  userProfileError: string | null;
  currentGameType: string | null;
  _fetchPromises: Map<string, Promise<any>>;
  fetchUserProfile: (sessionId: string) => Promise<void>;
  setGameType: (gameType: string) => void;
  refetchForGameType: (sessionId: string, gameType: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  subscribeWithSelector((set, get) => ({
    profile: null,
    isLoadingUserProfile: false,
    userProfileError: null,
    currentGameType: null,
    _fetchPromises: new Map(),

    setGameType: (gameType: string) => {
      set({ currentGameType: gameType });
    },

    refetchForGameType: async (sessionId: string, gameType: string) => {
      if (get().currentGameType && get().currentGameType !== gameType) {
        CacheUtil.clearGameTypeCache(get().currentGameType!);
      }
      
      set({ currentGameType: gameType });
      CacheUtil.clearGameTypeCache(gameType);
      await get().fetchUserProfile(sessionId);
    },

    fetchUserProfile: async (sessionId: string) => {
      if (!sessionId) return;

      CacheUtil.setUserScope(sessionId);

      const state = get();
      const gameType = state.currentGameType;
      const cacheKey = getGameTypeCacheKey(CACHE_KEYS.USER_PROFILE, gameType);
      const fetchKey = `fetchUserProfile_${sessionId}_${gameType || 'default'}`;

      if (state._fetchPromises.has(fetchKey)) {
        return state._fetchPromises.get(fetchKey);
      }

      const fetchPromise = (async () => {
        set({ isLoadingUserProfile: true, userProfileError: null });

        try {
          const cachedData = CacheUtil.getItem(cacheKey);
          if (cachedData) {
            set({ profile: cachedData, isLoadingUserProfile: false });
            return;
          }

          const response = await apiService.get(
            endpoints.trainingPlan.getTopics,
            sessionId
          );

          if (response.data?.userProfile) {
            CacheUtil.setItem(cacheKey, response.data.userProfile);

            set({
              profile: response.data.userProfile,
              isLoadingUserProfile: false,
            });
          } else {
            throw new Error("User profile not found in the response");
          }
        } catch (error) {
          set({
            userProfileError: error instanceof Error ? error.message : "Failed to fetch user profile",
            isLoadingUserProfile: false,
          });
        } finally {
          const currentState = get();
          currentState._fetchPromises.delete(fetchKey);
        }
      })();

      set((state) => ({
        _fetchPromises: new Map(state._fetchPromises).set(fetchKey, fetchPromise),
      }));

      return fetchPromise;
    },
  }))
);

export interface ProgressRatingData {
  week: number;
  rating: number;
}

export interface ProgressGameAnalysis {
  accuracy: number;
  score: number;
}

export interface ProgressRecentGame {
  date: string;
  opponent: string;
  result: string;
  opening: string;
  analysis: ProgressGameAnalysis;
  rating: number;
}

export interface ProgressPerformanceTrend {
  count?: number;
  rating?: number;
  change: number;
}

export interface ProgressData {
  currentLevel: {
    level: string;
    rating: number;
  };
  accuracy: {
    percentage: number;
    improvement: number;
  };
  ratingProgress: {
    data: ProgressRatingData[];
    currentMonth: string;
  };
  trainingDistribution: {
    openings: number;
    middlegame: number;
    endgame: number;
    tactics: number;
  };
  recentGames: ProgressRecentGame[];
  performanceTrends: {
    gamesWon: ProgressPerformanceTrend;
    eloRating: ProgressPerformanceTrend;
    mistakes: ProgressPerformanceTrend;
    blunders: ProgressPerformanceTrend;
  };
  winRate: number;
  avgAccuracy: number;
}

function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

interface ProgressState {
  progressData: ProgressData | null;
  isLoadingProgress: boolean;
  progressError: string | null;
  currentMonth: string;
  currentGameType: string | null;
  _fetchPromises: Map<string, Promise<any>>;
  setCurrentMonth: (month: string) => void;
  fetchProgressData: (sessionId: string, month?: string) => Promise<void>;
  forceRefresh: (sessionId: string, month?: string) => Promise<void>;
  setGameType: (gameType: string) => void;
  refetchForGameType: (sessionId: string, gameType: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>()(
  subscribeWithSelector((set, get) => ({
    progressData: null,
    isLoadingProgress: false,
    progressError: null,
    currentMonth: getCurrentMonth(),
    currentGameType: null,
    _fetchPromises: new Map(),

    setCurrentMonth: (month: string) => {
      const currentState = get();
      if (currentState.currentMonth !== month) {
        set({ 
          currentMonth: month,
          progressData: null, 
        });
      }
    },

    setGameType: (gameType: string) => {
      set({ currentGameType: gameType });
    },

    refetchForGameType: async (sessionId: string, gameType: string) => {
      if (get().currentGameType && get().currentGameType !== gameType) {
        CacheUtil.clearGameTypeCache(get().currentGameType!);
      }
      
      set({ currentGameType: gameType });
      CacheUtil.clearGameTypeCache(gameType);
      await get().fetchProgressData(sessionId);
    },

    fetchProgressData: async (sessionId: string, month?: string) => {
      if (!sessionId) return;

      CacheUtil.setUserScope(sessionId);

      const selectedMonth = month || get().currentMonth;
      const state = get();
      const gameType = state.currentGameType;
      const cacheKey = getProgressCacheKey(selectedMonth, gameType);
      const fetchKey = `fetchProgress_${sessionId}_${selectedMonth}_${gameType || 'default'}`;

      if (state._fetchPromises.has(fetchKey)) {
        return state._fetchPromises.get(fetchKey);
      }

      const fetchPromise = (async () => {
        set({ isLoadingProgress: true, progressError: null });

        try {
          const cachedData = CacheUtil.getItem(cacheKey);
          if (cachedData) {
            console.log(`Using cached progress data for ${selectedMonth}`);
            set({ 
              progressData: cachedData, 
              isLoadingProgress: false,
            });
            return;
          }

          console.log(`Fetching fresh progress data for ${selectedMonth}`);
          
          const response = await apiService.get(
            endpoints.trainingPlan.getProgress(selectedMonth),
            sessionId
          );

          CacheUtil.setItem(cacheKey, response.data);

          set({ 
            progressData: response.data, 
            isLoadingProgress: false,
          });

        } catch (error) {
          console.error('Error fetching progress data:', error);
          set({
            progressError: error instanceof Error ? error.message : "Failed to fetch progress data",
            isLoadingProgress: false,
          });
        } finally {
          const currentState = get();
          currentState._fetchPromises.delete(fetchKey);
        }
      })();

      set((state) => ({
        _fetchPromises: new Map(state._fetchPromises).set(fetchKey, fetchPromise),
      }));

      return fetchPromise;
    },

    forceRefresh: async (sessionId: string, month?: string) => {
      const selectedMonth = month || get().currentMonth;
      const gameType = get().currentGameType;
      const cacheKey = getProgressCacheKey(selectedMonth, gameType);
      
      CacheUtil.clearItem(cacheKey);
      
      return get().fetchProgressData(sessionId, selectedMonth);
    },
  }))
);

export const invalidateRatingCaches = (): void => {
  CacheUtil.clearAllProgress();

  const gameType =
    useUserStore.getState().currentGameType ??
    useProgressStore.getState().currentGameType;

  CacheUtil.clearItem(CACHE_KEYS.USER_PROFILE);
  CacheUtil.clearItem(getGameTypeCacheKey(CACHE_KEYS.USER_PROFILE, gameType));

  useProgressStore.setState({ progressData: null });
  useUserStore.setState({ profile: null });
};