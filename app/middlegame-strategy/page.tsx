"use client";
import ChessLessonPage from "@/components/handbooks/ChessLessonPage";
import Navigation from "@/components/navigator/navigation";
import { useMemo } from "react";
import { useMiddlegameStore } from "./MiddlegameStore";

export default function Page() {
  const middlegameStore = useMemo(() => useMiddlegameStore, []);

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
