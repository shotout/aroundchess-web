"use client";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { StartPlayVSAI } from "@/components/modal/StartPlayVSAI";
import Navigation from "@/components/navigator/navigation";
import { useApiClient } from "@/functions/api-client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
export default function PlayVSAI() {
  const { isLoading } = useApiClient();
  const [showPremiumDialog, setShowPremiumDialog] = useState<boolean>(false);
  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    toast.success("Thank you for subscribing to Premium!");
  };
  return (
    <Navigation>
      <div className="flex-1 relative w-full min-h-[489px] sm:min-h-[617px] xl:rounded-[32px] xl:my-8 xl:items-center xl:justify-center">
        <PremiumSubscription
          visible={showPremiumDialog && !isLoading}
          onClose={handleClosePremium}
          onGetPremium={handleGetPremium}
        />
        <div className="absolute w-full z-2 inset-0 flex items-center justify-center">
          <Image
            src={"/images/play-vs-ai/background-board.png"}
            alt="background"
            width={1000}
            height={1000}
            className="w-full min-h-[489px] sm:max-h-[617px] xl:min-w-[1077px] xl:h-[709px] xl:rounded-[32px] xl:mx-8 object-cover bg-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center m-4">
          <div className="w-full p-8 xl:max-w-[643px] z-10 sm:mx-7 bg-white/70 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-64 border border-2 border-[#fff] rounded-md p-4 flex flex-col gap-2 items-center justify-center ">
            <Image
              src={"/images/play-vs-ai/play-vs-ai.png"}
              alt="background"
              width={1000}
              height={1000}
              className="w-[188px] xl:w-[376px] h-auto"
            />
            <span className="font-medium text-lg xl:text-xl">Play VS AI</span>
            <span className="font-normal text-md xl:mx-20 text-center">
              Challenge AI to improve your accuracy and enhance your chess
              skills.
            </span>
            <StartPlayVSAI
              onLimit={(infoLimit) => setShowPremiumDialog(infoLimit)}
            />
          </div>
        </div>
      </div>
    </Navigation>
  );
}
