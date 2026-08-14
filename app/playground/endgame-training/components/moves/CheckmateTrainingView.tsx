"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckmateTrainingViewProps } from "../../types/EndgameTrainingTypes";

export default function CheckmateTrainingView({
  slug,
  data,
  onPositionSelect,
  onBackClick,
}: CheckmateTrainingViewProps) {
  const router = useRouter();

  const movesToCheckmate = useMemo(() => {
    const match = slug.match(/checkmate-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }, [slug]);

  const checkmatePositions = useMemo(() => {
    if (
      !data ||
      !Array.isArray(data) ||
      movesToCheckmate <= 0 ||
      movesToCheckmate > data.length
    ) {
      return [];
    }

    return data[movesToCheckmate - 1] || [];
  }, [data, movesToCheckmate]);

  const handlePositionSelect = (index: number) => {
    if (onPositionSelect) {
      onPositionSelect(index);
    }

    router.push(
      `/playground/endgame-training/checkmate-${movesToCheckmate}/position-${
        index + 1
      }/stage-${index + 1}`
    );
  };

  if (movesToCheckmate === 0 || checkmatePositions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">Category not found: {slug}</p>
        <button
          onClick={onBackClick}
          className="mt-4 text-blue-600 flex items-center gap-1"
        >
          Back to training selection
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {checkmatePositions.length > 0 ? (
        checkmatePositions.map((fen: string, index: number) => (
          <div
            key={index}
            className="rounded-xl p-4 border border-gray-200 bg-white flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <h3 className="font-semibold text-lg truncate">
                Position {index + 1}
              </h3>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => handlePositionSelect(index)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[14px] --sm flex items-center space-x-1 hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <span>Start practice</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">No positions found for this category.</p>
        </div>
      )}
    </div>
  );
}
