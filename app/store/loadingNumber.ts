import { create } from 'zustand';

interface loadingNumberState {
  length: number|null;
  setLength: (length: number) => void; 
  workingOn: number|null;
  setWorkingOn: (workingOn: number) => void; 
}

export const useLoadingNumber = create<loadingNumberState>((set) => ({
  length: 0,
  setLength: (length) => set({ length }),
  workingOn: 0,
  setWorkingOn: (workingOn) => set({ workingOn }),
   
}));