"use client";

import Image from "next/image";

const SHARE_ICON = "/images/v2/play-vs-ai/share-icon.png";

interface ShareButtonProps {
  onClick: () => void;
  variant?: "block" | "pill";
  label?: string;
  className?: string;
}

export function ShareButton({
  onClick,
  variant = "block",
  label = "Share with friends",
  className = "",
}: ShareButtonProps) {
  const block = variant === "block";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-[8px] rounded-lg sm:rounded-xl  border border-[#221AE9] font-base text-[#221AE9] transition-colors hover:bg-[#221AE908] ${
        block
          ? "w-full py-[10px] text-[14px] sm:py-[12px] sm:text-[15px]"
          : "shrink-0 px-[8px] py-[5px] text-[10px] sm:text-[13px]"
      } ${className}`}
    >
      <Image
        src={SHARE_ICON}
        alt=""
        width={40}
        height={40}
        className={`${
          block ? "w-[18px] h-[18px]" : "w-[16px] h-[16px]"
        } object-contain`}
      />
      {label}
    </button>
  );
}
