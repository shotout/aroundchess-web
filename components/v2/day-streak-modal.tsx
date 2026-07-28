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
 
  const notPlayedToday = staticFlame === "off" || variant === "broken";
  const daysLeft = 7 - (streak % 7);
  const subtitle =
    variant === "celebration" || variant === "broken" ? (
      notPlayedToday ? (
        <>
          Start playing today – only {daysLeft} more days
          <br />
          to claim your{" "}
          <span className="font-bold">10 Free Analysis Tokens</span>.
        </>
      ) : (
        <>
          Keep it up! Play Today – only {daysLeft} more
          <br />
          days to get{" "}
          <span className="font-bold">10 Free Analysis Tokens</span>.
        </>
      )
    ) : variant === "reward" ? (
      <>
        You have received 10 Tokens
        <br />
        for <span className="font-bold">Free Analysis</span>.
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
      <div className="relative w-full max-w-[420px] max-h-[94vh] rounded-[24px] bg-[#0E1E4B] overflow-hidden shadow-2xl flex flex-col">
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
              className="object-cover object-top"
              priority
            />
          )}
          {(variant === "celebration" || variant === "broken") && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: numberDelay, duration: 0.45 }}
              className={`absolute inset-x-0 ${
                variant === "broken" ? "top-[200px]" : "top-[90px]"
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
              className="absolute inset-x-0 bottom-0 px-[24px] pb-[3px] pt-0 text-center bg-gradient-to-t from-[#0E1E4B] to-transparent"
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
