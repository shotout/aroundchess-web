import Spinner from "@/components/ui/spinner";
import React from "react";
import PgnPlayer from "./LoadingChess";

const LoadingPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <Spinner />
        <div className="border border-input rounded-md flex flex-col items-center justify-center bg-white p-4 mt-4">
          <span className="text-sm">13/02/2025</span>
          <span className="text-sm">
            <span className="text-lg font-semibold text-[#00B427]">
              blitzmystic
            </span>{" "}
            (White)
            <span className="text-lg font-semibold"> vs Guest1234 </span>{" "}
            (Black)
          </span>
        </div>
        <div className="hidden md:block absolute top-80 left-0 md:left-0 w-[600px] sm:w-[250px] h-[500px] sm:h-[150px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="hidden md:block absolute top-80 right-0 md:right-0 w-[600px] sm:w-[250px] h-[500px] sm:h-[150px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="block sm:hidden absolute self-center top-86 right-24 left-24 bottom-0 w-[200px] sm:w-[350px] md:w-[460px] h-[200px] sm:h-[250px] md:h-[300px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="hidden md:block absolute bottom-0 right-0 md:right-20 md:bottom-12 w-[600px] sm:w-[200px] h-[500px] sm:h-[150px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <PgnPlayer />
      </div>
    </>
  );
};
export default LoadingPage;
