import { create } from 'zustand';

interface PlayVSAIState {
  AIChoosed: any;
  setAIChoosed: (AIChoosed: any) => void; 
}

export const usePlayVSAIStore = create<PlayVSAIState>((set) => ({
  AIChoosed: {},
  setAIChoosed: (AIChoosed) => set({ AIChoosed }),
   
}));