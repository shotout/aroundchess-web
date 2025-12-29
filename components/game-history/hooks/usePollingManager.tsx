import { useEffect, useCallback } from 'react';
import { useBackgroundAnalysisStore } from '@/app/store/backgroundAnaysis';
import { useProfileStore } from '@/app/store/profile';

export const usePollingManager = () => {
  const { sessionId } = useProfileStore();
  const { 
    getIncompleteJobs, 
    updateJob, 
    startPolling, 
    forceStopPolling,
    getJobByGameId 
  } = useBackgroundAnalysisStore();

  const startBackgroundPolling = useCallback(async (
    gameId: string | number,
    statusUrl: string,
    jobId: string,
    gamePgn: string,
    gameData?: any,
    isRestore: boolean = false
  ) => {
    const existing = getJobByGameId(gameId);
    if (existing?.status === "completed") return;

    const storeState = useBackgroundAnalysisStore.getState();
    const existingInterval = storeState.pollingIntervals.get(String(gameId));
    if (existingInterval) clearInterval(existingInterval);

    forceStopPolling(gameId);
    if (!startPolling(gameId)) return;

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

      const store = useBackgroundAnalysisStore.getState();
      if (!store.activePollingJobs.has(String(gameId))) {
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
          // compute client-side progress estimate if job has estimated duration
          const state = useBackgroundAnalysisStore.getState();
          const storeJob = state.analysisJobs[String(gameId)];
          let computedProgress = d.progress || 0;

          if (storeJob && storeJob.estimatedDurationSeconds) {
            const elapsedSec = Math.floor((Date.now() - (storeJob.startedAt || Date.now())) / 1000);
            const estimate = storeJob.estimatedDurationSeconds;

            // progress is elapsed / estimate, capped to 100
            computedProgress = Math.max(0, Math.min(100, Math.round((elapsedSec / estimate) * 100)));

            if (elapsedSec > estimate) {
              // past estimate and still processing -> mark as waiting
              updateJob(gameId, { status: "waiting", progress: 100 });
              return;
            }
          }

          updateJob(gameId, { status: "processing", progress: computedProgress });
        } else if (["completed", "ready"].includes(d.status)) {
          clearInterval(poll);
          const valid = d.result && d.result.id && d.result.userId && d.result.pgn;
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
          
          // Fetch last-analysis to get complete data
          try {
            const resultPgn = d.result?.pgn || gamePgn;
            if (resultPgn) {
              const { createPgnHash } = await import("@/utils/crypto-utils");
              const pgnHash = createPgnHash(resultPgn);
              const { default: axios } = await import("axios");
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
              
              console.log("🔄 [V2 Polling] Fetching last-analysis for pgnHash:", pgnHash);
              
              const lastAnalysisRes = await axios.get(
                `${baseUrl}/v2/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
                {
                  headers: { Authorization: `Bearer ${sessionId}` },
                }
              );
              
              console.log("📥 [V2 Polling] Last-analysis response:", lastAnalysisRes.data);
              
              if (lastAnalysisRes.data?.success && lastAnalysisRes.data?.data) {
                // Use data from last-analysis as it's more complete
                updateJob(gameId, {
                  status: "completed",
                  progress: 100,
                  result: lastAnalysisRes.data.data,
                  error: undefined,
                });
                console.log("✅ [V2 Polling] Job updated with last-analysis data");
                return;
              }
            }
          } catch (lastAnalysisError: any) {
            console.warn("⚠️ [V2 Polling] Failed to fetch last-analysis, using status result:", lastAnalysisError.message);
          }
          
          // Fallback: use result from status if last-analysis fails
          updateJob(gameId, {
            status: "completed",
            progress: 100,
            result: d.result || d,
            error: undefined,
          });
        }
      } catch (error: any) {
        console.error(`[POLLING] Error for game ${gameId}:`, error.message);
        if (error.response?.status !== 404) {
          active = false;
          clearInterval(poll);
          forceStopPolling(gameId);
          updateJob(gameId, {
            status: "failed",
            error: error.message || "Unknown error",
          });
        }
      }
    }, pollInterval);

    useBackgroundAnalysisStore.getState().pollingIntervals.set(String(gameId), poll);
  }, [sessionId, updateJob, startPolling, forceStopPolling, getJobByGameId]);

  const restorePollingJobs = useCallback(() => {
    const incompleteJobs = getIncompleteJobs();
    
    incompleteJobs.forEach(job => {
      const timeSinceLastPoll = Date.now() - (job.lastPolledAt || 0);
      if (timeSinceLastPoll > 30000 && job.statusUrl && job.gamePgn) {
        startBackgroundPolling(
          job.gameId, 
          job.statusUrl, 
          job.jobId, 
          job.gamePgn, 
          undefined, 
          true
        );
      }
    });
  }, [getIncompleteJobs, startBackgroundPolling]);

  useEffect(() => {
    const timer = setTimeout(() => {
      restorePollingJobs();
    }, 1000);

    return () => clearTimeout(timer);
  }, [restorePollingJobs]);

  return {
    startBackgroundPolling,
    restorePollingJobs,
  };
};