import { create } from "zustand";

export type GameLeaveGuardType = "resign" | "restart" | "leaderboard" | "leave";

interface PendingAction {
  type: GameLeaveGuardType;
  run: () => void;
}

interface GameLeaveGuardState {
  /** True while a live game has progress worth warning about — a move has been
   *  played. Set by the playing page, so anything outside it (the play top bar's
   *  Leaderboard link) can tell whether navigating away needs confirming.
   *
   *  Deliberately not "a game is on screen": every gate this arms warns that
   *  progress will be lost, and from the opening position there is none — the
   *  same reason Undo stays disabled until a move exists. */
  armed: boolean;
  pending: PendingAction | null;
  setArmed: (armed: boolean) => void;
  /** Runs `run` immediately when no progress is at stake, otherwise parks it
   *  behind the confirmation modal. Returns true when it was intercepted. */
  request: (type: GameLeaveGuardType, run: () => void) => boolean;
  /** Always parks `run` behind the modal, whatever `armed` says. For gates whose
   *  cost isn't lost progress — resigning forfeits ELO from move zero. */
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
