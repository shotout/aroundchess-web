"use client";

import Navigation from "@/components/navigator/navigation";
import React from "react";
import UserPGN from "./components/UserPGN";

const Page: React.FC = () => {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full h-auto 2xl:h-[calc(100vh-97px)] flex justify-center items-center pb-10 xl:pb-0">
            <UserPGN />
          </div>
        </Navigation>
      </div>
    </div>
  );
};

export default Page;
