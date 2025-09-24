"use client";

import ChessLessonPage from "@/components/handbooks/ChessLessonPage";
import Navigation from "@/components/navigator/navigation";
import { useEffect, useMemo } from "react";
import { useOpeningStore } from "./OpeningStore";
import { trackCustomEvent } from "../utils/facebookPixel";

export default function Page() {
  const openingStore = useMemo(() => useOpeningStore, []);
useEffect(() => {
    trackCustomEvent("ViewOpeningHandbook");
  }, []);
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full xl:mt-16">
            <ChessLessonPage
              lessonType="opening"
              lessonStore={openingStore()}
              title="Opening Theory"
              description="Master the first phase of the game with our comprehensive opening lessons"
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
