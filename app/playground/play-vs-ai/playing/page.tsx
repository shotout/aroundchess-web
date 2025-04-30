"use client";
import { usePgnStore } from "@/app/store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import Navigation from "@/components/navigator/navigation";

import PlayingPage from "@/components/playground/play-vs-ai/PlayingPage";

export default function Playing() {
  const { isLoading: loadingAnalyze } = usePgnStore();

  if (loadingAnalyze) return <LoadingPage />;
  return (
    <Navigation>
      <PlayingPage />
    </Navigation>
  );
}
