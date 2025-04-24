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

interface ExtendedChessLessonState<T extends ChessLesson>
  extends ChessLessonState<T> {
  readStatusMap: Record<string, boolean>;
  checkReadStatus: (id: string, sessionId?: string) => Promise<boolean>;
  markLessonAsRead: (id: string, sessionId?: string) => Promise<boolean>;
  isLoadingDetails: Record<string, boolean>;
  set: any;
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
        readStatusMap: {},
        isLoadingDetails: {},
        set,

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

            if (
              totalPages > 1 &&
              initialData.pagination.total > initialData.data.length
            ) {
              set({ isLoadingMore: true });

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
                }
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

            if (sessionId) {
              const readStatusPromises = allData.map((lesson) =>
                get().checkReadStatus(lesson.id, sessionId)
              );

              const batchSize = 5;
              const readStatuses: boolean[] = [];

              for (let i = 0; i < readStatusPromises.length; i += batchSize) {
                const batch = readStatusPromises.slice(i, i + batchSize);
                const batchResults = await Promise.all(batch);
                readStatuses.push(...batchResults);
              }

              allData = allData.map((lesson, index) => ({
                ...lesson,
                readStatus: readStatuses[index] || false,
              }));
            }

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

          if (lessonDetails[id] && !isLoadingDetails[id]) {
            return lessonDetails[id];
          }

          if (isLoadingDetails[id]) {
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

            const isRead = await get().checkReadStatus(id, sessionId);

            const lessonData = {
              ...responseData.data,
              readStatus: isRead,
            };

            set((state) => ({
              lessonDetails: {
                ...state.lessonDetails,
                [id]: lessonData,
              },
              isLoadingDetails: { ...state.isLoadingDetails, [id]: false },
            }));

            return lessonData;
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

        checkReadStatus: async (id: string, sessionId?: string) => {
          if (!sessionId) {
            return false;
          }

          const { readStatusMap } = get();
          if (readStatusMap[id] !== undefined) {
            return readStatusMap[id];
          }

          try {
            const apiBaseUrl = process.env.BASE_URL;
            const apiUrl = `${apiBaseUrl}/handbooks/read/`;

            const headers: HeadersInit = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionId}`,
            };

            const response = await fetch(apiUrl, {
              method: "POST",
              headers,
              body: JSON.stringify({ id: id }),
            });

            if (response.ok) {
              const data = await response.json();

              set((state) => ({
                readStatusMap: {
                  ...state.readStatusMap,
                  [id]: !!data.isRead,
                },
              }));

              if (get().lessonDetails[id]) {
                set((state) => ({
                  lessonDetails: {
                    ...state.lessonDetails,
                    [id]: {
                      ...state.lessonDetails[id],
                      readStatus: !!data.isRead,
                    },
                  },
                }));
              }

              set((state) => ({
                allLessons: state.allLessons.map((lesson) =>
                  lesson.id === id
                    ? { ...lesson, readStatus: !!data.isRead }
                    : lesson
                ),
                filteredLessons: state.filteredLessons.map((lesson) =>
                  lesson.id === id
                    ? { ...lesson, readStatus: !!data.isRead }
                    : lesson
                ),
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

        markLessonAsRead: async (id: string, sessionId?: string) => {
          if (!sessionId) {
            return false;
          }

          try {
            const apiBaseUrl = process.env.BASE_URL;
            const apiUrl = `${apiBaseUrl}/handbooks/read/`;

            const headers: HeadersInit = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionId}`,
            };

            const response = await fetch(apiUrl, {
              method: "POST",
              headers,
              body: JSON.stringify({
                id: id,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              console.log("Mark as read response:", data);

              set((state) => ({
                readStatusMap: {
                  ...state.readStatusMap,
                  [id]: true,
                },
              }));

              if (get().lessonDetails[id]) {
                set((state) => ({
                  lessonDetails: {
                    ...state.lessonDetails,
                    [id]: {
                      ...state.lessonDetails[id],
                      readStatus: true,
                    },
                  },
                }));
              }

              set((state) => ({
                allLessons: state.allLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: true } : lesson
                ),
                filteredLessons: state.filteredLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: true } : lesson
                ),
              }));

              return true;
            } else {
              const errorData = await response.json();
              console.error("Failed to mark lesson as read:", errorData);

              set((state) => ({
                readStatusMap: {
                  ...state.readStatusMap,
                  [id]: true,
                },
              }));

              if (get().lessonDetails[id]) {
                set((state) => ({
                  lessonDetails: {
                    ...state.lessonDetails,
                    [id]: {
                      ...state.lessonDetails[id],
                      readStatus: true,
                    },
                  },
                }));
              }

              set((state) => ({
                allLessons: state.allLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: true } : lesson
                ),
                filteredLessons: state.filteredLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: true } : lesson
                ),
              }));

              return true;
            }
          } catch (error) {
            console.error("Error marking lesson as read:", error);

            set((state) => ({
              readStatusMap: {
                ...state.readStatusMap,
                [id]: true,
              },
              allLessons: state.allLessons.map((lesson) =>
                lesson.id === id ? { ...lesson, readStatus: true } : lesson
              ),
              filteredLessons: state.filteredLessons.map((lesson) =>
                lesson.id === id ? { ...lesson, readStatus: true } : lesson
              ),
            }));

            return true;
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
