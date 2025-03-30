export interface ApiMiddlegame {
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
  patterns: {
    id: number;
    handbookId: string;
    pattern: string;
  }[];
  commonThemes: {
    id: number;
    handbookId: string;
    theme: string;
  }[];
  tacticalMotifs: {
    id: number;
    handbookId: string;
    motif: string;
  }[];
  strategicConcepts: {
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
export interface MiddlegameState {
  // Data
  allMiddlegames: ApiMiddlegame[]; // All fetched middlegames
  filteredMiddlegames: ApiMiddlegame[]; // Filtered middlegames for display
  middlegameDetails: Record<string, ApiMiddlegame>; // Indexed by id
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
  fetchAllMiddlegames: () => Promise<void>;
  fetchMiddlegameDetails: (id: string) => Promise<ApiMiddlegame | null>;
  setDifficultyFilter: (difficulty: DifficultyFilter) => void;
  setSearchTerm: (term: string) => void;
  reset: () => void;
  applyFilters: () => void;
}