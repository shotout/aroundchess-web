"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { EloOdometer } from "@/components/v2/elo-odometer";
import { useLottieData } from "@/components/v2/hooks/useLottieData";
import {
  AiRosterOpponent,
  pickRecommendedOpponents,
} from "@/components/v2/play-vs-ai-roster-data";

const ODOMETER_DELAY = 0.6;
const ODOMETER_DURATION = 1.8;

// Compressed copy of WON.json (embedded frames downscaled + recompressed,
// 64MB -> 1.2MB) so it loads fast enough to play the moment the modal opens.
export const WIN_LOTTIE = "/images/v2/play-vs-ai/WON.min.json";

interface PlayVsAiWinModalProps {
  oldElo: number;
  newElo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
  onClose: () => void;
  onStartGame: (opponent: AiRosterOpponent) => void;
}

export function PlayVsAiWinModal({
  oldElo,
  newElo,
  delta,
  opponentName,
  opponentElo,
  onClose,
  onStartGame,
}: PlayVsAiWinModalProps) {
  const animationData = useLottieData(WIN_LOTTIE);

  const opponents = useMemo(
    () => pickRecommendedOpponents(newElo || oldElo),
    [newElo, oldElo]
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (opponents.length > 0 && !opponents.some((o) => o.id === selectedId)) {
      setSelectedId(opponents[0].id);
    }
  }, [opponents, selectedId]);

  const selectedOpponent = opponents.find((o) => o.id === selectedId);

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

        {/* Celebration animation — the square Lottie is top-anchored so only
            the canvas' empty bottom strip gets cropped. Narrower on mobile so
            the whole modal fits the viewport without scrolling. */}
        <div className="w-[68%] sm:w-[74%] sm:[@media(max-height:920px)]:w-[46%] mx-auto aspect-[540/400] max-h-[26vh] sm:max-h-none">
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
          <h2 className="text-center font-bold text-[24px] sm:text-[30px] text-[#34C759] mt-[8px] sm:mt-[12px] mb-[4px] sm:mb-[6px] sm:[@media(max-height:920px)]:mt-[4px] sm:[@media(max-height:920px)]:mb-[2px]">
            You Won
          </h2>

          {opponentName && (
            <p className="text-center text-[14px] sm:text-[17px] text-[#374151] mb-[10px] sm:mb-[14px] sm:[@media(max-height:920px)]:mb-[8px]">
              Against {opponentName} (ELO {opponentElo})
            </p>
          )}

          {/* ELO pill + gain badge */}
          <div className="flex items-center justify-center gap-[8px] sm:gap-[10px] mb-[14px] sm:mb-[20px] sm:[@media(max-height:920px)]:mb-[12px]">
            <div className="flex items-center justify-between gap-[10px] sm:gap-[16px] bg-[#34C759] rounded-[10px] pl-[14px] pr-[12px] sm:pl-[20px] sm:pr-[16px] py-[8px] sm:py-[10px] flex-1 min-w-0 max-w-[300px]">
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
                  <path d="M10 2L17 10H13V15H7V10H3L10 2Z" fill="white" />
                  <rect x="7" y="16.5" width="6" height="1.8" rx="0.9" fill="white" />
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
            {delta > 0 && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ODOMETER_DELAY + ODOMETER_DURATION, duration: 0.35 }}
                className="text-[#34C759] font-bold text-[20px] sm:text-[24px] shrink-0"
              >
                +{delta}
              </motion.span>
            )}
          </div>

          <p className="text-center font-bold text-[15px] sm:text-[17px] text-[#111827]">
            That was a good call!
          </p>
          <p className="text-center text-[13px] sm:text-[15px] text-[#111827] mb-[12px] sm:mb-[18px] sm:[@media(max-height:920px)]:mb-[10px]">
            Ready to face more challenging opponents?
          </p>

          {/* Challenge next opponents */}
          <div className="rounded-[14px] border border-[#7CC0F2] p-[8px] sm:p-[10px] mb-[10px] sm:mb-[10px] sm:[@media(max-height:920px)]:mb-[8px]">
            <p className="text-center text-[12px] sm:text-[14px] font-medium text-[#111827] mb-[4px] sm:mb-[6px]">
              Challenge those Opponents next:
            </p>
            <div className="grid grid-cols-4 gap-[4px] sm:gap-[4px]">
              {opponents.map((opponent) => {
                const isSelected = opponent.id === selectedId;
                return (
                  <button
                    key={opponent.id}
                    type="button"
                    onClick={() => setSelectedId(opponent.id)}
                    className={`flex flex-col items-center gap-[2px] p-[4px] sm:p-[6px] rounded-[10px] border transition-colors min-w-0 ${
                      isSelected
                        ? "border-[#7CC0F2] bg-[#E6F7FE]"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <Image
                      src={opponent.img}
                      alt={opponent.name}
                      width={84}
                      height={84}
                      className="w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] rounded-full object-cover"
                    />
                    <span
                      className={`text-[12px] sm:text-[13px] font-semibold truncate max-w-full ${
                        isSelected ? "text-[#221AE9]" : "text-[#111827]"
                      }`}
                    >
                      {opponent.name}
                    </span>
                    <span
                      className={`text-[11px] sm:text-[12px] whitespace-nowrap ${
                        isSelected ? "text-[#221AE9]" : "text-[#6B7280]"
                      }`}
                    >
                      ELO {opponent.elo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => selectedOpponent && onStartGame(selectedOpponent)}
            disabled={!selectedOpponent}
            className="w-full py-[12px] sm:py-[14px] sm:[@media(max-height:920px)]:py-[12px] rounded-full bg-[#221AE9] text-white font-semibold text-[15px] sm:text-[16px] hover:bg-[#2d25ea] transition-colors disabled:opacity-50"
          >
            Start new Game
          </button>
        </div>
      </div>
    </div>
  );
}
