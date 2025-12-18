"use client";
import { useLimitPuzzle } from "@/app/store/limitPuzzle";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { StartPlayVSAI } from "@/components/modal/StartPlayVSAI";
import Navigation from "@/components/navigator/navigation";
import { useApiClient } from "@/functions/api-client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PlayVSAI() {
  const { isLoading } = useApiClient();
  const { setOpen } = useLimitPuzzle();
  const [showPremiumDialog, setShowPremiumDialog] = useState<boolean>(false);
  const [showPlayVSAIModal, setShowPlayVSAIModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    trackCustomEvent("ViewPlayVSAI");
  }, []);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    toast.success("Thank you for subscribing to Premium!");
  };

  const handleOpenPlayVSAI = () => {
    setShowPlayVSAIModal(true);
  };

  const handleClosePlayVSAI = () => {
    setShowPlayVSAIModal(false);
  };

  const handlePlayVSAILimit = (isLimit: boolean) => {
    if (isLimit) {
      toast.error(
        "You have reached your play limit. Please upgrade to premium."
      );
      setOpen(true);
    }
  };

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full h-[64vh] md:h-screen 2xl:h-[calc(100vh-97px)] flex justify-center items-center">
            <main className="w-full h-full xl:p-8">
              <div className="relative bg-[#e0f6ff] mx-auto w-full h-full flex items-center justify-center md:rounded-xl overflow-hidden border">
                {/* Premium Subscription Modal */}
                <PremiumSubscription
                  visible={showPremiumDialog && !isLoading}
                  onClose={handleClosePremium}
                  onGetPremium={handleGetPremium}
                />

                {/* You vs AI Modal */}
                <StartPlayVSAI
                  visible={showPlayVSAIModal}
                  onClose={handleClosePlayVSAI}
                  onLimit={handlePlayVSAILimit}
                />

                {isMobile ? (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/board-vision/board-mobile.png"
                      alt="Background"
                      priority
                      fill
                      sizes="100vw"
                      className="object-cover object-bottom"
                      style={{ objectPosition: "50% 100%" }}
                      quality={100}
                    />
                  </div>
                ) : (
                  <div className="absolute z-0 bottom-0 left-0 max-w-full">
                    <Image
                      src="/board-vision/board.png"
                      alt="Background"
                      priority
                      width={3000}
                      height={1000}
                      className="object-cover"
                      quality={100}
                    />
                  </div>
                )}

                <div className="relative z-20 w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center m-4">
                    <div className="w-full p-8 xl:max-w-[643px] 2xl:max-w-[700px] z-10 sm:mx-7 bg-white/70 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-64 border-2 border-[#fff] rounded-md flex flex-col gap-2 items-center justify-center">
                      <Image
                        src="/images/play-vs-ai/play-vs-ai.png"
                        alt="background"
                        width={1000}
                        height={1000}
                        className="w-[188px] xl:w-[376px] h-auto"
                      />
                      <span className="font-medium text-lg xl:text-xl">
                        You vs AI
                      </span>
                      <span className="font-normal text-md xl:mx-20 text-center">
                        Challenge AI to improve your accuracy and enhance your
                        chess skills.
                      </span>

                      {/* Start Now Button - Trigger for the modal */}
                      <button
                        onClick={handleOpenPlayVSAI}
                        disabled={isLoading}
                        className="w-full px-4 py-2 btn-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        data-tutorial="play-vs-ai-step-2"
                      >
                        {isLoading ? "Loading..." : "Start a Game"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
