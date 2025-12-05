"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyStatistics() {
    const router = useRouter();
    return (
        <div className="flex justify-center mb-[8px]">
            <div onClick={() => router.push("/my-statistics")} className="relative flex w-full items-center justify-start gap-[16px] border border-[#B8EAFF] md:w-[740px] h-[76px] lg:h-[120px] bg-[url('/images/bg-mystatistic.jpg')] bg-cover bg-left py-[16px] pl-[16px] md:pl-[120px] pr-[16px] rounded-[8px] cursor-pointer shadow-[0px_4px_8px_rgba(0,0,0,0.12)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-[8px] before:block before:md:hidden before:bg-[rgba(255,255,255,0.5)]">
                <div className="relative flex flex-col z-10">
                    <h3 className="text-[18px] md:text-[24px] leading-[150%] font-semibold">Your Statistics</h3>
                    <p className="text-[14px] md:text-[20px]">Discover your Game Statistics now.</p>
                </div>

                <Link href="/my-statistics" className="hidden md:flex relative justify-center items-center w-[200px] gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                    Show Statistics
                </Link>
            </div>
        </div>
    );
}