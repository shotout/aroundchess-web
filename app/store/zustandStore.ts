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
  playerColor?: string;
  gameFormat: string;
  pgn: string;
  timeClass?: string;
}

export interface AnalysisResult {
  [key: string]: any;
}

export interface GameStatistics {
  bestWin: {
    opponent: string;
    rating: number;
    date: string;
  };
  winRate: {
    percentage: number;
    monthlyChange: number;
  };
  averageEloRating: {
    rating: number;
    monthlyChange: number;
  };
  totalGames: {
    count: number;
    monthlyChange: number;
  };
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

const defaultPaginationState: PaginationState = {
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  hasMore: false,
  isLoadingMore: false,
};

interface PgnState {
  profileShow: any;
  setProfileShow: (profile: any) => void;

  tab: string;
  setTab: (state: string) => void;

  tabSelected: string;
  setTabSelected: (state: string) => void;

  activeState: string;
  setActiveState: (state: string) => void;

  activeUser: string;
  setActiveUser: (state: string) => void;

  pgn: string;
  username: string;
  usernameAnalysis: string;
  dataAnalysis: AnalysisResult | null;
  isLoading: boolean;
  lastFetchTimestamp: number;
  hideDiv: boolean;
  hasAnalyzedGame: boolean;
  isFromGameHistory: boolean;
  isFromAnalyzeDifferentGame: boolean;
  lastAnalysisFetched: boolean;
  isLastAnalysisLoading: boolean;

  gamesData: Game[];
  gamesLastFetched: number | null;
  gamesPagination: PaginationState;

  otherGamesData: Game[];
  otherGamesLastFetched: number | null;
  otherGamesPagination: PaginationState;

  analyticsData: any | null;
  analyticsLastFetched: number | null;

  performanceData: any | null;
  performanceLastFetched: number | null;

  statisticsData: GameStatistics | null;
  statisticsLastFetched: number | null;

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

  importedGames: Game[];

  isOpenTutorial: boolean;
  setIsOpenTutorial: (isOpenTutorial: boolean) => void;
  openingPlayed: any[];
  setOpeningPlayed: (openingPlayed: any[]) => void;

  lastFetchTime: number | null;
  isFetching: boolean;
  cacheExpiryTime: number;
  setLastFetchTime: (time: number) => void;
  setIsFetching: (fetching: boolean) => void;
  shouldRefetch: () => boolean;

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
  setHasAnalyzedGame: (hasAnalyzedGame: boolean) => void;

  setIsFromAnalyzeDifferentGame: (isFromAnalyzeDifferentGame: boolean) => void;
  setIsFromGameHistory: (isFromGameHistory: boolean) => void;
  clearGameHistoryData: () => void;
  setLastAnalysisFetched: (fetched: boolean) => void;
  setIsLastAnalysisLoading: (loading: boolean) => void;

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
  appendGamesData: (games: Game[]) => void;
  appendOtherGamesData: (games: Game[]) => void;
  clearGamesData: () => void;
  clearOtherGamesData: () => void;

  setGamesPagination: (pagination: PaginationState) => void;
  setOtherGamesPagination: (pagination: PaginationState) => void;

  setAnalyticsData: (data: any) => void;
  clearAnalyticsData: () => void;
  resetAnalyticsState: () => void;

  setPerformanceData: (data: any) => void;
  clearPerformanceData: () => void;
  resetPerformanceState: () => void;

  setStatisticsData: (data: GameStatistics) => void;
  clearStatisticsData: () => void;

  providerType: string;
  setProviderType: (arg0: string) => void;

  clearAll: () => void;

