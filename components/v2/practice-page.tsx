"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigator/navigation";
import { PracticePremiumGuard } from "@/components/v2/premium-lock-guard";

interface PracticeMode {
  title: string;
  description: string;
  href: string;
  img: string;
}

const PRACTICE_MODES: PracticeMode[] = [
  {
    title: "Puzzles",
    description: "Solve more than 500,000 Chess Puzzles.",
    href: "/playground/puzzle",
    img: "/images/v2/practice/puzzle.png",
  },
  {
    title: "Board Vision",
    description: "Quiz-Questions about your previous Games.",
    href: "/playground/board-vision",
    img: "/images/v2/practice/board-vision.png",
  },
  {
    title: "Endgame Training",
    description: "Practice to quickly win the Endgame.",
    href: "/playground/endgame-training",
    img: "/images/v2/practice/endgame-training.png",
  },
];

function PracticeModeCard({ mode }: { mode: PracticeMode }) {
  return (
    <Link
      href={mode.href}
      className="flex items-center justify-between gap-[10px] rounded-[20px] bg-[#221AE9] px-[20px] py-[5px] sm:px-[18px] sm:py-[16px] shadow-[0_5px_0_rgba(20,14,166,0.55)] transition-colors hover:bg-[#2d25ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <span className="flex flex-col gap-[6px] min-w-0">
        <span className="text-white font-extrabold text-[26px] sm:text-[19px] leading-tight tracking-wide">
          {mode.title}
        </span>
        <span className="text-white/95 text-[15px] sm:text-[12px] leading-[140%]">
          {mode.description}
        </span>
      </span>
      <Image
        src={mode.img}
        alt=""
        width={243}
        height={231}
        className="w-[120px] sm:w-[72px] h-auto object-contain shrink-0"
      />
    </Link>
  );
}

export function PracticePage() {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <PracticePremiumGuard />
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full sm:p-[24px] max-w-[1200px] min-[1600px]:max-w-[1400px] mx-auto border-b-2 border-gray">
            <section className="relative overflow-hidden bg-[#E6F7FE] sm:bg-white sm:rounded-[24px] sm:border sm:border-[#E5E7EB] sm:shadow-sm">
              <Image
                src="/images/v2/practice/background-mobile.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="sm:hidden object-contain object-center pointer-events-none select-none opacity-80"
              />
              <Image
                src="/images/v2/practice/background.png"
                alt=""
                fill
                priority
                sizes="1400px"
                className="hidden sm:block object-cover object-center pointer-events-none select-none opacity-10"
              />

              <div className="relative z-10 flex flex-col justify-center gap-[28px] sm:gap-[24px] px-[16px] sm:px-[40px] pt-[40px] sm:pt-[40px] pb-[50px] sm:pb-[48px] sm:min-h-[440px]">
                <header className="text-center flex flex-col gap-[8px]">
                  <h1 className="font-bold text-[38px] sm:text-[40px] leading-tight text-[#2F9AF0]">
                    Practice
                  </h1>
                  <p className="text-[17px] sm:text-[15px] text-[#1F2937]">
                    Discover fun ways to improve your Chess skills.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] sm:gap-[20px]">
                  {PRACTICE_MODES.map((mode) => (
                    <PracticeModeCard key={mode.title} mode={mode} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
