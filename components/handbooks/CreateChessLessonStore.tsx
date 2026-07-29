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
import { refreshSession } from "@/functions/refresh-token";
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
  markLessonAsUnread: (id: string, sessionId?: string) => Promise<boolean>;
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

/** GET with the session token, renewing it on a 401 and replaying once — an
 *  expired access token must not end a session whose refresh token still
 *  works. Returns the response; only an outright rejected refresh signs out. */
const authedFetch = async (
  url: string,
  sessionId?: string
): Promise<Response> => {
  const send = (token?: string) =>
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

  const token = sessionId ? sessionId : undefined;
  const response = await send(token);
  if (response.status !== 401 || !token) return response;

  const refreshed = await refreshSession();
  if (refreshed.status === "refreshed") return send(refreshed.token);
  if (refreshed.status === "rejected") handleSessionExpiration();
  return response;
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
            // Use a high limit to fetch all in one go (adjust if your API has a max limit)
            const url = `${apiBaseUrl}/${apiEndpoint}?limit=1000&category=${lessonType}`;

            const response = await authedFetch(
              url,
              sessionId != "" ? sessionId : undefined
            );

            if (response.status === 401) {
              // authedFetch already renewed-and-replayed; still 401 means the
              // session was rejected (and handled) or the endpoint refused us.
              return;
            }

            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let allData: T[] = [...data.data];

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
              ...data.pagination,
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
            // No 401 sniffing here: authedFetch owns that decision. Matching on
            // the message text signed people out for any error that merely
            // mentioned "401".
            set({
              error:
                error instanceof Error
                  ? error.message
                  : `Failed to fetch all ${lessonType}s`,
              isLoading: false,
            });
          }
        },

        fetchReadStatuses: async (sessionId?: string) => {
          if (!sessionId) return;

          try {
            set({ isCheckingReadStatus: true });

            const { allLessons } = get();

            const readStatusPromises = allLessons.map((lesson) =>
              get().checkReadStatus(lesson.id, sessionId)
            );

            const readStatusResults = await Promise.all(readStatusPromises);

            const readStatusMap: Record<string, boolean> = {};
            allLessons.forEach((lesson, index) => {
              readStatusMap[lesson.id] = readStatusResults[index] || false;
            });

            set((state) => ({
              allLessons: state.allLessons.map((lesson) => ({
                ...lesson,
                readStatus: readStatusMap[lesson.id],
              })),
              filteredLessons: state.filteredLessons.map((lesson) => ({
                ...lesson,
                readStatus: readStatusMap[lesson.id],
              })),
              readStatusMap: {
                ...state.readStatusMap,
                ...readStatusMap,
              },
              isCheckingReadStatus: false,
            }));
          } catch (error) {
            console.error("Error fetching read statuses:", error);
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

            const response = await authedFetch(
              apiUrl,
              sessionId != "" ? sessionId : undefined
            );

            if (response.status === 401) {
              // See fetchAllLessons: the renew-and-replay already happened.
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
            // See fetchAllLessons — authedFetch decides on 401s.
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

        markLessonAsUnread: async (id: string, sessionId?: string) => {
          if (!sessionId) {
            return false;
          }

          try {
            const apiBaseUrl = process.env.BASE_URL;
            const apiUrl = `${apiBaseUrl}/handbooks/unread/`;

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

              // Update the read status map
              set((state) => ({
                readStatusMap: {
                  ...state.readStatusMap,
                  [id]: false,
                },
              }));

              // Update lesson details if it exists
              if (get().lessonDetails[id]) {
                set((state) => ({
                  lessonDetails: {
                    ...state.lessonDetails,
                    [id]: {
                      ...state.lessonDetails[id],
                      readStatus: false,
                    },
                  },
                }));
              }

              // Update all lessons and filtered lessons
              set((state) => ({
                allLessons: state.allLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: false } : lesson
                ),
                filteredLessons: state.filteredLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: false } : lesson
                ),
              }));

              return true;
            } else {
              const errorData = await response.json();
              console.error("Failed to mark lesson as unread:", errorData);

              // Even if the API call fails, update the local state
              set((state) => ({
                readStatusMap: {
                  ...state.readStatusMap,
                  [id]: false,
                },
              }));

              if (get().lessonDetails[id]) {
                set((state) => ({
                  lessonDetails: {
                    ...state.lessonDetails,
                    [id]: {
                      ...state.lessonDetails[id],
                      readStatus: false,
                    },
                  },
                }));
              }

              set((state) => ({
                allLessons: state.allLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: false } : lesson
                ),
                filteredLessons: state.filteredLessons.map((lesson) =>
                  lesson.id === id ? { ...lesson, readStatus: false } : lesson
                ),
              }));

              return true;
            }
          } catch (error) {
            console.error("Error marking lesson as unread:", error);

            set((state) => ({
              readStatusMap: {
                ...state.readStatusMap,
                [id]: false,
              },
              allLessons: state.allLessons.map((lesson) =>
                lesson.id === id ? { ...lesson, readStatus: false } : lesson
              ),
              filteredLessons: state.filteredLessons.map((lesson) =>
                lesson.id === id ? { ...lesson, readStatus: false } : lesson
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
          readStatusMap: state.readStatusMap,
        }),
      }
    )
  );
}
