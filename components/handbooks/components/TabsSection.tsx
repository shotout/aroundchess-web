import React, { useState } from "react";
import ResourceSection from "./ResourcesSection";

interface TabsSectionProps {
  resources: any[] | undefined;
  videos: any[] | undefined;
  puzzles: any[] | undefined;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  resources,
  videos,
  puzzles,
}) => {
  const [activeTab, setActiveTab] = useState<string>("resources");

  const tabs = [
    { id: "resources", label: "Resources" },
    { id: "videos", label: "Videos" },
    { id: "puzzles", label: "Puzzles" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="p-2 flex bg-[#F9FAFC] rounded-lg border h-auto items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 p-[10px] font-medium text-center rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-white shadow-md text-black font-bold"
                : "text-gray-600 font-normal hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "resources" && (
          <ResourceSection resources={resources} title="Resources" />
        )}
        {activeTab === "videos" && (
          <ResourceSection resources={videos} title="Videos" />
        )}
        {activeTab === "puzzles" && (
          <ResourceSection resources={puzzles} title="Puzzles" />
        )}
      </div>
    </div>
  );
};

export default TabsSection;
