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
      {!showAnalyzePopup && <PlaygroundTourGate />}
      <Suspense>
        <PlayPage />
      </Suspense>
    </div>
  );
}
