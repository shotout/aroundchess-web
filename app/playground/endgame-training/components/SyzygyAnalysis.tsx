import React from "react";

const SyzygyAnalysis = ({
  mateDistance,
  playerColor,
  currentTurn,
  isLoading,
}: {
  mateDistance: number | null;
  playerColor: "w" | "b";
  currentTurn: "w" | "b";
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="w-full hidden sm:block p-4 sm:border-t border-gray-200">
        <div className="flex justify-center items-center p-2">
          <p className="text-[14px] --sm text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (mateDistance === null) return null;

  const isUserToMove = currentTurn === playerColor;

  return (
    <div className="w-full sm:p-4 sm:border-t border-gray-200">
      <div className="flex flex-col items-center justify-center gap-y-2 bg-[#007AFF14]/5 border border-[#007AFF] rounded-[4px] sm:rounded-xl py-1 sm:p-4">
        <p className="text-[14px] --sm xl:text-base text-center">
          {isUserToMove
            ? `You can checkmate in ${mateDistance} move${
                mateDistance === 1 ? "" : "s"
              }`
            : `Opponent can checkmate in ${mateDistance} move${
                mateDistance === 1 ? "" : "s"
              }`}
        </p>
      </div>
    </div>
  );
};

export default SyzygyAnalysis;
