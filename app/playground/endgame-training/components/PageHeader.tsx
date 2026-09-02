import { AlertCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

interface PageHeaderProps {
  activeTab: string;
  viewState: any;
}

export default function PageHeader({ activeTab, viewState }: PageHeaderProps) {
  return (
    <div className={`w-auto ${activeTab !== "board" ? "space-y-5" : ""} flex flex-col`}>
      <div className=" text-[14px] --sm lg:text-2xl font-bold text-gray-800">
        {activeTab === "board" ? (
          <></>
          // <div className="flex justify-center md:justify-start items-center">
          //   <Image src={"/images/choose-board.svg"} alt="Choose board icon" width={24} height={24} className="md:hidden mr-2" />
          //   <AlertCircle className="mr-2 hidden md:block" />
          //   <h1>Choose your board presentation :</h1>
          // </div>
        ) : (
          <div className="flex justify-center md:justify-start items-center">
            <Image
              src="/endgame-training/check.png"
              width={20}
              height={20}
              alt="Checkmate icon"
              className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] mr-2"
            />
            <h3 className="text-center md:text-left text-[15px] font-normal md:font-semibold md:text-[24px]">Checkmate in...</h3>
          </div>
        )}
      </div>

      {activeTab === "move" && viewState.view === "categories" && (
        <div className="text-black border p-[5px] bg-[rgba(0,0,0,.02)] rounded-[8px] text-[13px] md:text-[14px] leading-[130%] w-auto md:h-[45px] flex items-center">
          <h1 className="">
            Challenge yourself and achieve Checkmate in a{" "}
            <span className="font-bold">specific amount of moves.</span>{" "}
            Everytime you start a Game in this section,{" "}
            <span className="font-bold">
              the Board Presentation will be different!
            </span>
          </h1>
        </div>
      )}
    </div>
  );
}
