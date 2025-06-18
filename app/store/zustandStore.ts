import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Game {
  id: number | string;
  date: string;
  opponent: string;
  result: string;
  eloChange: string;
  resultColor: string;
  rating: string;
  opening: string;
  moves: string;
  timeControl: string;
  source: string;
  gameType: string;
  color: string;
  gameFormat: string;
  pgn: string;
}

export interface AnalysisResult {
  [key: string]: any;
}

interface PgnState {
  pgn: string;
  username: string;
  usernameAnalysis: string;
  dataAnalysis: AnalysisResult | null;
  isLoading: boolean;
  lastFetchTimestamp: number;
  hideDiv: boolean;

  gamesData: Game[];
  gamesLastFetched: number | null;

  otherGamesData: Game[];
  otherGamesLastFetched: number | null;

  analyticsData: any | null;
  analyticsLastFetched: number | null;

  performanceData: any | null;
  performanceLastFetched: number | null;

  error: Error | null;
  dataGamesImport: any;
  dataGames: any;
  historyGame: any[];
  capturedWhite: any[];
  capturedBlack: any[];
  mistakeLogs: any[];
  movementDetails: any;
  playerInfo: any;
  titleGame: string;
  previousAnalyses: any[];
  previousAnalysesDetail: any;
  savedMistakes: any[];

  // Track newly imported games
  importedGames: Game[];

  // openings played
  openingPlayed: any[];
  setOpeningPlayed: (openingPlayed: any[]) => void;

