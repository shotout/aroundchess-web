"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { useProfileStore } from "@/app/store/profile";
import { usePlayVsAiStatsStore } from "@/app/store/playVsAiStats";

const PAGE_LIMIT = 20;

export function useOpponentsPlayed() {
  const { sessionId } = useProfileStore();
  const { opponentsPlayed, opponentsPlayedPagination, setOpponentsPlayed } =
    usePlayVsAiStatsStore();

  // Persisted store data renders immediately; only a genuine first load
  // (empty cache) shows the loading state — refreshes happen silently.
  const [isLoading, setIsLoading] = useState(
    () => usePlayVsAiStatsStore.getState().opponentsPlayed.length === 0
  );
  const [error, setError] = useState<Error | null>(null);
  const fetchRef = useRef(false);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      if (!sessionId || fetchRef.current) return;
      fetchRef.current = true;
      const hasCachedData =
        usePlayVsAiStatsStore.getState().opponentsPlayed.length > 0;
      if (append || !hasCachedData) setIsLoading(true);
      setError(null);

      try {
        const res = await gameHistoryApi.getOpponentsPlayed(
          sessionId,
          page,
          PAGE_LIMIT
        );
        const fetched = res.data ?? [];
        const nextData = append
          ? [...usePlayVsAiStatsStore.getState().opponentsPlayed, ...fetched]
          : fetched;
        setOpponentsPlayed(nextData, res.pagination ?? null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch opponents played")
        );
      } finally {
        setIsLoading(false);
        fetchRef.current = false;
      }
    },
    [sessionId, setOpponentsPlayed]
  );

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }
    fetchPage(1, false);
  }, [sessionId, fetchPage]);

  const loadMore = useCallback(() => {
    const pagination = usePlayVsAiStatsStore.getState().opponentsPlayedPagination;
    if (!pagination || pagination.page >= pagination.totalPages) return;
    fetchPage(pagination.page + 1, true);
  }, [fetchPage]);

  const handleRetryFetch = useCallback(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  return {
    opponents: opponentsPlayed,
    pagination: opponentsPlayedPagination,
    isLoading,
    error,
    handleRetryFetch,
    loadMore,
  };
}
