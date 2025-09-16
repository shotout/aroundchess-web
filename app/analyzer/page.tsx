import React from "react";
import PGNAnalyzer from "@/components/analyzer/PGNAnalyzer";
import { SiteHeader } from "@/components/site-header";


export default function AnalyzePage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-col items-center w-full h-auto p-4 mt-16">
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          <PGNAnalyzer />
        </div>
      </div>
    </>
  );
}
