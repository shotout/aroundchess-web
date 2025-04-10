"use client";

import { createChessLessonStore } from "@/components/handbooks/CreateChessLessonStore";
import { EndgameLesson } from "@/components/handbooks/ChessLessonTypes";

export const useEndgameStore = createChessLessonStore<EndgameLesson>({
  storeName: "endgames-store",
  lessonType: "endgame",
  apiEndpoint: "handbooks",
});