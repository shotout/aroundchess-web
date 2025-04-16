"use client";

import Navigation from "@/components/navigator/navigation";
import React from "react";
import Welcome from "./Welcome";

const BoardVisionPage: React.FC = () => {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full h-[calc(100vh-56px)] xl:h-[calc(100vh-97px)] flex justify-center items-center">
            <Welcome />
          </div>
        </Navigation>
      </div>
    </div>
  );
};

export default BoardVisionPage;
