// lib/middlegameMapper.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import { DifficultyFilter } from './middlegame';

// Import ApiMiddlegame interface for proper typing
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

// Define the proper store state type
export interface MiddlegameState {
  // Data
  allMiddlegames: ApiMiddlegame[]; // All fetched middlegames
  filteredMiddlegames: ApiMiddlegame[]; // Filtered middlegames for display
  middlegameDetails: Record<string, ApiMiddlegame>; // Indexed by id
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

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

export const useMiddlegameStore = create<MiddlegameState>()(
  persist(
    (set, get) => ({
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

      applyFilters: () => {
        const { allMiddlegames, difficultyFilter, searchTerm } = get();
        
        if (!difficultyFilter && !searchTerm) {
          set({ filteredMiddlegames: allMiddlegames });
          return;
        }
        
        const searchTermLower = searchTerm.toLowerCase();
        
        const filtered = allMiddlegames.filter((middlegame) => {
          const difficultyMatch = !difficultyFilter || middlegame.difficulty === difficultyFilter;
          
          if (!difficultyMatch || !searchTermLower) {
            return difficultyMatch;
          }
          
          return middlegame.title.toLowerCase().includes(searchTermLower);
        });

        set({ filteredMiddlegames: filtered });
      },

      setDifficultyFilter: (difficulty: DifficultyFilter) => {
        set({ difficultyFilter: difficulty });
        get().applyFilters();
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      fetchAllMiddlegames: async () => {
        if (get().initialized && get().allMiddlegames.length > 0) {
          get().applyFilters();
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          const apiBaseUrl = process.env.BASE_URL;
          const initialUrl = `${apiBaseUrl}/handbooks?page=1&limit=100&category=middlegame`;
          
          const initialResponse = await fetch(initialUrl);

          if (!initialResponse.ok) {
            throw new Error(`API Error: ${initialResponse.status}`);
          }

          const initialData = await initialResponse.json();
          let allData = [...initialData.data];
          
          const totalPages = initialData.pagination.totalPages;
          
          if (totalPages > 1) {
            set({ isLoadingMore: true });
            
            const remainingRequests = [];
            for (let page = 2; page <= totalPages; page++) {
              const url = `${apiBaseUrl}/handbooks?page=${page}&limit=100&category=middlegame`;
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
            }
            
            set({ isLoadingMore: false });
          }
          
          allData.sort((a, b) => {
            const difficultyOrder = ["Beginner", "Intermediate", "Advanced", "Expert"];
            return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
          });
          
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

      fetchMiddlegameDetails: async (id: string) => {
        try {
          const existingMiddlegame = get().middlegameDetails[id];
          if (existingMiddlegame) {
            return existingMiddlegame;
          }

          const middlegameFromAll = get().allMiddlegames.find(m => m.id === id);
          if (middlegameFromAll) {
            set(state => ({
              middlegameDetails: { ...state.middlegameDetails, [id]: middlegameFromAll }
            }));
            return middlegameFromAll;
          }

          set({ isLoading: true, error: null });

          const apiBaseUrl = process.env.BASE_URL;
          const apiUrl = `${apiBaseUrl}/handbooks/${id}`;

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
      name: 'middlegames-store',
      partialize: (state) => ({
        allMiddlegames: state.allMiddlegames,
        middlegameDetails: state.middlegameDetails,
        initialized: state.initialized
      })
    }
  )
);

const fenCache = new Map<string, string>();
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function isFenString(input: string): boolean {
  // A valid FEN has slashes and typically contains numbers and piece letters
  return input.includes('/') && /[1-8prnbqkPRNBQK]/.test(input) && input.split('/').length === 8;
}

export function getFenFromMoves(input: string | null): string {
  if (!input) {
    return DEFAULT_FEN;
  }

  // First check if the input is already cached
  if (fenCache.has(input)) {
    return fenCache.get(input)!;
  }

  // Check if the input is already a FEN string
  if (isFenString(input)) {
    fenCache.set(input, input);
    return input;
  }

  // Otherwise, treat the input as chess moves
  try {
    const chess = new Chess();
    
    // Improved preprocessing of moves string
    const moveList = input
      .replace(/\d+\./g, '') // Remove move numbers like "1."
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim()
      .split(' ')
      .filter(move => move.length > 0); // Remove empty moves
    
    for (const move of moveList) {
      if (move && move.length > 1) {
        try {
          chess.move(move);
        } catch (moveError) {
          console.warn(`Skipping invalid move: ${move} in sequence ${input}`);
        }
      }
    }
    
    const fen = chess.fen();
    fenCache.set(input, fen);
    return fen;
  } catch (error) {
    console.error("Error generating FEN from moves:", error, "Input:", input);
    return DEFAULT_FEN;
  }
}

export function getSlugFromId(id: string): string {
  return id.replace('middlegame_', '');
}

export function getIdFromSlug(slug: string): string {
  return slug.startsWith('middlegame_') ? slug : `middlegame_${slug}`;
}