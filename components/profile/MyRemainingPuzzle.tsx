import { FC, useEffect, useState } from "react";
import CurrentInfo from "./CurrentInfo";
import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";
import { formatDate, formatDateHistory } from "@/functions/format-date";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useApiClient } from "@/functions/api-client";

const MyRemainingPuzzle = () => {
  const {  activeMembership, isMember } = useProfileStore();
  const { getUsagePuzzle } = useApiClient();
  const [remainingPuzzle, setRemainingPuzzle] = useState(0);
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();
  useEffect(() => {
    handleGetLog();
  }, []);
  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
  };
  const handleGetLog = async () => {
    await getUsagePuzzle().then((res) => {
      let usage = res.data.totalPuzzlesThisMonth;
      setRemainingPuzzle(usage);
    });
  };
  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Remaining Puzzle</span>
      </div>
      <div className="flex justify-center items-center sm:justify-start">
        <CurrentInfo
          handleOnClick={() => handleOpenOffer("subscription")}
          title="Remaining Puzzles in this month:"
          textButton={isMember ? null : "Go Unlimited"}
          image="/images/puzzle/asset-puzzle.png"
        >
          {!isMember ? (
            <>
              <div className="flex flex-row items-center justify-center">
                <Image
                  alt="puzzle"
                  src="/icons/sidebar-puzzle-icon-active.png"
                  width={42}
                  height={40}
                />
                <div className="block gap-1 max-w-fill">
                  <span className="font-semibold text-[40px] text-[#221AE9]">
                    {20 - remainingPuzzle}
                  </span>
                  <span className="font-medium text-[20px]">/20</span>
                </div>
              </div>
              <span className="font-normal text-[11px] text-center">
                Free Puzzles reset on{" "}
                {formatDateHistory(activeMembership.endDate)}. Get Unlimited
                Puzzles now by clicking the button below.
              </span>
            </>
          ) : (
            <div className="flex flex-row items-center justify-center">
              <Image
                alt="puzzle"
                src="/icons/sidebar-puzzle-icon-active.png"
                width={42}
                height={40}
              />
              <Image
                alt="puzzle"
                src="/images/pricing/infinity-icon.png"
                width={56}
                height={56}
              />
            </div>
          )}
        </CurrentInfo>
      </div>
    </div>
  );
};

export default MyRemainingPuzzle;
