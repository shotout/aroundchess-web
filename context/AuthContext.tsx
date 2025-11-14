"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Define the type for the auth context
type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Create context with default values - this is key!
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for the provider component
type AuthProviderProps = {
  children: ReactNode;
};

// Provider component
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get current user session
    const getSession = async (): Promise<void> => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        // When user logs in, clear the Black Friday banner closed flag
        // so the banner reappears on their next login
        if (event === "SIGNED_IN" && session?.user) {
          localStorage.removeItem("blackFridayBannerClosed");
        }
        
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Make the context value
  const value = React.useMemo(
    () => ({
      user,
      loading,
    }),
    [user, loading]
  );

  // Return the provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook that shorhands the context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

