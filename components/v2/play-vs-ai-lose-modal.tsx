"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ShareButton } from "@/components/v2/share-button";
import { ShareImageSheet } from "@/components/v2/share-image-sheet";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { EloOdometer } from "@/components/v2/elo-odometer";
import { eloDeltaColorClass, formatEloDelta } from "@/components/v2/format-number";
import { useLottieData } from "@/components/v2/hooks/useLottieData";

const ODOMETER_DELAY = 0.6;
const ODOMETER_DURATION = 1.8;

// Compressed copy of LOSE.json (embedded frames downscaled + recompressed,
// 44MB -> 0.8MB) so it loads fast enough to play the moment the modal opens.
export const LOSE_LOTTIE = "/images/v2/play-vs-ai/LOSE.min.json";

interface LoseModalCardProps {
  oldElo: number;
  newElo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
  onDiscoverMistakes?: () => void;
  /**
   * "modal" (default) is the real in-game screen. "tour" renders the exact
   * same card inert for the playground tutorial: no interactivity, no 96vh
   * cap (the tour sizes the room it gets), and a wider animation on mobile.
   */
  variant?: "modal" | "tour";
  /**
   * Fires once the Lottie has played out (it doesn't loop). The playground tour
   * holds its tooltip back until then so the animation isn't competing with the
   * copy. Never fires if the animation JSON fails to load, so callers that gate
   * UI on it need their own fallback.
   */
  onAnimationComplete?: () => void;
}

// Shared visual body of the "You Lost" screen. The real modal wraps this in a
// full-screen overlay + close button; the playground tour renders it inline.
export function LoseModalCard({
  oldElo,
  newElo,
  delta,
  opponentName,
  opponentElo,
  onDiscoverMistakes,
  variant = "modal",
  onAnimationComplete,
}: LoseModalCardProps) {
  const tour = variant === "tour";
  const animationData = useLottieData(LOSE_LOTTIE);

  // See the win modal: both modes now run the modal's mobile sizing, because the
  // tour fills this card from under the tooltip to the bottom of the screen and
  // the old step-down left the content adrift in the middle of it. The tour only
  // departs on the animation, which is wider to take up the remaining height.
  // Desktop is unchanged.
  const m = (tourCls: string, modalCls: string) => (tour ? tourCls : modalCls);

  return (
    <div
      // max-sm: only — see the win card. The mobile tour is the only thing that
      // stretches this, so the desktop tour keeps its plain block layout.
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

      {/* Height comes from WIDTH, not max-h — see the win modal. The renderer
          slices (covers + crops), so a max-h under aspect-[540/400] cut the
          arrows down to two tips on a phone instead of scaling them. */}
      <div
        // Never grows. The renderer covers the box, so a taller box is scaled to
        // fill its height — which shows *more* of the source canvas, empty
        // bottom strip included, straight into the gap above "You Lost". Holding
        // the aspect ratio keeps that strip cropped; the root centres the whole
        // stack instead, so surplus height goes outside the content, not inside.
        className={m(
          "relative w-[72%] sm:w-[90%] sm:[@media(max-height:920px)]:w-[52%] mx-auto aspect-[540/400] max-sm:shrink-0",
          "relative w-[68%] sm:w-[90%] sm:[@media(max-height:920px)]:w-[52%] mx-auto aspect-[540/400] max-h-[26vh] sm:max-h-none"
        )}
      >
        {/* Out of flow — see the win modal: an in-flow height:100% child can
            outgrow an aspect-ratio box in Safari and push the card body away. */}
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
        // No flex-1 here — the animation above takes the surplus, so the copy
        // keeps its designed spacing instead of being spread out to fill.
        className={`${m(
          "px-[20px] pb-[20px] max-sm:shrink-0",
          "px-[20px] pb-[20px]"
        )} sm:px-[36px] sm:pb-[28px] sm:[@media(max-height:920px)]:pb-[18px]`}
      >
        <h2
          className={`text-center font-bold ${m(
            "text-[24px] mt-[8px] mb-[4px]",
            "text-[24px] mt-[8px] mb-[4px]"
          )} sm:text-[30px] text-[#DC2626] sm:mt-[12px] sm:mb-[6px] sm:[@media(max-height:920px)]:mt-[4px] sm:[@media(max-height:920px)]:mb-[2px]`}
        >
          You Lost
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

        {/* ELO pill + loss badge */}
        <div
          className={`flex items-center justify-center gap-[8px] sm:gap-[10px] ${m(
            "mb-[14px]",
            "mb-[14px]"
          )} sm:mb-[20px] sm:[@media(max-height:920px)]:mb-[12px]`}
        >
          <div
            className={`flex items-center justify-between gap-[10px] sm:gap-[16px] bg-[#DC2626] rounded-[10px] ${m(
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
                <path d="M10 18L3 10H7V5H13V10H17L10 18Z" fill="white" />
                <rect x="7" y="1.7" width="6" height="1.8" rx="0.9" fill="white" />
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
          {/* Always rendered, same as the win modal: a calibrating account's 0
              is still the modal's statement about the rating. */}
          <motion.span
            initial={{ opacity: 0, y: -8 }}
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
          That was close!
        </p>
        <p
          className={`text-center ${m(
            "text-[13px] mb-[12px]",
            "text-[13px] mb-[12px]"
          )} sm:text-[15px] text-[#111827] sm:mb-[18px] sm:[@media(max-height:920px)]:mb-[12px]`}
        >
          Discover your biggest mistakes now to see how to win next time!
        </p>

        <button
          onClick={onDiscoverMistakes}
          className={`w-full ${m(
            "py-[12px] text-[15px]",
            "py-[12px] text-[15px]"
          )} sm:py-[14px] sm:[@media(max-height:920px)]:py-[12px] rounded-full bg-[#221AE9] text-white font-semibold sm:text-[16px] hover:bg-[#2d25ea] transition-colors`}
        >
          Discover Mistakes
        </button>
      </div>
    </div>
  );
}

interface PlayVsAiLoseModalProps {
  oldElo: number;
  newElo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
  onClose: () => void;
  onDiscoverMistakes: () => void;
}

export function PlayVsAiLoseModal({
  oldElo,
  newElo,
  delta,
  opponentName,
  opponentElo,
  onClose,
  onDiscoverMistakes,
}: PlayVsAiLoseModalProps) {
  const [sharing, setSharing] = useState(false);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      {sharing && (
        <ShareImageSheet
          spec={{
            kind: "result",
            result: "lose",
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

        <LoseModalCard
          oldElo={oldElo}
          newElo={newElo}
          delta={delta}
          opponentName={opponentName}
          opponentElo={opponentElo}
          onDiscoverMistakes={onDiscoverMistakes}
        />
      </div>
    </div>
  );
}
