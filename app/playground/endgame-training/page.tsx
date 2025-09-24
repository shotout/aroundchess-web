"use client";

import React, { useEffect } from "react";
import Navigation from "@/components/navigator/navigation";
import EndgameTrainingPage from "./EndgameTrainingPage";
import { trackCustomEvent } from "@/app/utils/facebookPixel";

export default function Page() {
  useEffect(() => {
      trackCustomEvent("ViewEndgameTraining");
    }, []);
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full flex h-auto justify-center items-center">
            <EndgameTrainingPage />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
