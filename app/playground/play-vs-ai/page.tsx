"use client";

import { useEffect, useState } from "react";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { PlayPage } from "@/components/v2/play-page";
import AnalyzeGameFreePopup from "@/components/v2/analyze-game-free-popup";
import { DayStreakLoginTrigger } from "@/components/v2/day-streak-login-trigger";
import { PlaygroundTour } from "@/components/v2/playground-tour";

export default function PlayVSAI() {
  const [showAnalyzePopup, setShowAnalyzePopup] = useState(false);

  useEffect(() => {
    trackCustomEvent("ViewPlayVSAI");
    if (sessionStorage.getItem("showAnalyzePopup") === "true") {
      sessionStorage.removeItem("showAnalyzePopup");
      setShowAnalyzePopup(true);
    }
  }, []);

  return (
    <div className="relative">
      <AnalyzeGameFreePopup
        visible={showAnalyzePopup}
        onClose={() => setShowAnalyzePopup(false)}
      />
      <DayStreakLoginTrigger suppressed={showAnalyzePopup} />
      <PlaygroundTour />
      <PlayPage />
    </div>
  );
}
