"use client";

import Navigation from "@/components/navigator/navigation";
import React, { useEffect } from "react";
import Welcome from "./Welcome";
import { trackCustomEvent } from "@/app/utils/facebookPixel";

const BoardVisionPage: React.FC = () => {
  useEffect(() => {
    trackCustomEvent("ViewBoardVision");
  }, []);
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full  h-screen 2xl:h-[calc(100vh-97px)] flex justify-center items-center">
            <Welcome />
          </div>
        </Navigation>
      </div>
    </div>
  );
};

export default BoardVisionPage;
