"use client";

import Navigation from "@/components/navigator/navigation";
import ChessProgressionUI from "./TrainingPage";
import { trackCustomEvent } from "../utils/facebookPixel";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
      trackCustomEvent("ViewTrainingPlan");
    }, []);
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full">
            <ChessProgressionUI />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
