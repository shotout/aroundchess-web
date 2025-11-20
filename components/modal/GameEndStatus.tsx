"use client";

import { useGameEndStatus } from "@/app/store/gameEndStatus";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
      <DialogOverlay
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/50 border-none"
      />
      <DialogContent
        onClick={() => setOpen(false)}
        className="min-w-full min-h-full rounded-none lg:p-[32px] bg-[#00000090] border-0 shadow-none items-center justify-center"
      >
        <VisuallyHidden>
          <DialogTitle>Game End Status</DialogTitle>
        </VisuallyHidden>
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
