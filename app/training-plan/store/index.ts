import { create } from "zustand";
import { apiService, endpoints } from "../api/endpoints";
import CacheUtil, { CACHE_KEYS } from "../api/cacheUtils";

// Common interfaces
export interface UserProfile {
  username: string;
  elo: number;
  avatar: string;
  targetElo?: number;
  level?: string;
}

// ========== TRAINING PLAN STORE ==========
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

interface TrainingPlanState {
  // API data
  userProfile: UserProfile | null;
  config: Config | null;
  topics: TopicsData | null;

  // Selected topics
  selectedWhiteOpenings: string[];
  selectedBlackOpenings: string[];
  selectedMiddlegames: string[];
  selectedEndgames: string[];

  // UI state
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  isAdjustMode: boolean;

  // Actions
  fetchTopics: (sessionId: string) => Promise<void>;
  fetchExistingTopics: (sessionId: string) => Promise<void>;
  toggleTopic: (topicId: string, category: string) => void;
  createTrainingPlan: (sessionId: string) => Promise<boolean>;
  setAdjustMode: (mode: boolean) => void;
  reset: () => void;
}

export const useTrainingPlanStore = create<TrainingPlanState>((set, get) => ({
  // Initial state
  userProfile: null,
  config: null,
  topics: null,

  selectedWhiteOpenings: [],
  selectedBlackOpenings: [],
  selectedMiddlegames: [],
  selectedEndgames: [],

  isLoading: false,
  isCreating: false,
  error: null,
  isAdjustMode: false,

  // Set adjust mode
  setAdjustMode: (mode: boolean) => {
    set({ isAdjustMode: mode });
  },

  // Fetch topics from API (for creating new plan)
  fetchTopics: async (sessionId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Check if we have valid cached data
      const cachedData = CacheUtil.getItem(CACHE_KEYS.TRAINING_TOPICS);
      if (cachedData) {
        const { userProfile, config, topics } = cachedData;
        set({
          userProfile,
          config,
          topics,
          isLoading: false,
        });
        return;
      }

      // If no valid cache, fetch from API
      const response = await apiService.get(
        endpoints.trainingPlan.getTopics,
        sessionId
      );
      const { userProfile, config, topics } = response.data;

      // Cache the response
      CacheUtil.setItem(CACHE_KEYS.TRAINING_TOPICS, response.data);

      set({
        userProfile,
        config,
        topics,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching training plan topics:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch training plan topics",
        isLoading: false,
      });
    }
  },

  // Fetch existing topics (for adjusting existing plan)
  fetchExistingTopics: async (sessionId: string) => {
    set({ isLoading: true, error: null });

    try {
      // First, fetch the existing topics to get what's currently selected
      const existingResponse = await apiService.get(
        endpoints.trainingPlan.getExistingTopics,
        sessionId
      );
      const existingData: ExistingTopicsResponse = existingResponse.data;

      // Extract the selected topic IDs from the existing topics
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

      // Also fetch all available topics to get the full list and config
      const allTopicsResponse = await apiService.get(
        endpoints.trainingPlan.getTopics,
        sessionId
      );
      const allTopicsData = allTopicsResponse.data;

      set({
        userProfile: allTopicsData.userProfile,
        config: allTopicsData.config,
        topics: allTopicsData.topics,
        selectedWhiteOpenings,
        selectedBlackOpenings,
        selectedMiddlegames,
        selectedEndgames,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching existing training plan topics:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch existing training plan topics",
        isLoading: false,
      });
    }
  },

  // Toggle a topic selection
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

  // Create training plan with selected topics
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

      // Clear all caches since creating a new plan affects everything
      CacheUtil.clearAll();

      set({ isCreating: false });
      return true;
    } catch (error) {
      console.error("Error creating training plan:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create training plan",
        isCreating: false,
      });
      return false;
    }
  },

  // Reset store state
  reset: () => {
    set({
      selectedWhiteOpenings: [],
      selectedBlackOpenings: [],
      selectedMiddlegames: [],
      selectedEndgames: [],
      error: null,
      isAdjustMode: false,
    });
  },
}));

