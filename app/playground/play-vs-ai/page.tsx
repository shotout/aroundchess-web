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

  // Deep links that land on the Play VS AI card (#play-vs-ai): the leaderboard's
  // "Play Now" and the mobile menu's "Play vs AI". The hero is rendered inside a
  // Suspense boundary, so poll briefly until it mounts rather than relying on
  // the browser's one-shot hash scroll. hashchange covers tapping the menu entry
  // while already on this page, where the component never remounts.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const scrollToHero = () => {
      if (window.location.hash !== "#play-vs-ai") return;
      if (timer) clearInterval(timer);
      let tries = 0;
      timer = setInterval(() => {
        const el = document.getElementById("play-vs-ai");
        if (el) {
          el.style.scrollMarginTop = "100px";
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          if (timer) clearInterval(timer);
        } else if (++tries > 40) {
          if (timer) clearInterval(timer);
        }
      }, 100);
    };

    scrollToHero();
    window.addEventListener("hashchange", scrollToHero);
    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener("hashchange", scrollToHero);
    };
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
