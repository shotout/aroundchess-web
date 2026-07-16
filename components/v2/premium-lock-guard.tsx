"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useProfileStore } from "@/app/store/profile";

interface PremiumLockGuardProps {
  image: string;
  description: string;
}

/**
 * Blocks a premium-only area for users without a membership. Renders a lock
 * modal over the page; closing it navigates back so the content stays
 * inaccessible. Use the presets below so each area keeps consistent copy.
 */
export function PremiumLockGuard({ image, description }: PremiumLockGuardProps) {
  const router = useRouter();
  const { isMember, isMemberMonthly, hydrated } = useProfileStore();
  const isSubscribed = !!(isMember || isMemberMonthly);

  // Wait for the persisted profile to rehydrate so premium members never see
  // the lock flash on load.
  if (!hydrated || isSubscribed) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-[320px] sm:max-w-[640px] rounded-[20px] sm:rounded-[28px] bg-white shadow-2xl px-[20px] sm:px-[48px] pt-[40px] sm:pt-[48px] pb-[24px] sm:pb-[40px] text-center">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close"
          className="absolute top-[14px] right-[14px] sm:top-[20px] sm:right-[20px] text-[#111827] hover:opacity-70"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
        </button>

        <Image
          src={image}
          alt="Premium"
          width={320}
          height={320}
          priority
          className="w-[110px] sm:w-[260px] h-auto object-contain mx-auto"
        />

        <h2 className="mt-[16px] sm:mt-[28px] font-bold text-[16px] sm:text-[28px] text-[#111827]">
          Your next level starts here.
        </h2>
        <p className="mt-[8px] sm:mt-[12px] text-[13px] sm:text-[18px] leading-[150%] text-[#374151]">
          {description}
        </p>

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mt-[20px] sm:mt-[36px] w-full rounded-full bg-[#221AE9] hover:bg-[#2d25ea] text-white font-semibold text-[14px] sm:text-[18px] py-[11px] sm:py-[16px] transition-colors"
        >
          Get Premium
        </button>
      </div>
    </div>
  );
}

/** Lock for the Practice area (menu, Puzzles, Board Vision, Endgame Training). */
export function PracticePremiumGuard() {
  return (
    <PremiumLockGuard
      image="/images/v2/practice/premium-practice.png"
      description="Get Premium to unlock the Practice Area and access Puzzles, Board Vision and Endgame Training."
    />
  );
}

/** Lock for the Learn area (menu, Training Plan, Handbook). */
export function LearnPremiumGuard() {
  return (
    <PremiumLockGuard
      image="/images/v2/learn/premium-learn.png"
      description="Get Premium to unlock the Learning Area and access your individual Training Plan and the Handbook."
    />
  );
}
