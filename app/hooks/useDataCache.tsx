import { useEffect, useRef, useCallback } from 'react';
import { usePgnStore } from '@/app/store/zustandStore';
import { useApiClient } from '@/functions/api-client';
import { sha256Hex } from '@/functions/sha256';
import { enrichMistakeLogsWithAnalyzeSections } from '@/components/mistake-log/utils';

export const useDataCache = () => {
  const {
    lastFetchTime,
    isFetching,
    shouldRefetch,
    setLastFetchTime,
    setIsFetching,
    setSavedMistakes,
    setPreviousAnalyses,
    setPreviousAnalysesDetail,
    setPgn,
    setTitleGame,
    setMovementDetails,
    setPlayerInfo,
    setMistakeLogs,
    savedMistakes,
    previousAnalyses,
    hydrated
  } = usePgnStore();

  const {
    getMistakeSaved,
    getMistakePrevious,
    getMistakePreviousDetail,
    getAnalysisByPgnHash,
  } = useApiClient();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAllData = useCallback(async (skipSavedMistakes = false) => {
    if (isFetching) return;

    setIsFetching(true);

    try {
      // Only fetch savedMistakes if not skipped AND no cached data exists
      if (!skipSavedMistakes) {
        const savedData = await getMistakeSaved({ page: 1, limit: 10 });
        // Only update if we got valid data, otherwise keep cached data
        if (savedData?.data && Array.isArray(savedData.data)) {
          setSavedMistakes(savedData.data);
          if (savedData.data.length > 0) {
            setPreviousAnalysesDetail(savedData.data[0]);
          }
        }
      }

      // Force-refresh to avoid backend cache for previous analyses
      const prevData = await getMistakePrevious({ force: 1 });
      console.log("prevData",prevData)
      if (prevData?.data && Array.isArray(prevData.data) && prevData.data.length > 0) {
        setPreviousAnalyses(prevData.data);

        const prevDataDetail = await getMistakePreviousDetail(
          prevData.data[0].id,
          { page: 1, limit: 10 }
        );

        const dataDetail = prevDataDetail.data;
        if (dataDetail) {
          setPgn(dataDetail.pgn);
          setTitleGame(dataDetail.title);
          setMovementDetails(dataDetail.movementDetail);
          setPlayerInfo(dataDetail.playerInfo);
          try {
            const hash = await sha256Hex(dataDetail.pgn || "");
            const analysisRes = await getAnalysisByPgnHash(hash);
            const sections = {
              threats: analysisRes?.data?.threats || [],
              middleGame: analysisRes?.data?.middleGame || { badMoves: [] },
              endGame: analysisRes?.data?.endGame || { badMoves: [] },
            };
            const enriched = enrichMistakeLogsWithAnalyzeSections(
              dataDetail.mistakeLogs,
              sections
            );
            setMistakeLogs(enriched as any);
          } catch {
            if (dataDetail.mistakeLogs) {
              setMistakeLogs(dataDetail.mistakeLogs);
            }
          }
        }
      }

      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('Error fetching data:', error);
      // Don't clear cached data on error - just keep what we have
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, getMistakeSaved, getMistakePrevious, getMistakePreviousDetail, setSavedMistakes, setPreviousAnalysesDetail, setPreviousAnalyses, setPgn, setTitleGame, setMovementDetails, setPlayerInfo, setMistakeLogs, setLastFetchTime, setIsFetching, getAnalysisByPgnHash]);

  const initializeData = useCallback(async () => {
    if (!hydrated) return;

    const hasCachedData = savedMistakes.length > 0 || previousAnalyses.length > 0;
    const hasSavedMistakes = savedMistakes.length > 0;

    // Only fetch if no cached data, OR if we have cached data but it's expired (not on initial load)
    if (!hasCachedData) {
      // No cached data - always fetch
      await fetchAllData();
    } else if (lastFetchTime && shouldRefetch()) {
      // Has cached data AND cache is expired (lastFetchTime exists) - refetch
      // Skip fetching savedMistakes if they already exist to preserve all bookmarks
      await fetchAllData(hasSavedMistakes);
    }
    // If hasCachedData and no lastFetchTime (initial load), just use cached data
  }, [hydrated, shouldRefetch, fetchAllData, savedMistakes.length, previousAnalyses.length, lastFetchTime]);

  useEffect(() => {
    if (!hydrated) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (shouldRefetch()) {
        fetchAllData();
      }
    }, 60 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hydrated, fetchAllData, shouldRefetch]);

  return {
    initializeData,
    fetchAllData,
    isFetching,
    lastFetchTime,
    hasCachedData: savedMistakes.length > 0 || previousAnalyses.length > 0
  };
};