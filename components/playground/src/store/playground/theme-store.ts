import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BoardTheme {
  light: string
  dark: string
  selected: string
  highlight?: string
  lastMove?: string
}

interface ThemeState {
  pieceTheme: 'default' | 'classic'
  boardTheme: BoardTheme
  setPieceTheme: (theme: 'default' | 'classic') => void
  setBoardTheme: (theme: BoardTheme) => void
}

type SetState = (state: Partial<ThemeState>) => void

export const useThemeStore = create(
  persist<ThemeState>(
    (set: SetState) => ({
      pieceTheme: 'default',
      boardTheme: {
        light: 'bg-white hover:bg-white/90',
        dark: 'bg-[#B7C0D8] hover:bg-[#B7C0D8]/90',
        selected: 'ring-2 ring-yellow-400 ring-inset',
        highlight: 'ring-2 ring-yellow-400 ring-inset',
        lastMove: 'ring-2 ring-yellow-400 ring-inset',
      },
      setPieceTheme: (theme: 'default' | 'classic') => set({ pieceTheme: theme }),
      setBoardTheme: (theme: BoardTheme) => set({ boardTheme: theme }),
    }),
    {
      name: 'theme-store',
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        state.pieceTheme = 'default';
        state.boardTheme = {
          light: 'bg-white hover:bg-white/90',
          dark: 'bg-[#B7C0D8] hover:bg-[#B7C0D8]/90',
          selected: 'ring-2 ring-yellow-400 ring-inset',
          highlight: 'ring-2 ring-yellow-400 ring-inset',
          lastMove: 'ring-2 ring-yellow-400 ring-inset',
        };
      },
    }
  )
) 