"use client";

import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";
import { usePricingOffer } from "@/app/store/pricingOffer";

const ProfileTokensBar = () => {
  const { token } = useProfileStore();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();

  const handleBuyMoreTokens = () => {
    setOpenSubscribe(true);
    setTabType("tokens");
  };

  return (
    <div className="w-full rounded-[12px] border-2 border-[#221AE9] bg-gradient-to-r from-[#E6F7FE] to-white px-[16px] py-[12px] md:px-[24px]">
      <div className="flex sm:hidden flex-col items-center gap-3 py-[8px] text-center">
        <span className="text-[18px] font-semibold text-black">
          My Remaining Analysis Tokens
        </span>
        <Image
          alt=""
          src="/images/v2/profile/remaining_token.png"
          width={120}
          height={120}
          className="object-contain w-[110px] h-[110px]"
        />
        <span className="text-[14px] text-black">Remaining Tokens:</span>
        <div className="flex flex-row items-center gap-1">
          <Image
            alt="tokens"
            src="/icons/tokens-icon.png"
            width={32}
            height={32}
          />
          <span className="font-semibold text-[32px] text-[#221AE9]">
            {token.balance}
          </span>
        </div>
        <button
          onClick={handleBuyMoreTokens}
          className="btn-primary rounded-full w-full h-[44px] font-medium"
        >
          Buy More Tokens
        </button>
      </div>

      <div className="hidden sm:flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            alt=""
            src="/images/v2/profile/remaining_token.png"
            width={64}
            height={64}
            className="object-contain shrink-0 w-[52px] h-[52px] md:w-[64px] md:h-[64px]"
          />
          <span className="text-[18px] md:text-[22px] font-semibold text-black">
            My Remaining Analysis Tokens
          </span>
          <div className="flex flex-row items-center gap-1">
            <Image
              alt="tokens"
              src="/icons/tokens-icon.png"
              width={32}
              height={32}
            />
            <span className="font-semibold text-[28px] md:text-[32px] text-[#221AE9]">
              {token.balance}
            </span>
          </div>
        </div>

        <button
          onClick={handleBuyMoreTokens}
          className="btn-primary rounded-full w-[220px] h-[44px] font-medium"
        >
          Buy More Tokens
        </button>
      </div>
    </div>
  );
};

export default ProfileTokensBar;
