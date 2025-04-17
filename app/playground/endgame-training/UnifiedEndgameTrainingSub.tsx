"use client";

import React from "react";
import CheckmateTrainingView from "./components/CheckmateTrainingView";
import EndgameTrainingView from "./components/EndgameTrainingView";

export default function UnifiedEndgameTrainingSub({
  params,
}: {
  params: { slug: string };
}) {
  const isCheckmateMode = params.slug.startsWith("checkmate-");

  return (
    <div className="w-full h-full p-6 flex flex-col space-y-4">
      {isCheckmateMode ? (
        <CheckmateTrainingView slug={params.slug} />
      ) : (
        <EndgameTrainingView slug={params.slug} />
      )}
    </div>
  );
}
