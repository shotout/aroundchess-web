"use client";

import React from "react";
import Navigation from "@/components/navigator/navigation";
import StageDetailView from "../../../components/board/StageDetailView";

export default function Page({
  params,
}: {
  params: { slug: string; position: string; stageNum: string };
}) {
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
