import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ChessLesson,
  ChessLessonState,
  DifficultyFilter,
  LessonType,
  Pagination,
} from "./ChessLessonTypes";

interface CreateStoreOptions {
  storeName: string;
  lessonType: LessonType;
  apiEndpoint: string;
}

/**
 * Factory function to create a Zustand store for a specific chess lesson type
 */
export function createChessLessonStore<T extends ChessLesson>({
  storeName,
  lessonType,
  apiEndpoint,
}: CreateStoreOptions) {
  return create<ChessLessonState<T>>()(
    persist(
      (set, get) => ({
        allLessons: [],
        filteredLessons: [],
        lessonDetails: {},
        pagination: null,
        difficultyFilter: null,
        searchTerm: "",
        isLoading: false,
        isLoadingMore: false,
        error: null,
        initialized: false,

        applyFilters: () => {
          const { allLessons, difficultyFilter, searchTerm, filteredLessons } =
            get();

          // Early return if there are no filters and we already have the same array reference
          if (
            !difficultyFilter &&
            !searchTerm &&
            filteredLessons === allLessons
          ) {
            return;
          }

          // Return all lessons if no filters are applied
          if (!difficultyFilter && !searchTerm) {
            set({ filteredLessons: allLessons });
            return;
          }

          const searchTermLower = searchTerm.toLowerCase();

          const filtered = allLessons.filter((lesson) => {
            const difficultyMatch =
              !difficultyFilter || lesson.difficulty === difficultyFilter;

            if (!difficultyMatch || !searchTermLower) {
              return difficultyMatch;
            }

            return lesson.title.toLowerCase().includes(searchTermLower);
          });

          // Only set state if the filtered result is different
          if (JSON.stringify(filtered) !== JSON.stringify(filteredLessons)) {
            set({ filteredLessons: filtered });
          }
        },

        setDifficultyFilter: (difficulty: DifficultyFilter) => {
          set({ difficultyFilter: difficulty });
          get().applyFilters();
        },

        setSearchTerm: (term: string) => {
          set({ searchTerm: term });
          get().applyFilters();
        },

        fetchAllLessons: async (sessionId?: string) => {
          if (get().initialized && get().allLessons.length > 0) {
            get().applyFilters();
            return;
          }

          try {
            set({ isLoading: true, error: null });

            const apiBaseUrl = process.env.BASE_URL;
            const initialUrl = `${apiBaseUrl}/${apiEndpoint}?page=1&limit=100&category=${lessonType}`;

            const headers: HeadersInit = {};
            if (sessionId) {
              headers["Authorization"] = `Bearer ${sessionId}`;
            }

            const initialResponse = await fetch(initialUrl, { headers });

            if (!initialResponse.ok) {
              throw new Error(`API Error: ${initialResponse.status}`);
            }

            const initialData = await initialResponse.json();
            let allData: T[] = [...initialData.data];

            const totalPages = initialData.pagination.totalPages;

            if (totalPages > 1) {
              set({ isLoadingMore: true });

              const remainingRequests = [];
              for (let page = 2; page <= totalPages; page++) {
                const url = `${apiBaseUrl}/${apiEndpoint}?page=${page}&limit=100&category=${lessonType}`;
                remainingRequests.push(
                  fetch(url, { headers })
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(
                          `API Error on page ${page}: ${response.status}`
                        );
                      }
                      return response.json();
                    })
                    .then((data) => data.data)
                );
              }

              try {
                const remainingData = await Promise.all(remainingRequests);
                allData = [...allData, ...remainingData.flat()];
              } catch (fetchError) {
                console.error("Error fetching additional pages:", fetchError);
              }

              set({ isLoadingMore: false });
            }

            allData.sort((a, b) => {
              const difficultyOrder = [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert",
              ];
              return (
                difficultyOrder.indexOf(a.difficulty) -
                difficultyOrder.indexOf(b.difficulty)
              );
            });

            const pagination: Pagination = {
              ...initialData.pagination,
              total: allData.length,
            };

            set({
              allLessons: allData,
              filteredLessons: allData,
              pagination,
              isLoading: false,
              initialized: true,
            });
          } catch (error) {
            console.error(`Error fetching all ${lessonType}s:`, error);
            set({
              error:
                error instanceof Error
                  ? error.message
                  : `Failed to fetch all ${lessonType}s`,
              isLoading: false,
              isLoadingMore: false,
            });
          }
        },

        fetchLessonDetails: async (id: string, sessionId?: string) => {
          try {
            const existingLesson = get().lessonDetails[id];
            if (existingLesson) {
              return existingLesson;
            }

            const lessonFromAll = get().allLessons.find((l) => l.id === id);
            if (lessonFromAll) {
              set((state) => ({
                lessonDetails: { ...state.lessonDetails, [id]: lessonFromAll },
              }));
              return lessonFromAll;
            }

            set({ isLoading: true, error: null });

            const apiBaseUrl = process.env.BASE_URL;
            const apiUrl = `${apiBaseUrl}/${apiEndpoint}/${id}`;

            const headers: HeadersInit = {};
            if (sessionId) {
              headers["Authorization"] = `Bearer ${sessionId}`;
            }

            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            set((state) => ({
              lessonDetails: { ...state.lessonDetails, [id]: data.data },
              isLoading: false,
            }));
            return data.data;
          } catch (error) {
            console.error(
              `Error fetching ${lessonType} details for ${id}:`,
              error
            );
            set({
              error:
                error instanceof Error
                  ? error.message
                  : `Failed to fetch ${lessonType} details for ${id}`,
              isLoading: false,
            });
            return null;
          }
        },

        reset: () => {
          set({
            filteredLessons: get().allLessons,
            difficultyFilter: null,
            searchTerm: "",
            isLoading: false,
            error: null,
          });
        },
      }),
      {
        name: storeName,
        partialize: (state) => ({
          allLessons: state.allLessons,
          lessonDetails: state.lessonDetails,
          initialized: state.initialized,
        }),
      }
    )
  );
}
