"use client";

import { create } from "zustand";

interface ChesscomConnectState {
  /** A page has asked for the Chess.com connect dialog. */
  requested: boolean;
  open: () => void;
  close: () => void;
}

/**
 * Global "open the Chess.com connect flow" request.
 *
 * ChesscomPromoModalHost (root layout) owns the single ChessAccountSetup mount
 * and renders it only while this is set, so any page can ask for the real
 * connect dialog without mounting its own copy. That matters because
 * ChessAccountSetup runs a profile check that toasts "Verifying username...",
 * which has no business firing on a page just because something on it *could*
 * open the connect flow.
 */
export const useChesscomConnect = create<ChesscomConnectState>((set) => ({
  requested: false,
  open: () => set({ requested: true }),
  close: () => set({ requested: false }),
}));

/** Imperative opener for event handlers. */
export const openChesscomConnect = () =>
  useChesscomConnect.getState().open();
