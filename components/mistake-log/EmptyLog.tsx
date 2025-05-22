"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import Link from "next/link";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { TabsTrigger } from "../ui/tabs";
import { AnalyzeDifferentGame } from "../modal/AnalyzeDifferentGame";
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
  const [openAnalyze, setOpenAnalyze] = useState<boolean>(false);

  const router = useRouter();
  const handleAnalyze = () => {
    router.push("/analysis");
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

      <AnalyzeDifferentGame
        style="w-full"
        openPopup={openAnalyze}
        label="Analyze Games"
      />

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
