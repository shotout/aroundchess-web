"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "./circularProgress";
import formatFileSize from "@/functions/format-file-size";

interface FileUploadCardProps {
  item: any;
  handleDeleteFile: any;
}

export function FileUploadCard({
  item,
  handleDeleteFile,
}: FileUploadCardProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const randomIncrement = Math.floor(Math.random() * 10) + 1;
        let next = Math.min(prev + randomIncrement, 100);
        if (next >= 100) {
          next = 100;
          setIsUploading(false);
          clearInterval(interval);
        }
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);
  return (
    // Mobile stacks the delete control under the file details, so the card is
    // free-height there; sm: and up restores the original fixed-height row.
    <div className="flex items-center justify-center w-full bg-white rounded-[8px] p-[16px] sm:h-[94px]">
      <div className="flex w-full flex-col gap-[8px] sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:rounded-[4px] sm:p-[8px] sm:bg-[#E6F7FE] sm:h-[62px]">
        {/* On mobile the blue panel wraps the file details only, so the action
            below it sits on the card's white background. From sm: the panel
            moves back out to the row above and this row goes plain again. */}
        <div className="flex flex-row items-center gap-2 min-w-0 rounded-[4px] p-[8px] bg-[#E6F7FE] sm:rounded-none sm:p-0 sm:bg-transparent">
          <div className="flex items-center justify-center shrink-0 rounded-[4px] w-[46px] h-[46px] bg-[#81CFF3]">
            <span className="font-medium text-[16px] text-[#040404]">PDF</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[14px] text-[#040404] break-words sm:break-normal">
              {item.name}
            </span>
            <span className="font-normal text-[14px] -- text-[#585858]">
              {formatFileSize(item.size, "B")}
            </span>
          </div>
        </div>
        {isUploading ? (
          <CircularProgress
            percentage={uploadProgress}
            label={uploadProgress < 0 ? "Uploading file..." : ""}
          />
        ) : (
          <button
            onClick={() => handleDeleteFile(item)}
            className="w-full justify-center sm:w-auto sm:justify-start flex flex-row items-center gap-2 bg-[#FFE3E3] border border-[#FFC9C9] h-[32px] rounded-full p-[10px] shrink-0"
          >
            <Trash2 size={16} color="#FD0000" />
            <span className="font-medium text-[14px] --10px text-[#FD0000]">
              Delete File
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
