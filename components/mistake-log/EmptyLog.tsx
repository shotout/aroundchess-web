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
    <div className="flex flex-col w-[95%] justify-center gap-[24px] bg-white rounded-[16px] items-center p-2">
      <Image
        alt=""
        src={"/images/mistake-log/empty-mistake-log.png"}
        width={1000}
        height={1000}
        className="w-[95px] h-[100px]  sm:w-[116px] sm:h-[120px] md:w-[132px] md:h-[140px] lg:w-[155px] lg:h-[160px]"
      />
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <span className="font-semibold text-[24px] text-[#121212]">
          {title ? title : "You have not yet saved any Mistakes"}
        </span>
        <span className="font-meidum text-[18px] text-[#585858]">
          {content
            ? content
            : `Go to the "Previous Analyses" Tab or analyze another Game now`}
        </span>
      </div>

    

      <div className="w-full">
              <button
              onClick={handleAnalyze}
                className="w-full px-5 py-2 btn-primary rounded-full"
              >
                Analyze a different game
              </button>
            </div>

      {!noButton && (
        <button
          onClick={onClickSeePrevious}
          className="w-full rounded-full btn-secondary font-medium text-[16px] h-[44px]"
        >
          See Previous Analyses
        </button>
      )}
    </div>
  );
};

export default EmptyLog;
