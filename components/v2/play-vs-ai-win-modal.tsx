"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { EloOdometer } from "@/components/v2/elo-odometer";
import { eloDeltaColorClass, formatEloDelta } from "@/components/v2/format-number";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";
import { useLottieData } from "@/components/v2/hooks/useLottieData";
import {
  AiRosterOpponent,
  pickRecommendedOpponents,
} from "@/components/v2/play-vs-ai-roster-data";
import { ShareButton } from "@/components/v2/share-button";
import { ShareImageSheet } from "@/components/v2/share-image-sheet";

const ODOMETER_DELAY = 0.6;
const ODOMETER_DURATION = 1.8;

export const WIN_LOTTIE = "/images/v2/play-vs-ai/WON.min.json";

interface WinModalCardProps {
  oldElo: number;
  newElo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
  onStartGame?: (opponent: AiRosterOpponent) => void;
  variant?: "modal" | "tour";
  onAnimationComplete?: () => void;
}

export function WinModalCard({
  oldElo,
  newElo,
  delta,
  opponentName,
  opponentElo,
  onStartGame,
  variant = "modal",
  onAnimationComplete,
}: WinModalCardProps) {
  const tour = variant === "tour";
  const animationData = useLottieData(WIN_LOTTIE);

  const m = (tourCls: string, modalCls: string) => (tour ? tourCls : modalCls);

  const effectiveElo = useEffectiveElo();
  const opponents = useMemo(
    () => pickRecommendedOpponents(newElo || oldElo || effectiveElo || 1200),
    [newElo, oldElo, effectiveElo]
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (opponents.length > 0 && !opponents.some((o) => o.id === selectedId)) {
      setSelectedId(opponents[0].id);
    }
  }, [opponents, selectedId]);

  const selectedOpponent = opponents.find((o) => o.id === selectedId);

  return (
    <div
      className={
        tour
          ? "relative w-full max-w-[545px] overflow-hidden bg-white rounded-2xl shadow-2xl select-none pointer-events-none max-sm:flex max-sm:flex-col max-sm:justify-center"
          : "relative w-full max-w-[545px] max-h-[96vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
      }
    >
      {tour && (
        <ShareButton
          variant="pill"
          onClick={() => {}}
          className="absolute top-[12px] left-[14px] sm:top-[16px] sm:left-[18px] z-10 bg-white"
        />
      )}

      <div
        className={m(
          "relative w-[72%] sm:w-[74%] sm:[@media(max-height:920px)]:w-[46%] mx-auto aspect-[540/400] max-sm:shrink-0",
          "relative w-[68%] sm:w-[74%] sm:[@media(max-height:920px)]:w-[46%] mx-auto aspect-[540/400] max-h-[26vh] sm:max-h-none"
        )}
      >
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={false}
            onComplete={onAnimationComplete}
            rendererSettings={{ preserveAspectRatio: "xMidYMin slice" }}
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>

      <div
        className={`${m(
          "px-[20px] pb-[20px]",
          "px-[20px] pb-[20px]"
        )} sm:px-[36px] sm:pb-[28px] sm:[@media(max-height:920px)]:pb-[18px]`}
      >
        <h2
          className={`text-center font-bold ${m(
            "text-[24px] mt-[8px] mb-[4px]",
            "text-[24px] mt-[8px] mb-[4px]"
          )} sm:text-[30px] text-[#34C759] sm:mt-[12px] sm:mb-[6px] sm:[@media(max-height:920px)]:mt-[4px] sm:[@media(max-height:920px)]:mb-[2px]`}
        >
          You Won
        </h2>

        {opponentName && (
          <p
            className={`text-center ${m(
              "text-[14px] mb-[10px]",
              "text-[14px] mb-[10px]"
            )} sm:text-[17px] text-[#374151] sm:mb-[14px] sm:[@media(max-height:920px)]:mb-[8px]`}
          >
            Against {opponentName} (ELO {opponentElo})
          </p>
        )}

        <div
          className={`flex items-center justify-center gap-[8px] sm:gap-[10px] ${m(
            "mb-[14px]",
            "mb-[14px]"
          )} sm:mb-[20px] sm:[@media(max-height:920px)]:mb-[12px]`}
        >
          <div
            className={`flex items-center justify-between gap-[10px] sm:gap-[16px] bg-[#34C759] rounded-[10px] ${m(
              "pl-[14px] pr-[12px] py-[8px]",
              "pl-[14px] pr-[12px] py-[8px]"
            )} sm:pl-[20px] sm:pr-[16px] sm:py-[10px] flex-1 min-w-0 ${m(
              "max-w-[300px]",
              "max-w-[300px]"
            )} sm:max-w-[300px]`}
          >
            <span
              className={`text-white font-semibold ${m(
                "text-[14px]",
                "text-[14px]"
              )} sm:text-[17px] whitespace-nowrap`}
            >
              Your Current ELO
            </span>
            <span className="flex items-center gap-[6px] sm:gap-[8px]">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${m(
                  "w-[16px] h-[16px]",
                  "w-[16px] h-[16px]"
                )} sm:w-[20px] sm:h-[20px] shrink-0`}
              >
                <path d="M10 2L17 10H13V15H7V10H3L10 2Z" fill="white" />
                <rect x="7" y="16.5" width="6" height="1.8" rx="0.9" fill="white" />
              </svg>
              <span
                className={`text-white font-bold ${m(
                  "text-[22px]",
                  "text-[22px]"
                )} sm:text-[28px] leading-none pt-1`}
              >
                <EloOdometer
                  from={oldElo}
                  to={newElo}
                  delay={ODOMETER_DELAY}
                  duration={ODOMETER_DURATION}
                />
              </span>
            </span>
          </div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ODOMETER_DELAY + ODOMETER_DURATION, duration: 0.35 }}
            className={`font-bold ${m(
              "text-[20px]",
              "text-[20px]"
            )} sm:text-[24px] shrink-0 ${eloDeltaColorClass(delta)}`}
          >
            {formatEloDelta(delta)}
          </motion.span>
        </div>

        <p
          className={`text-center font-bold ${m(
            "text-[15px]",
            "text-[15px]"
          )} sm:text-[17px] text-[#111827]`}
        >
          That was a good call!
        </p>
        <p
          className={`text-center ${m(
            "text-[13px] mb-[12px]",
            "text-[13px] mb-[12px]"
          )} sm:text-[15px] text-[#111827] sm:mb-[18px] sm:[@media(max-height:920px)]:mb-[10px]`}
        >
          Ready to face more challenging opponents?
        </p>

        <div
          className={`rounded-[14px] border border-[#7CC0F2] ${m(
            "p-[8px] mb-[10px]",
            "p-[8px] mb-[10px]"
          )} sm:p-[10px] sm:mb-[10px] sm:[@media(max-height:920px)]:mb-[8px]`}
        >
          <p
            className={`text-center ${m(
              "text-[12px] mb-[4px]",
              "text-[12px] mb-[4px]"
            )} sm:text-[14px] font-medium text-[#111827] sm:mb-[6px]`}
          >
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
                  className={`flex flex-col items-center gap-[2px] ${m(
                    "p-[4px]",
                    "p-[4px]"
                  )} sm:p-[6px] rounded-[10px] border transition-colors min-w-0 ${
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
                    className={`${m(
                      "w-[56px] h-[56px]",
                      "w-[56px] h-[56px]"
                    )} sm:w-[72px] sm:h-[72px] rounded-full object-cover`}
                  />
                  <span
                    className={`${m(
                      "text-[12px]",
                      "text-[12px]"
                    )} sm:text-[13px] font-semibold truncate max-w-full ${
                      isSelected ? "text-[#221AE9]" : "text-[#111827]"
                    }`}
                  >
                    {opponent.name}
                  </span>
                  <span
                    className={`${m(
                      "text-[11px]",
                      "text-[11px]"
                    )} sm:text-[12px] whitespace-nowrap ${
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
          onClick={() => selectedOpponent && onStartGame?.(selectedOpponent)}
          disabled={!selectedOpponent}
          className={`w-full ${m(
            "py-[12px] text-[15px]",
            "py-[12px] text-[15px]"
          )} sm:py-[14px] sm:[@media(max-height:920px)]:py-[12px] rounded-full bg-[#221AE9] text-white font-semibold sm:text-[16px] hover:bg-[#2d25ea] transition-colors disabled:opacity-50`}
        >
          Start new Game
        </button>
      </div>
    </div>
  );
}

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
  const [sharing, setSharing] = useState(false);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      {sharing && (
        <ShareImageSheet
          spec={{
            kind: "result",
            result: "win",
            elo: newElo,
            delta,
            opponentName,
            opponentElo,
          }}
          onClose={() => setSharing(false)}
        />
      )}
      <div className="relative w-full max-w-[545px]">
        <ShareButton
          variant="pill"
          onClick={() => setSharing(true)}
          className="absolute top-[12px] left-[14px] sm:top-[16px] sm:left-[18px] z-10 bg-white"
        />
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[14px] sm:top-[16px] sm:right-[18px] z-10 text-[#111827] hover:text-[#374151]"
          aria-label="Close"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <WinModalCard
          oldElo={oldElo}
          newElo={newElo}
          delta={delta}
          opponentName={opponentName}
          opponentElo={opponentElo}
          onStartGame={onStartGame}
        />
      </div>
    </div>
  );
}
