"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
interface emptyLogProps {
  title?: string;
  content?: string;
  noButton?: boolean;
  onClickSeePrevious?: () => void;
}
const EmptyLog: React.FC<emptyLogProps> = ({
  title,
  content,
  noButton,
  onClickSeePrevious,
}) => {

  const router = useRouter();
  const handleAnalyze = () => {
    router.push("/my-game-history");
  };
  return (
    <div className="flex flex-col w-full lg:h-auto justify-start lg:justify-center gap-[24px] rounded-[16px] items-center px-[16px] pt-[24px] lg:pt-[16px] pb-[16px] mb-[16px]">
      <Image
        alt=""
        src={"/images/mistake-log/empty-mistake-log.png"}
        width={180}
        height={180}
        className="w-[172px] h-[178px]  sm:w-[116px] sm:h-[120px] md:w-[132px] md:h-[140px] lg:w-[155px] lg:h-[160px]"
      />
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <span className="font-semibold text-[18px] text-center leading-[140%] lg:text-[24px] text-[#121212]">
          {title ? title : (
            <span>You have not saved <br className="lg:hidden" />any Mistakes yet.</span>
          )}
        </span>
      </div>

      <div className="w-full flex justify-center">
        <button
          onClick={handleAnalyze}
          className="w-full max-w-[500px] px-5 py-2 btn-primary rounded-full"
        >
          Analyze Games
        </button>
      </div>

    </div>
  );
};

export default EmptyLog;
