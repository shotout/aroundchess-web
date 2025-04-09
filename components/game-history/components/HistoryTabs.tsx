import React, { useState } from "react";
import UserHistory from "../components/UserHistory";
import OtherHistory from "../components/OtherHistory";

interface HistoryTabsProps {
  username: string | null;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ username }) => {
  const [activeTab, setActiveTab] = useState<"user" | "other">("user");

  return (
    <div className="lg:border-2 lg:p-4 xl:p-0 lg:rounded-md bg-white">
      <div className="flex justify-center flex-col">
        {/* Desktop Tab Navigation */}
        <div className="xl:flex justify-center hidden">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 text-center py-3 text-lg
              ${
                activeTab !== "user"
                  ? "text-black border-b border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
                  : "font-bold"
              }
              ${activeTab === "user" ? "rounded-tl-md" : ""}
              border-r border-gray-200`}
          >
            {username || "My Games"}
          </button>
          <button
            onClick={() => setActiveTab("other")}
            className={`flex-1 text-center py-3 text-lg
              ${
                activeTab !== "other"
                  ? "text-black border-b border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
                  : "font-bold"
              }
              ${activeTab === "other" ? "rounded-tr-md" : ""}`}
          >
            Other Games
          </button>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="xl:hidden flex justify-center mb-4">
          <div className="flex w-full shadow-sm border rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 text-center py-2 text-sm
                ${
                  activeTab === "user"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "bg-white text-gray-600"
                }`}
            >
              {username || "My Games"}
            </button>
            <button
              onClick={() => setActiveTab("other")}
              className={`flex-1 text-center py-2 text-sm
                ${
                  activeTab === "other"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "bg-white text-gray-600"
                }`}
            >
              Other Games
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="xl:mt-4">
          {activeTab === "user" && <UserHistory />}
          {activeTab === "other" && <OtherHistory />}
        </div>
      </div>
    </div>
  );
};

export default HistoryTabs;
