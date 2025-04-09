import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import axios from 'axios';
import { DifficultyFilter, MiddlegameState } from './middlegame';

const apiBaseUrl = process.env.BASE_URL;



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

      fetchAllMiddlegames: async (sessionId?: string) => {
        if (get().initialized && get().allMiddlegames.length > 0) {
          get().applyFilters();
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          const headers = sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
          const url = `${apiBaseUrl}/handbooks`;
          
          const initialResponse = await axios.get(url, {
            params: { page: 1, limit: 100, category: 'middlegame' },
            headers
          });

          let allData = [...initialResponse.data.data];
          const totalPages = initialResponse.data.pagination.totalPages;
          
          if (totalPages > 1) {
            set({ isLoadingMore: true });
            
            try {
              const requests = Array.from({ length: totalPages - 1 }, (_, i) => 
                axios.get(url, {
                  params: { page: i + 2, limit: 100, category: 'middlegame' },
                  headers
                })
              );
              
              const responses = await Promise.all(requests);
              const additionalData = responses.flatMap(response => response.data.data);
              allData = [...allData, ...additionalData];
            } catch (error) {
              console.error('Error fetching additional pages:', error);
            } finally {
              set({ isLoadingMore: false });
            }
          }
          
          const difficultyOrder = ["Beginner", "Intermediate", "Advanced", "Expert"];
          allData.sort((a, b) => 
            difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)
          );
          
          set({ 
            allMiddlegames: allData,
            filteredMiddlegames: allData,
            pagination: {
              ...initialResponse.data.pagination,
              total: allData.length
            },
            isLoading: false,
            initialized: true
          });
          
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.status || 'Unknown'}`
            : 'Failed to fetch all middlegames';
            
          console.error('Error fetching all middlegames:', error);
          set({ 
            error: errorMessage,
            isLoading: false,
            isLoadingMore: false
          });
        }
      },

      fetchMiddlegameDetails: async (id: string, sessionId?: string) => {
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

          const headers = sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
          const url = `${apiBaseUrl}/handbooks/${id}`;

          const response = await axios.get(url, { headers });
          const middlegameData = response.data.data;
          
          set(state => ({
            middlegameDetails: { ...state.middlegameDetails, [id]: middlegameData },
            isLoading: false
          }));
          
          return middlegameData;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.status || 'Unknown'}`
            : `Failed to fetch middlegame details for ${id}`;
            
          console.error(`Error fetching middlegame details for ${id}:`, error);
          set({ 
            error: errorMessage,
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
  return input.includes('/') && /[1-8prnbqkPRNBQK]/.test(input) && input.split('/').length === 8;
}

export function getFenFromMoves(input: string | null): string {
  if (!input) {
    return DEFAULT_FEN;
  }

  if (fenCache.has(input)) {
    return fenCache.get(input)!;
  }

  if (isFenString(input)) {
    fenCache.set(input, input);
    return input;
  }

  try {
    const chess = new Chess();
    
    const moveList = input
      .replace(/\d+\./g, '') 
      .replace(/\s+/g, ' ')  
      .trim()
      .split(' ')
      .filter(move => move.length > 0); 
    
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