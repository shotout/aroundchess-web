"use client";

import { Suspense, useEffect, useState } from "react";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { PlayPage } from "@/components/v2/play-page";
import AnalyzeGameFreePopup from "@/components/v2/analyze-game-free-popup";
import { DayStreakLoginTrigger } from "@/components/v2/day-streak-login-trigger";
import { PlaygroundTourGate } from "@/components/v2/playground-tour-gate";

export default function PlayVSAI() {
  const [showAnalyzePopup, setShowAnalyzePopup] = useState(false);

  useEffect(() => {
    trackCustomEvent("ViewPlayVSAI");
    if (sessionStorage.getItem("showAnalyzePopup") === "true") {
      sessionStorage.removeItem("showAnalyzePopup");
      setShowAnalyzePopup(true);
    }
  }, []);

  // Deep link from the leaderboard's "Play Now" (/play#play-vs-ai): the hero is
  // rendered inside a Suspense boundary, so poll briefly until it mounts rather
  // than relying on the browser's one-shot hash scroll.
  useEffect(() => {
    if (window.location.hash !== "#play-vs-ai") return;
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById("play-vs-ai");
      if (el) {
        el.style.scrollMarginTop = "100px";
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(timer);
      } else if (++tries > 40) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <AnalyzeGameFreePopup
        visible={showAnalyzePopup}
        onClose={() => setShowAnalyzePopup(false)}
      />
      <DayStreakLoginTrigger suppressed={showAnalyzePopup} />
      {/* Mounted only once the analyze popup is closed so the tour's
          auto-start never opens over it. */}
      {!showAnalyzePopup && <PlaygroundTourGate />}
      <Suspense>
        <PlayPage />
      </Suspense>
    </div>
  );
}
