"use client";

import React, { use } from "react";
import Navigation from "@/components/navigator/navigation";
import StageDetailView from "../../../components/board/StageDetailView";
type Props = {
  params: Promise<{ slug: string; position: string; stageNum: string }>;
};

export default function Page(props: Props) {
  const params = use(props.params);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full flex justify-center items-center">
            <StageDetailView
              categorySlug={params.slug}
              subcategorySlug={params.position}
              stageNumber={params.stageNum.replace("stage-", "")}
            />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
