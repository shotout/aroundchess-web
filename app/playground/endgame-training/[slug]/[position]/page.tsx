"use client";

import React from "react";
import Navigation from "@/components/navigator/navigation";
import UnifiedPositionDetail from "../../UnifiedPositionDetail";

export default function Page({
  params,
}: {
  params: { slug: string; position: string };
}) {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full flex justify-center items-center">
            <UnifiedPositionDetail params={params} />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
