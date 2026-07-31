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

const ODOMETER_DELAY = 0.6;
const ODOMETER_DURATION = 1.8;

// Compressed copy of WON.json (embedded frames downscaled + recompressed,
// 64MB -> 1.2MB) so it loads fast enough to play the moment the modal opens.
export const WIN_LOTTIE = "/images/v2/play-vs-ai/WON.min.json";

interface WinModalCardProps {
  oldElo: number;
  newElo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
  onStartGame?: (opponent: AiRosterOpponent) => void;
  /**
   * "modal" (default) is the real in-game screen. "tour" renders the exact
   * same card inert for the playground tutorial: no interactivity, no 96vh
   * cap (the tour sizes the room it gets), and a wider animation on mobile.
   */
  variant?: "modal" | "tour";
  /**
   * Fires once the celebration Lottie has played out (it doesn't loop). The
   * playground tour holds its tooltip back until then so the animation isn't
   * competing with the copy for attention. Never fires if the animation JSON
   * fails to load, so callers that gate UI on it need their own fallback.
   */
  onAnimationComplete?: () => void;
}

// Shared visual body of the "You Won" screen. The real modal wraps this in a
// full-screen overlay + close button; the playground tour renders it inline.
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

  // The tour used to render this a step below the modal's mobile sizing, on the
  // grounds that it only had whatever slot its tooltip left. It now fills from
  // under the tooltip to the bottom of the screen, and at the smaller sizing the
  // content floated in the middle of that with white at both ends — so both
  // modes run the modal's mobile values, and the tour only departs on the
  // animation, which is wider here to take up the remaining height.
  // Desktop (sm:) is identical for both, as before.
  const m = (tourCls: string, modalCls: string) => (tour ? tourCls : modalCls);

  // While an account is still calibrating there is no rated ELO yet, so both
  // props are 0 and the picks fell through to the fixed beginner spread
  // (250/400/500/600) — even for someone onboarding said was advanced. Rate them
  // by the same rule the rest of the app uses: leaderboard ELO, else the
  // onboarding ELO, else the shared 1200 default.
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
      // max-sm: flex column + justify-center. Only the mobile tour stretches this
      // card (cardFill is mobile-only), and centring is what puts the surplus
      // outside the content rather than under the last button. Prefixed rather
      // than bare so the desktop tour keeps the plain block layout it has always
      // had — it has no surplus to distribute, and this shouldn't be the reason
      // it starts behaving like a flex container.
      className={
        tour
          ? "relative w-full max-w-[545px] overflow-hidden bg-white rounded-2xl shadow-2xl select-none pointer-events-none max-sm:flex max-sm:flex-col max-sm:justify-center"
          : "relative w-full max-w-[545px] max-h-[96vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
      }
    >
      {/* Celebration animation — the square Lottie is top-anchored so only
          the canvas' empty bottom strip gets cropped. It's the card's elastic
          part: narrowed on mobile and shrunk on short desktop viewports so the
          card always fits the room it has (96vh for the modal, whatever the
          tour tooltip leaves) at full width, instead of the card scaling down
          and ending up narrower than the tooltip above it.

          Height is bought with WIDTH, never with max-h. The renderer is set to
          "slice", so it covers the box and crops whatever doesn't fit: a max-h
          that undercuts aspect-[540/400] doesn't scale the art down, it cuts it
          off. A 26vh cap on a phone took a third of the animation with it —
          the lose card's arrows were reduced to two tips. A narrower box hits
          the same height while staying exactly on-ratio, so nothing is cropped
          beyond the empty bottom strip the ratio itself trims. */}
      <div
        className={m(
          "relative w-[72%] sm:w-[74%] sm:[@media(max-height:920px)]:w-[46%] mx-auto aspect-[540/400] max-sm:shrink-0",
          "relative w-[68%] sm:w-[74%] sm:[@media(max-height:920px)]:w-[46%] mx-auto aspect-[540/400] max-h-[26vh] sm:max-h-none"
        )}
      >
        {/* Absolute, not in flow: Safari lets an in-flow child with height:100%
            outgrow an aspect-ratio box, and the Lottie's own SVG then stretched
            this one until it pushed the whole card body off screen. Out of flow
            it can only ever fill the height the aspect ratio (or max-h) gives. */}
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

        {/* ELO pill + gain badge */}
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
          {/* Always rendered, including the 0 an account that is still
              calibrating gets: the badge is the modal's statement about the
              rating, so hiding it read as "this win did nothing". */}
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

        {/* Challenge next opponents */}
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
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[545px]">
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
