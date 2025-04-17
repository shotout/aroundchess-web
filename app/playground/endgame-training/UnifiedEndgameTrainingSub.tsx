"use client";

import React from "react";
import CheckmateTrainingView from "./components/moves/CheckmateTrainingView";
import EndgameTrainingView from "./components/board/EndgameTrainingView";

interface UnifiedEndgameTrainingSubProps {
  params: { slug: string };
}

export default function UnifiedEndgameTrainingSub({
  params,
}: UnifiedEndgameTrainingSubProps) {
  const isCheckmateMode = params.slug.startsWith("checkmate-");

  return (
    <div className="w-full h-full p-6 flex flex-col space-y-4">
      {isCheckmateMode ? (
        <CheckmateTrainingView
          slug={params.slug}
          data={[]}
          onPositionSelect={function (positionIndex: number): void {
            throw new Error("Function not implemented.");
          }}
          onBackClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ) : (
        <EndgameTrainingView slug={params.slug} />
      )}
    </div>
  );
}
