"use client";
import Navigation from "@/components/navigator/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
export default function Puzzle() {
  const puzzleTopic = [
    {
      value: "all",
      label: "All",
      description: "Includes all available puzzles without filtering by theme",
    },
    {
      value: "advancedPawn",
      label: "Advanced Pawn",
      description:
        "Puzzles featuring advanced pawn tactics to gain positional or material advanteage",
    },
  ];
  const handleStart = () => {};
  return (
    <Navigation>
      <div className="flex-1 relative w-full min-h-[489px] sm:min-h-[617px] xl:rounded-[32px] xl:my-8 xl:items-center xl:justify-center">
        <div className="absolute w-full z-2 inset-0 flex items-center justify-center">
          <Image
            src={"/images/puzzle/bg-start.png"}
            alt="background"
            width={1000}
            height={1000}
            className="w-full min-h-[489px] sm:max-h-[617px] xl:min-w-[1077px] xl:h-[709px] xl:rounded-[32px] xl:mx-8 object-cover bg-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center m-4">
          <div className="w-full p-8 xl:max-w-[643px] z-10 sm:mx-7 rounded-md p-4 flex flex-col gap-2 items-center justify-center ">
            <Image
              src={"/images/puzzle/asset-puzzle.png"}
              alt="asset"
              width={1000}
              height={1000}
              className="w-[188px] xl:w-[234px] h-auto"
            />
            <Image
              src={"/images/puzzle/frame-start.png"}
              alt="asset"
              width={1000}
              height={1000}
              className="absolute inset-0 z-0 self-center justify-self-center w-1/2 h-auto"
            />
            <span className="font-medium text-lg xl:text-xl">
              Puzzle Training
            </span>
            <span className="font-normal text-md xl:mx-20 text-center text-[#585858]">
              Train with more than 500,000 Puzzles
            </span>
            <div className="flex flex-col w-full my-2 z-20">
              <span className="font-medium text-[16px]">
                Select Puzzle Topic
              </span>
              <Select name="subject">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {puzzleTopic.map((item, index) => {
                    return (
                      <SelectItem className="flex w-full items-center justify-center" key={item.value} value={item.label}>
                        <div className="flex w-full flex-col items-center justify-center gap-2 py-[8px]">
                          <span className="font-normal text-[12px]">
                            {item.label}
                          </span>
                          <span className="font-normal text-[11px] text-[#221AE9]">
                            {item.description}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={handleStart}
              className="w-full px-4 py-2 btn-primary rounded-full"
            >
              Start Puzzles
            </button>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
