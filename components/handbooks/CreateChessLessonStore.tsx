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

// Extended state to include read status
interface ExtendedChessLessonState<T extends ChessLesson>
  extends ChessLessonState<T> {
  readStatusMap: Record<string, boolean>;
  checkReadStatus: (id: string, sessionId?: string) => Promise<boolean>;
  isLoadingDetails: Record<string, boolean>;
}

export function createChessLessonStore<T extends ChessLesson>({
  storeName,
  lessonType,
  apiEndpoint,
}: CreateStoreOptions) {
  return create<ExtendedChessLessonState<T>>()(
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
        // New fields for optimized fetching
        readStatusMap: {},
        isLoadingDetails: {},

        applyFilters: () => {
          const { allLessons, difficultyFilter, searchTerm, filteredLessons } =
            get();

          if (
            !difficultyFilter &&
            !searchTerm &&
            filteredLessons === allLessons
          ) {
            return;
          }

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
            // Increase limit to reduce the number of pagination requests
            const initialUrl = `${apiBaseUrl}/${apiEndpoint}?page=1&limit=250&category=${lessonType}`;

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

            // Only fetch additional pages if there are more than one page and we didn't get all data
            if (
              totalPages > 1 &&
              initialData.pagination.total > initialData.data.length
            ) {
              set({ isLoadingMore: true });

              // Batch requests in groups of 3 to avoid overwhelming the server
              const remainingPages = Array.from(
                { length: totalPages - 1 },
                (_, i) => i + 2
              );
              const batchSize = 3;

              for (let i = 0; i < remainingPages.length; i += batchSize) {
                const currentBatch = remainingPages.slice(i, i + batchSize);
                const batchRequests = currentBatch.map((page) => {
                  const url = `${apiBaseUrl}/${apiEndpoint}?page=${page}&limit=250&category=${lessonType}`;
                  return fetch(url, { headers })
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(
                          `API Error on page ${page}: ${response.status}`
                        );
                      }
                      return response.json();
                    })
                    .then((data) => data.data);
                });

                try {
                  const batchData = await Promise.all(batchRequests);
                  allData = [...allData, ...batchData.flat()];
                } catch (fetchError) {
                  console.error("Error fetching batch:", fetchError);
                  // Continue with what we have instead of failing completely
                }
              }

              set({ isLoadingMore: false });
            }

            // Sort by difficulty
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
          const { lessonDetails, isLoadingDetails } = get();

          // If we already have the lesson and it's not currently loading, return it
          if (lessonDetails[id] && !isLoadingDetails[id]) {
            return lessonDetails[id];
          }

          // If we're already loading this lesson, wait for it to complete
          if (isLoadingDetails[id]) {
            // Wait for the loading to complete by checking every 100ms
            const waitForLoading = () => {
              return new Promise<T | null>((resolve) => {
                const checkLoading = () => {
                  const currentState = get();
                  if (!currentState.isLoadingDetails[id]) {
                    resolve(currentState.lessonDetails[id] || null);
                  } else {
                    setTimeout(checkLoading, 100);
                  }
                };
                checkLoading();
              });
            };

            return waitForLoading();
          }

          try {
            // Mark this lesson as loading
            set((state) => ({
              isLoadingDetails: { ...state.isLoadingDetails, [id]: true },
            }));

            const apiBaseUrl = process.env.BASE_URL;
            const apiUrl = `${apiBaseUrl}/handbooks/${id}`;

            const headers: HeadersInit = {};
            if (sessionId) {
              headers["Authorization"] = `Bearer ${sessionId}`;
            }

            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData.success || !responseData.data) {
              throw new Error("Invalid response structure from API");
            }

            // Also check read status while we're at it
            get().checkReadStatus(id, sessionId);

            set((state) => ({
              lessonDetails: {
                ...state.lessonDetails,
                [id]: responseData.data,
              },
              isLoadingDetails: { ...state.isLoadingDetails, [id]: false },
            }));

            return responseData.data;
          } catch (error) {
            console.error(
              `Error fetching ${lessonType} details for ${id}:`,
              error
            );
            set((state) => ({
              error:
                error instanceof Error
                  ? error.message
                  : `Failed to fetch ${lessonType} details for ${id}`,
              isLoadingDetails: { ...state.isLoadingDetails, [id]: false },
            }));
            return null;
          }
        },

        // New method to check and update read status
        checkReadStatus: async (id: string, sessionId?: string) => {
          // If we don't have a session ID, we can't check read status
          if (!sessionId) {
            return false;
          }

          // If we already know the read status, return it
          const { readStatusMap } = get();
          if (readStatusMap[id] !== undefined) {
            return readStatusMap[id];
          }

          try {
            const apiBaseUrl = process.env.BASE_URL;
            const apiUrl = `${apiBaseUrl}/api/handbooks/read/`;

            const headers: HeadersInit = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionId}`,
            };

            const response = await fetch(apiUrl, {
              method: "POST",
              headers,
              body: JSON.stringify({ handbookId: id }),
            });

            if (response.ok) {
              const data = await response.json();

              set((state) => ({
                readStatusMap: {
                  ...state.readStatusMap,
                  [id]: !!data.isRead,
                },
              }));

              return !!data.isRead;
            } else {
              console.log(
                "Book read status check failed:",
                await response.json()
              );
              return false;
            }
          } catch (error) {
            console.error("Error checking read status:", error);
            return false;
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
          readStatusMap: state.readStatusMap, // Persist read status
        }),
      }
    )
  );
}
