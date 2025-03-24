// types/openings.ts
export interface ApiOpening {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: DifficultyLevel;
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
    variations: {
      id: number;
      handbookId: string;
      name: string;
      moves: string | null;
      description: string;
      keyIdeas: { id: number; variationId: number; idea: string }[];
    }[];
  }
  
  export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
  export type DifficultyFilter = DifficultyLevel | null;
  
  export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
  
  export interface OpeningsState {
    allOpenings: ApiOpening[];
    filteredOpenings: ApiOpening[];
    openingDetails: Record<string, ApiOpening>;
    pagination: Pagination | null;
    difficultyFilter: DifficultyFilter;
    searchTerm: string;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    initialized: boolean;
    fetchAllOpenings: () => Promise<void>;
    fetchOpeningDetails: (id: string) => Promise<ApiOpening | null>;
    setDifficultyFilter: (difficulty: DifficultyFilter) => void;
    setSearchTerm: (term: string) => void;
    reset: () => void;
    applyFilters: () => void;
  }