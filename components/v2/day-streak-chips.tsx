"use client";

import Image from "next/image";

const DOTS = Array.from({ length: 3 });

function Dots({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[2px] shrink-0">
      {DOTS.map((_, i) => (
        <span
          key={i}
          className={`w-[3px] h-[3px] rounded-full ${
            active ? "bg-[#A6E0FF]" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

export function DayStreakChips({
  streak,
  highlightNext = false,
}: {
  streak: number;
  /** Light up the day after the current streak as today's goal — used by
   * the static (not-played-today) modal, e.g. Day 1 at streak 0. */
  highlightNext?: boolean;
}) {
  const cycleStart = Math.floor(Math.max(streak - 1, 0) / 7) * 7 + 1;
  const days = Array.from({ length: 6 }, (_, i) => cycleStart + i);
  const tokenAchieved = streak > 0 && streak % 7 === 0;

  return (
    <div className="flex items-center gap-[4px]">
      {days.map((day) => (
        <div key={day} className="contents">
          <div
            className={`flex-1 aspect-square min-w-0 rounded-[10px] flex flex-col items-center justify-center leading-none ${
              day <= streak || (highlightNext && day === streak + 1)
                ? "bg-[#221AE9] text-white"
                : "bg-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <span className="text-[9px] sm:text-[10px] font-semibold">Day</span>
            <span className="text-[12px] sm:text-[15px] font-bold mt-[2px]">
              {day}
            </span>
          </div>
          <Dots active={day + 1 <= streak} />
        </div>
      ))}
      <div
        className={`flex-1 aspect-square min-w-0 rounded-[10px] flex items-center justify-center ${
          tokenAchieved
            ? "bg-gradient-to-b from-[#FFD75E] to-[#E8A317] ring-2 ring-[#F5B301]"
            : "bg-[#E5E7EB]"
        }`}
      >
        <Image
          src="/images/v2/days-streak/token.png"
          alt="Free Analysis Token"
          width={40}
          height={40}
          className="w-[70%] h-[70%] object-contain"
        />
      </div>
    </div>
  );
}
