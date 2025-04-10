"use client";
import ChessLessonPage from "@/components/handbooks/ChessLessonPage";
import { MiddlegameLesson } from "@/components/handbooks/ChessLessonTypes";
import { createChessLessonStore } from "@/components/handbooks/CreateChessLessonStore";
import Navigation from "@/components/navigator/navigation";
import { useMemo } from "react";

export const useMiddlegameStore = createChessLessonStore<MiddlegameLesson>({
  storeName: "middlegames-store",
  lessonType: "middlegame",
  apiEndpoint: "handbooks",
});

export default function Page() {
  const middlegameStore = useMemo(() => useMiddlegameStore, []);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full mt-16">
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
