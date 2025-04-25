"use client";

import Navigation from "@/components/navigator/navigation";
import ChessProgressionUI from "./TrainingPage";

export default function Page() {
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
