import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ChessLesson,
  ChessLessonState,
  DifficultyFilter,
  LessonType,
  Pagination,
} from "./ChessLessonTypes";
import { useProfileStore } from "@/app/store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import { toast } from "sonner";

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
  isCheckingReadStatus: boolean;
  fetchReadStatuses: (sessionId?: string) => Promise<void>;
  set: any;
}

const handleSessionExpiration = () => {
  const { clearAll } = useProfileStore.getState();
  clearAll();

  localStorage.removeItem("token");
  setPersistedCookie("token", "", 0);

  toast.error("Your session has expired. Please log in again.");
  window.location.href = "/login";
};

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
        isCheckingReadStatus: false,
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
            if (sessionId != "") {
              headers["Authorization"] = `Bearer ${sessionId}`;
            }

            const initialResponse = await fetch(initialUrl, { headers });

            if (initialResponse.status === 401) {
              handleSessionExpiration();
              return;
            }

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
              const batchSize = 3; // Batch size of 3 as requested

              for (let i = 0; i < remainingPages.length; i += batchSize) {
                const currentBatch = remainingPages.slice(i, i + batchSize);

                try {
                  const batchPromises = currentBatch.map(async (page) => {
                    const url = `${apiBaseUrl}/${apiEndpoint}?page=${page}&limit=250&category=${lessonType}`;
                    const response = await fetch(url, { headers });

                    if (!response.ok) {
                      throw new Error(
                        `API Error on page ${page}: ${response.status}`
                      );
                    }

                    const data = await response.json();
                    return data.data;
                  });

                  const batchResults = await Promise.all(batchPromises);

                  for (const pageData of batchResults) {
                    allData = [...allData, ...pageData];
                  }

                  // Update progress indicator
                  // const progress = Math.min(
                  //   100,
                  //   Math.round(((i + batchSize) / remainingPages.length) * 100)
                  // );
                } catch (batchError) {}
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

            const lessonsWithoutReadStatus = allData.map((lesson) => ({
              ...lesson,
              readStatus: undefined,
            }));

            set({
              allLessons: lessonsWithoutReadStatus,
              filteredLessons: lessonsWithoutReadStatus,
              pagination,
              isLoading: false,
              initialized: true,
            });

            if (sessionId != "") {
              get().fetchReadStatuses(sessionId);
            }
          } catch (error) {
            if (error instanceof Error && error.message.includes("401")) {
              handleSessionExpiration();
              return;
            }
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

        fetchReadStatuses: async (sessionId?: string) => {
          if (!sessionId) return;

          try {
            set({ isCheckingReadStatus: true });

            const { allLessons } = get();

            const batchSize = 5;
            const readStatusMap: Record<string, boolean> = {};

            for (let i = 0; i < allLessons.length; i += batchSize) {
              const currentBatch = allLessons.slice(i, i + batchSize);
              const batchPromises = currentBatch.map((lesson) =>
                get().checkReadStatus(lesson.id, sessionId)
              );

              const batchResults = await Promise.all(batchPromises);

              currentBatch.forEach((lesson, index) => {
                readStatusMap[lesson.id] = batchResults[index] || false;
              });

              set((state) => ({
                allLessons: state.allLessons.map((lesson) =>
                  readStatusMap[lesson.id] !== undefined
                    ? { ...lesson, readStatus: readStatusMap[lesson.id] }
                    : lesson
                ),
                filteredLessons: state.filteredLessons.map((lesson) =>
                  readStatusMap[lesson.id] !== undefined
                    ? { ...lesson, readStatus: readStatusMap[lesson.id] }
                    : lesson
                ),
                readStatusMap: {
                  ...state.readStatusMap,
                  ...readStatusMap,
                },
              }));
            }

            set({ isCheckingReadStatus: false });
          } catch (error) {
            set({ isCheckingReadStatus: false });
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
            if (sessionId != "") {
              headers["Authorization"] = `Bearer ${sessionId}`;
            }

            const response = await fetch(apiUrl, { headers });

            if (response.status === 401) {
              handleSessionExpiration();
              return null;
            }

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData.success || !responseData.data) {
              throw new Error("Invalid response structure from API");
            }

            const lessonData = {
              ...responseData.data,
              readStatus: undefined,
            };

            set((state) => ({
              lessonDetails: {
                ...state.lessonDetails,
                [id]: lessonData,
              },
              isLoadingDetails: { ...state.isLoadingDetails, [id]: false },
            }));

            if (sessionId != "") {
              const isRead = await get().checkReadStatus(id, sessionId);

              set((state) => ({
                lessonDetails: {
                  ...state.lessonDetails,
                  [id]: {
                    ...state.lessonDetails[id],
                    readStatus: isRead,
                  },
                },
              }));
            }

            return lessonData;
          } catch (error) {
            if (error instanceof Error && error.message.includes("401")) {
              handleSessionExpiration();
              return null;
            }
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

              return !!data.isRead;
            } else {
              return false;
            }
          } catch (error) {
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
