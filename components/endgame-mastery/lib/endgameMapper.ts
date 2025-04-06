// lib/endgameMapper.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import { DifficultyFilter, EndgameState } from './endgame';

export const useEndgameStore = create<EndgameState>()(
  persist(
    (set, get) => ({
      allEndgames: [],
      filteredEndgames: [],
      endgameDetails: {},
      pagination: null,
      difficultyFilter: null,
      searchTerm: "",
      isLoading: false,
      isLoadingMore: false,
      error: null,
      initialized: false,

      applyFilters: () => {
        const { allEndgames, difficultyFilter, searchTerm } = get();
        
        if (!difficultyFilter && !searchTerm) {
          set({ filteredEndgames: allEndgames });
          return;
        }
        
        const searchTermLower = searchTerm.toLowerCase();
        
        const filtered = allEndgames.filter((endgame) => {
          const difficultyMatch = !difficultyFilter || endgame.difficulty === difficultyFilter;
          
          if (!difficultyMatch || !searchTermLower) {
            return difficultyMatch;
          }
          
          return endgame.title.toLowerCase().includes(searchTermLower);
        });

        set({ filteredEndgames: filtered });
      },

      setDifficultyFilter: (difficulty: DifficultyFilter) => {
        set({ difficultyFilter: difficulty });
        get().applyFilters();
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      fetchAllEndgames: async () => {
        if (get().initialized && get().allEndgames.length > 0) {
          get().applyFilters();
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          const apiBaseUrl = process.env.BASE_URL
          const initialUrl = `${apiBaseUrl}/handbooks?page=1&limit=100&category=endgame`;
          
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
              const url = `${apiBaseUrl}/handbooks?page=${page}&limit=100&category=endgame`;
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
            allEndgames: allData,
            filteredEndgames: allData,
            pagination: {
              ...initialData.pagination,
              total: allData.length
            },
            isLoading: false,
            initialized: true
          });
          
        } catch (error) {
          console.error('Error fetching all endgames:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch all endgames',
            isLoading: false,
            isLoadingMore: false
          });
        }
      },

      fetchEndgameDetails: async (id: string) => {
        try {
          const existingEndgame = get().endgameDetails[id];
          if (existingEndgame) {
            return existingEndgame;
          }

          const endgameFromAll = get().allEndgames.find(e => e.id === id);
          if (endgameFromAll) {
            set(state => ({
              endgameDetails: { ...state.endgameDetails, [id]: endgameFromAll }
            }));
            return endgameFromAll;
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
            endgameDetails: { ...state.endgameDetails, [id]: data.data },
            isLoading: false
          }));
          return data.data;
        } catch (error) {
          console.error(`Error fetching endgame details for ${id}:`, error);
          set({ 
            error: error instanceof Error ? error.message : `Failed to fetch endgame details for ${id}`,
            isLoading: false
          });
          return null;
        }
      },

      reset: () => {
        set({
          filteredEndgames: get().allEndgames,
          difficultyFilter: null,
          searchTerm: "",
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'endgames-store',
      partialize: (state) => ({
        allEndgames: state.allEndgames,
        endgameDetails: state.endgameDetails,
        initialized: state.initialized
      })
    }
  )
);

const fenCache = new Map<string, string>();
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Checks if a string appears to be in FEN notation
 * @param input String to check
 * @returns boolean indicating if the string looks like a FEN position
 */
function isFenString(input: string): boolean {
  // A valid FEN has slashes and typically contains numbers and piece letters
  return input.includes('/') && /[1-8prnbqkPRNBQK]/.test(input) && input.split('/').length === 8;
}

/**
 * Gets a FEN position from either moves or a FEN string
 * @param input String containing either chess moves or a FEN position
 * @returns FEN string representation of the position
 */
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
  return id.replace('endgame_', '');
}

export function getIdFromSlug(slug: string): string {
  return slug.startsWith('endgame_') ? slug : `endgame_${slug}`;
}