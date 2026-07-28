"use client";

import { useSuccessSent } from "@/app/store/successSent";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SuccessSent() {
  const router = useRouter();
  const { open, setOpen } = useSuccessSent();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleBack = () => {
    setOpen(false);
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
        className="rounded-lg max-w-sm sm:max-w-[640px] sm:max-h-[95%] lg:p-[32px] bg-[#E3F3FF] border border-[#C0CED4] max-h-[95%] overflow-y-hidden"
      >
        {/* Radix requires an accessible name on every DialogContent */}
        <DialogTitle className="sr-only">Message sent</DialogTitle>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image
              src="/images/contact-us/success-sent.png"
              alt="success-icon"
              width={1000}
              height={1000}
              className="w-[160px] h-[160px] lg:w-[320px] lg:h-[320px] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4">
            <span className="font-medium text-[24px] text-[#2e2e2e] text-center">
              Your Message was successfully sent!
            </span>
            <span className="font-normal text-[18px] text-[#2e2e2e] text-center">
              Thank you for your Message. Our Team will respond as soon as
              possible.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-3">
          <button
            onClick={handleBack}
            className="w-full btn-primary rounded-full h-[44px] max-w-[320px]"
          >
            <span className="font-medium text-[14px] -- sm:text-[16px] text-[#e6f7fe]">
              Close
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
