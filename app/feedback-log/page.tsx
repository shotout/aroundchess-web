"use client";
import MistakeLog from "@/components/mistake-log/MistakeLog";
import Navigation from "@/components/navigator/navigation";
import { usePgnStore } from "../store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
export default function FeedbackLog() {
  const { isLoading } = usePgnStore();
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
