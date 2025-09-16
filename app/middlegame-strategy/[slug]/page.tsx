"use client";
import ChessLessonDetail from "@/components/handbooks/ChessLessonDetail";
import Navigation from "@/components/navigator/navigation";
import { use, useMemo } from "react";
import { useMiddlegameStore } from "../MiddlegameStore";
type Props = {
  params: Promise<{ slug: string }>;
};

export default function Page(props: Props) {
  const params = use(props.params);
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
