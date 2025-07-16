import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChessNewsState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  chessNews: { [categoryId: string]: { data: any[]; fetchedAt: number } };
  setChessNews: (categoryId: string, data: any[]) => void;
  savedArticles: any[];
  setSavedArticles: (savedArticles: any[]) => void;
  detailNews: any;
  setDetailNews: (detailNews: any) => void;
  detailNewsFetchedAt?: number;
  setDetailNewsFetchedAt: (timestamp: number) => void;
  mostReadsArticle: any;
  setMostReadsArticle: (mostReadsArticle: any) => void;
  mostReadsFetchedAt?: number;
  setMostReadsFetchedAt: (timestamp: number) => void;
}

export const useChessNewsStore = create<ChessNewsState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      categories: [],
      setCategories: (categories) => set({ categories }),
      chessNews: {},
      setChessNews: (categoryId, data) =>
        set((state) => ({
          chessNews: {
            ...state.chessNews,
            [categoryId]: { data, fetchedAt: Date.now() },
          },
        })),
      savedArticles: [],
      setSavedArticles: (savedArticles) => set({ savedArticles }),
      detailNews: {},
      setDetailNews: (detailNews) => set({ detailNews }),
      detailNewsFetchedAt: undefined,
      setDetailNewsFetchedAt: (timestamp) => set({ detailNewsFetchedAt: timestamp }),
      mostReadsArticle: [],
      setMostReadsArticle: (mostReadsArticle) => set({ mostReadsArticle }),
      mostReadsFetchedAt: undefined,
      setMostReadsFetchedAt: (timestamp) => set({ mostReadsFetchedAt: timestamp }),
    }),
    {
      name: "chess-news-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chessNews: state.chessNews,
        detailNews: state.detailNews,
        detailNewsFetchedAt: state.detailNewsFetchedAt,
        savedArticles: state.savedArticles,
        mostReadsArticle: state.mostReadsArticle,
        mostReadsFetchedAt: state.mostReadsFetchedAt,
        categories: state.categories,
      }),
    }
  )
);