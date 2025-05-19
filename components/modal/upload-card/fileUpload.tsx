"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CircularProgress from "./circularProgress";

export function FileUploadCard() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState(50);

  return (
    <div className="flex items-center justify-center w-full bg-white rounded-[8px] p-[16px] h-[94px]">
      <div className="flex w-full flex-row items-center justify-between rounded-[4px] p-[8px] bg-[#E6F7FE] h-[62px]">
        <div className="flex flex-row items-center gap-2">
          <div className="flex items-center justify-center rounded-[4px] w-[46px] h-[46px] bg-[#81CFF3]">
            <span className="font-medium text-[16px] text-[#040404]">PDF</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[14px] text-[#040404]">
              added-file.pdf
            </span>
            <span className="font-normal text-[12px] text-[#585858]">5MB</span>
          </div>
        </div>
        {!isUploading ? (
          <CircularProgress
            percentage={uploadProgress}
            label="Uploading file..."
          />
        ) : (
          <button className="flex flex-row items-center gap-2 bg-[#FFE3E3] border border-[#FFC9C9] h-[32px] rounded-full p-[10px]">
            <Trash2 size={16} color="#FD0000" />
            <span className="font-medium text-[10px] text-[#FD0000]">
              Delete File
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
