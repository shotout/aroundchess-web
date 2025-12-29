"use client";

import { useShareGame } from "@/app/store/shareGame";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export function ShareGame() {
  const { open, fen, pgn, setOpen } = useShareGame();

  useEffect(() => {
    setOpen(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      {/* Desktop/Tablet Version */}
      <div className="">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            style={{
              backgroundImage: `url(/images/play-vs-ai/background-share.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              maxHeight: "95vh",
              width: "100%",
            }}
            className="rounded-lg hidden sm:block max-w-sm sm:max-w-[640px] sm:max-h-[95%] lg:p-[32px] bg-white max-h-[95%] overflow-y-hidden"
          >
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
      </div>

      {/* Mobile Version */}
      <div className="sm:hidden">
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setOpen(false)}
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                }}
                className="fixed bottom-0 left-0 right-0 z-50"
              >
                <div
                  className="bg-white rounded-t-3xl mb-2 p-6 relative overflow-hidden"
                  style={{
                    backgroundImage: `url(/images/play-vs-ai/background-share.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black z-10"
                  >
                    <X size={24} />
                  </button>

                  <div className="mb-6 relative z-10">
                    <h2 className="text-xl font-semibold text-center mb-2">
                      Share this Game
                    </h2>
                    <p className="text-[14px] --sm text-gray-600 text-center">
                      Copy this Game's PGN or FEN and share it with your
                      Friends.
                    </p>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="bg-[#fafdff] rounded-xl p-4">
                      <div className="bg-[#F9FAFC] rounded-lg p-3 mb-3">
                        <span className="font-medium text-base">FEN</span>
                      </div>
                      <div className="bg-[#e6f7fe] rounded-lg p-4 flex items-start justify-between">
                        <span className="text-[14px] --sm font-mono break-all flex-1 mr-3">
                          {fen}
                        </span>
                        <button
                          onClick={handleCopyFen}
                          className="flex-shrink-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <Copy size={20} className="text-blue-600" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#fafdff] rounded-xl p-4">
                      <div className="bg-[#F9FAFC] rounded-lg p-3 mb-3">
                        <span className="font-medium text-base">PGN</span>
                      </div>
                      <div className="bg-[#e6f7fe] rounded-lg p-4 flex items-start justify-between">
                        <span className="text-[14px] --sm font-mono break-all flex-1 mr-3">
                          {pgn}
                        </span>
                        <button
                          onClick={handleCopyPgn}
                          className="flex-shrink-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <Copy size={20} className="text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
