"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LazyPlaygroundTour = dynamic(
  () => import("@/components/v2/playground-tour"),
  { ssr: false }
);

const PENDING_KEY = "ac_playground_tour_pending_v1";
export const PLAYGROUND_TOUR_EVENT = "playground-tour:start";

export function isPlaygroundTourPending() {
  try {
    return !!localStorage.getItem(PENDING_KEY);
  } catch {
    return false;
  }
}

export function queuePlaygroundTour() {
  try {
    localStorage.setItem(PENDING_KEY, "1");
  } catch {}
}

export function startPlaygroundTour() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PLAYGROUND_TOUR_EVENT));
  }
}

export function PlaygroundTourGate({ autoStart = true }: { autoStart?: boolean }) {
  const [load, setLoad] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    try {
      const forced =
        new URLSearchParams(window.location.search).get("tour") === "playground";
      if (forced || (autoStart && !!localStorage.getItem(PENDING_KEY))) {
        setLoad(true);
        return;
      }
    } catch {
      return;
    }
    const start = () => {
      setManual(true);
      setLoad(true);
    };
    window.addEventListener(PLAYGROUND_TOUR_EVENT, start);
    window.__startPlaygroundTour = start;
    return () => {
      window.removeEventListener(PLAYGROUND_TOUR_EVENT, start);
      if (window.__startPlaygroundTour === start) delete window.__startPlaygroundTour;
    };
  }, [autoStart]);

  if (!load) return null;
  return <LazyPlaygroundTour autoStart={autoStart} forceStart={manual} />;
}

export default PlaygroundTourGate;
