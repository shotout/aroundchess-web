"use client";

import { useShareGame } from "@/app/store/shareGame";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ShareGame() {
  const router = useRouter();
  const { open, fen, pgn, setOpen } = useShareGame();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleCopyFen = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(fen));
      toast("Current FEN copied to clipboard!");
    } catch (error) {}
  };
  const handleCopyPgn = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(pgn));
      toast("Current PGN copied to clipboard!");
    } catch (error) {}
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg max-w-sm sm:max-w-[640px] sm:max-h-[90%] lg:p-[32px] bg-white max-h-[90%] overflow-y-hidden">
        <Image
          src={`/images/play-vs-ai/background-share.png`}
          alt="bg"
          width={1000}
          height={1000}
          className="w-full h-full fixed absolute inset-0 rounded-[12px] object-cover z-0"
          priority
        />
        <DialogHeader className="flex items-center z-20">
          <span className="text-center font-medium text-[18px] w-2/3">
            Share this Game
          </span>
          <span className="font-normal text-[14px]">
            Copy this Game's PGN or FEN and share it with your Friends.
          </span>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center bg-[transparent] z-20">
          <div className="w-full flex flex-col bg-[#fafdff] rounded-[12px] p-[8px] mb-[20px]">
            <span className="bg-[#F9FAFC] rounded-[6px] p-[16px] font-medium text-[14px]">
              FEN
            </span>
            <div className="flex flex-row justify-between items-center bg-[#e6f7fe] rounded-[6px] px-[16px] py-[8px]">
              <span className="font-normal text-[14px] block">{fen}</span>
              <Image
                onClick={handleCopyFen}
                alt="clipboard"
                src={"/images/play-vs-ai/clipboard.png"}
                width={1000}
                height={1000}
                className="h-[20px] w-[20px] cursor-pointer"
              />
            </div>
          </div>
          <div className="bg-[#fafdff] flex flex-col rounded-[12px] p-[8px]">
            <span className="bg-[#F9FAFC] rounded-[6px] px-[16px] py-[8px] font-medium text-[14px]">
              PGN
            </span>
            <div className="flex flex-row justify-between items-center bg-[#e6f7fe] rounded-[6px] p-[12px]">
              <span className="font-normal text-[14px] block">{pgn}</span>
              <Image
                onClick={handleCopyPgn}
                alt="clipboard"
                src={"/images/play-vs-ai/clipboard.png"}
                width={1000}
                height={1000}
                className="h-[20px] w-[20px] self-end justify-self-end cursor-pointer"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
