"use client";

import { OpeningLesson } from "@/components/handbooks/ChessLessonTypes";
import { createChessLessonStore } from "@/components/handbooks/CreateChessLessonStore";

export const useOpeningStore = createChessLessonStore<OpeningLesson>({
  storeName: "openings-store",
  lessonType: "opening",
  apiEndpoint: "handbooks",
});
