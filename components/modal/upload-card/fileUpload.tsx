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
        const randomIncrement = Math.floor(Math.random() * 10) + 1; // 1 to 10
        let next = Math.min(prev + randomIncrement, 100);
        if (next >= 100) {
          next = 100;
          setIsUploading(false);
          clearInterval(interval);
        }
        return next;
      });
    }, 300); // update every 300ms

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center justify-center w-full bg-white rounded-[8px] p-[16px] h-[94px]">
      <div className="flex w-full flex-row items-center justify-between rounded-[4px] p-[8px] bg-[#E6F7FE] h-[62px]">
        <div className="flex flex-row items-center gap-2">
          <div className="flex items-center justify-center rounded-[4px] w-[46px] h-[46px] bg-[#81CFF3]">
            <span className="font-medium text-[16px] text-[#040404]">PDF</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[14px] text-[#040404]">
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
            className="flex flex-row items-center gap-2 bg-[#FFE3E3] border border-[#FFC9C9] h-[32px] rounded-full p-[10px]"
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
