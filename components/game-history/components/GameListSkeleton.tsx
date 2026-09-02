import React from "react";

const SkeletonCell = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />
);

const SkeletonRow = () => {
  const DESKTOP_GRID_TEMPLATE = "0.5fr 1.5fr 1fr 1fr 2fr 1fr 1fr 1fr 2fr 1fr 2fr";
  
  return (
    <div
      className="grid py-3 border-b border-gray-200 bg-white hover:bg-blue-50"
      style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
    >
      {/* # */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-6" height="h-3" />
      </div>
      
      {/* Date */}
      <div className="flex items-center px-4">
        <SkeletonCell width="w-20" />
      </div>
      
      {/* Time Control */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-12" />
      </div>
      
      {/* Result */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-8" />
      </div>
      
      {/* Opponent */}
      <div className="flex items-center px-4">
        <SkeletonCell width="w-24" />
      </div>
      
      {/* Rating */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-12" />
      </div>
      
      {/* Game Type */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-16" />
      </div>
      
      {/* Moves */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-8" />
      </div>
      
      {/* Opening */}
      <div className="flex items-center px-4">
        <SkeletonCell width="w-32" />
      </div>
      
      {/* Source */}
      <div className="flex items-center px-2">
        <SkeletonCell width="w-16" />
      </div>
      
      {/* Actions */}
      <div className="px-4">
        <div className="h-8 w-full bg-gray-200 rounded-3xl animate-pulse" />
      </div>
    </div>
  );
};

// Main skeleton loading component
const DesktopTableSkeleton = ({ rows = 10 }) => {
  const DESKTOP_GRID_TEMPLATE = "0.5fr 1.5fr 1fr 1fr 2fr 1fr 1fr 1fr 2fr 1fr 2fr";
  
  return (
    <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200">
      {/* Header Row */}
      <div
        className="grid bg-blue-100 py-3 text-[14px] --xs font-medium text-gray-700"
        style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
      >
        <div className="px-2 text-left invisible">#</div>
        <div className="px-4 text-left">Date</div>
        <div className="px-2 text-left">Time Control</div>
        <div className="px-2 text-left">Result</div>
        <div className="px-4 text-left">Opponent</div>
        <div className="px-2 text-left">Rating</div>
        <div className="px-2 text-left">Game Type</div>
        <div className="px-2 text-left">Moves</div>
        <div className="px-4 text-left">Opening</div>
        <div className="px-2 text-left">Source</div>
        <div className="px-4 text-center">Actions</div>
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    </div>
  );
};

// Mobile skeleton component
const MobileCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex justify-between items-start mb-3">
      <SkeletonCell width="w-20" height="h-4" />
      <SkeletonCell width="w-12" height="h-4" />
    </div>
    
    <div className="space-y-2 mb-3">
      <SkeletonCell width="w-32" height="h-3" />
      <SkeletonCell width="w-24" height="h-3" />
      <SkeletonCell width="w-28" height="h-3" />
    </div>
    
    <div className="flex justify-between items-center">
      <SkeletonCell width="w-16" height="h-3" />
      <div className="h-8 w-20 bg-gray-200 rounded-3xl animate-pulse" />
    </div>
  </div>
);

const MobileSkeletonGrid = ({ cards = 8 }) => (
  <div className="lg:hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] md:gap-2">
      {Array.from({ length: cards }).map((_, index) => (
        <MobileCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Complete skeleton loading component
const GamesListSkeleton = ({ desktopRows = 10, mobileCards = 8 }) => (
  <div className="p-0 md:p-4 xl:p-0">
    <DesktopTableSkeleton rows={desktopRows} />
    <MobileSkeletonGrid cards={mobileCards} />
  </div>
);

export default GamesListSkeleton;