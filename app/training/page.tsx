"use client";

import Navigation from "@/components/navigator/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaFontAwesome } from "react-icons/fa";

export default function Handbook() {
    return (
        <div className="flex overflow-hidden bg-primary-white">
              <div className="flex flex-col overflow-y-auto w-full">
                <Navigation>
                    <div className="w-full flex items-center bg-[url(/images/handbook/bg.jpg)] bg-cover bg-center min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-97px)] p-[16px] pt-[32px] md:pt-[16px]">
                        <div className="w-full flex flex-wrap items-center justify-center gap-[16px]">
                            <div className="flex flex-col items-center justify-center gap-[12px] w-full md:w-[360px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[15px]">
                                <div className="flex gap-[12px]">
                                    <Image src="/images/training/training-plan-icon.svg" alt="opening theory" width={50} height={48} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-[16px] leading-[140%]">Training Plan</h3>
                                        <p className="text-[14px] leading-[120%] md:min-h-[86px]">Your Training Plan will help you to improve your skills step-by-step on a daily basis.</p>
                                    </div>
                                </div>

                                <Link href="/training-plan" className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Open Training Plan <FaArrowRight  />
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-[12px] w-full md:w-[360px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[15px]">
                                <div className="flex gap-[12px]">
                                    <Image src="/images/training/handbook-icon.svg" alt="opening theory" width={50} height={48} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-[16px] leading-[140%]">Handbook: Chess Theory</h3>
                                        <p className="text-[14px] leading-[120%] md:min-h-[86px]">Master the fundamental principles of chess openings, middlegame and endgame. Learn how to develop your pieces effectively, control the center, and ensure king safety.</p>
                                    </div>
                                </div>

                                <Link href="/handbook" className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Open Handbook <FaArrowRight  />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Navigation>
            </div>
        </div>
    );
}