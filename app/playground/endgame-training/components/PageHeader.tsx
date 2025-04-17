import React from "react";

interface PageHeaderProps {
  activeTab: string;
  viewState: any;
}

export default function PageHeader({ activeTab, viewState }: PageHeaderProps) {
  return (
    <div className="w-auto">
      <h1 className="text-2xl font-bold text-gray-800">
        {activeTab === "board" ? (
          <>
            <span className="inline mr-2">⊞</span>
            Choose your board presentation
          </>
        ) : (
          <>
            <span className="inline mr-2">⚡</span>
            Checkmate in...
          </>
        )}
      </h1>
      {activeTab === "move" && viewState.view === "categories" && (
        <div className="text-gray-600 border p-1 rounded-md text-xs w-auto">
          Challenge yourself and achieve Checkmate in a specific amount of
          moves. Everytime you start a Game in this section, the Board
          Presentation will be different!
        </div>
      )}
    </div>
  );
}
