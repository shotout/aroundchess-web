"use client";
import ChessLessonDetail from "@/components/handbooks/ChessLessonDetail";
import Navigation from "@/components/navigator/navigation";
import { useMiddlegameStore } from "../page";
import { useMemo } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const middlegameStore = useMemo(() => useMiddlegameStore, []);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full -mt-16 sm:-mt-16 md:-mt-20 lg:-mt-20 xl:mt-0">
            <ChessLessonDetail
              params={params}
              lessonType="middlegame"
              lessonStore={middlegameStore()}
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
