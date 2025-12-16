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
                    <div className="w-full flex items-center bg-[url(/images/handbook/bg.jpg)] bg-cover bg-center min-h-[300px] xl:min-h-[500px] p-[16px] pt-[32px] lg:py-[32px]">
                        <div className="w-full flex flex-col items-center justify-center gap-[16px]">
                            <div className="flex flex-col items-center justify-center gap-[12px] w-full md:w-[640px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[32px]">
                                <Image src="/images/handbook/icon-opening-theory.svg" alt="opening theory" width={50} height={48} />
                                <div className="w-full text-center">
                                    <h3 className="mb-[8px] font-medium text-[18px] leading-[140%]">Opening Theory</h3>
                                    <p className="text-[16px] leading-[120%]">Master the first phase of the game with our comprehensive opening lessons</p>
                                </div>

                                <Link href="/opening-theory" className="flex relative justify-center items-center w-[200px] gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Discover Lessons <FaArrowRight  />
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-[12px] w-full md:w-[640px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[32px]">
                                <Image src="/images/handbook/icon-middlegame-strategy.svg" alt="opening theory" width={50} height={48} />
                                <div className="w-full text-center">
                                    <h3 className="mb-[8px] font-medium text-[18px] leading-[140%]">Middlegame Strategy</h3>
                                    <p className="text-[16px] leading-[120%]">Master strategic and tactical concepts to dominate the middlegame</p>
                                </div>

                                <Link href="/middlegame-strategy" className="flex relative justify-center items-center w-[200px] gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Discover Lessons <FaArrowRight  />
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-[12px] w-full md:w-[640px] bg-[rgba(255,255,255,.65)] backdrop-blur-[8px] border-[2px] border-[#FAFDFF] rounded-[16px] px-[12px] py-[32px]">
                                <Image src="/images/handbook/icon-endgame-mastery.svg" alt="opening theory" width={50} height={48} />
                                <div className="w-full text-center">
                                    <h3 className="mb-[8px] font-medium text-[18px] leading-[140%]">Endgame Mastery</h3>
                                    <p className="text-[16px] leading-[120%]">Perfect your endgame technique with comprehensive lessons and exercises</p>
                                </div>

                                <Link href="/endgame-mastery" className="flex relative justify-center items-center w-[200px] gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                    Discover Lessons <FaArrowRight  />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Navigation>
            </div>
        </div>
    );
}