// hooks/useClerkAuth.ts
"use client";

import { useEffect } from "react";
import { useUser, useSession, useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/components/analysis/onboarding/store/AuthStore";

/**
 * Custom hook to sync Clerk authentication state with our auth store
 */
export function useClerkAuth() {
  const { isSignedIn, user } = useUser();
  const { session } = useSession();
  const { signOut } = useAuth();
  
  const { 
    sessionId, 
    isAuthenticated, 
    setSessionId, 
    setIsAuthenticated, 
    clearAuth 
  } = useAuthStore();

  // Sync Clerk auth state to our store
  useEffect(() => {
    if (isSignedIn && session && user) {
      // User is authenticated and we have a session
      const currentSessionId = session.id;
      
      // Update session ID if it's different
      if (currentSessionId !== sessionId) {
        console.log("Updating session ID", currentSessionId);
        setSessionId(currentSessionId);
      }
      
      // Set authenticated status
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
    } else if (!isSignedIn && isAuthenticated) {
      // User signed out in Clerk but our store thinks they're authenticated
      clearAuth();
    }
  }, [isSignedIn, session, user, sessionId, isAuthenticated, setSessionId, setIsAuthenticated, clearAuth]);

  /**
   * Logout function that clears both Clerk and local auth state
   */
  const logout = async () => {
    try {
      // Clear our auth store first
      clearAuth();
      
      // Then sign out from Clerk
      if (signOut) {
        await signOut();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return {
    isAuthenticated,
    sessionId,
    logout,
  };
}