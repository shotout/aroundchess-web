"use client";

import Image from "next/image";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProcessingAnalysisMode({ 
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

                <h3 className="text-[18px] text-center font-bold text-[#121212] mb-[16px]">Choose Analysis Mode</h3>

                <div className="flex flex-col items-center justify-center mb-[8px]">
                    <div className="w-[100px] h-[100px]">
                        <CircularProgressbar 
                            value={50} 
                            text={`${50}%`} 
                            styles={{
                                root: {},
                                text: {
                                    fill: "#364152",
                                    fontSize: "22px",
                                    fontWeight: 600,
                                },
                                path: {
                                    stroke: "#221AE9",
                                    strokeLinecap: "butt",
                                },
                                trail: {
                                    stroke: "#DEDEDE",
                                }
                            }} />
                        <span className="text-[24px] lg:text-[36px] font-semibold">AI Analyzing Now...</span>
                    </div>
                    <Image src={"/images/analysis/chessboard.png"} alt="chesboard" width={560} height={484} className="w-full" />
                </div>
            </div>
        </div>
    );
}