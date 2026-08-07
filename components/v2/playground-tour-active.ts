"use client";

import { useEffect, useState } from "react";

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

export function usePlaygroundTourActive() {
  const [state, setState] = useState(active);
  useEffect(() => {
    const onChange = (e: Event) => setState((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, onChange);
    setState(active);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  return state;
}
