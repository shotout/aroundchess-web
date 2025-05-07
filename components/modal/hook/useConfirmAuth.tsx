// utils/authUtils.ts
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
};
export type User = {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
};

export const useConfirmAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [sessionId , setToken] = useLocalStorage<string>("token", "");

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  const { user } = useAuth();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    // Replace this with your actual authentication check
    // For example, checking a token in localStorage or using a context
    const checkAuth = async () => {
      try {
        if (sessionId && isSignedIn) {
          // User is authenticated
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: user,
          });
        } else {
          // User is not authenticated
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [sessionId, isSignedIn]);

  return authState;
};

// Hook to protect routes or components
export const useRequireAuth = (redirectUrl: string = "/login") => {
  const { isAuthenticated, isLoading, user } = useConfirmAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page with the current path as a return URL
      const returnPath = encodeURIComponent(router.asPath);
      // router.push(`${redirectUrl}?returnTo=${returnPath}`);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  return { isAuthenticated, isLoading, user };
};
