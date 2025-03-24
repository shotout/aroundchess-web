// lib/openingMapper.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import { DifficultyFilter, OpeningsState } from './opening';


export const useOpeningsStore = create<OpeningsState>()(
  persist(
    (set, get) => ({
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

      applyFilters: () => {
        const { allOpenings, difficultyFilter, searchTerm } = get();
        
        if (!difficultyFilter && !searchTerm) {
          set({ filteredOpenings: allOpenings });
          return;
        }
        
        const searchTermLower = searchTerm.toLowerCase();
        
        const filtered = allOpenings.filter((opening) => {
          const difficultyMatch = !difficultyFilter || opening.difficulty === difficultyFilter;
          
          if (!difficultyMatch || !searchTermLower) {
            return difficultyMatch;
          }
          
          return opening.title.toLowerCase().includes(searchTermLower);
        });

        set({ filteredOpenings: filtered });
      },

      setDifficultyFilter: (difficulty: DifficultyFilter) => {
        set({ difficultyFilter: difficulty });
        get().applyFilters();
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      fetchAllOpenings: async () => {
        if (get().initialized && get().allOpenings.length > 0) {
          get().applyFilters();
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          const apiBaseUrl = process.env.BASE_URL
          const initialUrl = `${apiBaseUrl}/handbooks?page=1&limit=100&category=opening`;
          
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
              const url = `${apiBaseUrl}/handbooks?page=${page}&limit=100&category=opening`;
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

      fetchOpeningDetails: async (id: string) => {
        try {
          const existingOpening = get().openingDetails[id];
          if (existingOpening) {
            return existingOpening;
          }

          const openingFromAll = get().allOpenings.find(o => o.id === id);
          if (openingFromAll) {
            set(state => ({
              openingDetails: { ...state.openingDetails, [id]: openingFromAll }
            }));
            return openingFromAll;
          }

          set({ isLoading: true, error: null });

          const apiBaseUrl = process.env.BASE_URL
          const apiUrl = `${apiBaseUrl}/handbooks/${id}`;

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
      name: 'openings-store',
      partialize: (state) => ({
        allOpenings: state.allOpenings,
        openingDetails: state.openingDetails,
        initialized: state.initialized
      })
    }
  )
);

const fenCache = new Map<string, string>();
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function getFenFromMoves(moves: string | null): string {
  if (!moves) {
    return DEFAULT_FEN;
  }

  if (fenCache.has(moves)) {
    return fenCache.get(moves)!;
  }

  try {
    const chess = new Chess();
    
    const moveList = moves
      .replace(/\d+\./g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
    
    for (const move of moveList) {
      if (move && move.length > 1) {
        try {
          chess.move(move);
        } catch (moveError) {
          console.warn(`Skipping invalid move: ${move}`);
        }
      }
    }
    
    const fen = chess.fen();
    fenCache.set(moves, fen);
    return fen;
  } catch (error) {
    console.error("Error generating FEN from moves:", error);
    return DEFAULT_FEN;
  }
}

export function getSlugFromId(id: string): string {
  return id.replace('opening_', '');
}

export function getIdFromSlug(slug: string): string {
  return slug.startsWith('opening_') ? slug : `opening_${slug}`;
}