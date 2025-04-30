// store/index.ts
import { create } from "zustand";
import endpoints, { apiService } from "../api/endpoints";

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

  // Actions
  fetchTopics: (sessionId: string) => Promise<void>;
  toggleTopic: (topicId: string, category: string) => void;
  createTrainingPlan: (sessionId: string) => Promise<boolean>;
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

  // Fetch topics from API
  fetchTopics: async (sessionId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.get(endpoints.trainingPlan.getTopics, sessionId);
      const { userProfile, config, topics } = response.data;

      set({
        userProfile,
        config,
        topics,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching training plan topics:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch training plan topics",
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
    const { selectedWhiteOpenings, selectedBlackOpenings, selectedMiddlegames, selectedEndgames } = get();
    set({ isCreating: true, error: null });

    try {
      await apiService.post(
        endpoints.trainingPlan.createPlan,
        sessionId,
        {
          whiteOpening: selectedWhiteOpenings,
          blackOpening: selectedBlackOpenings,
          middleGame: selectedMiddlegames,
          endGame: selectedEndgames,
        }
      );

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

  // Reset store state
  reset: () => {
    set({
      selectedWhiteOpenings: [],
      selectedBlackOpenings: [],
      selectedMiddlegames: [],
      selectedEndgames: [],
      error: null,
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
  fetchSchedule: (sessionId: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedule: null,
  isLoading: false,
  error: null,

  fetchSchedule: async (sessionId: string) => {
    if (!sessionId) return;

    set({ isLoading: true, error: null });

    try {
      const response = await apiService.get(endpoints.trainingPlan.getTodaySchedule, sessionId);
      set({ schedule: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching training schedule:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch training schedule",
        isLoading: false,
      });
    }
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
  
  setCurrentMonth: (month: string) => set({ currentMonth: month }),
  
  fetchProgressData: async (sessionId: string, month?: string) => {
    if (!sessionId) return;
    
    const selectedMonth = month || get().currentMonth;
    
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.get(
        endpoints.trainingPlan.getProgress(selectedMonth), 
        sessionId
      );
      
      set({ progressData: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching progress data:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch progress data",
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
      const response = await apiService.get(endpoints.user.getProfile, sessionId);
      set({ profile: response.data.data.userProfile, isLoading: false });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // Fallback to training plan topics to get the user profile data
      // This is because your current API structure includes profile in training topics
      try {
        const fallbackResponse = await apiService.get(
          endpoints.trainingPlan.getTopics, 
          sessionId
        );
        
        if (fallbackResponse.data?.userProfile) {
          set({ 
            profile: fallbackResponse.data.userProfile, 
            isLoading: false,
            error: null
          });
        } else {
          throw new Error("User profile not found");
        }
      } catch (fallbackError) {
        set({
          error: fallbackError instanceof Error 
            ? fallbackError.message 
            : "Failed to fetch user profile",
          isLoading: false,
        });
      }
    }
  },
}));

// Helper function to get current month in YYYY-MM format
function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}