import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import GamesTab from "./GamesTab/GamesTab";
import Analytics from "./Analytics/Analytics";
import Performance from "./Performance/Performance";

const OtherHistory = () => {
  const Tabs = ["Games", "Analytics", "Performance"] as const;
  type TabType = (typeof Tabs)[number];
  const [tab, setTab] = useState<TabType>("Games");

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <Card className="mb-4 w-full overflow-hidden border-[1px] lg:border-none border-[#DEDEDE]">
          <div className="flex justify-center items-center h-12 text-xs lg:text-sm px-2">
            {Tabs.map((t, index) => (
              <button
                key={index}
                onClick={() => setTab(t)}
                className={`flex-1 bg-transparent text-center py-2 mx-auto rounded-md font-semibold ${
                  tab === t
                    ? " text-black shadow-sm border border-[#DEDEDE]"
                    : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>
      </div>
      {tab === "Games" && <GamesTab />}
      {tab === "Analytics" && <Analytics />}
      {tab === "Performance" && <Performance />}
    </div>
  );
};

export default OtherHistory;
