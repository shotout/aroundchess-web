import { create } from "zustand";

export type GameLeaveGuardType = "resign" | "restart" | "leaderboard" | "leave";

interface PendingAction {
  type: GameLeaveGuardType;
  run: () => void;
}

interface GameLeaveGuardState {
  armed: boolean;
  pending: PendingAction | null;
  setArmed: (armed: boolean) => void;
  request: (type: GameLeaveGuardType, run: () => void) => boolean;
  open: (type: GameLeaveGuardType, run: () => void) => void;
  confirm: () => void;
  dismiss: () => void;
}

export const useGameLeaveGuard = create<GameLeaveGuardState>((set, get) => ({
  armed: false,
  pending: null,
  setArmed: (armed) => set({ armed }),
  request: (type, run) => {
    if (!get().armed) {
      run();
      return false;
    }
    set({ pending: { type, run } });
    return true;
  },
  open: (type, run) => set({ pending: { type, run } }),
  confirm: () => {
    const { pending } = get();
    set({ pending: null });
    pending?.run();
  },
  dismiss: () => set({ pending: null }),
}));
