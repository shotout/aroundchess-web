import React, { useState } from "react";
import UserHistory from "../components/UserHistory";
import OtherHistory from "../components/OtherHistory";
import { usePgnStore } from "@/app/store/zustandStore";
import { useTutorial } from "@/components/TutorialProvider";

interface HistoryTabsProps {
  username: string | null;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ username }) => {
  const { activeUser, setActiveUser } = usePgnStore();
  const { isTutorialPlay, dataTutorial } = useTutorial();

  return (
    <div className="xl:px-4 pb-4">
      <div className="flex justify-center flex-col xl:border xl:rounded-md">
        <div className="flex justify-center  border-gray-200 rounded-t-md overflow-hidden">
          <button
            onClick={() => setActiveUser("user")}
            className={`flex-1 py-3 text-center text-[14px] --sm md:text-base xl:text-lg transition-colors
              ${
                activeUser === "user"
                  ? "font-bold "
                  : "text-black border-b border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
              }
              ${activeUser === "user" ? "rounded-tl-md" : ""}
              border-r border-gray-200`}
          >
            {isTutorialPlay ? dataTutorial.username : username || "My Games"}
          </button>
          <button
            onClick={() => setActiveUser("other")}
            className={`flex-1 py-3 text-center text-[14px] --sm md:text-base xl:text-lg transition-colors
              ${
                activeUser === "other"
                  ? "font-bold "
                  : "text-black border-b border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
              }
              ${activeUser === "other" ? "rounded-tr-md" : ""}`}
          >
            Other Games
          </button>
        </div>

        <div className="mt-4">
          {activeUser === "user" && <UserHistory />}
          {activeUser === "other" && <OtherHistory />}
        </div>
      </div>
    </div>
  );
};

export default HistoryTabs;
