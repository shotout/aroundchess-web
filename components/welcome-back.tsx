"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"

export function WelcomeBack() {

    return (
        <div className="bg-[rgba(255,255,255,.65)] backdrop-blur-sm rounded-[8px] sm:rounded-[16px] p-[12px] sm:p-[32px] outline outline-1 outline-[#E6F7FE]">
            <h3 className="font-bold text-[18px] sm:text-[28px] leading-[130%] mb-[8px] text-[#040404] text-center">Welcome back to AroundChess!</h3>
            <p className="text-center text-[15px] leading-[140%] sm:text-[20px] mb-[8px] sm:mb-[16px] text-[#2E2E2E]">Continue your Chess Journey with our advanced analysis tools, review your analyzed games, track your progress, and discover new insights to improve your play.</p>

            <div className="flex flex-wrap justify-center items-center mx-[-12px]">
                <ButtonSrc 
                    href="/play"
                    icon="/images/homepage/btn-play-practice-icon.svg"
                    title="Play & Practice"
                    hint="You vs AI, Puzzles, Board Vision, Endgame Training"
                />

                <ButtonSrc 
                    href="/my-game-history"
                    icon="/images/homepage/btn-analyze-games-icon.svg"
                    title="Analyze Games"
                    hint="Game History, Saved Mistakes"
                />

                <ButtonSrc 
                    href="/training"
                    icon="/images/homepage/btn-training-icon.svg"
                    title="Training"
                    hint="Training Plan, <br />Handbook: Chess Theory"
                />
            </div>
        </div>
    )
}

function ButtonSrc(props: {
    href: string,
    icon: string,
    title: string
    hint: string
})
{
    return (
        <div className="flex-shrink-0 w-full lg:w-1/2 xl:w-1/3 px-[12px] mb-[16px] xl:mb-0">
            <Link href={props.href} className="relative max-h-[100px] flex items-center gap-[8px] bg-[#2327EB] border-b-[4px] border-[#2452E7] rounded-full bg-gradient-to-tr from-[#25CADC] to-[#2327EB] overflow-hidden py-[14px] px-[16px] sm:px-[32px] hover:scale-[1.02]">
                <Image src="/images/bg-logo-gram-white.svg" alt="playground" width={150} height={150}
                    className="absolute left-0 top-[50%] translate-y-[-50%]"/>

                <Image src={props.icon} alt="playground" width={100} height={70} className="h-[70px]" />

                <div className="text-white block">
                    <h4 className="font-bold text-[20px] sm:text-[24px] leading-[140%]">{props.title}</h4>
                    <p className="text-[14px]" dangerouslySetInnerHTML={{
                        __html: props.hint
                    }} />
                </div>
            </Link>
        </div>
    );
}