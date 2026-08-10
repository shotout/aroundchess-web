"use client";

import Image from "next/image";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { DayStreakChips } from "@/components/v2/day-streak-chips";
import { useLottieData } from "@/components/v2/hooks/useLottieData";

const NUMBER_DELAY = 1.8;
const TEXT_DELAY = 2.1;

export type DayStreakVariant = "login" | "celebration" | "reward" | "broken";

export type DayStreakStaticFlame = "on" | "off";

interface DayStreakModalProps {
  variant: DayStreakVariant;
  streak: number;
  onClose: () => void;
  staticFlame?: DayStreakStaticFlame;
}

const IMAGES: Record<DayStreakVariant, string> = {
  login: "/images/v2/days-streak/fire-off.png",
  celebration: "/images/v2/days-streak/fire-on.png",
  reward: "/images/v2/days-streak/Free-token.png",
  broken: "/images/v2/days-streak/break.png",
};

const FLAME_IMAGES: Record<DayStreakStaticFlame, string> = {
  off: "/images/v2/days-streak/fire-off.png",
  on: "/images/v2/days-streak/fire-on.png",
};

/** Each piece of artwork carries its own board background, none of which is the
 *  default panel navy — so the shell and the fades over the art follow the art
 *  instead, and no seam shows under the chips. Colours are sampled at the crop
 *  line each piece actually renders at: break.png cropped at 28%, the flame
 *  stills top-anchored, the celebration Lottie's board asset at its
 *  xMidYMid-slice boundary. Class strings are literal so Tailwind emits them. */
const ART_TONES = {
  broken: {
    shell: "bg-[#091931]",
    fade: "from-[#091931]",
    top: "from-[#091931] via-[#091931]/70",
  },
  celebration: {
    shell: "bg-[#0C315F]",
    fade: "from-[#0C315F]",
    top: "from-[#0C315F] via-[#0C315F]/70",
  },
  flameOff: {
    shell: "bg-[#05214B]",
    fade: "from-[#05214B]",
    top: "from-[#05214B] via-[#05214B]/70",
  },
  flameOn: {
    shell: "bg-[#001943]",
    fade: "from-[#001943]",
    top: "from-[#001943] via-[#001943]/70",
  },
} as const;

export const CELEBRATION_LOTTIE = "/images/v2/days-streak/Day-Streak.min.json";
export const REWARD_LOTTIE = "/images/v2/days-streak/get-token.min.json";

