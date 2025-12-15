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
    console.log(`🚀 [V3_POLLING_START] Called for game ${gameId}:`, {
      jobId,
      statusUrl,
      isRestore,
      hasPgn: !!gamePgn
    });

    const existing = getJobByGameId(gameId);
    if (existing?.status === "completed") {
      console.log(`ℹ️ [V3_POLLING_START] Job already completed for game ${gameId}, skipping`);
      return;
    }

    // Clear any existing interval first
    const storeState = useV3BackgroundAnalysisStore.getState();
    const existingInterval = storeState.pollingIntervals.get(String(gameId));
    if (existingInterval) {
      console.log(`🗑️ [V3_POLLING_START] Clearing existing interval for game ${gameId}`);
      clearInterval(existingInterval);
    }

    // Force stop any active polling
    forceStopPolling(gameId);
    console.log(`🛑 [V3_POLLING_START] Force stopped existing polling for game ${gameId}`);

    // Small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 100));

    // Start new polling
    const started = startPolling(gameId);
    console.log(`🏁 [V3_POLLING_START] startPolling returned:`, started);
    
    if (!started) {
      console.warn(`⚠️ [V3_POLLING_START] startPolling returned false for game ${gameId}`);
      console.warn(`⚠️ [V3_POLLING_START] Forcing activePollingJobs.add manually...`);
      // Manually add to activePollingJobs as a fallback
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
      console.log(`✅ [V3_POLLING_START] Manually added game ${gameId} to activePollingJobs`);
    }

    const gameSize = (gamePgn.match(/\d+\./g) || []).length;
    const isSmall = gameSize <= 15;
    const pollInterval = isSmall ? 2000 : 3000;
    const maxAttempts = isSmall ? 30 : 100;

    let attempts = 0;
    let active = true;
    let lastTime = 0;
    const minInterval = 2000;

    console.log(`🔄 [V3_POLLING_SETUP] Setting up interval for game ${gameId}:`, {
      pollInterval,
      maxAttempts,
      gameSize,
      isSmall
    });

    const poll = setInterval(async () => {
      console.log(`🔍 [V3_POLLING_TICK] Polling tick for game ${gameId}:`, {
        active,
        attempts: `${attempts}/${maxAttempts}`
      });

      if (!active) {
        console.log(`🛑 [V3_POLLING_TICK] Not active, clearing interval for game ${gameId}`);
        clearInterval(poll);
        return;
      }

      const store = useV3BackgroundAnalysisStore.getState();
      const isInActiveSet = store.activePollingJobs.has(String(gameId));
      console.log(`🔎 [V3_POLLING_TICK] Checking activePollingJobs for game ${gameId}:`, {
        isInActiveSet,
        activeJobsCount: store.activePollingJobs.size,
        activeJobs: Array.from(store.activePollingJobs)
      });

      if (!isInActiveSet) {
        console.warn(`⚠️ [V3_POLLING_TICK] Game ${gameId} NOT in activePollingJobs! Stopping polling.`);
        console.warn(`⚠️ [V3_POLLING_TICK] This usually means forceStopPolling was called externally`);
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

          // Use server-reported progress directly
          // Only use client-side calculation as fallback when server doesn't provide progress
          let computedProgress = d.progress || 0;

          // If server doesn't provide progress AND job has estimated duration, use client-side estimate
          if (!d.progress || d.progress === 0) {
            const state = useV3BackgroundAnalysisStore.getState();
            const storeJob = state.analysisJobs[String(gameId)];

            if (storeJob && storeJob.estimatedDurationSeconds) {
              const elapsedSec = Math.floor((Date.now() - (storeJob.startedAt || Date.now())) / 1000);
              const estimate = storeJob.estimatedDurationSeconds;

              // Calculate progress: elapsed / estimate, capped at 95% (not 100%)
              // Never show 100% until server confirms completion
              computedProgress = Math.max(0, Math.min(95, Math.round((elapsedSec / estimate) * 100)));

              console.log(`[V3_POLLING] Client-side progress estimate: ${computedProgress}% (${elapsedSec}s / ${estimate}s)`);

              // If past estimate, cap at 95% and mark as waiting (not 100%)
              if (elapsedSec > estimate) {
                updateJob(gameId, { status: "waiting", progress: 95 });
                return;
              }
            }
          } else {
            console.log(`[V3_POLLING] Using server-reported progress: ${d.progress}%`);
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
