"use client";

import { Suspense } from "react";
import { LeaderboardPage } from "@/components/v2/leaderboard-page";

export const dynamic = "force-dynamic";

export default function Leaderboard() {
  return (
    <Suspense>
      <LeaderboardPage />
    </Suspense>
  );
}
