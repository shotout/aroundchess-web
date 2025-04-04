// src/store/gameStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define game interface
export interface Game {
  id: string;
  date: string;
  timeControl: string;
  result: string;
  opponent: string;
  rating: string;
  eloChange: string;
  moves: string;
  opening: string;
  source: string;
  color: string;
  gameFormat: string;
  pgn: string;
  gameType: string;
  createdAt?: Date;
}

// Define store interface
interface GameStore {
  games: Game[];
  importedGames: Game[];
  addImportedGame: (game: Omit<Game, 'id' | 'createdAt'>) => void;
  getGameById: (id: string) => Game | undefined;
  getAllGames: () => Game[];
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

// Create the store
const useGameStore = create<GameStore>((set, get) => ({
  games: [], // Will be populated with the dummy games or from an API
  importedGames: [], // Only the games imported by the user
  isLoading: false,
  error: null,

  // Add a newly imported game
  addImportedGame: (gameData) => {
    const newGame: Game = {
      ...gameData,
      id: `imported-${uuidv4()}`, // Generate unique ID
      createdAt: new Date(),
    };

    set((state) => ({
      importedGames: [newGame, ...state.importedGames],
    }));

    return newGame;
  },

  // Get a specific game by ID
  getGameById: (id) => {
    const { games, importedGames } = get();
    return [...games, ...importedGames].find(game => game.id === id);
  },

  // Get all games (both predefined and imported)
  getAllGames: () => {
    const { games, importedGames } = get();
    return [...importedGames, ...games];
  },

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error state
  setError: (error) => set({ error }),
}));

// Initialize with dummy games
export const initializeGameStore = (dummyGames: Game[]) => {
  useGameStore.setState({ games: dummyGames });
};

export default useGameStore;