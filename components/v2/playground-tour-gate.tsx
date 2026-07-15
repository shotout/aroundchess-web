"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lightweight mount gate for the playground tour. The tour itself pulls in
// chess.js, swiper, and the chessboard components, so it's loaded as a
// separate chunk only when the tour will actually show: first visit, an
// explicit ?tour=playground, or a manual trigger. Returning visitors never
// download any of it.

const LazyPlaygroundTour = dynamic(
  () => import("@/components/v2/playground-tour"),
  { ssr: false }
);

const DONE_KEY = "ac_playground_tour_done_v1";
export const PLAYGROUND_TOUR_EVENT = "playground-tour:start";

// Import the replay trigger from here (not from playground-tour) so a
// "Replay tutorial" button doesn't statically pull in the heavy chunk.
export function startPlaygroundTour() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PLAYGROUND_TOUR_EVENT));
  }
}

export function PlaygroundTourGate({ autoStart = true }: { autoStart?: boolean }) {
  const [load, setLoad] = useState(false);
  // set when the load was caused by a manual trigger, so the tour opens
  // immediately instead of re-checking its auto-start conditions
  const [manual, setManual] = useState(false);

  useEffect(() => {
    try {
      const forced =
        new URLSearchParams(window.location.search).get("tour") === "playground";
      if (forced || (autoStart && !localStorage.getItem(DONE_KEY))) {
        setLoad(true);
        return;
      }
    } catch {
      return;
    }
    // Already seen: stay unloaded, but keep the manual triggers working.
    // Once the tour mounts it installs its own handlers over these.
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
