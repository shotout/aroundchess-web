"use client";

import { usePgnStore } from "@/app/store/zustandStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const FamousGameButton = () => {
  const router = useRouter();

  const {
    setUsername: setUsernamePlayer,
    setPgn,
    setIsLoading,
    setError,
    isLoading,
    dataAnalysis,
    setDataAnalysis,
    setDataGames,
    dataGames,
  } = usePgnStore();
  const fetchPgnFamousGame = async () => {
    let arr = null;
    try {
      const resFamousGame = await fetch("/local-data/famous-game.txt");
      const pgnLocal = await resFamousGame.text();
      setPgn(pgnLocal);
      const resAnalysis = await fetch("/local-data/analysis.json");
      const responseAnalysis = await resAnalysis.json();
      console.log("pgnLocal", pgnLocal);
      console.log("responseAnalysis", responseAnalysis);

      setDataAnalysis(responseAnalysis);
      arr = responseAnalysis;
      setError(null);
      // router.push("/analysis");
    } catch (err) {
      console.log("error", err);
      toast.error(err + "");
      router.push("/");
      setIsLoading(false);

      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      if (arr != null) {
        router.push("/analysis");
      } else {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="max-w-[668px] mt-48 bg-white z-100 sm:mx-7 sm:mt-1 sm:bg-white sm:bg-clip-padding sm:backdrop-filter sm:backdrop-blur-sm sm:bg-opacity-75 border border-[#DEDEDE] rounded-md p-[32px] flex flex-col gap-2 sm:justify-center lg:justify-start">
      <p className="w-full block text-[#040404] text-start font-medium text-[28px] ">
        Discover our Advanced Chess Analysis
      </p>
      <p className="block mb-3 text-[20px] text-start font-medium text-[#2e2e2e]">
        See a sample Analysis of the legendary Game Vladislav Kovalev vs Magnus
        Carlsen before you start analyzing your own Games!
      </p>
      <div className="flex flex-row justify-center items-center">
        <span className="font-medium text-[14px] text-[#17119B]">
          29/12/2022
        </span>
      </div>
      <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row items-center justify-between rounded-[8px] p-[12px] gap-2 border border-[#00B427] bg-[#D3FFDD]">
        <div className="flex flex-row items-center">
          <Image
            alt="magnus"
            src={"/images/homepage/magnus-photo.png"}
            width={1000}
            height={1000}
            className="w-[44px] h-[44px] rounded-full object-cover mr-2"
            priority
          />
          <div className="flex flex-col">
            <span className="font-medium text-[16px] text-[#00B427]">
              Magnus Carlsen
            </span>
            <span className="font-normal text-[14px] text-[#2e2e2e]">
              ELO Rating:{" "}
              <span className="font-medium text-[#17119B]">2852</span>
            </span>
          </div>
        </div>
        <Image
          alt="magnus"
          src={"/images/homepage/norway.png"}
          width={1000}
          height={1000}
          className="w-[32px] h-[24px] object-cpntain"
          priority
        />
      </div>
      <span className="text-[20px] text-[#17119B] font-medium">VS</span>
      <div className="flex flex-row items-center justify-between rounded-[8px] p-[12px] gap-2 border border-[#DEDEDE] bg-white">
        <div className="flex flex-row items-center">
          <Image
            alt="magnus"
            src={"/images/homepage/vladislav-photo.png"}
            width={1000}
            height={1000}
            className="w-[44px] h-[44px] rounded-full object-cover mr-2"
            priority
          />
          <div className="flex flex-col">
            <span className="font-medium text-[16px] text-[#00B427]">
              Vladislav Kovalev
            </span>
            <span className="font-normal text-[14px] text-[#2e2e2e]">
              ELO Rating:{" "}
              <span className="font-medium text-[#17119B]">2555</span>
            </span>
          </div>
        </div>
        <Image
          alt="magnus"
          src={"/images/homepage/world-flag.png"}
          width={1000}
          height={1000}
          className="w-[32px] h-[24px] object-cpntain"
          priority
        />
      </div>
    </div>
      <button
        className="btn-primary mt-2 w-full text-xs px-2 py-2 rounded-full"
        onClick={fetchPgnFamousGame}
      >
        Start Analysis
      </button>
    </div>
  );
};

export const FamousGameCard = () => {
  return (
    <div className="hidden sm:flex flex-row justify-between items-center gap-4">
      <div className="flex flex-row items-center justify-between w-1/2 rounded-[8px] p-[12px] gap-2 border border-[#00B427] bg-[#D3FFDD]">
        <div className="flex flex-row items-center">
          <Image
            alt="magnus"
            src={"/images/homepage/magnus-photo.png"}
            width={1000}
            height={1000}
            className="w-[44px] h-[44px] rounded-full object-cover mr-2"
            priority
          />
          <div className="flex flex-col">
            <span className="font-medium text-[16px] text-[#00B427]">
              Magnus Carlsen
            </span>
            <span className="font-normal text-[14px] text-[#2e2e2e]">
              ELO Rating:{" "}
              <span className="font-medium text-[#17119B]">2852</span>
            </span>
          </div>
        </div>
        <Image
          alt="magnus"
          src={"/images/homepage/norway.png"}
          width={1000}
          height={1000}
          className="w-[32px] h-[24px] object-cpntain"
          priority
        />
      </div>
      <div className="flex flex-row items-center justify-between w-1/2 rounded-[8px] p-[12px] gap-2 border border-[#DEDEDE] bg-white">
        <div className="flex flex-row items-center">
          <Image
            alt="magnus"
            src={"/images/homepage/vladislav-photo.png"}
            width={1000}
            height={1000}
            className="w-[44px] h-[44px] rounded-full object-cover mr-2"
            priority
          />
          <div className="flex flex-col">
            <span className="font-medium text-[16px] text-[#00B427]">
              Vladislav Kovalev
            </span>
            <span className="font-normal text-[14px] text-[#2e2e2e]">
              ELO Rating:{" "}
              <span className="font-medium text-[#17119B]">2555</span>
            </span>
          </div>
        </div>
        <Image
          alt="magnus"
          src={"/images/homepage/world-flag.png"}
          width={1000}
          height={1000}
          className="w-[32px] h-[24px] object-cpntain"
          priority
        />
      </div>
    </div>
  );
};
