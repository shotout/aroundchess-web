export interface ApiEndgame {
    variations: any;
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    estimatedTime: string;
    forColor: string;
    popularityLevel: number;
    recommendedFor: string[];
    relatedTopics: string[];
    eco: string | null;
    moves: string | null;
    prerequisites: { id: number; handbookId: string; prerequisite: string }[];
    objectives: { id: number; handbookId: string; objective: string }[];
    resources: {
      id: number;
      handbookId: string;
      title: string;
      url: string;
      platform: string;
      description: string;
    }[];
    techniques: {
      id: number;
      handbookId: string;
      technique: string;
    }[];
    keyPrinciples: {
      id: number;
      handbookId: string;
      principle: string;
    }[];
    winningIdeas: {
      id: number;
      handbookId: string;
      idea: string;
    }[];
    theoreticalConcepts: {
      id: number;
      handbookId: string;
      concept: string;
    }[];
  }
  
  // Types for pagination
  export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
  
  // Filter types
  export type DifficultyFilter = "Beginner" | "Intermediate" | "Advanced" | "Expert" | null;
  
  // Store state interface
  export interface EndgameState {
    // Data
    allEndgames: ApiEndgame[]; // All fetched endgames
    filteredEndgames: ApiEndgame[]; // Filtered endgames for display
    endgameDetails: Record<string, ApiEndgame>; // Indexed by id
    pagination: Pagination | null;
  
    // Filter states
    difficultyFilter: DifficultyFilter;
    searchTerm: string;
  
    // Loading states
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    initialized: boolean;
  
    // Actions
    fetchAllEndgames: () => Promise<void>;
    fetchEndgameDetails: (id: string) => Promise<ApiEndgame | null>;
    setDifficultyFilter: (difficulty: DifficultyFilter) => void;
    setSearchTerm: (term: string) => void;
    reset: () => void;
    applyFilters: () => void;
  }