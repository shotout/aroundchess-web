"use client";

import { useGameEndStatus } from "@/app/store/gameEndStatus";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";

export function GameEndStatus({ gameStatus }: any) {
  const router = useRouter();
  const { open, setOpen } = useGameEndStatus();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleBack = () => {
    router.replace("/");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-full min-h-full rounded-none lg:p-[32px] bg-[#00000090] border-0 shadow-none items-center justify-center">
        <Image
          src={`/images/play-vs-ai/${gameStatus}-popup.gif`}
          alt="GIF"
          width={1000}
          height={1000}
          unoptimized={true}
          className="w-full h-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
