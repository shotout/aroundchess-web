"use client";
import ChessLessonPage from "@/components/handbooks/ChessLessonPage";
import Navigation from "@/components/navigator/navigation";
import { useEffect, useMemo } from "react";
import { useMiddlegameStore } from "./MiddlegameStore";
import { trackCustomEvent } from "../utils/facebookPixel";

export default function Page() {
  const middlegameStore = useMemo(() => useMiddlegameStore, []);
useEffect(() => {
    trackCustomEvent("ViewMiddlegameHandbook");
  }, []);
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full xl:mt-16">
            <ChessLessonPage
              lessonType="middlegame"
              lessonStore={middlegameStore()}
              title="Middlegame Strategy"
              description="Master the critical middle phase of the game with our comprehensive strategy lessons"
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
