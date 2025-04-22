import { FC, useState } from "react";
import CurrentInfo from "./CurrentInfo";
import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";
import { usePricingOffer } from "@/app/store/pricingOffer";

const MyRemainingAnalysisTokens = () => {
  const [tokens, setTokens] = useState<number>(14);
  const { token } = useProfileStore();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();
  const handleOpenOffer = (type: string) => {
    console.log("BUKA")
    setOpenSubscribe(true);
    setTabType(type);
  };
  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">
          My Remaining Analysis Tokens
        </span>
      </div>
      <CurrentInfo
        handleOnClick={() => handleOpenOffer("token")}
        title="Remaining Tokens:"
        textButton="Buy More Tokens"
        image="/icons/icon-member-tokens.png"
      >
        <div className="flex flex-row items-center justify-center">
          <Image
            alt="tokens"
            src="/icons/tokens-icon.png"
            width={40}
            height={40}
          />
          <span className="font-semibold text-[40px] text-[#221AE9]">
            {token.balance}
          </span>
        </div>
      </CurrentInfo>
    </div>
  );
};

export default MyRemainingAnalysisTokens;
