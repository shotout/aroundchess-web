"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { transformApiDataToComponentFormat } from "@/components/game-history/hooks/useGameData";
import { Game } from "@/components/game-history/types/GameHistoryTypes";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";

const AI_SOURCES = new Set(["vs_ai", "ai", "against ai"]);

function cachedOpponentGames(opponentUsername: string): Game[] {
  const raw = usePgnStore.getState().gamesData;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const target = opponentUsername.toLowerCase();
  return transformApiDataToComponentFormat(raw).filter(
    (game) =>
      AI_SOURCES.has((game.source || "").toLowerCase().trim()) &&
      (game.opponent || "").toLowerCase() === target
  );
}

export function useOpponentGames(opponentUsername: string) {
  const { sessionId } = useProfileStore();

  const [games, setGames] = useState<Game[]>(() =>
    cachedOpponentGames(opponentUsername)
  );
  const [isLoading, setIsLoading] = useState(
    () => cachedOpponentGames(opponentUsername).length === 0
  );
  const [error, setError] = useState<Error | null>(null);

  const fetchRef = useRef(false);
  const hasDataRef = useRef(games.length > 0);
  useEffect(() => {
    hasDataRef.current = games.length > 0;
  }, [games]);

  const fetchGames = useCallback(async () => {
    if (!sessionId || fetchRef.current) return;
    fetchRef.current = true;
    if (!hasDataRef.current) setIsLoading(true);
    setError(null);

    try {
      const res = await gameHistoryApi.getUserGames(sessionId, {
        sources: ["vs_ai"],
        opponent: opponentUsername,
      });
      if (res?.data) {
        setGames(transformApiDataToComponentFormat(res.data));
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch games"));
    } finally {
      setIsLoading(false);
      fetchRef.current = false;
    }
  }, [sessionId, opponentUsername]);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }
    fetchGames();
  }, [sessionId, fetchGames]);

  const handleRetryFetch = useCallback(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, isLoading, error, handleRetryFetch };
}
