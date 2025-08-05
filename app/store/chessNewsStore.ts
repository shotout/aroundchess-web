import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CACHE_DURATION_MS = 60 * 60 * 1000;

interface ChessNewsState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  categories: any[];
  setCategories: (cats: any[]) => void;
  chessNews: Record<string, { data: any[]; fetchedAt: number }>;
  setChessNews: (key: string, data: any[]) => void;
  fetchChessNews: (
    categoryId: number | null,
    searchTerm: string,
    fetchFn: (params: any) => Promise<{ data: any[] }>
  ) => Promise<void>;
  savedArticles: any[];
  setSavedArticles: (a: any[]) => void;
  detailNews: any;
  setDetailNews: (d: any) => void;
  detailNewsFetchedAt?: number;
  setDetailNewsFetchedAt: (t: number) => void;
  mostReadsArticle: any[];
  setMostReadsArticle: (a: any[]) => void;
  mostReadsFetchedAt?: number;
  setMostReadsFetchedAt: (t: number) => void;
}

export const useChessNewsStore = create<ChessNewsState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      categories: [],
      setCategories: (cats) => set({ categories: cats }),
      chessNews: {},
      setChessNews: (key, data) =>
        set((s) => ({
          chessNews: {
            ...s.chessNews,
            [key]: { data, fetchedAt: Date.now() },
          },
        })),
      fetchChessNews: async (categoryId, searchTerm, fetchFn) => {
        const key = categoryId === null ? "all" : String(categoryId);
        const entry = get().chessNews[key];
        const now = Date.now();
        if (!searchTerm && entry && now - entry.fetchedAt < CACHE_DURATION_MS) {
          return;
        }
        set({ isLoading: true });
        const params: any = {};
        if (categoryId !== null) params.categoryId = categoryId;
        if (searchTerm) params.search = searchTerm;

        try {
          const resp = await fetchFn(params);
          set((s) => ({
            chessNews: {
              ...s.chessNews,
              [key]: { data: resp.data, fetchedAt: Date.now() },
            },
            isLoading: false,
          }));
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },
      savedArticles: [],
      setSavedArticles: (a) => set({ savedArticles: a }),
      detailNews: {},
      setDetailNews: (d) => set({ detailNews: d }),
      detailNewsFetchedAt: undefined,
      setDetailNewsFetchedAt: (t) => set({ detailNewsFetchedAt: t }),
      mostReadsArticle: [],
      setMostReadsArticle: (a) => set({ mostReadsArticle: a }),
      mostReadsFetchedAt: undefined,
      setMostReadsFetchedAt: (t) => set({ mostReadsFetchedAt: t }),
    }),
    {
      name: "chess-news-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chessNews: state.chessNews,
        savedArticles: state.savedArticles,
        categories: state.categories,
        detailNews: state.detailNews,
        detailNewsFetchedAt: state.detailNewsFetchedAt,
        mostReadsArticle: state.mostReadsArticle,
        mostReadsFetchedAt: state.mostReadsFetchedAt,
      }),
    }
  )
);
