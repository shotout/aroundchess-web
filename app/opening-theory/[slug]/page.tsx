"use client";

import ChessLessonDetail from "@/components/handbooks/ChessLessonDetail";
import Navigation from "@/components/navigator/navigation";
import { useMemo } from "react";
import { useOpeningStore } from "../OpeningStore";

export default function Page({ params }: { params: { slug: string } }) {
  const openingStore = useMemo(() => useOpeningStore, []);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full -mt-16 sm:-mt-16 md:-mt-20 lg:-mt-20 xl:mt-0">
            <ChessLessonDetail
              params={params}
              lessonType="opening"
              lessonStore={openingStore()}
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
