import { AlertCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

interface PageHeaderProps {
  activeTab: string;
  viewState: any;
}

export default function PageHeader({ activeTab, viewState }: PageHeaderProps) {
  return (
    <div className="w-auto space-y-5 flex flex-col">
      <div className="text-2xl  font-bold text-gray-800">
        {activeTab === "board" ? (
          <div className="flex items-center">
            <AlertCircle className="mr-2" />
            <h1>Choose your board presentation :</h1>
          </div>
        ) : (
          <div className="flex items-center">
            <Image
              src="/endgame-training/check.png"
              width={20}
              height={20}
              alt="Checkmate icon"
              className="mr-2"
            />
            <h1>Checkmate in...</h1>
          </div>
        )}
      </div>
      {activeTab === "move" && viewState.view === "categories" && (
        <div className="text-black border p-3 rounded-md text-sm w-auto h-[40px] flex items-center">
          <h1>
            Challenge yourself and achieve Checkmate in a{" "}
            <span className="font-bold">specific amount of moves.</span>{" "}
            Everytime you start a Game in this section,{" "}
            <span className="font-bold">
              the Board Presentation will be different!
            </span>
          </h1>
        </div>
      )}
    </div>
  );
}
