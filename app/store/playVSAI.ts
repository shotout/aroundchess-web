import { create } from 'zustand';

interface PlayVSAIState {
  AIChoosed: any;
  setAIChoosed: (AIChoosed: any) => void; 
}

export const usePlayVSAIStore = create<PlayVSAIState>((set) => ({
  AIChoosed: {
    "color": "white",
    "difficulty": "beginner",
    "opponent": {
        "id": 0,
        "name": "Thomas De",
        "elo": 250,
        "img": "/images/play-vs-ai/thomas.png"
    }
},
  setAIChoosed: (AIChoosed) => set({ AIChoosed }),
   
}));