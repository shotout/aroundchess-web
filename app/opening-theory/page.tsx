"use client";

import Navigation from "@/components/navigator/navigation";
import OpeningTheoryPage from "@/components/opening-theory/OpeningTheoryPage";

export default function Page() {
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
