import { useConfirmLogin } from "@/app/store/confirmLogin";
import { useProfileStore } from "@/app/store/profile";
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
};

export const useConfirmAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
   const { sessionId } = useProfileStore();

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
    const checkAuth = async () => {
      try {
        if (sessionId && isSignedIn) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: user,
          });
        } else {
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

export const useRequireAuth = (redirectUrl: string = "/login") => {
  const { isAuthenticated, isLoading, user } = useConfirmAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnPath = encodeURIComponent(router.asPath);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  return { isAuthenticated, isLoading, user };
};