// ========== SCHEDULE STORE ==========
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
  isLoading: boolean;
  error: string | null;
  planExpired: boolean;
  fetchSchedule: (sessionId: string) => Promise<void>;
  resetExpiredStatus: () => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedule: null,
  isLoading: false,
  error: null,
  planExpired: false,

  fetchSchedule: async (sessionId: string) => {
    if (!sessionId) return;

    set({ isLoading: true, error: null, planExpired: false });

    try {
      // Check if we have valid cached data
      const cachedData = CacheUtil.getItem(CACHE_KEYS.TRAINING_SCHEDULE);
      if (cachedData) {
        set({ schedule: cachedData, isLoading: false });
        return;
      }

      // If no valid cache, fetch from API
      const response = await apiService.get(
        endpoints.trainingPlan.getTodaySchedule,
        sessionId
      );

      // Cache the response
      CacheUtil.setItem(CACHE_KEYS.TRAINING_SCHEDULE, response.data);

      set({ schedule: response.data, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching training schedule:", error);

      // Check if this is an expired plan error
      const errorMessage = error instanceof Error ? error.message : "";
      const responseData = error?.response?.data;

      // Various ways the API might indicate an expired plan
      const isExpiredPlanError =
        responseData?.message?.includes("expired") ||
        errorMessage.includes("expired") ||
        (responseData?.statusCode === 400 &&
          responseData?.message?.includes("training plan"));

      if (isExpiredPlanError) {
        // For expired plan errors, set planExpired flag but don't treat as a fatal error
        set({
          planExpired: true,
          schedule: null,
          isLoading: false,
          error:
            responseData?.message ||
            "Your training plan has expired. Please create a new one.",
        });
      } else {
        // For other errors, handle normally
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch training schedule",
          isLoading: false,
        });
      }
    }
  },

  resetExpiredStatus: () => {
    set({ planExpired: false, error: null });
  },
}));

// ========== PROGRESS STORE ==========
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

interface ProgressState {
  progressData: ProgressData | null;
  isLoading: boolean;
  error: string | null;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  fetchProgressData: (sessionId: string, month?: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressData: null,
  isLoading: false,
  error: null,
  currentMonth: getCurrentMonth(),

  setCurrentMonth: (month: string) => {
    set({ currentMonth: month });
    CacheUtil.clearItem(CACHE_KEYS.PROGRESS_DATA);
  },

  fetchProgressData: async (sessionId: string, month?: string) => {
    if (!sessionId) return;

    const selectedMonth = month || get().currentMonth;

    set({ isLoading: true, error: null });

    try {
      const cachedData = CacheUtil.getItem(CACHE_KEYS.PROGRESS_DATA);
      if (cachedData && !month) {
        set({ progressData: cachedData, isLoading: false });
        return;
      }

      const response = await apiService.get(
        endpoints.trainingPlan.getProgress(selectedMonth),
        sessionId
      );

      if (!month) {
        CacheUtil.setItem(CACHE_KEYS.PROGRESS_DATA, response.data);
      }

      set({ progressData: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch progress data",
        isLoading: false,
      });
    }
  },
}));

// ========== USER PROFILE STORE ==========
interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: (sessionId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async (sessionId: string) => {
    if (!sessionId) return;

    set({ isLoading: true, error: null });

    try {
      const cachedData = CacheUtil.getItem(CACHE_KEYS.USER_PROFILE);
      if (cachedData) {
        set({ profile: cachedData, isLoading: false });
        return;
      }

      const response = await apiService.get(
        endpoints.trainingPlan.getTopics,
        sessionId
      );

      if (response.data?.userProfile) {
        CacheUtil.setItem(CACHE_KEYS.USER_PROFILE, response.data.userProfile);

        set({
          profile: response.data.userProfile,
          isLoading: false,
        });
      } else {
        throw new Error("User profile not found in the response");
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile",
        isLoading: false,
      });
    }
  },
}));

function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}
