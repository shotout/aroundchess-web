"use client";

import React from "react";
import Navigation from "@/components/navigator/navigation";
import UnifiedEndgameTrainingSub from "../UnifiedEndgameTrainingSub";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full flex justify-center items-center">
            <UnifiedEndgameTrainingSub params={params} />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
