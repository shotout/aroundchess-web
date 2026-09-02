"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { toast } from "sonner";

interface ChessProfileState {
  isLoading: boolean;
  isSignedIn: boolean;
  hasUsername: boolean;
  error: string | null;
  checkComplete: boolean;
}

const profileCache = new Map<string, { username: string; timestamp: number }>();
const CACHE_DURATION = 120 * 60 * 1000;

export const useChessProfile = () => {
  const { sessionId } = useProfileStore();
  const { username, setUsername } = usePgnStore();

  const [state, setState] = useState<ChessProfileState>({
    isLoading: false,
    isSignedIn: false,
    hasUsername: false,
    error: null,
    checkComplete: false,
  });

  // Use ref to prevent multiple simultaneous API calls
  const fetchingRef = useRef(false);

  const checkProfile = useCallback(async () => {
    if (!sessionId || fetchingRef.current) {
      setState((prev) => ({
        ...prev,
        isSignedIn: false,
        checkComplete: true,
      }));
      return;
    }

    // Check cache first
    const cached = profileCache.get(sessionId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setUsername(cached.username);
      setState({
        isLoading: false,
        isSignedIn: true,
        hasUsername: true,
        error: null,
        checkComplete: true,
      });
      return;
    }

    fetchingRef.current = true;
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isSignedIn: true,
      error: null,
    }));

    const toastId = toast.loading("Verifying username...");

    try {
      const response = await gameHistoryApi.getProfile(sessionId);

      if (response?.success && response?.data?.username) {
        const fetchedUsername = response.data.username;

        // Cache the result
        profileCache.set(sessionId, {
          username: fetchedUsername,
          timestamp: Date.now(),
        });

        setUsername(fetchedUsername);
        setState({
          isLoading: false,
          isSignedIn: true,
          hasUsername: true,
          error: null,
          checkComplete: true,
        });
      } else {
        setState({
          isLoading: false,
          isSignedIn: true,
          hasUsername: false,
          error: null,
          checkComplete: true,
        });
      }
    } catch (error) {
      setState({
        isLoading: false,
        isSignedIn: true,
        hasUsername: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
        checkComplete: true,
      });
    } finally {
      toast.dismiss(toastId);
      fetchingRef.current = false;
    }
  }, [sessionId, setUsername]);

  // Initial check when sessionId changes
  useEffect(() => {
    if (username) {
      setState({
        isLoading: false,
        isSignedIn: !!sessionId,
        hasUsername: true,
        error: null,
        checkComplete: true,
      });
      return;
    }

    if (!sessionId) {
      setState({
        isLoading: false,
        isSignedIn: false,
        hasUsername: false,
        error: null,
        checkComplete: true,
      });
      return;
    }

    checkProfile();
  }, [sessionId, username, checkProfile]);

  const refetch = useCallback(() => {
    if (sessionId) {
      profileCache.delete(sessionId); // Clear cache
      checkProfile();
    }
  }, [sessionId, checkProfile]);

  return {
    ...state,
    username,
    refetch,
  };
};
