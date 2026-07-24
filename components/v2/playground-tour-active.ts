"use client";

import { useEffect, useState } from "react";

// Whether the playground tour is currently on screen. Login-time modals that
// would otherwise stack on top of the tutorial (the out-of-analyses offer)
// watch this so they queue behind the tour and open once it finishes.
//
// This is deliberately separate from isPlaygroundTourPending() (the queued
// localStorage flag): the tour consumes that flag the moment it starts, so it
// can't tell you the tour is *still running* — which is exactly the window
// where the offer fetch tends to resolve.

let active = false;
const EVENT = "playground-tour:active-change";

export function setPlaygroundTourActive(next: boolean) {
  if (active === next) return;
  active = next;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  }
}

export function isPlaygroundTourActive() {
  return active;
}

/** Reactive view of the tour's on-screen state for use in render. */
export function usePlaygroundTourActive() {
  const [state, setState] = useState(active);
  useEffect(() => {
    const onChange = (e: Event) => setState((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, onChange);
    // sync in case it flipped between the initial render and this effect
    setState(active);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  return state;
}
