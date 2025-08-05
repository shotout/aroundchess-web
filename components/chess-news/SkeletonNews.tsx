export function ArticleSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-md overflow-hidden p-2 border border-input shadow-md h-[240px] sm:h-[254px] animate-pulse bg-gray-100"
        >
          <div className="w-full h-[100px] sm:h-[115px] bg-gray-200 rounded-md mb-2" />
          <div className="px-2 py-1">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="h-3 w-16 bg-gray-300 rounded" />
              <div className="h-3 w-12 bg-gray-300 rounded" />
            </div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-full bg-gray-200 rounded mb-1" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CategorySkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="py-2 px-3 rounded-[4px] bg-gray-100 border border-input animate-pulse min-h-[40px] sm:min-h-[44px]"
        >
          <div className="h-3 w-3/4 bg-gray-300 rounded mx-auto" />
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="flex flex-col p-4 gap-2 animate-pulse">
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white xl:w-2/3">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="w-full h-64 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-100 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
        </div>
        <div className="md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full xl:w-1/3">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <div className="w-16 h-16 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-2/3 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}