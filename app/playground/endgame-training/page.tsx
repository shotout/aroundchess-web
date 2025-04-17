"use client";

import React from "react";
import Navigation from "@/components/navigator/navigation";
import EndgameTrainingPage from "./EndgameTrainingPage";

export default function Page() {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full flex justify-center items-center">
            <EndgameTrainingPage />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
