import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface CheckmateData {
  [index: number]: string[];
}

interface CheckmateStore {
  data: CheckmateData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  clearData: () => void;
}

const isValidRawCheckmateData = (data: any): data is CheckmateData => {
  return (
    Array.isArray(data) &&
    data.every(category => Array.isArray(category) && 
    category.every(item => typeof item === 'string'))
  );
};

export const useCheckmateTraining = create<CheckmateStore>()(
  persist(
    (set) => ({
      data: null,
      isLoading: false,
      error: null,
      
      fetchData: async () => {
        const state = useCheckmateTraining.getState();
        if (state.isLoading) return;
        
        try {
          set({ isLoading: true });
          
          const response = await axios.get<CheckmateData>('/checkmate.json');
          
          console.log('Checkmate data response structure:', 
            response.data ? (
              Array.isArray(response.data) 
                ? `2D Array with ${response.data.length} categories` 
                : typeof response.data
            ) : 'No data');
          
          if (!isValidRawCheckmateData(response.data)) {
            console.error('Invalid checkmate data format:', response.data);
            throw new Error('Invalid checkmate data format');
          }
          
          set({ data: response.data, isLoading: false, error: null });
        } catch (error) {
          console.error('Error fetching checkmate data:', error);
          
          set({ 
            data: [],
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch checkmate data'
          });
        }
      },
      
      clearData: () => {
        set({ data: null, error: null });
      }
    }),
    {
      name: 'checkmate-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }), 
    }
  )
);