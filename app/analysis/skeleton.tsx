export const AnalysisSkeleton = () => {
  return (
    <div className="flex flex-col xl:flex-row-reverse gap-4 xl:gap-x-6 justify-center py-4 max-w-full overflow-hidden">
      <div className="flex-shrink-0 w-full xl:w-80">
        <div className="bg-gray-200 animate-pulse rounded-lg h-96 mb-4"></div>
        <div className="space-y-3">
          <div className="bg-gray-200 animate-pulse rounded h-4 w-3/4"></div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-1/2"></div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-2/3"></div>
        </div>
      </div>
      <div className="flex-shrink-1 min-w-0 w-full">
        <div className="bg-gray-200 animate-pulse rounded-lg h-96 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-200 animate-pulse rounded h-24"></div>
          <div className="bg-gray-200 animate-pulse rounded h-24"></div>
          <div className="bg-gray-200 animate-pulse rounded h-24"></div>
          <div className="bg-gray-200 animate-pulse rounded h-24"></div>
        </div>
      </div>
    </div>
  );
};