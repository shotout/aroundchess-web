import { create } from "zustand";
import axios from "axios";

const endpoint = process.env.BASE_URL;

interface UserProfile {
  targetElo: number;
  level: string;
  username: string;
  elo: number;
  avatar: string;
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

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    userProfile: UserProfile;
    config: Config;
    topics: TopicsData;
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

  // Actions
  fetchTopics: (sessionId: string) => Promise<void>;
  toggleTopic: (topicId: string, category: string) => void;
  createTrainingPlan: (sessionId: string) => Promise<boolean>;
  reset: () => void;
}

const useTrainingPlanStore = create<TrainingPlanState>((set, get) => ({
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
      const response = await axios.get<ApiResponse>(
        `${endpoint}/training-plan/topics`,
        {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      const { userProfile, config, topics } = response.data.data;

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
      await axios.post(
        `${endpoint}/training-plan/create`,
        {
          whiteOpening: selectedWhiteOpenings,
          blackOpening: selectedBlackOpenings,
          middleGame: selectedMiddlegames,
          endGame: selectedEndgames,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

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
    });
  },
}));

export default useTrainingPlanStore;
