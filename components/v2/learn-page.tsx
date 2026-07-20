"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigator/navigation";
import { LearnPremiumGuard } from "@/components/v2/premium-lock-guard";

interface LearnMode {
  title: string;
  description: string;
  href: string;
  img: string;
}

const LEARN_MODES: LearnMode[] = [
  {
    title: "Training Plan",
    description: "Create a customized Training Plan to improve your ELO.",
    href: "/training-plan",
    img: "/images/v2/learn/calendar.png",
  },
  {
    title: "Handbook: Chess Theory",
    description: "Master the fundamental principles of Chess.",
    href: "/handbook",
    img: "/images/v2/learn/book.png",
  },
];

function LearnModeCard({ mode }: { mode: LearnMode }) {
  return (
    <Link
      href={mode.href}
      className="flex items-center justify-between gap-[10px] rounded-[20px] bg-[#221AE9] px-[20px] py-[22px] sm:px-[24px] sm:py-[20px] shadow-[0_5px_0_rgba(20,14,166,0.55)] transition-colors hover:bg-[#2d25ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <span className="flex flex-col gap-[8px] sm:gap-[6px] min-w-0">
        <span className="text-white font-bold text-[29px] sm:text-[24px] leading-tight tracking-wide">
          {mode.title}
        </span>
        <span className="text-white/95 text-[16px] sm:text-[14px] leading-[140%]">
          {mode.description}
        </span>
      </span>
      <Image
        src={mode.img}
        alt=""
        width={243}
        height={231}
        className="w-[140px] sm:w-[130px] h-auto object-contain shrink-0"
      />
    </Link>
  );
}

export function LearnPage() {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <LearnPremiumGuard />
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full sm:p-[24px] max-w-[1200px] min-[1600px]:max-w-[1400px] mx-auto border-b-2 border-gray">
            <section className="relative overflow-hidden bg-[#E6F7FE] sm:bg-white sm:rounded-[24px] sm:border sm:border-[#E5E7EB] sm:shadow-sm">
              <Image
                src="/images/v2/learn/background-mobile.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="sm:hidden object-cover object-top pointer-events-none select-none opacity-80"
              />
              <Image
                src="/images/v2/learn/background.png"
                alt=""
                fill
                priority
                sizes="1400px"
                className="hidden sm:block object-cover object-center pointer-events-none select-none opacity-30"
              />

              <div className="relative z-10 flex flex-col justify-center gap-[28px] sm:gap-[32px] px-[16px] sm:px-[40px] pt-[40px] sm:pt-[40px] pb-[100px] sm:pb-[48px] sm:min-h-[440px]">
                <header className="text-center flex flex-col gap-[10px]">
                  <h1 className="font-bold text-[38px] sm:text-[40px] leading-tight text-[#2F9AF0]">
                    Learn
                  </h1>
                  <p className="text-[17px] sm:text-[17px] text-[#1F2937] max-w-[640px] mx-auto">
                    Create a Training Plan or practice Chess Theory with our
                    Handbook and take your chess skills to the next level.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] sm:gap-[28px] w-full max-w-[1000px] mx-auto">
                  {LEARN_MODES.map((mode) => (
                    <LearnModeCard key={mode.title} mode={mode} />
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