  setPgn: (pgn: string) => void;
  setUsernameAnalysis: (usernameAnalysis: string) => void;
  setUsername: (username: string) => void;
  setDataAnalysis: (dataAnalysis: AnalysisResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetFetchState: () => void;
  setError: (error: Error | null) => void;
  setDataGamesImport: (dataGamesImport: any) => void;
  setDataGames: (dataGames: any) => void;
  setHideDiv: (hideDiv: boolean) => void;

  setHistoryGame: (historyGame: any[]) => void;
  setCapturedWhite: (capturedWhite: any[]) => void;
  setCapturedBlack: (capturedBlack: any[]) => void;
  setMistakeLogs: (mistakeLogs: any[]) => void;
  setSavedMistakes: (savedMistakes: any[]) => void;
  setPreviousAnalyses: (previousAnalyses: any[]) => void;
  setPreviousAnalysesDetail: (previousAnalysesDetail: any) => void;
  setMovementDetails: (movementDetails: any[]) => void;
  setPlayerInfo: (playerInfo: any[]) => void;
  setTitleGame: (titleGame: string) => void;

  setGamesData: (games: Game[]) => void;
  setOtherGamesData: (games: Game[]) => void;
  clearGamesData: () => void;
  clearOtherGamesData: () => void;

  setAnalyticsData: (data: any) => void;
  clearAnalyticsData: () => void;
  resetAnalyticsState: () => void;

  setPerformanceData: (data: any) => void;
  clearPerformanceData: () => void;
  resetPerformanceState: () => void;

  clearAll: () => void;

  // Functions to add imported games
  addImportedGame: (game: Omit<Game, "id">) => Game;
  addOtherImportedGame: (game: Omit<Game, "id">) => Game; // New function for other games
  hydrated: boolean;
  setHydrated: () => void;
}

export const usePgnStore = create<PgnState>()(
  persist(
    (set, get) => ({
      hydrated: false, // manually track hydration
      setHydrated: () => set({ hydrated: true }),

      pgn: "",
      username: "",
      usernameAnalysis: "",
      dataAnalysis: null,
      isLoading: false,
      lastFetchTimestamp: 0,
      hideDiv: false,

      gamesData: [],
      gamesLastFetched: null,

      otherGamesData: [],
      otherGamesLastFetched: null,

      analyticsData: null,
      analyticsLastFetched: null,

      performanceData: null,
      performanceLastFetched: null,

      error: null,
      dataGamesImport: null,
      dataGames: null,
      historyGame: [],
      capturedWhite: [],
      capturedBlack: [],
      mistakeLogs: [],
      movementDetails: [],
      playerInfo: [],
      titleGame: "",
      previousAnalyses: [],
      previousAnalysesDetail: [],
      savedMistakes: [],

      // Initialize imported games array
      importedGames: [],
      openingPlayed: [],
      setOpeningPlayed: (openingPlayed: any) => set({ openingPlayed }),

      setPgn: (pgn: string) => set({ pgn }),

      setUsername: (username: string) =>
        set((state) => ({
          username,
          lastFetchTimestamp:
            username !== state.username ? Date.now() : state.lastFetchTimestamp,
        })),
      setUsernameAnalysis: (usernameAnalysis: string) =>
        set((state) => ({
          usernameAnalysis,
          lastFetchTimestamp:
            usernameAnalysis !== state.usernameAnalysis
              ? Date.now()
              : state.lastFetchTimestamp,
        })),
      setHideDiv: (hideDiv: boolean) => set({ hideDiv }),

      setDataAnalysis: (dataAnalysis: AnalysisResult | null) =>
        set({ dataAnalysis }),

      setIsLoading: (isLoading: boolean) => set({ isLoading }),

      resetFetchState: () => set({ lastFetchTimestamp: Date.now() }),

      setError: (error: Error | null) => set({ error }),

      setDataGamesImport: (dataGamesImport: any) => set({ dataGamesImport }),

      setDataGames: (dataGames: any) => set({ dataGames }),

      setHistoryGame: (historyGame: any[]) => set({ historyGame }),
      setCapturedWhite: (capturedWhite: any[]) => set({ capturedWhite }),

      setCapturedBlack: (capturedBlack: any[]) => set({ capturedBlack }),
      setMistakeLogs: (mistakeLogs: any[]) => set({ mistakeLogs }),
      setMovementDetails: (movementDetails: any[]) => set({ movementDetails }),
      setPlayerInfo: (playerInfo: any[]) => set({ playerInfo }),
      setTitleGame: (titleGame: string) => set({ titleGame }),
      setSavedMistakes: (savedMistakes: any[]) => set({ savedMistakes }),
      setPreviousAnalyses(previousAnalyses) {
        set({ previousAnalyses });
      },
      setPreviousAnalysesDetail(previousAnalysesDetail) {
        set({ previousAnalysesDetail });
      },
      setGamesData: (games: Game[]) =>
        set({
          gamesData: games,
          gamesLastFetched: Date.now(),
        }),

      setOtherGamesData: (games: Game[]) =>
        set({
          otherGamesData: games,
          otherGamesLastFetched: Date.now(),
        }),

      clearGamesData: () =>
        set({
          gamesData: [],
          gamesLastFetched: null,
        }),

      clearOtherGamesData: () =>
        set({
          otherGamesData: [],
          otherGamesLastFetched: null,
        }),

      setAnalyticsData: (data: any) =>
        set({
          analyticsData: data,
          analyticsLastFetched: Date.now(),
        }),

      clearAnalyticsData: () =>
        set({
          analyticsData: null,
          analyticsLastFetched: null,
        }),

      resetAnalyticsState: () =>
        set({
          analyticsLastFetched: Date.now(),
        }),

      setPerformanceData: (data: any) =>
        set({
          performanceData: data,
          performanceLastFetched: Date.now(),
        }),

      clearPerformanceData: () =>
        set({
          performanceData: null,
          performanceLastFetched: null,
        }),

      resetPerformanceState: () =>
        set({
          performanceLastFetched: Date.now(),
        }),

      clearAll: () =>
        set({
          pgn: "",
          username: "",
          usernameAnalysis: "",
          dataAnalysis: null,
          isLoading: false,
          lastFetchTimestamp: 0,
          gamesData: [],
          gamesLastFetched: null,
          analyticsData: null,
          analyticsLastFetched: null,
          performanceData: null,
          performanceLastFetched: null,
          error: null,
          dataGamesImport: null,
          dataGames: null,
          capturedWhite: [],
          capturedBlack: [],
          hideDiv: false,
          otherGamesData: [],
          otherGamesLastFetched: null,
          openingPlayed: [],
          importedGames: [],
        }),

      addImportedGame: (gameData) => {
        const newId = `imported_user_${Date.now()}_${Math.random()}`;

        const newGame: Game = {
          ...gameData,
          id: newId,
        };

        set((state) => ({
          importedGames: [newGame, ...state.importedGames],
          gamesData: [newGame, ...state.gamesData],
          gamesLastFetched: Date.now(),
        }));
        return newGame;
      },

      addOtherImportedGame: (gameData) => {
        const newId = `imported_other_${Date.now()}_${Math.random()}`;

        const newGame: Game = {
          ...gameData,
          id: newId,
          source: gameData.source || "PGN Upload",
          gameFormat: gameData.gameFormat || "PGN Upload",
        };

        set((state) => ({
          importedGames: [newGame, ...state.importedGames],
          otherGamesData: [newGame, ...state.otherGamesData],
          otherGamesLastFetched: Date.now(),
        }));

        return newGame;
      },
    }),
    {
      name: "pgn-session-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },

      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        dataAnalysis: state.dataAnalysis,
        isLoading: state.isLoading,
        username: state.username,
        usernameAnalysis: state.usernameAnalysis,
        pgn: state.pgn,
        openingPlayed: state.openingPlayed,
        gamesData: state.gamesData,
        gamesLastFetched: state.gamesLastFetched,
        otherGamesData: state.otherGamesData,
        otherGamesLastFetched: state.otherGamesLastFetched,
        analyticsData: state.analyticsData,
        analyticsLastFetched: state.analyticsLastFetched,
        performanceData: state.performanceData,
        performanceLastFetched: state.performanceLastFetched,
        importedGames: state.importedGames,
      }),
    }
  )
);
