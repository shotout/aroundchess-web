"use client";

import Navigation from "@/components/navigator/navigation";
import OpeningDetailWithNextTopics from "@/components/opening-theory/OpeningDetail";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full -mt-16 sm:-mt-16 md:-mt-20 lg:-mt-20 xl:mt-0">
            <OpeningDetailWithNextTopics params={params} />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
