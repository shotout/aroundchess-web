import { create } from "zustand";

export interface GameTypeData {
  game_type: string;
  elo: number;
  label: string;
}

interface PlayerStatsState {
  username: string | null;
  gameTypesData: GameTypeData[];
  selectedGameType: string | null;
  isValidatingUsername: boolean;
  usernameFound: boolean;

  setPlayerData: (username: string, gameTypesData: GameTypeData[]) => void;
  setSelectedGameType: (gameType: string) => void;
  setIsValidatingUsername: (isValidating: boolean) => void;
  setUsernameFound: (found: boolean) => void;
  clearPlayerStats: () => void;
  getSelectedGameData: () => GameTypeData | null;
}

export const usePlayerStatsStore = create<PlayerStatsState>((set, get) => ({
  username: null,
  gameTypesData: [],
  selectedGameType: null,
  isValidatingUsername: false,
  usernameFound: false,

  setPlayerData: (username, gameTypesData) =>
    set({
      username,
      gameTypesData,
      selectedGameType: null,
    }),

  setSelectedGameType: (gameType) => set({ selectedGameType: gameType }),

  setIsValidatingUsername: (isValidating) =>
    set({ isValidatingUsername: isValidating }),

  setUsernameFound: (found) => set({ usernameFound: found }),

  clearPlayerStats: () =>
    set({
      username: null,
      gameTypesData: [],
      selectedGameType: null,
      isValidatingUsername: false,
      usernameFound: false,
    }),

  getSelectedGameData: () => {
    const state = get();
    if (!state.selectedGameType) return null;
    return (
      state.gameTypesData.find(
        (game) => game.game_type === state.selectedGameType
      ) || null
    );
  },
}));
