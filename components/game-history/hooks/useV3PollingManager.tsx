import { useEffect, useCallback } from 'react';
import { useV3BackgroundAnalysisStore } from '@/app/store/v3BackgroundAnalysis';
import { useProfileStore } from '@/app/store/profile';
import { toast } from 'sonner';

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
    if (existing?.status === "completed") return;

    const storeState = useV3BackgroundAnalysisStore.getState();
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

      const store = useV3BackgroundAnalysisStore.getState();
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
        if (!isRestore) {
          toast.error("Analysis polling timed out. Please try again.");
        }
        return;
      }

      try {
        const { default: axios } = await import("axios");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
        const timestamp = Date.now();
        const separator = statusUrl.includes('?') ? '&' : '?';
        const fullUrl = `${baseUrl}${statusUrl}${separator}t=${timestamp}`;

        console.log(`[V3_POLLING] Polling URL: ${fullUrl}`);
        console.log(`[V3_POLLING] Attempt ${attempts}/${maxAttempts} for game ${gameId}`);

        const response = await axios.get(fullUrl, {
          headers: { Authorization: `Bearer ${sessionId}` },
        });

        console.log(`[V3_POLLING] Response status:`, response.status);
        console.log(`[V3_POLLING] Response data:`, response.data);

        const d = response.data.data;

        if (["processing", "pending"].includes(d.status)) {
          console.log(`[V3_POLLING] Job is ${d.status}, progress: ${d.progress}`);

          // compute client-side progress estimate if job has estimated duration
          const state = useV3BackgroundAnalysisStore.getState();
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
          console.log(`[V3_POLLING] Job completed! Status: ${d.status}`);
          console.log(`[V3_POLLING] Full response data:`, JSON.stringify(response.data, null, 2));
          console.log(`[V3_POLLING] Result data:`, d.result);
          console.log(`[V3_POLLING] Checking validation:`, {
            hasResult: !!d.result,
            hasId: !!(d.result?.id),
            hasUserId: !!(d.result?.userId),
            hasPgn: !!(d.result?.pgn),
          });

          clearInterval(poll);

          // For v3, the result might be in a different structure
          // Check if we have the essential data (at minimum, we need some result)
          const hasResult = d.result || d;
          const valid = hasResult && (d.result?.pgn || d.pgn || gamePgn);

          console.log(`[V3_POLLING] Validation result:`, valid);

          if (!valid) {
            console.error(`[V3_POLLING] ❌ Validation failed - marking as failed`);
            forceStopPolling(gameId);
            updateJob(gameId, {
              status: "failed",
              error: "Analysis completed but result is incomplete",
            });
            if (!isRestore) {
              toast.error("Analysis completed but result is incomplete. Please try again.");
            }
            return;
          }

          if (isSmall) await new Promise((r) => setTimeout(r, 2000));

          forceStopPolling(gameId);
          // override any waiting/finalizing state and mark completed
          // Extract analysis ID from response (could be in d.id, d.analysisId, or d.result.id)
          const analysisId = d.id || d.analysisId || d.result?.id;
          console.log(`[V3_POLLING] Extracted analysisId:`, analysisId);

          updateJob(gameId, {
            status: "completed",
            progress: 100,
            result: d.result || d,
            analysisId: analysisId,
            error: undefined,
          });

          toast.success(
            isSmall
              ? "Analysis complete! (Small games process quickly)"
              : "Analysis complete!",
            {
              description: "Click 'View Results' to see your analysis.",
              duration: 5000,
            }
          );
        }
      } catch (error: any) {
        console.error(`[V3_POLLING] ❌ Error for game ${gameId}:`, error.message);
        console.error(`[V3_POLLING] Error response:`, error.response?.data);
        console.error(`[V3_POLLING] Error status:`, error.response?.status);
        console.error(`[V3_POLLING] Full error:`, error);

        // Ignore 404 errors (job might not be ready yet)
        if (error.response?.status === 404) {
          console.log(`[V3_POLLING] Got 404, continuing to poll...`);
          return;
        }

        // For other errors, mark as failed
        active = false;
        clearInterval(poll);
        forceStopPolling(gameId);
        updateJob(gameId, {
          status: "failed",
          error: error.response?.data?.message || error.message || "Unknown error",
        });
        if (!isRestore) {
          toast.error(`Analysis failed: ${error.response?.data?.message || error.message}`);
        }
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
