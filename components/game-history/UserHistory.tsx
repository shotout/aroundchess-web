import React, { useState } from "react";
import GamesTab from "./GamesTab/GamesTab";
import Analytics from "./Analytics/Analytics";
import Performance from "./Performance/Performance";

const UserHistory = () => {
  const Tabs = ["Games", "Analytics", "Performance"] as const;
  type TabType = (typeof Tabs)[number];
  const [tab, setTab] = useState<TabType>("Games");

  return (
    <div className="w-full">
      {/* Full-width container with bottom border */}
      <div className="w-full xl:border-b-2 border-[#DEDEDE] mb-4">
        {/* Tabs container */}
        <div className="flex justify-between items-center mb-2 px-4">
          <div className="mb-4 w-full overflow-hidden rounded-md bg-[#F9FAFC] md:bg-transparent border-[1px] md:border-none border-[#DEDEDE]">
            <div className="flex justify-center items-center h-12 text-xs lg:text-sm px-2">
              {Tabs.map((t, index) => (
                <button
                  key={index}
                  onClick={() => setTab(t)}
                  className={`flex-1 bg-transparent text-center py-2 mx-auto rounded-md font-semibold ${
                    tab === t
                      ? " text-black border border-[#DEDEDE] shadow-card"
                      : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="xl:p-4">
        {tab === "Games" && <GamesTab />}
        {tab === "Analytics" && <Analytics />}
        {tab === "Performance" && <Performance />}
      </div>
    </div>
  );
};

export default UserHistory;
