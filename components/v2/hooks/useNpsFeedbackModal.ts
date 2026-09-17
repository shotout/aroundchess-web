"use client";

import { create } from "zustand";

export interface NpsFeedbackModalRequest {
  /** Skips every gate and sends nothing, so it cannot spend the real prompt. */
  preview?: boolean;
}

interface NpsFeedbackModalState {
  request: NpsFeedbackModalRequest | null;
  open: (request?: NpsFeedbackModalRequest) => void;
  close: () => void;
}

/** Imperative control of the NPS layover; the automatic path never uses this. */
export const useNpsFeedbackModal = create<NpsFeedbackModalState>((set) => ({
  request: null,
  open: (request = {}) => set({ request }),
  close: () => set({ request: null }),
}));

/** Opener for non-React call sites. */
export function openNpsFeedbackModal(request: NpsFeedbackModalRequest = {}) {
  useNpsFeedbackModal.getState().open(request);
}

/** Closer for the same. */
export function closeNpsFeedbackModal() {
  useNpsFeedbackModal.getState().close();
}
