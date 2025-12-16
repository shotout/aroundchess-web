"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyStatistics() {
    const router = useRouter();
    return (
        <div className="flex justify-center mb-[8px]">
            <div onClick={() => router.push("/my-statistics")} className="relative z-0 flex w-full items-center justify-start gap-[16px] border border-[#B8EAFF] md:w-[740px] h-[76px] lg:h-[120px] bg-[url('/images/bg-mystatistic.jpg')] bg-cover bg-left py-[16px] pl-[16px] md:pl-[120px] pr-[16px] rounded-[8px] cursor-pointer shadow-[0px_4px_8px_rgba(0,0,0,0.12)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-[8px] before:block before:md:hidden before:bg-[rgba(255,255,255,0.5)]">
                <div className="relative flex flex-col z-10">
                    <h3 className="text-[18px] md:text-[24px] leading-[150%] font-semibold">Your Statistics</h3>
                    <p className="text-[14px] md:text-[20px]">Discover your Game Statistics now.</p>
                </div>

                <Link href="/my-statistics" className="hidden md:flex relative justify-center items-center w-[200px] gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                    Show Statistics              
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.0459 12.7959L14.2959 19.5459C14.0846 19.7572 13.7979 19.8759 13.4991 19.8759C13.2002 19.8759 12.9135 19.7572 12.7022 19.5459C12.4908 19.3345 12.3721 19.0479 12.3721 18.749C12.3721 18.4501 12.4908 18.1635 12.7022 17.9521L17.5312 13.1249H3.75C3.45163 13.1249 3.16548 13.0064 2.9545 12.7954C2.74353 12.5844 2.625 12.2983 2.625 11.9999C2.625 11.7016 2.74353 11.4154 2.9545 11.2044C3.16548 10.9934 3.45163 10.8749 3.75 10.8749H17.5312L12.7041 6.04492C12.4927 5.83358 12.374 5.54693 12.374 5.24804C12.374 4.94916 12.4927 4.66251 12.7041 4.45117C12.9154 4.23983 13.2021 4.12109 13.5009 4.12109C13.7998 4.12109 14.0865 4.23983 14.2978 4.45117L21.0478 11.2012C21.1527 11.3058 21.2359 11.4302 21.2926 11.5671C21.3493 11.704 21.3784 11.8507 21.3782 11.9989C21.3781 12.1471 21.3486 12.2938 21.2916 12.4305C21.2346 12.5673 21.1511 12.6914 21.0459 12.7959Z" fill="white"/>
                    </svg>
                </Link>
            </div>
        </div>
    );
}