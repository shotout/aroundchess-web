"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
interface ThreatsProps {
  next: () => void;
  prev: () => void;
}
const Threats: React.FC<ThreatsProps> = (props) => {
  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 bg-white px-4 lg:justify-start lg:max-h-[800px] lg:min-h-[800px] lg:overflow-auto">
        <div className="border w-full border-primary border-t-4 rounded-md p-3">
          <div className="flex flex-row items-center gap-2">
            <Image
              alt=""
              src={"/icons/alert-triangle.png"}
              width={1000}
              height={1000}
              className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
            />
            <span className="text-md sm:text-lg lg:text-2xl font-bold w-full">
              Most Critical Threats
            </span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="border border-input rounded-md p-4">
              <div className="flex flex-row justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal border border-primary rounded-[4px] p-1">
                  Move 2: <span className="font-bold">e5</span>
                </span>
                <span className="text-[10px] font-normal text-center text-[#B08503] border border-[#B08503] rounded-[4px] p-1 sm:p-2">
                  [TYPE OF THROAT]
                </span>
              </div>
              <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal">
                [EXPLANATION OF THROAT]
              </span>
              <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                <span className="text-[10px] sm:text-sm md:text-md lg:text-lg font-normal text-primary">
                  [HOW THE THREAT COULD HAVE BEEN AVOIDED]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-xs sm:text-sm md:text-md lg:text-lg text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Movement Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Button>
        <div className="w-8" />
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Opening
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </>
  );
};

export default Threats;