export function DayStreakModal({
  variant,
  streak,
  onClose,
  staticFlame,
}: DayStreakModalProps) {
  const animated =
    !staticFlame && (variant === "reward" || variant === "celebration");
  const animationData = useLottieData(
    !animated ? null : variant === "reward" ? REWARD_LOTTIE : CELEBRATION_LOTTIE
  );
  const numberDelay = animated ? NUMBER_DELAY : 0.2;
  const textDelay = animated ? TEXT_DELAY : 0.4;

  const title =
    variant === "broken"
      ? "Your Streak Broke!"
      : variant === "celebration" || variant === "reward"
        ? "Day Streak"
        : null;
 
  // Which ART_TONES entry matches the art this render actually shows. The
  // reward lottie is left on the default navy — its own art fades to black.
  const artTone: keyof typeof ART_TONES | null =
    variant === "broken" && !staticFlame
      ? "broken"
      : animated && variant === "celebration"
        ? "celebration"
        : staticFlame === "on"
          ? "flameOn"
          : staticFlame === "off" || variant === "login"
            ? "flameOff"
            : null;
  const tone = artTone ? ART_TONES[artTone] : null;
  const shellBg = tone?.shell ?? "bg-[#0E1E4B]";
  const fadeFrom = tone?.fade ?? "from-[#0E1E4B]";

  const daysLeft = 7 - (streak % 7);
  
  const subtitle =
    variant === "celebration" || variant === "broken" ? (
      streak <= 0 ? (
        <>
          Start playing today – only {daysLeft} more days
          <br />
          to claim your{" "}
          <span className="font-bold">10 Free Analysis Tokens</span>.
        </>
      ) : staticFlame === "off" ? (
        // Streak running, but today's game isn't in yet (unlit flame) — the
        // count only holds if they play today, so the nudge says so.
        <>
          Keep it up! Play Today - only {daysLeft} more days
          <br />
          to get <span className="font-bold">10 Free Analysis Tokens</span>.
        </>
      ) : (
        <>
          Keep it up! Play {daysLeft} more days
          <br />
          to get <span className="font-bold">10 Free Analysis Tokens</span>.
        </>
      )
    ) : variant === "reward" ? (
      <>
        You have received 10 Tokens
        <br />
        for <span className="font-bold">Free Analyses</span>.
      </>
    ) : null;
  // Static login-style shows: nudge to play while the flame is still off;
  // once today's game is in ("on") — or right after a celebration — just close.
  const cta =
    variant === "celebration" && !staticFlame
      ? "Close"
      : staticFlame === "on"
        ? "Close"
        : "Play now";

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4">
      <div
        className={`relative w-full max-w-[420px] max-h-[94vh] rounded-[24px] ${shellBg} overflow-hidden shadow-2xl flex flex-col`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-[12px] right-[14px] z-20 text-white/90 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* The close button gets its own row above the chips (design) — with
            less top padding the last chip sits under it and swallows it. */}
        <div className="px-[16px] sm:px-[20px] pt-[46px] sm:pt-[40px] relative z-10">
          <DayStreakChips
            streak={streak}
            highlightNext={staticFlame === "off" || variant === "broken"}
          />
        </div>

        <div
          className={`relative w-full min-h-0 shrink ${
            variant === "celebration" || variant === "broken"
              ? "aspect-[15/16]"
              : "aspect-[10/9]"
          }`}
        >
          {animated ? (
            animationData && (
              <Lottie
                animationData={animationData}
                loop={false}
                rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                className={
                  variant === "reward"
                    ? "absolute inset-0"
                    : "absolute inset-x-0 top-[12px] bottom-[12px]"
                }
              />
            )
          ) : (
            <Image
              src={
                staticFlame
                  ? FLAME_IMAGES[staticFlame]
                  : variant === "celebration"
                    ? IMAGES.login
                    : IMAGES[variant]
              }
              alt=""
              fill
              sizes="420px"
              // break.png is narrower than the flame art, so object-cover
              // blows it up and the flame lands too low — crop from further
              // down the source to lift it.
              className={`object-cover ${
                variant === "broken" && !staticFlame
                  ? "object-[50%_28%]"
                  : "object-top"
              }`}
              priority
            />
          )}
          {tone && (
            // Every piece of art is vignetted, so its corners still read darker
            // than the panel even at a matched colour — fade the panel into the
            // art so there is no hard edge under the chips.
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 top-0 h-[64px] z-10 bg-gradient-to-b ${tone.top} to-transparent`}
            />
          )}
          {(variant === "celebration" || variant === "broken") && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: numberDelay, duration: 0.45 }}
              className={`absolute inset-x-0 ${
                variant === "broken" ? "top-[120px]" : "top-[90px]"
              } bottom-0 z-10 flex items-center justify-center pointer-events-none text-white font-extrabold text-[48px] sm:text-[86px] leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]`}
            >
              {streak}
            </motion.span>
          )}
          {variant === "reward" && title && (
            <h2 className="absolute inset-x-0 top-[2%] text-center text-white font-bold text-[22px] sm:text-[26px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              {title}
            </h2>
          )}
          {(variant === "celebration" ||
            variant === "reward" ||
            variant === "broken") && (
            <motion.div
              initial={variant === "reward" ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: textDelay, duration: 0.5 }}
              className={`absolute inset-x-0 bottom-0 px-[24px] pb-[3px] pt-0 text-center bg-gradient-to-t ${fadeFrom} to-transparent`}
            >
              {(variant === "celebration" || variant === "broken") && (
                <h2 className="text-white font-bold text-[22px] sm:text-[26px]">
                  {title}
                </h2>
              )}
              <p className="text-white/90 text-[13px] sm:text-[14px] mt-[4px] leading-[150%]">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>

        <div className="px-[16px] sm:px-[20px] pb-[16px] sm:pb-[20px] pt-[8px]">
          <button
            onClick={onClose}
            className="w-full py-[13px] rounded-[10px] bg-[#221AE9] hover:bg-[#2d25ea] text-white font-semibold text-[15px] transition-colors"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
