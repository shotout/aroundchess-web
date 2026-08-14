"use client";
import Navigation from "@/components/navigator/navigation";
import { usePgnStore } from "../store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { useEffect, useState } from "react";
import DotSpinner from "@/components/game-history/Spinner";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { trackCustomEvent } from "../utils/facebookPixel";
import SavedMistakePage from "@/components/mistake-log/SavedMistakePage";
import MistakeLog from "@/components/mistake-log/MistakeLog";

export default function FeedbackLog() {
  const { isLoading, hydrated } = usePgnStore();
  const [ready, setReady] = useState(false);
  useEffect(() => {
      trackCustomEvent("ViewFeedbackLog");
    }, []);
  useEffect(() => {
    if (hydrated) {
      setReady(true);
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
                <ChessAccountSetup isLoading={isLoading} />
                <div className="w-full">
                  <SavedMistakePage />
                </div>
              </Navigation>
            </div>
          </div>
        )}
      </>
    );
  }
}
