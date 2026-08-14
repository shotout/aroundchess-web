import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { EndgameData } from '../types/EndgameTrainingTypes';

interface EndgameStore {
  data: EndgameData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  clearData: () => void;
}

export const useEndgametraining = create<EndgameStore>()(
  persist(
    (set) => ({
      data: null,
      isLoading: false,
      error: null,
      
      fetchData: async () => {
        try {
          set({ isLoading: true });
          const response = await axios.get<EndgameData>('/endgamedatabase.json');
          set({ data: response.data, isLoading: false, error: null });
        } catch (error) {
          console.error('Error fetching endgame data:', error);
          set({ isLoading: false, error: 'Failed to fetch endgame data' });
        }
      },
      
      clearData: () => {
        set({ data: null, error: null });
      }
    }),
    {
      name: 'endgame-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }),
    }
  )
);