"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { useStatusPurchaseTokens } from "@/app/store/statusPurchaseTokens";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function StatusPurchaseTokens() {
  const router = useRouter();
  const { open, setOpen, status, setStatus, quantity } =
    useStatusPurchaseTokens();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dots, setDots] = useState<string>("");

  useEffect(() => {
    console.log("status", status);
    if (status == "failed") {
      setContent(`Your Purchase for ${quantity} Tokens was failed!`);
      setDescription(
        "Your payment failed, retry payment or try to change the payment method."
      );
    } else if (status == "success") {
      setContent(`Your Purchase for ${quantity} Tokens was successful!`);
      setDescription("Analyze more games now!");
    } else if (status == "failed-membership") {
      setContent(`Your Purchase for Premium Package was failed!`);
      setDescription(
        "Your payment failed, retry payment or try to change the payment method."
      );
    } else {
      handleWaiting();
      setDescription("");
    }
  }, [status]);
  const handleWaiting = () => {
    // Timer to update dots every second
    const timer = setInterval(() => {
      // Cycle through empty, ., .., and ...
      setDots((prevDots) => {
        if (prevDots === "") return ".";
        if (prevDots === ".") return "..";
        if (prevDots === "..") return "...";
        return ""; // Reset when it reaches ...
      });
    }, 2000);

    // Clean up the interval when component unmounts
    return () => clearInterval(timer);
  };
  useEffect(() => {
    if (status == "waiting") {
      setContent(`We're verifying your payment${dots}`);
    }
  }, [dots, status]);
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleBack = () => {
    router.replace("/");
  };
  const handleAnalyze = () => {
    router.replace("/analysis");
  };
  const handleFailed = () => {
    setOpen(false);
    setOpenPricing(true);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        style={{
          backgroundImage: `url(/images/background-modal.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxHeight: "95vh",
          width: "100%",
        }}
        className={`rounded-lg max-w-sm sm:max-w-[1141px] sm:max-h-[95%] lg:p-[32px] bg-white border border-[#C0CED4] max-h-[95%] overflow-y-hidden`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image
              src={`/images/pricing/${status}-payment-icon.png`}
              alt={status}
              width={1000}
              height={1000}
              className="w-[151px] h-[160px] lg:w-[244px] lg:h-[258px] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4">
            <span className="font-medium text-[18px] text-[#2e2e2e] text-center">
              {content}
            </span>
            <span className="font-normal text-[14px] text-[#2e2e2e] text-center">
              {description}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-3 ">
          {status == "success" && (
            <button
              onClick={handleAnalyze}
              className="w-[320px] btn-primary rounded-full h-[44px]  "
            >
              <span className="font-medium text-[12px] sm:text-[16px] text-[#e6f7fe]">
                Analyze Game
              </span>
            </button>
          )}
          {status == "failed" ||
            (status == "failed-membership" && (
              <button
                onClick={handleFailed}
                className="w-[320px] btn-primary rounded-full h-[44px] "
              >
                <span className="font-medium text-[12px] sm:text-[16px] text-[#e6f7fe]">
                  Retry Payment
                </span>
              </button>
            ))}
          {status != "waiting" && (
            <button
              onClick={handleBack}
              className="w-[320px] btn-secondary rounded-full h-[44px] "
            >
              <span className="font-medium text-[12px] sm:text-[16px] text-[#e6f7fe]">
                Back to Dashboard
              </span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
