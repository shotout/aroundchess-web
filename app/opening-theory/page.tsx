"use client";

import Navigation from "@/components/navigator/navigation";
import OpeningTheoryPage from "@/components/opening-theory/OpeningTheoryPage";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const { sessionId } = useAuth();

  useEffect(() => {
    if (!sessionId) return;
    console.log(sessionId);
  }, [sessionId]);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full xl:mt-16">
            <OpeningTheoryPage />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
