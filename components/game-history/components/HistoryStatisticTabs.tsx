import React, { useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useTutorial } from "@/components/TutorialProvider";
import UserStatisticHistory from "./UserStatisticHistory";

interface HistoryTabsProps {
  username: string | null;
}

const HistoryStatisticTabs: React.FC<HistoryTabsProps> = ({ username }) => {
  const { activeUser, setActiveUser } = usePgnStore();
  const { isTutorialPlay, dataTutorial } = useTutorial();

  return (
    <div className="xl:px-4 pb-4">
      <div className="flex justify-center flex-col xl:border xl:rounded-md">
        <UserStatisticHistory />
      </div>
    </div>
  );
};

export default HistoryStatisticTabs;
