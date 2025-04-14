"use client";

import Navigation from "@/components/navigator/navigation";
import React from "react";
import Welcome from "./Welcome";

const BoardVisionPage: React.FC = () => {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="xl:-mt-16">
            <div className="w-full flex justify-center items-center h-screen">
              <Welcome />
            </div>
          </div>
        </Navigation>
      </div>
    </div>
  );
};

export default BoardVisionPage;
