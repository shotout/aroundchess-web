import { create } from "zustand";
import { isBrowserOnline } from "@/components/v2/offline-simulation";

interface OfflineGateState {
  open: boolean;
  /** What the player was trying to do, held so a successful reconnect can
   *  carry it out instead of making them ask twice. */
  pending: (() => void) | null;
  /** Runs `action` when there is a connection; otherwise raises the offline
   *  modal and keeps the action for the retry. Returns whether it ran.
   *
   *  Blocks only on a definite offline reading. A captive portal
   *  reports true, so the action goes ahead and fails on its own — which is
   *  the honest outcome: refusing to even try, on a signal that cannot see the
   *  difference, would break analysis for anyone the browser is merely unsure
   *  about. probeConnection is the authority once the modal is already up. */
  request: (action: () => void) => boolean;
  dismiss: () => void;
  /** The connection is back: close and run whatever was waiting. */
  resume: () => void;
}

/** Site-wide gate for actions that cannot work without a connection.
 *
 *  A store rather than local state per call site because the callers are
 *  repeated: every row in Recent Games owns an analysis flow, and five rows
 *  each rendering their own copy of the modal is five stacked dialogs. This
 *  way OfflineGateHost renders exactly one, wherever the request came from.
 */
export const useOfflineGate = create<OfflineGateState>((set, get) => ({
  open: false,
  pending: null,
  request: (action) => {
    if (isBrowserOnline()) {
      action();
      return true;
    }
    set({ open: true, pending: action });
    return false;
  },
  dismiss: () => set({ open: false, pending: null }),
  resume: () => {
    const { pending } = get();
    set({ open: false, pending: null });
    pending?.();
  },
}));
