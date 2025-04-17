import React from "react";

interface CheckmateTrainingViewProps {
  slug: string;
  data: string[][];
  onPositionSelect: (positionIndex: number) => void;
  onBackClick: () => void;
}

export default function CheckmateTrainingView({
  slug,
  data,
  onPositionSelect,
  onBackClick,
}: CheckmateTrainingViewProps) {
  // Extract the move count from slug for checkmate mode
  const movesToCheckmate = React.useMemo(() => {
    const match = slug.match(/checkmate-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }, [slug]);

  // Get positions for this checkmate category
  const checkmatePositions = React.useMemo(() => {
    if (
      !data ||
      !Array.isArray(data) ||
      movesToCheckmate <= 0 ||
      movesToCheckmate > data.length
    ) {
      return [];
    }

    // Array is 0-indexed, but our moves count starts at 1
    return data[movesToCheckmate - 1] || [];
  }, [data, movesToCheckmate]);

  // Check if valid moveCount
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

  // Render checkmate positions grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {checkmatePositions.length > 0 ? (
        checkmatePositions.map((fen: string, index: number) => (
          <div
            key={index}
            className="rounded-xl p-4 border border-gray-200 bg-white flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 text-blue-600">♟️</div>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  Position {index + 1}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {`${movesToCheckmate} move checkmate puzzle`}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => onPositionSelect(index)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <span>Start practice</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
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
