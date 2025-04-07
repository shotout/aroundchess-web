// useGamesData.ts
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Game, usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";
import { isCacheValid, transformApiDataToComponentFormat } from "../GamesTabHelper";

const endpoint = process.env.NEXT_PUBLIC_BASE_AUTH

interface UseGamesDataResult {
  isLoading: boolean;
  error: Error | null;
  gamesData: Game[];
  handleRetryFetch: () => void;
  handleForceRefresh: () => void;
}

export function useGamesData(
  username: string | null, 
  sessionId: string | null, 
  authIsLoaded: boolean,
  lastFetchTimestamp: number | null,
  cachedGames: Game[],
  gamesLastFetched: number | null,
  setGamesData: (games: Game[]) => void
): UseGamesDataResult {
  const [apiProcessedData, setApiProcessedData] = useState<Game[]>([]);
  const [isLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchRef = useRef(false);

  const cacheValid = isCacheValid(gamesLastFetched, cachedGames);

  useEffect(() => {
    const fetchGames = async () => {
      if (!username || fetchRef.current) {
        if (authIsLoaded && !username) {
          setDataLoading(false);
        }
        return;
      }

      if (cacheValid) {
        setApiProcessedData(cachedGames);
        setDataLoading(false);
        return;
      }

      fetchRef.current = true;
      setDataLoading(true);
      setError(null);

      try {
        const apiUrl = `${endpoint}/games/my-game-history?type=chessdotcom`
        const config = {
          headers: {
            Accept: "application/json",
            Authorization: sessionId ? `Bearer ${sessionId}` : undefined,
          },
        };

        const response = await axios.get(apiUrl, config);

        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            const transformedData = transformApiDataToComponentFormat(
              response.data.data
            );

            

            setApiProcessedData(transformedData);
            setGamesData(transformedData);
            console.log(transformedData);
          } else {
            setApiProcessedData([]);
            setGamesData([]);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch games")
        );
      } finally {
        setDataLoading(false);
        setTimeout(() => {
          fetchRef.current = false;
        }, 3000);
      }
    };

    if (authIsLoaded) {
      fetchGames();
    }
  }, [
    username,
    authIsLoaded,
    sessionId,
    lastFetchTimestamp,
    setGamesData,
    cacheValid,
    cachedGames,
    gamesLastFetched,
  ]);

  const handleRetryFetch = () => {
    fetchRef.current = false;
    const { resetFetchState } = usePgnStore.getState();
    resetFetchState();
  };

  const handleForceRefresh = () => {
    fetchRef.current = false;
    const { resetFetchState, clearGamesData } = usePgnStore.getState();
    clearGamesData();
    resetFetchState();
    toast.info("Refreshing games data...");
  };

  return {
    isLoading,
    error,
    gamesData: apiProcessedData,
    handleRetryFetch,
    handleForceRefresh
  };
}