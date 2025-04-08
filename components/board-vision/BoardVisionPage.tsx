"use client";

import React from "react";
import WelcomeScreen from "./WelcomeScreen";
import { useBoardVisionStore } from "./store/BoardvisionStore";
import DefaultPGN from "./DefaultPGN";
import UserPGN from "./UserPGN";

const BoardVisionPage: React.FC = () => {
  const { appState } = useBoardVisionStore();

  return (
    <div className="w-full flex justify-center items-center h-screen">
      {appState === "welcome" && <WelcomeScreen />}
      {appState === "default" && <DefaultPGN />}
      {appState === "player-game" && <UserPGN />}
    </div>
  );
};

export default BoardVisionPage;
