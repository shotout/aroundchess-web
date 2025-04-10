"use client";
import EndgamePage from "@/components/endgame-mastery/EndgamePage";
import ChessLessonPage from "@/components/handbooks/ChessLessonPage";
import { EndgameLesson } from "@/components/handbooks/ChessLessonTypes";
import { createChessLessonStore } from "@/components/handbooks/CreateChessLessonStore";
import Navigation from "@/components/navigator/navigation";
import { useMemo } from "react";

export const useEndgameStore = createChessLessonStore<EndgameLesson>({
  storeName: "endgames-store",
  lessonType: "endgame",
  apiEndpoint: "handbooks",
});

export default function Page() {
  const endgameStore = useMemo(() => useEndgameStore, []);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full mt-16">
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
