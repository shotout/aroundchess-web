"use client";
import ChessLessonPage from "@/components/handbooks/ChessLessonPage";
import Navigation from "@/components/navigator/navigation";
import { useEffect, useMemo } from "react";
import { useEndgameStore } from "./EndgameStore";
import { trackCustomEvent } from "../utils/facebookPixel";

export default function Page() {
  const endgameStore = useMemo(() => useEndgameStore, []);
  useEffect(() => {
    trackCustomEvent("ViewEndgameHandbook");
  }, []);
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full xl:mt-16">
            <ChessLessonPage
              lessonType="endgame"
              lessonStore={endgameStore()}
              title="Endgame Mastery"
              description="Master the crucial final phase of the game with our comprehensive endgame lessons"
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