  addImportedGame: (game: Omit<Game, "id">) => Game;
  addOtherImportedGame: (game: Omit<Game, "id">) => Game;
  hydrated: boolean;
  setHydrated: () => void;
}

export const usePgnStore = create<PgnState>()(
  persist(
    (set, get) => ({
      profileShow: {},
      setProfileShow: (profileShow) => set({ profileShow }),

      tab: "Games",
      setTab: (tab: string) => set({ tab }),

      tabSelected: "saved",
      setTabSelected: (tabSelected: string) => set({ tabSelected }),

      activeState: "My Training Plan",
      setActiveState: (activeState: string) => set({ activeState }),

      activeUser: "user",
      setActiveUser: (activeUser: string) => set({ activeUser }),

      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      pgn: "",
      username: "",
      usernameAnalysis: "",
      dataAnalysis: null,
      isLoading: false,
      lastFetchTimestamp: 0,
      hideDiv: false,
      hasAnalyzedGame: false,
      isFromAnalyzeDifferentGame: false,
      isFromGameHistory: false,
      lastAnalysisFetched: false,
      isLastAnalysisLoading: false,

      gamesData: [],
      gamesLastFetched: null,
      gamesPagination: defaultPaginationState,

      otherGamesData: [],
      otherGamesLastFetched: null,
      otherGamesPagination: defaultPaginationState,

      analyticsData: null,
      analyticsLastFetched: null,

      performanceData: null,
      performanceLastFetched: null,

      statisticsData: null,
      statisticsLastFetched: null,

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

      importedGames: [],

      isOpenTutorial: false,
      setIsOpenTutorial: (isOpenTutorial: boolean) => set({ isOpenTutorial }),
      openingPlayed: [],
      setOpeningPlayed: (openingPlayed: any) => set({ openingPlayed }),

      lastFetchTime: null,
      isFetching: false,
      cacheExpiryTime: 10000,

      setLastFetchTime: (time: number) => set({ lastFetchTime: time }),
      setIsFetching: (fetching: boolean) => set({ isFetching: fetching }),
      shouldRefetch: () => {
        const { lastFetchTime, cacheExpiryTime } = get();
        if (!lastFetchTime) return true;
        return Date.now() - lastFetchTime > cacheExpiryTime;
      },

      providerType: "",
      setProviderType: (providerType: string) => set({ providerType }),

      setPgn: (pgn: string) => set({ pgn }),

      setUsername: (username: string) =>
        set((state) => {
          const isActualUsernameChange =
            username !== state.username && state.username !== "";
          return {
            username,
            lastFetchTimestamp: isActualUsernameChange
              ? Date.now()
              : state.lastFetchTimestamp,
            // lastAnalysisFetched: isActualUsernameChange
            //   ? false
            //   : state.lastAnalysisFetched,
          };
        }),
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
        set({ dataAnalysis, hasAnalyzedGame: dataAnalysis !== null }),

      setIsLoading: (isLoading: boolean) => set({ isLoading }),

      setHasAnalyzedGame: (hasAnalyzedGame: boolean) =>
        set({ hasAnalyzedGame }),

      setIsFromAnalyzeDifferentGame: (isFromAnalyzeDifferentGame: boolean) =>
        set({ isFromAnalyzeDifferentGame }),
      setIsFromGameHistory: (isFromGameHistory: boolean) =>
        set({ isFromGameHistory }),

      setLastAnalysisFetched: (lastAnalysisFetched: boolean) =>
        set({ lastAnalysisFetched }),

      setIsLastAnalysisLoading: (isLastAnalysisLoading: boolean) =>
        set({ isLastAnalysisLoading }),

      clearGameHistoryData: () =>
        set({
          pgn: "",
          dataAnalysis: null,
          dataGamesImport: null,
          isFromGameHistory: false,
        }),

      resetFetchState: () =>
        set({
          lastFetchTimestamp: Date.now(),
          gamesLastFetched: null,
          otherGamesLastFetched: null,
          analyticsLastFetched: null,
          performanceLastFetched: null,
          statisticsLastFetched: null,
          gamesData: [],
          otherGamesData: [],
          gamesPagination: defaultPaginationState,
          otherGamesPagination: defaultPaginationState,
        }),

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

      appendGamesData: (games: Game[]) =>
        set((state) => ({
          gamesData: [...state.gamesData, ...games],
          gamesLastFetched: Date.now(),
        })),

      appendOtherGamesData: (games: Game[]) =>
        set((state) => ({
          otherGamesData: [...state.otherGamesData, ...games],
          otherGamesLastFetched: Date.now(),
        })),

      clearGamesData: () =>
        set({
          gamesData: [],
          gamesLastFetched: null,
          gamesPagination: defaultPaginationState,
        }),

      clearOtherGamesData: () =>
        set({
          otherGamesData: [],
          otherGamesLastFetched: null,
          otherGamesPagination: defaultPaginationState,
        }),

      setGamesPagination: (pagination: PaginationState) =>
        set({ gamesPagination: pagination }),

      setOtherGamesPagination: (pagination: PaginationState) =>
        set({ otherGamesPagination: pagination }),

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

      setStatisticsData: (data: GameStatistics) =>
        set({
          statisticsData: data,
          statisticsLastFetched: Date.now(),
        }),

      clearStatisticsData: () =>
        set({
          statisticsData: null,
          statisticsLastFetched: null,
        }),

      clearAll: () =>
        set({
          tab: "Games",
          tabSelected: "saved",
          activeState: "My Training Plan",
          activeUser: "user",
          pgn: "",
          username: "",
          usernameAnalysis: "",
          dataAnalysis: null,
          isLoading: false,
          lastFetchTimestamp: 0,
          hasAnalyzedGame: false,
          isFromGameHistory: false,
          lastAnalysisFetched: false,
          isLastAnalysisLoading: false,
          gamesData: [],
          gamesLastFetched: null,
          gamesPagination: defaultPaginationState,
          analyticsData: null,
          analyticsLastFetched: null,
          performanceData: null,
          performanceLastFetched: null,
          statisticsData: null,
          statisticsLastFetched: null,
          error: null,
          dataGamesImport: null,
          dataGames: null,
          capturedWhite: [],
          capturedBlack: [],
          hideDiv: false,
          otherGamesData: [],
          otherGamesLastFetched: null,
          otherGamesPagination: defaultPaginationState,
          openingPlayed: [],
          importedGames: [],
          providerType: "",
          lastFetchTime: null,
          isFetching: false,
          previousAnalyses: [],
          previousAnalysesDetail: null,
          historyGame: [],
          mistakeLogs: [],
          movementDetails: null,
          playerInfo: null,
          profileShow: null,
        }),

      addImportedGame: (gameData) => {
        const newId = `imported_user_${Date.now()}_${Math.random()}`;

        const newGame: Game = {
          ...gameData,
          id: newId,
        };

        set((state) => ({
          importedGames: [
            newGame,
            ...state.importedGames
          ],
          gamesData: [
            newGame,
            ...state.gamesData.filter(
              (g) =>
                g.opponent != gameData.opponent && g.moves != gameData.moves
            ),
          ],
          gamesLastFetched: Date.now(),
          gamesPagination: {
            ...state.gamesPagination,
            total: state.gamesPagination.total + 1,
          },
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
          playerColor: gameData.color || gameData.playerColor || "White",
          timeClass: gameData.timeClass || "Unknown",
        };

        set((state) => ({
          importedGames: [newGame, ...state.importedGames],
          otherGamesData: [newGame, ...state.otherGamesData.slice(0, 4)],
          otherGamesLastFetched: Date.now(),
          otherGamesPagination: {
            ...state.otherGamesPagination,
            total: state.otherGamesPagination.total + 1,
          },
        }));

        return newGame;
      },
    }),
    {
      name: "pgn-local-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },

      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dataAnalysis: state.dataAnalysis,
        isLoading: state.isLoading,
        username: state.username,
        usernameAnalysis: state.usernameAnalysis,
        pgn: state.pgn,
        hasAnalyzedGame: state.hasAnalyzedGame,
        isFromGameHistory: state.isFromGameHistory,
        lastAnalysisFetched: state.lastAnalysisFetched,
        openingPlayed: state.openingPlayed,
        gamesData: state.gamesData,
        gamesLastFetched: state.gamesLastFetched,
        gamesPagination: state.gamesPagination,
        otherGamesData: state.otherGamesData,
        otherGamesLastFetched: state.otherGamesLastFetched,
        otherGamesPagination: state.otherGamesPagination,
        analyticsData: state.analyticsData,
        analyticsLastFetched: state.analyticsLastFetched,
        performanceData: state.performanceData,
        performanceLastFetched: state.performanceLastFetched,
        statisticsData: state.statisticsData,
        statisticsLastFetched: state.statisticsLastFetched,
        importedGames: state.importedGames,
        providerType: state.providerType,
        activeState: state.activeState,
        activeUser: state.activeUser,
        lastFetchTime: state.lastFetchTime,
        savedMistakes: state.savedMistakes,
        previousAnalyses: state.previousAnalyses,
        previousAnalysesDetail: state.previousAnalysesDetail,
        mistakeLogs: state.mistakeLogs,
        movementDetails: state.movementDetails,
        playerInfo: state.playerInfo,
        titleGame: state.titleGame,
        historyGame: state.historyGame,
        capturedWhite: state.capturedWhite,
        capturedBlack: state.capturedBlack,
        tabSelected: state.tabSelected,
        tab: state.tab,
        profileShow: state.profileShow,
      }),
    }
  )
);
