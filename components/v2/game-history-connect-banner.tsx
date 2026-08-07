"use client";

import Image from "next/image";

interface Props {
  onClick: () => void;
}

export default function GameHistoryConnectBanner({ onClick }: Props) {
  return (
    <div className="w-full my-[16px] flex items-center justify-center gap-[8px] md:gap-[12px] rounded-2xl border border-[#DAD8FB] bg-[#EDECFD] px-[12px] py-[14px] md:px-[24px] md:py-[16px]">
      <Image
        src="/images/v2/game_history/knight-icon-alt-2.png"
        alt=""
        width={56}
        height={56}
        className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] object-contain shrink-0"
        aria-hidden="true"
      />

      <p className="text-[11px] min-[400px]:text-[13px] sm:text-[14px] md:text-[16px] leading-[140%] text-[#1E1E1E] font-medium text-center whitespace-nowrap max-[359px]:whitespace-normal">
        Your Chess.com account is not connected.{" "}
        <button
          type="button"
          onClick={onClick}
          className="text-[#221AE9] font-semibold underline underline-offset-2 hover:opacity-80"
        >
          Connect now.
        </button>
      </p>
    </div>
  );
}
