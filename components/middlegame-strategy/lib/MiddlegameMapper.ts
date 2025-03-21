// lib/middlegameMapper.ts - Optimization for local filtering
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';

// Types for API data
export interface ApiMiddlegame {
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
interface MiddlegameState {
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

// Create Zustand store with persistence
export const useMiddlegameStore = create<MiddlegameState>()(
  persist(
    (set, get) => ({
      // Initial state
      allMiddlegames: [],
      filteredMiddlegames: [],
      middlegameDetails: {},
      pagination: null,
      difficultyFilter: null,
      searchTerm: "",
      isLoading: false,
      isLoadingMore: false,
      error: null,
      initialized: false,

      // Apply filters to update filteredMiddlegames - now optimized for performance
      applyFilters: () => {
        const { allMiddlegames, difficultyFilter, searchTerm } = get();
        
        // If no filters, return all middlegames
        if (!difficultyFilter && !searchTerm) {
          set({ filteredMiddlegames: allMiddlegames });
          return;
        }
        
        // Prepare search term for case-insensitive search
        const searchTermLower = searchTerm.toLowerCase();
        
        // Apply filters efficiently in a single pass
        const filtered = allMiddlegames.filter((middlegame) => {
          // Apply difficulty filter if selected
          const difficultyMatch = !difficultyFilter || middlegame.difficulty === difficultyFilter;
          
          // Skip search filter if no search term or difficulty already failed
          if (!difficultyMatch || !searchTermLower) {
            return difficultyMatch;
          }
          
          // Apply search filter to title
          return middlegame.title.toLowerCase().includes(searchTermLower);
        });

        set({ filteredMiddlegames: filtered });
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

      // Fetch all middlegames for local filtering - optimized to handle large datasets
      fetchAllMiddlegames: async () => {
        // Check if we've already initialized
        if (get().initialized && get().allMiddlegames.length > 0) {
          console.log('Using cached middlegames');
          get().applyFilters();
          return;
        }

        try {
          set({ isLoading: true, error: null });

          // Fetch with a large limit to reduce number of requests
          const initialUrl = `https://ac-api.kemang.sg/api/handbooks?page=1&limit=100&category=middlegame`;
          
          console.log(`Fetching all middlegames, starting with: ${initialUrl}`);
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
              const url = `https://ac-api.kemang.sg/api/handbooks?page=${page}&limit=100&category=middlegame`;
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
          
          // Update state with all middlegames
          set({ 
            allMiddlegames: allData,
            filteredMiddlegames: allData,
            pagination: {
              ...initialData.pagination,
              total: allData.length
            },
            isLoading: false,
            initialized: true
          });
          
        } catch (error) {
          console.error('Error fetching all middlegames:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch all middlegames',
            isLoading: false,
            isLoadingMore: false
          });
        }
      },

      // Fetch a single middlegame's details
      fetchMiddlegameDetails: async (id: string) => {
        try {
          // Check if we already have this middlegame in the store
          const existingMiddlegame = get().middlegameDetails[id];
          if (existingMiddlegame) {
            console.log(`Using cached details for middlegame: ${id}`);
            return existingMiddlegame;
          }

          // Check in allMiddlegames
          const middlegameFromAll = get().allMiddlegames.find(o => o.id === id);
          if (middlegameFromAll) {
            set(state => ({
              middlegameDetails: { ...state.middlegameDetails, [id]: middlegameFromAll }
            }));
            return middlegameFromAll;
          }

          set({ isLoading: true, error: null });

          // Not found locally, fetch from API
          const apiUrl = `https://ac-api.kemang.sg/api/handbooks/${id}`;

          console.log(`Fetching middlegame detail from API: ${apiUrl}`);
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          set(state => ({
            middlegameDetails: { ...state.middlegameDetails, [id]: data.data },
            isLoading: false
          }));
          return data.data;
        } catch (error) {
          console.error(`Error fetching middlegame details for ${id}:`, error);
          set({ 
            error: error instanceof Error ? error.message : `Failed to fetch middlegame details for ${id}`,
            isLoading: false
          });
          return null;
        }
      },

      // Reset the store
      reset: () => {
        set({
          filteredMiddlegames: get().allMiddlegames,
          difficultyFilter: null,
          searchTerm: "",
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'middlegame-store', // Storage key
      // Don't persist loading states and errors
      partialize: (state) => ({
        allMiddlegames: state.allMiddlegames,
        middlegameDetails: state.middlegameDetails,
        initialized: state.initialized
      })
    }
  )
);

// Helper to get FEN string from moves - optimized for memoization
const fenCache = new Map<string, string>();
const DEFAULT_FEN = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1";

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

// Helper to get slug from middlegame ID
export function getSlugFromId(id: string): string {
  return id.replace('middlegame_', '');
}

// Helper to get ID from slug
export function getIdFromSlug(slug: string): string {
  return slug.startsWith('middlegame_') ? slug : `middlegame_${slug}`;
}