"use client";

import { X } from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { EloOdometer } from "@/components/v2/elo-odometer";
import { useLottieData } from "@/components/v2/hooks/useLottieData";

const ODOMETER_DELAY = 0.6;
const ODOMETER_DURATION = 1.8;

// Compressed copy of LOSE.json (embedded frames downscaled + recompressed,
// 44MB -> 0.8MB) so it loads fast enough to play the moment the modal opens.
export const LOSE_LOTTIE = "/images/v2/play-vs-ai/LOSE.min.json";

interface PlayVsAiLoseModalProps {
  oldElo: number;
  newElo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
  onClose: () => void;
  onStartGame: () => void;
}

export function PlayVsAiLoseModal({
  oldElo,
  newElo,
  delta,
  opponentName,
  opponentElo,
  onClose,
  onStartGame,
}: PlayVsAiLoseModalProps) {
  const animationData = useLottieData(LOSE_LOTTIE);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[545px] max-h-[96vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[14px] sm:top-[16px] sm:right-[18px] z-10 text-[#111827] hover:text-[#374151]"
          aria-label="Close"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <div className="w-[68%] sm:w-[90%] sm:[@media(max-height:920px)]:w-[52%] mx-auto aspect-[540/400] max-h-[26vh] sm:max-h-none">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop={false}
              rendererSettings={{ preserveAspectRatio: "xMidYMin slice" }}
              className="w-full h-full"
            />
          )}
        </div>

        <div className="px-[20px] sm:px-[36px] pb-[20px] sm:pb-[28px] sm:[@media(max-height:920px)]:pb-[18px]">
          <h2 className="text-center font-bold text-[24px] sm:text-[30px] text-[#DC2626] mt-[8px] sm:mt-[12px] mb-[4px] sm:mb-[6px] sm:[@media(max-height:920px)]:mt-[4px] sm:[@media(max-height:920px)]:mb-[2px]">
            You Lost
          </h2>

          {opponentName && (
            <p className="text-center text-[14px] sm:text-[17px] text-[#374151] mb-[10px] sm:mb-[14px] sm:[@media(max-height:920px)]:mb-[8px]">
              Against {opponentName} (ELO {opponentElo})
            </p>
          )}

          {/* ELO pill + loss badge */}
          <div className="flex items-center justify-center gap-[8px] sm:gap-[10px] mb-[14px] sm:mb-[20px] sm:[@media(max-height:920px)]:mb-[12px]">
            <div className="flex items-center justify-between gap-[10px] sm:gap-[16px] bg-[#DC2626] rounded-[10px] pl-[14px] pr-[12px] sm:pl-[20px] sm:pr-[16px] py-[8px] sm:py-[10px] flex-1 min-w-0 max-w-[300px]">
              <span className="text-white font-semibold text-[14px] sm:text-[17px] whitespace-nowrap">
                Your Current ELO
              </span>
              <span className="flex items-center gap-[6px] sm:gap-[8px]">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0"
                >
                  <path d="M10 18L3 10H7V5H13V10H17L10 18Z" fill="white" />
                  <rect x="7" y="1.7" width="6" height="1.8" rx="0.9" fill="white" />
                </svg>
                <span className="text-white font-bold text-[22px] sm:text-[28px] leading-none pt-1">
                  <EloOdometer
                    from={oldElo}
                    to={newElo}
                    delay={ODOMETER_DELAY}
                    duration={ODOMETER_DURATION}
                  />
                </span>
              </span>
            </div>
            {delta < 0 && (
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ODOMETER_DELAY + ODOMETER_DURATION, duration: 0.35 }}
                className="text-[#DC2626] font-bold text-[20px] sm:text-[24px] shrink-0"
              >
                {delta}
              </motion.span>
            )}
          </div>

          <p className="text-center font-bold text-[15px] sm:text-[17px] text-[#111827]">
            Tough game!
          </p>
          <p className="text-center text-[13px] sm:text-[15px] text-[#111827] mb-[12px] sm:mb-[18px] sm:[@media(max-height:920px)]:mb-[12px]">
            Ready to bounce back and try again?
          </p>

          <button
            onClick={onStartGame}
            className="w-full py-[12px] sm:py-[14px] sm:[@media(max-height:920px)]:py-[12px] rounded-full bg-[#221AE9] text-white font-semibold text-[15px] sm:text-[16px] hover:bg-[#2d25ea] transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
