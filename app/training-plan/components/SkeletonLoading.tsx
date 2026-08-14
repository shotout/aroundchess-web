import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const UserProfileCardSkeleton: React.FC = () => (
  <div className="xl:border xl:border-blue-base lg:rounded-md bg-[#F6F9FF] shadow-sm">
    <div className="p-4 gap-y-4 flex flex-col animate-pulse">
      <div className="flex items-center gap-4 justify-between">
        <div className="bg-white items-center p-1 lg:p-2 gap-x-3 lg:gap-x-2 rounded-full justify-center flex">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
      </div>

      <div className="mt-8">
        <div className="w-full space-y-6">
          <div className="hidden xl:grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="h-8 flex items-center justify-center">
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="relative h-[98px] flex justify-center items-end">
                  <div className="w-10 h-14 bg-gray-200 rounded"></div>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-2 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid xl:hidden grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="h-8 flex items-center justify-center">
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="relative flex h-16 w-12 justify-center">
                  <div className="w-9 h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-2 bg-gray-200 rounded w-10"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative h-20">
            <div className="relative w-full mt-6">
              <div className="absolute -translate-y-1/2 w-full grid grid-cols-6 xl:grid-cols-6 z-10">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                  </div>
                ))}
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 h-4 rounded-full bg-gray-200 z-0 left-[8.33%] right-[8.33%]">
                <div className="h-full bg-gray-300 rounded-full w-1/3"></div>
              </div>
            </div>
            <div className="absolute left-1/3 top-8">
              <div className="w-4 h-4 bg-gray-200 rotate-45 absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="min-w-[120px] h-7 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#D7EBFF] to-[#FFFFFF00] rounded-lg p-4 border border-[#3871EC33]/30">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TrainingPlanDisplaySkeleton: React.FC = () => (
  <div className="xl:border xl:border-gray-200 p-4 rounded-lg shadow-sm overflow-hidden">
    <div className="flex w-full flex-col gap-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="w-5 h-5 bg-gray-200 rounded lg:hidden"></div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex-1 flex-shrink-0 min-w-[100px]">
            <div className="flex flex-col items-center justify-center h-24 w-full px-2 py-4 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="border border-gray-200 rounded-lg p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>

          <div className="border border-gray-200 bg-gray-50 p-3 rounded-lg mb-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="flex-shrink-0 min-w-[200px] sm:max-w-[300px]"
              >
                <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col gap-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="w-full h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>

        <div className="border border-gray-200 bg-gray-50 p-3 rounded-lg mb-4">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        <div className="flex justify-center">
          <div className="w-32 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ProgressDisplaySkeleton: React.FC = () => (
  <div className="space-y-4 p-4 xl:p-0 animate-pulse">
    <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-y-4">
        <div className="h-6 bg-gray-200 rounded w-48"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-200 rounded-lg h-[150px] p-6 relative">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-lg h-[150px] p-6 relative">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-28"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="md:grid md:grid-cols-5 gap-6">
      <div className="md:col-span-3 flex flex-col gap-6 border rounded-md p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="w-40 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="h-5 bg-gray-200 rounded w-56 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="md:col-span-2 flex flex-col rounded-md border p-4 gap-6 mt-6 md:mt-0">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-4 h-32">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TrainingPlanCardSkeleton: React.FC = () => (
  <div className="relative w-full h-full p-8 bg-gradient-to-b from-[#EAEAEA] via-white to-[#EAEAEA] flex items-center justify-center border lg:rounded-md overflow-hidden animate-pulse">
    <div className="w-full p-8 xl:max-w-[643px] 2xl:max-w-[700px] sm:mx-7 bg-white/70 rounded-md flex flex-col gap-4 items-center justify-center">
      <div className="w-24 h-24 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="space-y-2 text-center">
        <div className="h-4 bg-gray-200 rounded w-80"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      <div className="w-full h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export const PlanCheckSkeleton: React.FC = () => (
  <div className="flex items-center justify-center p-12 border border-gray-200 rounded-lg animate-pulse">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 rounded w-48"></div>
    </div>
  </div>
);
