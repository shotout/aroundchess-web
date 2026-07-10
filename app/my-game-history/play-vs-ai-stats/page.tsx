"use client";

import { Suspense } from "react";
import Navigation from "@/components/navigator/navigation";
import { PlayVsAiStatsPage } from "@/components/v2/play-vs-ai-stats-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense>
      <div className="flex overflow-hidden bg-primary-white">
        <div className="flex flex-col overflow-y-auto w-full">
          <Navigation>
            <PlayVsAiStatsPage />
          </Navigation>
        </div>
      </div>
    </Suspense>
  );
}
