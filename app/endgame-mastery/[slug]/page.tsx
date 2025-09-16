"use client";
import ChessLessonDetail from "@/components/handbooks/ChessLessonDetail";
import Navigation from "@/components/navigator/navigation";
import { useMemo } from "react";
import { useEndgameStore } from "../EndgameStore";

interface EndgamePageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: EndgamePageProps) {
  const endgameStore = useMemo(() => useEndgameStore, []);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full -mt-16 sm:-mt-16 md:-mt-20 lg:-mt-20 xl:mt-0">
            <ChessLessonDetail
              params={params}
              lessonType="endgame"
              lessonStore={endgameStore()}
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
