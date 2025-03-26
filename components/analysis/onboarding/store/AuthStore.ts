"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  sessionId: string;
  isAuthenticated: boolean;
  setSessionId: (sessionId: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionId: '',
      isAuthenticated: false,
      setSessionId: (sessionId) => set({ sessionId }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      clearAuth: () => set({ sessionId: '', isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);