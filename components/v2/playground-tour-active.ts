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

// Whether the play hero should render at the tour's compact mobile sizing.
//
// Deliberately NOT the same flag as "the tour is on screen". The compact set
// exists for one reason: on steps 1-2 the tour cuts a spotlight around the live
// hero, and at full size that target doesn't fit a phone viewport. Steps 3-5
// spotlight nothing — the hero is pure backdrop there — and leaving it shrunk
// through them made the page behind the demo cards read as empty space with a
// small card stranded in it. So this tracks the anchored steps only, and the
// background goes back to the real layout for the rest of the run.
let heroCompact = false;
const HERO_EVENT = "playground-tour:hero-compact-change";

export function setPlaygroundTourHeroCompact(next: boolean) {
  if (heroCompact === next) return;
  heroCompact = next;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(HERO_EVENT, { detail: next }));
  }
}

/** Reactive view of the compact-hero state for use in render. */
export function usePlaygroundTourHeroCompact() {
  const [state, setState] = useState(heroCompact);
  useEffect(() => {
    const onChange = (e: Event) => setState((e as CustomEvent<boolean>).detail);
    window.addEventListener(HERO_EVENT, onChange);
    setState(heroCompact);
    return () => window.removeEventListener(HERO_EVENT, onChange);
  }, []);
  return state;
}
