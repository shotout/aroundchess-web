import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StageCardProps {
  stageNumber: number;
  active: boolean;
  categorySlug: string;
  subcategorySlug: string;
  fen?: string;
}

const StageCard: React.FC<StageCardProps> = ({
  stageNumber,
  active,
  categorySlug,
  subcategorySlug,
}) => {
  const router = useRouter();

  const handleStageClick = () => {
    router.push(
      `/playground/endgame-training/${categorySlug}/${subcategorySlug}/${stageNumber}`
    );
  };

  return (
    <div
      onClick={handleStageClick}
      className={`
        bg-gradient-to-br from-[#C7DEE9]/10 via-[#BAE2F4]/10 to-[#56B8E9]/10
        relative border-2 rounded-lg p-1 xl:p-3 space-x-2 xl:space-x-5 cursor-pointer border-[#56B8E9] hover:border-blue-base transition-all h-24 xl:h-32 flex items-center justify-center overflow-hidden
     
      `}
    >
      <div className="absolute bottom-0 right-0 pointer-events-none">
        <Image
          src="/endgame-training/sword.png"
          alt="sword bg"
          width={35}
          height={35}
          className="opacity-80"
        />
      </div>

      <div className="absolute top-0 -left-6 pointer-events-none">
        <Image
          src="/endgame-training/board.png"
          alt="chess board"
          width={35}
          height={35}
          className="opacity-80"
        />
      </div>

      <div className="font-semibold text-xl relative z-10">Stage</div>
      <div
        className={`text-[33px] xl:text-[65px] font-bold bg-gradient-to-b from-[#017BFF] from-[5%] to-[#5DDEFF] inline-block text-transparent bg-clip-text relative z-10`}
      >
        {stageNumber}
      </div>
    </div>
  );
};

export default StageCard;
