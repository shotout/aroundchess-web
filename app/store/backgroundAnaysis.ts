import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalysisJob {
  gameId: string | number;
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'finalizing';
  progress: number;
  startedAt: number;
  finalizingStartedAt?: number;
  result?: any;
  error?: string;
  isPolling?: boolean; // Track if polling is active for this job
}

interface BackgroundAnalysisState {
  analysisJobs: Record<string, AnalysisJob>;
  activePollingJobs: Set<string>; // Track which jobs are currently being polled
  pollingIntervals: Map<string, NodeJS.Timeout>; // Track interval IDs for cleanup
  addJob: (gameId: string | number, jobId: string) => void;
  updateJob: (gameId: string | number, updates: Partial<AnalysisJob>) => void;
  removeJob: (gameId: string | number) => void;
  getJobByGameId: (gameId: string | number) => AnalysisJob | undefined;
  clearOldJobs: () => void;
  startPolling: (gameId: string | number) => boolean; // Returns true if polling can start
  stopPolling: (gameId: string | number) => void;
  forceStopPolling: (gameId: string | number) => void; // Force stop with cleanup
}

export const useBackgroundAnalysisStore = create<BackgroundAnalysisState>()(
  persist(
    (set, get) => ({
      analysisJobs: {},
      activePollingJobs: new Set(),
      pollingIntervals: new Map(),
      
      addJob: (gameId, jobId) => {
        set((state) => ({
          analysisJobs: {
            ...state.analysisJobs,
            [String(gameId)]: {
              gameId,
              jobId,
              status: 'pending',
              progress: 0,
              startedAt: Date.now(),
              isPolling: false,
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
      
      startPolling: (gameId) => {
        const state = get();
        const gameKey = String(gameId);
        
        if (state.activePollingJobs.has(gameKey)) {
          console.log(`[STORE] Polling already active for game ${gameId}`);
          return false; // Polling already active
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
        
        console.log(`[STORE] Started polling for game ${gameId}`);
        return true; // Polling can start
      },
      
      stopPolling: (gameId) => {
        const gameKey = String(gameId);
        set((state) => {
          const newActivePolling = new Set(state.activePollingJobs);
          newActivePolling.delete(gameKey);
          
          // Clear interval if it exists
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
        
        console.log(`[STORE] Stopped polling for game ${gameId}`);
      },
      
      forceStopPolling: (gameId) => {
        const gameKey = String(gameId);
        const state = get();
        
        // Force clear any existing interval
        const intervalId = state.pollingIntervals.get(gameKey);
        if (intervalId) {
          clearInterval(intervalId);
          console.log(`[STORE] Force cleared interval for game ${gameId}`);
        }
        
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
        
        console.log(`[STORE] Force stopped polling for game ${gameId}`);
      },
      
      clearOldJobs: () => {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000; // 1 hour
        
        set((state) => {
          const newJobs: Record<string, AnalysisJob> = {};
          const newActivePolling = new Set<string>();
          
          Object.entries(state.analysisJobs).forEach(([key, job]) => {
            // Keep jobs that are either:
            // - Less than 1 hour old
            // - Still processing or finalizing
            // - Completed with results
            if (
              job.startedAt > oneHourAgo ||
              job.status === 'processing' ||
              job.status === 'finalizing' ||
              (job.status === 'completed' && job.result)
            ) {
              newJobs[key] = job;
              // Keep active polling state for jobs that are still being polled
              if (job.isPolling) {
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
      name: 'background-analysis-storage',
      // Don't persist activePollingJobs as it's runtime state
      partialize: (state) => ({ analysisJobs: state.analysisJobs }),
    }
  )
);