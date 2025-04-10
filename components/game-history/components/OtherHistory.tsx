import React from "react";
import OtherGamesTab from "./other-history/OtherGamesTab";

const OtherHistory: React.FC = () => {
  return (
    <div className="w-full">
      <div className="w-full xl:border-b-2 border-[#DEDEDE]">
        <div className="flex justify-between items-center px-4">
          <div className="mb-4 hidden xl:flex w-full overflow-hidden border-[1px] lg:border-none border-[#DEDEDE]"></div>
        </div>
      </div>
      <OtherGamesTab />
    </div>
  );
};

export default OtherHistory;
