import React from "react";

const ChessFAQSkeleton = () => {
  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-[#BDD5FF] via-[#FCFCFD] to-[#FCFCFD] gap-3">
      {/* Header Section Skeleton */}
      <div className="relative flex justify-center p-[16px] md:mt-[72px]">
        {/* Background placeholder */}
        <div className="w-full absolute inset-0 bg-gray-200 animate-pulse rounded-md"></div>
        
        {/* Logo placeholder */}
        <div className="flex items-center">
          <div className="w-[155.75px] h-[50px] bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="flex justify-center px-[16px]">
        <div className="h-[18px] md:h-[33.47px] w-[280px] md:w-[400px] bg-gray-300 animate-pulse rounded-md"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="relative flex flex-row items-center md:w-[445px] md:self-center mx-[16px] p-3 gap-2 bg-[#F8F9FC] rounded-md border border-[#DEDEDE]">
        <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-full"></div>
        <div className="w-full h-4 bg-gray-300 animate-pulse rounded-md"></div>
      </div>

      {/* Desktop Tabs Skeleton */}
      <div className="hidden md:flex w-[95%] z-[2] self-center flex-row items-center justify-center xl:justify-around gap-8 mx-[16px] z-1 mt-[100px] rounded-[8px]">
        {[1, 2].map((index) => (
          <div
            key={index}
            className="relative flex flex-row items-center justify-center bg-[#FFF] sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[522px] py-[24px] pr-[9px] h-[92px] border border-[#DEDEDE] rounded-[8px]"
          >
            {/* Background image placeholder */}
            <div className="sm:w-2/3 lg:w-[120px] h-full absolute inset-0 bg-gray-200 animate-pulse rounded-md"></div>
            
            {/* Tab content placeholder */}
            <div className="z-10 flex flex-col items-center justify-center bg-[#ffffff80] w-fill p-[12px] min-h-[44px] max-h-[71px] rounded-[12px] self-center justify-self-center">
              <div className="w-24 h-5 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Tabs Skeleton */}
      <div className="md:hidden flex flex-row mx-[16px]">
        <div className="flex flex-col items-center justify-center px-[12px] h-[42px] rounded-[12px] w-[40%] bg-white border border-gray-300 rounded-md mr-1">
          <div className="w-16 h-3 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
        <div className="flex flex-col items-center justify-center px-[12px] h-[42px] rounded-[12px] w-[60%] bg-white border border-gray-300 rounded-md">
          <div className="w-20 h-3 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>

      {/* Active Tab Title Skeleton */}
      <div className="flex justify-center mx-4 mt-8">
        <div className="h-[16px] md:h-[24px] w-[200px] md:w-[300px] bg-gray-300 animate-pulse rounded-md"></div>
      </div>

      {/* FAQ Items Skeleton */}
      <div className="space-y-3 mx-4 mb-[32px] z-[2]">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="bg-white rounded-md shadow">
            {/* Question skeleton */}
            <div className="w-full px-[20px] py-2 flex justify-between items-center">
              <div className="w-[70%] h-[12px] md:h-[16px] bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-full"></div>
            </div>

            {/* Answer skeleton (shown for first item to demonstrate expanded state) */}
            {index === 1 && (
              <div className="px-[20px] py-[5px] md:py-[10px] border-t bg-[#F2FBFE]">
                <div className="space-y-2">
                  <div className="w-full h-[12px] md:h-[14px] bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="w-[85%] h-[12px] md:h-[14px] bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="w-[92%] h-[12px] md:h-[14px] bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessFAQSkeleton;