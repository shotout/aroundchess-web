import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface V3AnalysisJob {
  gameId: string | number;
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'finalizing' | 'waiting';
  progress: number;
  startedAt: number;
  finalizingStartedAt?: number;
  result?: any;
  analysisId?: string; // ID for feedback
  error?: string;
  isPolling?: boolean;
  statusUrl?: string;
  gamePgn?: string;
  depth?: number;
  lastPolledAt?: number;
  estimatedDurationSeconds?: number;
}

interface V3BackgroundAnalysisState {
  analysisJobs: Record<string, V3AnalysisJob>;
  activePollingJobs: Set<string>;
  pollingIntervals: Map<string, NodeJS.Timeout>;
  addJob: (gameId: string | number, jobId: string, statusUrl?: string, gamePgn?: string, depth?: number) => void;
  updateJob: (gameId: string | number, updates: Partial<V3AnalysisJob>) => void;
  removeJob: (gameId: string | number) => void;
  getJobByGameId: (gameId: string | number) => V3AnalysisJob | undefined;
  clearOldJobs: () => void;
  startPolling: (gameId: string | number) => boolean;
  stopPolling: (gameId: string | number) => void;
  forceStopPolling: (gameId: string | number) => void;
  restorePollingJobs: () => void;
  getIncompleteJobs: () => V3AnalysisJob[];
}

export const useV3BackgroundAnalysisStore = create<V3BackgroundAnalysisState>()(
  persist(
    (set, get) => ({
      analysisJobs: {},
      activePollingJobs: new Set(),
      pollingIntervals: new Map(),

      addJob: (gameId, jobId, statusUrl, gamePgn, depth) => {
        // map depths to estimated durations (in seconds)
        const estimateMap: Record<number, number> = {
          12: 101, // 1:41 -> 101s
          16: 150, // 2:30 -> 150s
          18: 113, // 1:53 -> 113s
        };
        const estimatedDurationSeconds = depth ? (estimateMap[depth] || 150) : undefined;
        set((state) => ({
          analysisJobs: {
            ...state.analysisJobs,
            [String(gameId)]: {
              gameId,
              jobId,
              status: 'pending',
              progress: 0,
              startedAt: Date.now(),
              lastPolledAt: Date.now(),
              isPolling: false,
              statusUrl,
              gamePgn,
              depth,
              estimatedDurationSeconds,
            },
          },
        }));
      },

      updateJob: (gameId, updates) => {
        set((state) => ({
          analysisJobs: {
            ...state.analysisJobs,
            [String(gameId)]: {
              ...state.analysisJobs[String(gameId)],
              ...updates,
              lastPolledAt: updates.status ? Date.now() : state.analysisJobs[String(gameId)]?.lastPolledAt,
            },
          },
        }));
      },

      removeJob: (gameId) => {
        set((state) => {
          const newJobs = { ...state.analysisJobs };
          delete newJobs[String(gameId)];
          const newActivePolling = new Set(state.activePollingJobs);
          newActivePolling.delete(String(gameId));
          return {
            analysisJobs: newJobs,
            activePollingJobs: newActivePolling
          };
        });
      },

      getJobByGameId: (gameId) => {
        return get().analysisJobs[String(gameId)];
      },

      getIncompleteJobs: () => {
        const jobs = get().analysisJobs;
        return Object.values(jobs).filter(job =>
          ['pending', 'processing', 'finalizing'].includes(job.status) &&
          job.statusUrl && job.gamePgn
        );
      },

      startPolling: (gameId) => {
        const state = get();
        const gameKey = String(gameId);

        if (state.activePollingJobs.has(gameKey)) {
          return false;
        }

        set((state) => {
          const newActivePolling = new Set(state.activePollingJobs);
          newActivePolling.add(gameKey);
          return {
            activePollingJobs: newActivePolling,
            analysisJobs: {
              ...state.analysisJobs,
              [gameKey]: {
                ...state.analysisJobs[gameKey],
                isPolling: true,
              },
            },
          };
        });

        return true;
      },

      stopPolling: (gameId) => {
        const gameKey = String(gameId);
        set((state) => {
          const newActivePolling = new Set(state.activePollingJobs);
          newActivePolling.delete(gameKey);

          const intervalId = state.pollingIntervals.get(gameKey);
          if (intervalId) {
            clearInterval(intervalId);
            state.pollingIntervals.delete(gameKey);
          }

          return {
            activePollingJobs: newActivePolling,
            analysisJobs: {
              ...state.analysisJobs,
              [gameKey]: {
                ...state.analysisJobs[gameKey],
                isPolling: false,
              },
            },
          };
        });
      },

      forceStopPolling: (gameId) => {
        const gameKey = String(gameId);
        const state = get();

        set((state) => {
          const newActivePolling = new Set(state.activePollingJobs);
          newActivePolling.delete(gameKey);

          const newIntervals = new Map(state.pollingIntervals);
          newIntervals.delete(gameKey);

          return {
            activePollingJobs: newActivePolling,
            pollingIntervals: newIntervals,
            analysisJobs: {
              ...state.analysisJobs,
              [gameKey]: {
                ...state.analysisJobs[gameKey],
                isPolling: false,
              },
            },
          };
        });
      },

      restorePollingJobs: () => {
        const incompleteJobs = get().getIncompleteJobs();

        incompleteJobs.forEach(job => {
          const timeSinceLastPoll = Date.now() - (job.lastPolledAt || 0);
          const shouldRestore = timeSinceLastPoll > 30000;

          if (shouldRestore && job.statusUrl && job.gamePgn) {
            console.log(`[V3_STORE] Restoring polling for job ${job.gameId}`);
          }
        });
      },

      clearOldJobs: () => {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;

        set((state) => {
          const newJobs: Record<string, V3AnalysisJob> = {};
          const newActivePolling = new Set<string>();

          Object.entries(state.analysisJobs).forEach(([key, job]) => {
            if (
              job.startedAt > oneHourAgo ||
              ['processing', 'finalizing'].includes(job.status) ||
              (job.status === 'completed' && job.result) ||
              (job.status === 'failed' && job.startedAt > now - 3 * 60 * 1000)
            ) {
              newJobs[key] = job;
              if (job.isPolling && ['processing', 'finalizing', 'pending'].includes(job.status)) {
                newActivePolling.add(key);
              }
            }
          });

          return {
            analysisJobs: newJobs,
            activePollingJobs: newActivePolling
          };
        });
      },
    }),
    {
      name: 'v3-background-analysis-storage',
      partialize: (state) => ({
        analysisJobs: state.analysisJobs,
        activePollingJobsArray: Array.from(state.activePollingJobs)
      }),
      onRehydrateStorage: () => (state) => {
        if (state && (state as any).activePollingJobsArray) {
          state.activePollingJobs = new Set((state as any).activePollingJobsArray);
          delete (state as any).activePollingJobsArray;
        }
      },
    }
  )
);
