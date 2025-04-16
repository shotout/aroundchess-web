"use client";

import Navigation from "@/components/navigator/navigation";
import EndgameTrainingPage from "./components/EndgameTrainingPage";

export default function Page() {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="xl:-mt-16">
            <EndgameTrainingPage />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
