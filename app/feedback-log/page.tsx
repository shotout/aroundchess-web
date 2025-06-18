"use client";
import MistakeLog from "@/components/mistake-log/MistakeLog";
import Navigation from "@/components/navigator/navigation";
import { usePgnStore } from "../store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { useEffect, useState } from "react";
import DotSpinner from "@/components/game-history/Spinner";
export default function FeedbackLog() {
  const { isLoading, hydrated } = usePgnStore();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (hydrated) {
      setReady(true);
      console.log(hydrated, "TEST hydrated");
    }
  }, [hydrated]);
  if (!hydrated) return <DotSpinner />;
  if (ready) {
    return (
      <>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className="flex overflow-hidden bg-primary-white">
            <div className="flex flex-col overflow-y-auto w-full">
              <Navigation>
                <div className="w-full">
                  <MistakeLog />
                </div>
              </Navigation>
            </div>
          </div>
        )}
      </>
    );
  }
}
