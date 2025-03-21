// store/openingsStore.ts - Optimization for local filtering
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';

// Types for API data
export interface ApiOpening {
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
  variations: {
    id: number;
    handbookId: string;
    name: string;
    moves: string | null;
    description: string;
    keyIdeas: { id: number; variationId: number; idea: string }[];
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
interface OpeningsState {
  // Data
  allOpenings: ApiOpening[]; // All fetched openings
  filteredOpenings: ApiOpening[]; // Filtered openings for display
  openingDetails: Record<string, ApiOpening>; // Indexed by id
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
  fetchAllOpenings: () => Promise<void>;
  fetchOpeningDetails: (id: string) => Promise<ApiOpening | null>;
  setDifficultyFilter: (difficulty: DifficultyFilter) => void;
  setSearchTerm: (term: string) => void;
  reset: () => void;
  applyFilters: () => void;
}

// Create Zustand store with persistence
export const useOpeningsStore = create<OpeningsState>()(
  persist(
    (set, get) => ({
      // Initial state
      allOpenings: [],
      filteredOpenings: [],
      openingDetails: {},
      pagination: null,
      difficultyFilter: null,
      searchTerm: "",
      isLoading: false,
      isLoadingMore: false,
      error: null,
      initialized: false,

      // Apply filters to update filteredOpenings - now optimized for performance
      applyFilters: () => {
        const { allOpenings, difficultyFilter, searchTerm } = get();
        
        // If no filters, return all openings
        if (!difficultyFilter && !searchTerm) {
          set({ filteredOpenings: allOpenings });
          return;
        }
        
        // Prepare search term for case-insensitive search
        const searchTermLower = searchTerm.toLowerCase();
        
        // Apply filters efficiently in a single pass
        const filtered = allOpenings.filter((opening) => {
          // Apply difficulty filter if selected
          const difficultyMatch = !difficultyFilter || opening.difficulty === difficultyFilter;
          
          // Skip search filter if no search term or difficulty already failed
          if (!difficultyMatch || !searchTermLower) {
            return difficultyMatch;
          }
          
          // Apply search filter to title
          return opening.title.toLowerCase().includes(searchTermLower);
        });

        set({ filteredOpenings: filtered });
      },

      // Set difficulty filter
      setDifficultyFilter: (difficulty: DifficultyFilter) => {
        set({ difficultyFilter: difficulty });
        get().applyFilters();
      },

      // Set search term
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      // Fetch all openings for local filtering - optimized to handle large datasets
      fetchAllOpenings: async () => {
        // Check if we've already initialized
        if (get().initialized && get().allOpenings.length > 0) {
          console.log('Using cached openings');
          get().applyFilters();
          return;
        }

        try {
          set({ isLoading: true, error: null });

          // Fetch with a large limit to reduce number of requests
          const initialUrl = `https://ac-api.kemang.sg/api/handbooks?page=1&limit=100&category=opening`;
          
          console.log(`Fetching all openings, starting with: ${initialUrl}`);
          const initialResponse = await fetch(initialUrl);

          if (!initialResponse.ok) {
            throw new Error(`API Error: ${initialResponse.status}`);
          }

          const initialData = await initialResponse.json();
          let allData = [...initialData.data];
          
          // Get pagination info
          const totalPages = initialData.pagination.totalPages;
          
          // Fetch remaining pages in parallel if needed
          if (totalPages > 1) {
            set({ isLoadingMore: true });
            
            const remainingRequests = [];
            for (let page = 2; page <= totalPages; page++) {
              const url = `https://ac-api.kemang.sg/api/handbooks?page=${page}&limit=100&category=opening`;
              remainingRequests.push(
                fetch(url)
                  .then(response => {
                    if (!response.ok) {
                      throw new Error(`API Error on page ${page}: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then(data => data.data)
              );
            }
            
            try {
              const remainingData = await Promise.all(remainingRequests);
              allData = [...allData, ...remainingData.flat()];
            } catch (fetchError) {
              console.error('Error fetching additional pages:', fetchError);
              // Continue with what we have so far
            }
            
            set({ isLoadingMore: false });
          }
          
          // Sort data by difficulty level for better UX
          allData.sort((a, b) => {
            const difficultyOrder = ["Beginner", "Intermediate", "Advanced", "Expert"];
            return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
          });
          
          // Update state with all openings
          set({ 
            allOpenings: allData,
            filteredOpenings: allData,
            pagination: {
              ...initialData.pagination,
              total: allData.length
            },
            isLoading: false,
            initialized: true
          });
          
        } catch (error) {
          console.error('Error fetching all openings:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch all openings',
            isLoading: false,
            isLoadingMore: false
          });
        }
      },

      // Fetch a single opening's details
      fetchOpeningDetails: async (id: string) => {
        try {
          // Check if we already have this opening in the store
          const existingOpening = get().openingDetails[id];
          if (existingOpening) {
            console.log(`Using cached details for opening: ${id}`);
            return existingOpening;
          }

          // Check in allOpenings
          const openingFromAll = get().allOpenings.find(o => o.id === id);
          if (openingFromAll) {
            set(state => ({
              openingDetails: { ...state.openingDetails, [id]: openingFromAll }
            }));
            return openingFromAll;
          }

          set({ isLoading: true, error: null });

          // Not found locally, fetch from API
          const apiUrl = `https://ac-api.kemang.sg/api/handbooks/${id}`;

          console.log(`Fetching opening detail from API: ${apiUrl}`);
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          set(state => ({
            openingDetails: { ...state.openingDetails, [id]: data.data },
            isLoading: false
          }));
          return data.data;
        } catch (error) {
          console.error(`Error fetching opening details for ${id}:`, error);
          set({ 
            error: error instanceof Error ? error.message : `Failed to fetch opening details for ${id}`,
            isLoading: false
          });
          return null;
        }
      },

      // Reset the store
      reset: () => {
        set({
          filteredOpenings: get().allOpenings,
          difficultyFilter: null,
          searchTerm: "",
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'openings-store', // Storage key
      // Don't persist loading states and errors
      partialize: (state) => ({
        allOpenings: state.allOpenings,
        openingDetails: state.openingDetails,
        initialized: state.initialized
      })
    }
  )
);

// Helper to get FEN string from moves - optimized for memoization
const fenCache = new Map<string, string>();
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function getFenFromMoves(moves: string | null): string {
  // Default FEN if no moves provided
  if (!moves) {
    return DEFAULT_FEN;
  }

  // Check cache first
  if (fenCache.has(moves)) {
    return fenCache.get(moves)!;
  }

  try {
    // Create a new chess instance
    const chess = new Chess();
    
    // Clean the moves string and split into individual moves
    const moveList = moves
      .replace(/\d+\./g, '') // Remove move numbers (like "1.", "2.", etc.)
      .replace(/\s+/g, ' ')   // Normalize whitespace
      .trim()
      .split(' ');
    
    // Apply each move
    for (const move of moveList) {
      if (move && move.length > 1) { // Make sure it's a valid move
        try {
          chess.move(move);
        } catch (moveError) {
          console.warn(`Skipping invalid move: ${move}`);
        }
      }
    }
    
    // Cache and return the FEN string
    const fen = chess.fen();
    fenCache.set(moves, fen);
    return fen;
  } catch (error) {
    console.error("Error generating FEN from moves:", error);
    // Return default FEN position if there's an error
    return DEFAULT_FEN;
  }
}

// Helper to get slug from opening ID
export function getSlugFromId(id: string): string {
  return id.replace('opening_', '');
}

// Helper to get ID from slug
export function getIdFromSlug(slug: string): string {
  return slug.startsWith('opening_') ? slug : `opening_${slug}`;
}