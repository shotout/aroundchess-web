"use client";

import Image from "next/image";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChooseAnalysisMode({ 
    open, 
    onOpenChange 
}: Props) {

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
    const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
    const headerHeight = 72;
    const headerHeightLg = 96;

    if (!open) return null;

    return (
        <div
            className="fixed bg-[rgba(0,0,0,.5)] backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0"
            style={{
                top:
                typeof window !== "undefined" && window.innerWidth >= 1024
                    ? headerHeightLg
                    : headerHeight,
                left: sidebarWidth,
                right: 0,
                bottom: 0,
            }}
            // onClick={() => onOpenChange(false)}
        >
            <div className="relative w-full lg:w-[560px] bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] lg:rounded-[24px] p-[16px] lg:p-[32px]">
                <button type="button" className="absolute top-[16px] lg:top-[32px] right-[16px] lg:right-[32px]">
                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h3 className="text-[18px] text-center font-bold text-[#121212] mb-[32px]">Choose Analysis Mode</h3>

                <div className="flex flex-col gap-[16px]">
                    <button type="button" className="relative w-full rounded-[24px] p-[12px] border border-b-[5px] border-[#16A6E9] bg-gradient-to-b from-[#DAF1FB] to-[#81CFF3] overflow-hidden">
                        <Image src={"/images/analysis/bg.svg"} alt="..." width={240} height={240} className="bg-image absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
                        <div className="flex flex-col justify-center items-center">
                            <Image src={"/images/analysis/icon_quick-summary.svg"} alt="..." width={60} height={60} className="" />
                            <p className="text-[24px] font-semibold text-[#040404] leading-[150%] mb-[4px]">Quick Summary</p>
                            <p className="text-[16px] text-[#585858] mb-[16px]">(Easy hints to improve your game)</p>
                            <span className="flex items-center gap-[4px] text-[16px] leading-[20px] font-bold">
                                Open Game Analysis
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_494_127255)">
                                        <path d="M1 7H15.101" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8.79688 0.875L15.0969 7L8.79688 13.125" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_494_127255">
                                            <rect width="16" height="14" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                        </div>
                    </button>

                    <button type="button" disabled className="relative w-full rounded-[24px] p-[12px] border border-b-[5px] border-[#16A6E9] bg-gradient-to-b from-[#DAF1FB] to-[#81CFF3] overflow-hidden disabled:border-[#666666] disabled:from-[#DEDEDE] disabled:to-[#99A5A9]">
                        <Image src={"/images/analysis/bg.svg"} alt="..." width={240} height={240} className="bg-image absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] grayscale" />
                        <div className="flex flex-col justify-center items-center">
                            <Image src={"/images/analysis/icon_chess-master.svg"} alt="..." width={60} height={60} className="" />
                            <p className="text-[24px] font-semibold text-[#040404] leading-[150%] mb-[4px]">Quick Summary</p>
                            <p className="text-[16px] text-[#585858] mb-[4px]">(In-depth Analysis - understand it all)</p>
                            {true ? (
                                <div className="relative w-[300px] flex items-center justify-center h-[45px] text-[#666666] bg-white border border-[#666666] rounded-full before:content-[''] before:absolute before:top-[-1px] before:left-0 before:w-[45%] before:h-[45px] before:bg-gradient-to-tr before:from-[rgba(102,102,102,.8)] before:to-[rgba(157,157,157,.5)] before:rounded-l-full before:z-0">
                                    <span className="relative z-10">On Progress: <strong className="font-semibold">45%</strong></span>
                                </div>
                            ) : (
                                <span className="flex items-center gap-[4px] text-[16px] leading-[20px] font-bold">
                                    Open Chess Master Analysis
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_494_127255)">
                                            <path d="M1 7H15.101" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.79688 0.875L15.0969 7L8.79688 13.125" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_494_127255">
                                                <rect width="16" height="14" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}