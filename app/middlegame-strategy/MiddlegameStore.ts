"use client"

import { MiddlegameLesson } from "@/components/handbooks/ChessLessonTypes";
import { createChessLessonStore } from "@/components/handbooks/CreateChessLessonStore";

export const useMiddlegameStore = createChessLessonStore<MiddlegameLesson>({
  storeName: "middlegames-store",
  lessonType: "middlegame",
  apiEndpoint: "handbooks",
});