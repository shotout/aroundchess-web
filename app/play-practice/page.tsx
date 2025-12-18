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
                    {/* <div className="w-full flex items-center bg-[url(/images/handbook/bg.jpg)] bg-cover bg-center min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-97px)] p-[16px] pt-[32px] md:pt-[16px]"> */}
                    <div className="w-full flex items-center bg-[url(/images/handbook/bg.jpg)] bg-cover bg-center min-h-[300px] lg:min-h-[calc(100vh-600px)] p-[16px] pt-[32px] lg:py-[32px]">
                        <div className="w-full flex flex-wrap items-center justify-center gap-[16px]">
                            <div className="flex flex-col justify-center gap-[12px] w-full md:w-[490px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[16px] md:py-[24px]">
                                <div className="flex items-center gap-[12px]">
                                    <Image src="/images/play-practice/play-vs-ai-icon.svg" alt="opening theory" width={80} height={48} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-[16px] leading-[140%]">You vs AI</h3>
                                        <p className="text-[14px] leading-[120%] md:min-h-[40px]">Challenge AI to improve your accuracy and enhance your chess skills.</p>
                                    </div>
                                </div>

                                <Link href="/playground/play-vs-ai" className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Start <FaArrowRight  />
                                </Link>
                            </div>

                            <div className="flex flex-col justify-center gap-[12px] w-full md:w-[490px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[16px] md:py-[24px]">
                                <div className="flex items-center gap-[12px]">
                                    <Image src="/images/play-practice/puzzle-icon.svg" alt="opening theory" width={80} height={48} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-[16px] leading-[140%]">Puzzles</h3>
                                        <p className="text-[14px] leading-[120%] md:min-h-[40px]">Train with more than 500,000 Puzzles</p>
                                    </div>
                                </div>

                                <Link href="/playground/puzzle" className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Start <FaArrowRight  />
                                </Link>
                            </div>

                            <div className="flex flex-col justify-center gap-[12px] w-full md:w-[490px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[16px] md:py-[24px]">
                                <div className="flex items-center gap-[12px]">
                                    <Image src="/images/play-practice/board-visions-icon.svg" alt="opening theory" width={80} height={48} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-[16px] leading-[140%]">Board Vision</h3>
                                        <p className="text-[14px] leading-[120%] md:min-h-[40px]">Answer technical Chess Questions from positions of your previous Games to improve your Board Vision.</p>
                                    </div>
                                </div>

                                <Link href="/playground/board-vision" className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Start <FaArrowRight  />
                                </Link>
                            </div>

                            <div className="flex flex-col justify-center gap-[12px] w-full md:w-[490px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[16px] md:py-[24px]">
                                <div className="flex items-center gap-[12px]">
                                    <Image src="/images/play-practice/endgame-training-icon.svg" alt="opening theory" width={80} height={48} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-[16px] leading-[140%]">Endgame Training</h3>
                                        <p className="text-[14px] leading-[120%] md:min-h-[40px]">Practice a variety of Endgame Positions and quickly improve your Endgame Skills!</p>
                                    </div>
                                </div>

                                <Link href="/playground/endgame-training" className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Start <FaArrowRight  />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Navigation>
            </div>
        </div>
    );
}