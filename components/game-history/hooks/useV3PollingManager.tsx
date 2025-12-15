import { useEffect, useCallback } from 'react';
import { useV3BackgroundAnalysisStore } from '@/app/store/v3BackgroundAnalysis';
import { useProfileStore } from '@/app/store/profile';

export const useV3PollingManager = () => {
  const { sessionId } = useProfileStore();
  const {
    getIncompleteJobs,
    updateJob,
    startPolling,
    forceStopPolling,
    getJobByGameId
  } = useV3BackgroundAnalysisStore();

  const startV3BackgroundPolling = useCallback(async (
    gameId: string | number,
    statusUrl: string,
    jobId: string,
    gamePgn: string,
    gameData?: any,
    isRestore: boolean = false
  ) => {
    const existing = getJobByGameId(gameId);
    if (existing?.status === "completed") {
      return;
    }

    const storeState = useV3BackgroundAnalysisStore.getState();
    const existingInterval = storeState.pollingIntervals.get(String(gameId));
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    forceStopPolling(gameId);

    await new Promise(resolve => setTimeout(resolve, 100));

    const started = startPolling(gameId);
    
    if (!started) {
      const state = useV3BackgroundAnalysisStore.getState();
      const newActivePolling = new Set(state.activePollingJobs);
      newActivePolling.add(String(gameId));
      useV3BackgroundAnalysisStore.setState({
        activePollingJobs: newActivePolling,
        analysisJobs: {
          ...state.analysisJobs,
          [String(gameId)]: {
            ...state.analysisJobs[String(gameId)],
            isPolling: true,
          },
        },
      });
    }

    const gameSize = (gamePgn.match(/\d+\./g) || []).length;
    const isSmall = gameSize <= 15;
    const pollInterval = isSmall ? 2000 : 3000;
    const maxAttempts = isSmall ? 30 : 100;

    let attempts = 0;
    let active = true;
    let lastTime = 0;
    const minInterval = 2000;

    const poll = setInterval(async () => {
      if (!active) {
        clearInterval(poll);
        return;
      }

      const store = useV3BackgroundAnalysisStore.getState();
      const isInActiveSet = store.activePollingJobs.has(String(gameId));

      if (!isInActiveSet) {
        active = false;
        clearInterval(poll);
        return;
      }

      const current = getJobByGameId(gameId);
      if (current?.status === "completed") {
        active = false;
        clearInterval(poll);
        forceStopPolling(gameId);
        return;
      }

      const now = Date.now();
      if (now - lastTime < minInterval) return;
      lastTime = now;

      attempts++;
      if (attempts > maxAttempts) {
        active = false;
        clearInterval(poll);
        forceStopPolling(gameId);
        updateJob(gameId, { status: "failed", error: "Polling timeout" });
        return;
      }

      try {
        const { default: axios } = await import("axios");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
        const timestamp = Date.now();
        const separator = statusUrl.includes('?') ? '&' : '?';
        const fullUrl = `${baseUrl}${statusUrl}${separator}t=${timestamp}`;

        const response = await axios.get(fullUrl, {
          headers: { Authorization: `Bearer ${sessionId}` },
        });

        const d = response.data.data;

        if (["processing", "pending"].includes(d.status)) {
          let computedProgress = d.progress || 0;

          if (!d.progress || d.progress === 0) {
            const state = useV3BackgroundAnalysisStore.getState();
            const storeJob = state.analysisJobs[String(gameId)];

            if (storeJob && storeJob.estimatedDurationSeconds) {
              const elapsedSec = Math.floor((Date.now() - (storeJob.startedAt || Date.now())) / 1000);
              const estimate = storeJob.estimatedDurationSeconds;

              computedProgress = Math.max(0, Math.min(95, Math.round((elapsedSec / estimate) * 100)));

              if (elapsedSec > estimate) {
                updateJob(gameId, { status: "waiting", progress: 95 });
                return;
              }
            }
          }

          updateJob(gameId, { status: "processing", progress: computedProgress });
        } else if (["completed", "ready"].includes(d.status)) {
          clearInterval(poll);

          const hasResult = d.result || d;
          const valid = hasResult && (d.result?.pgn || d.pgn || gamePgn);

          if (!valid) {
            forceStopPolling(gameId);
            updateJob(gameId, {
              status: "failed",
              error: "Analysis completed but result is incomplete",
            });
            return;
          }

          if (isSmall) await new Promise((r) => setTimeout(r, 2000));

          forceStopPolling(gameId);
          
          // Fetch last-analysis to get complete data including analysisId
          try {
            const resultPgn = d.result?.gameInfo?.pgn || d.gameInfo?.pgn || gamePgn;
            if (resultPgn) {
              const { createPgnHash } = await import("@/utils/crypto-utils");
              const pgnHash = createPgnHash(resultPgn);
              const { default: axios } = await import("axios");
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
              
              const lastAnalysisRes = await axios.get(
                `${baseUrl}/v3/analyze/last-analysis/${pgnHash}`,
                {
                  headers: { Authorization: `Bearer ${sessionId}` },
                }
              );
              
              if (lastAnalysisRes.data?.data) {
                const analysisId = lastAnalysisRes.data.data.analysisId || 
                                 lastAnalysisRes.data.data.id || 
                                 d.id || 
                                 d.analysisId || 
                                 d.result?.id;
                
                updateJob(gameId, {
                  status: "completed",
                  progress: 100,
                  result: lastAnalysisRes.data.data,
                  analysisId: analysisId,
                  error: undefined,
                });
                return;
              }
            }
          } catch (fetchError) {
            // Fallback to original result if fetch fails
          }
          
          // Fallback: use original result
          const analysisId = d.id || d.analysisId || d.result?.id;
          updateJob(gameId, {
            status: "completed",
            progress: 100,
            result: d.result || d,
            analysisId: analysisId,
            error: undefined,
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          return;
        }

        active = false;
        clearInterval(poll);
        forceStopPolling(gameId);
        updateJob(gameId, {
          status: "failed",
          error: error.response?.data?.message || error.message || "Unknown error",
        });
      }
    }, pollInterval);

    useV3BackgroundAnalysisStore.getState().pollingIntervals.set(String(gameId), poll);
  }, [sessionId, updateJob, startPolling, forceStopPolling, getJobByGameId]);

  const restorePollingJobs = useCallback(() => {
    const incompleteJobs = getIncompleteJobs();

    incompleteJobs.forEach(job => {
      const timeSinceLastPoll = Date.now() - (job.lastPolledAt || 0);
      if (timeSinceLastPoll > 30000 && job.statusUrl && job.gamePgn) {
        startV3BackgroundPolling(
          job.gameId,
          job.statusUrl,
          job.jobId,
          job.gamePgn,
          undefined,
          true
        );
      }
    });
  }, [getIncompleteJobs, startV3BackgroundPolling]);

  useEffect(() => {
    const timer = setTimeout(() => {
      restorePollingJobs();
    }, 1000);

    return () => clearTimeout(timer);
  }, [restorePollingJobs]);

  return {
    startV3BackgroundPolling,
    restorePollingJobs,
  };
};
