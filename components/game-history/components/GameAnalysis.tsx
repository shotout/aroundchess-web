"use client";

import Image from "next/image";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { Chess, Square } from "chess.js";
import { BoardOrientation, PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { SettingBoard } from "@/components/modal/SettingBoard";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import { useChessMoveStore } from "@/app/store/chessMoveStore";
import { CustomChessArrows } from "./CustomChessArrows";
import { useProfileStore } from "@/app/store/profile";
import type { Swiper as SwiperType } from 'swiper';
import Link from "next/link";

interface ArrowConfig {
    from: string;
    to: string;
    color: string;
    isKnightMove: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  v3Result?: any;
}

export default function GameAnalysis({
    open,
    onOpenChange,
    v3Result
}: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperType>();

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
    const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
    const headerHeight = 72;
    const headerHeightLg = 96;

    if (!open) return null;

    return (
        <div
            className="fixed bg-[rgba(0,0,0,.5)] backdrop-blur-sm z-50 flex justify-center items-center lg:py-[16px]"
            style={{
                top:
                typeof window !== "undefined" && window.innerWidth >= 1024
                    ? headerHeightLg
                    : headerHeight,
                left: sidebarWidth,
                right: 0,
                bottom: 0,
            }}
            onClick={() => onOpenChange(false)}
        >
            <div onClick={(e) => e.stopPropagation()} data-tutorial="4" className="relative w-full lg:w-[400px] xxl:w-[450px] 2xl:w-[520px] lg:h-[580px] xxl:h-[660px] overflow-x-hidden bg-gradient-to-b from-white to-[#D0EFFF] rounded-0 lg:rounded-[16px] p-[16px] lg:py-[10px] xxl:p-[20px]">
                <button type="button" onClick={() => { onOpenChange(false) }} className="absolute top-[16px] xxl:top-[32px] right-[16px] xxl:right-[32px]">
                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h3 className="text-[18px] text-center font-bold text-[#121212] mb-[16px] lg:mb-[10px] xxl:mb-[16px]">Game Analysis</h3>

                {v3Result.summary.criticalMistakes.length > 0 ? (
                    <>
                        <Swiper
                            modules={[EffectCards, Pagination]}
                            effect="cards"
                            grabCursor={true}
                            cardsEffect={{
                                slideShadows: true,
                                rotate: true,
                                perSlideRotate: 2,
                                perSlideOffset: 8,
                            }}
                            pagination={{
                                clickable: true,
                                el: '.swiper-pagination',
                            }}
                            onSlideChange={(swiper) => {
                                setActiveIndex(swiper.activeIndex);
                            }}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                setActiveIndex(swiper.activeIndex);
                                console.log(swiper);
                            }}
                            className="w-full"
                        >
                            {v3Result.summary.criticalMistakes.map((mistake: any, index: number) => (
                                <SwiperSlide key={index}>
                                    <GameAnalysisSlide mistake={mistake} />
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <AnalysisHelpfulSlide
                                    analysisId={v3Result?.analysisId}
                                    v3Result={v3Result}
                                    onOpenChange={() => {
                                        onOpenChange(false);
                                    }}
                                />
                            </SwiperSlide>
                        </Swiper>

                        <div data-tutorial="5" className="relative h-[50px] mt-[16px] flex items-center justify-center gap-[64px]">
                            <button onClick={() => swiperRef.current?.slidePrev()} className="custom-swiper-button-prev relative w-[32px] h-[32px] flex justify-center items-center gap-[4px] p-[8px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_1155_12540)">
                                        <path d="M15 7H0.899022" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M7.20312 0.875L0.903125 7L7.20312 13.125" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1155_12540">
                                            <rect width="16" height="14" fill="white" transform="matrix(-1 0 0 1 16 0)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-semibold">- {activeIndex + 1} of {v3Result.summary.criticalMistakes.length + 1} -</span>
                                <div className="swiper-pagination">
                                    <div className="swiper-pagination-bullets">
                                        {v3Result.summary.criticalMistakes.map((mistake: any, index: number) => (
                                            <div
                                                key={index}
                                                className={`swiper-pagination-bullet mx-[3px] ${activeIndex === index ? 'swiper-pagination-bullet-active' : ''}`}
                                            ></div>
                                        ))}
                                    </div>`
                                </div>
                            </div>
                            <button onClick={() => swiperRef.current?.slideNext()} className="custom-swiper-button-next w-[32px]! h-[32px]! flex relative justify-center items-center p-[8px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_1155_12557)">
                                        <path d="M1 7L15.101 7" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8.80469 13.125L15.1047 7L8.80469 0.875" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1155_12557">
                                            <rect width="16" height="14" fill="white" transform="matrix(1 1.74846e-07 1.74846e-07 -1 0 14)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </>
                ) : <AnalysisEmptyState handleClose={() => onOpenChange(false)} />}
            </div>
        </div>
    );
}

const GameAnalysisSlide = ({mistake} : {mistake: any}) => {
    const [game, setGame] = useState(new Chess());
    const [boardSize, setBoardSize] = useState(240);
    const [orientation, setOrientation] = useState<BoardOrientation>("white");
    const [is3DMode, setIs3DMode] = useState<boolean>(false);
    const [customArrows, setCustomArrows] = useState<ArrowConfig[]>([]);

    const { setStyleChoosed } = useChessBoardThemeStore();
    const { chessMove, setChessMove } = useChessMoveStore();

    // Helper function to detect if a move is a knight move (L-shaped)
    const isKnightMove = (from: string, to: string): boolean => {
        const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const rankFrom = parseInt(from[1]) - 1;
        const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
        const rankTo = parseInt(to[1]) - 1;

        const fileDiff = Math.abs(fileTo - fileFrom);
        const rankDiff = Math.abs(rankTo - rankFrom);

        // Knight moves: 2 squares in one direction, 1 in perpendicular
        return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
    };

    const handleSwitch = () => {
        setOrientation((prev) => {
            if (prev == "white") {
                return "black";
            } else {
                return "white";
            }
        });
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth < 1400) {
            setBoardSize(170);
        } 

        if (typeof window !== "undefined" && window.innerWidth > 1600) {
            setBoardSize(280);
        }
    }, []);

    // Load FEN position from mistake when it changes
    useEffect(() => {
        if (mistake?.fen) {
            console.log("🎯 [GameAnalysisSlide] Loading FEN from mistake:", mistake.fen);
            try {
                const newGame = new Chess();
                newGame.load(mistake.fen);
                setGame(newGame);
                console.log("✅ [GameAnalysisSlide] FEN loaded successfully");
            } catch (error) {
                console.error("❌ [GameAnalysisSlide] Failed to load FEN:", error);
                console.error("❌ Invalid FEN:", mistake.fen);
            }
        } else {
            console.log("⚠️ [GameAnalysisSlide] No FEN found in mistake object:", mistake);
        }
    }, [mistake]);

    // Generate arrows for badMove (red) and goodMove (green)
    useEffect(() => {
        const arrows: ArrowConfig[] = [];

        console.log("🎯 [GameAnalysisSlide] Generating arrows from mistake:", mistake);
        console.log("🎯 [GameAnalysisSlide] Arrows object:", mistake?.arrows);

        // Red arrow for bad move
        if (mistake?.arrows?.badMove) {
            const badMove = mistake.arrows.badMove;
            console.log("🔴 [GameAnalysisSlide] Bad move object:", badMove);

            // Check if it's an object with startSquare and endSquare
            if (badMove.startSquare && badMove.endSquare) {
                const from = badMove.startSquare;
                const to = badMove.endSquare;
                const color = "rgba(239, 68, 68, 0.8)"; // Red color
                const isKnight = isKnightMove(from, to);

                arrows.push({
                    from,
                    to,
                    color,
                    isKnightMove: isKnight
                });

                console.log(`🔴 [GameAnalysisSlide] Added ${isKnight ? 'L-shaped' : 'straight'} bad move arrow:`, from, "->", to);
            }
        } else {
            console.log("⚠️ [GameAnalysisSlide] No badMove found in mistake.arrows");
        }

        // Green arrow for good move (could be goodMove or bestMove)
        const goodMove = mistake?.arrows?.goodMove || mistake?.arrows?.bestMove;
        if (goodMove) {
            console.log("🟢 [GameAnalysisSlide] Good move object:", goodMove);

            // Check if it's an object with startSquare and endSquare
            if (goodMove.startSquare && goodMove.endSquare) {
                const from = goodMove.startSquare;
                const to = goodMove.endSquare;
                const color = "rgba(34, 197, 94, 0.8)"; // Green color
                const isKnight = isKnightMove(from, to);

                arrows.push({
                    from,
                    to,
                    color,
                    isKnightMove: isKnight
                });

                console.log(`🟢 [GameAnalysisSlide] Added ${isKnight ? 'L-shaped' : 'straight'} good move arrow:`, from, "->", to);
            }
        } else {
            console.log("⚠️ [GameAnalysisSlide] No goodMove/bestMove found in mistake.arrows");
        }

        setCustomArrows(arrows);
        console.log("✅ [GameAnalysisSlide] Total arrows:", arrows.length);
        console.log("✅ [GameAnalysisSlide] Arrows array:", arrows);
    }, [mistake]);

    const toggleBoardMode = () => {
        setIs3DMode((prev) => !prev);
        const style = !is3DMode ? "3d" : "2d";
        setStyleChoosed(style);
    };

    return (
        <div className="bg-white border border-[#221AE9] rounded-[8px] p-[16px] lg:p-[10px] xxl:p-[16px] shadow-[0px_4px_10px_0px_rgba(23,28,183,.25]">
            <div className="w-full flex flex-col gap-[10px] items-center justify-center mb-[16px]">
                {/* <Image src="/images/analysis/chessboard2d.png" alt="analysis" width={320} height={320} className="mb-[10px]" /> */}
                <div
                    style={{ width: boardSize }}
                    className="flex flex-row self-end sm:self-center justify-end items-center gap-3"
                >
                    <button onClick={handleSwitch}>
                        <Image
                            src={"/images/play-vs-ai/switch.png"}
                            alt="icon"
                            width={20}
                            height={20}
                            className="w-[20px] h-[20px] rounded-full object-contain"
                        />
                    </button>
                    
                    <SettingBoard />
                
                    <button onClick={toggleBoardMode}>
                        <Image
                            src={`/icons/${!is3DMode ? `3d-icon` : `2d-icon`}.png`}
                            alt="icon"
                            width={22}
                            height={27}
                            className="w-[22px] h-[27px] object-contain"
                        />
                    </button>
                </div>

                <motion.div
                    initial={{ rotateX: 180 }}
                    animate={!is3DMode ? { opacity: 0, display: "hidden" } : { opacity: 1, rotateX: !is3DMode ? 180 : 360 }}
                    transition={{
                        duration: 0.6,
                        stiffness: 500,
                        damping: 30,
                        ease: [0.4, 0.0, 0.2, 1],
                        type: "tween",
                    }}
                    style={{
                        width: boardSize,
                        display: is3DMode ? "flex" : "none",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        position: "relative",
                    }}
                >
                    {is3DMode && (
                        <>
                            <ThreeDBoard
                                arePiecesClickable={false}
                                arePiecesDraggable={false}
                                boardWidth={boardSize}
                                orientation={orientation}
                                position={game.fen()}
                                onSquareClick={function (square: Square): void {
                                    throw new Error("Function not implemented.");
                                }}
                                onSquareRightClick={function (square: Square): void {
                                    throw new Error("Function not implemented.");
                                }}
                                onPromotionPieceSelect={function (
                                    piece?: PromotionPieceOption,
                                    promoteFromSquare?: Square,
                                    promoteToSquare?: Square
                                ): boolean {
                                    throw new Error("Function not implemented.");
                                }}
                                promotionToSquare={null}
                                showPromotionDialog={false}
                                customArrows={[]}
                                areArrowsAllowed={false}
                                customArrowColor={""}
                            />
                            <CustomChessArrows
                                arrows={customArrows}
                                boardSize={boardSize}
                                orientation={orientation}
                            />
                        </>
                    )}
                </motion.div>

                <motion.div
                    initial={{ rotateX: 180 }}
                    animate={
                    is3DMode
                        ? { opacity: 0, display: "none" }
                        : { opacity: 1, rotateX: is3DMode ? 180 : 360 }
                    }
                    transition={{
                        duration: 0.5,
                        stiffness: 500,
                        damping: 35,
                        ease: [0.4, 0.0, 0.2, 1],
                        type: "tween",
                    }}
                    style={{
                        width: boardSize,
                        display: !is3DMode ? "flex" : "none",
                        backfaceVisibility: "hidden",
                        position: "relative",
                    }}
                >
                    {!is3DMode && (
                    <>
                        <TwoDChessboard
                            arePiecesClickable={false}
                            arePiecesDraggable={false}
                            boardWidth={boardSize}
                            orientation={orientation}
                            position={game.fen()}
                            onSquareClick={function (square: Square): void {
                                throw new Error("Function not implemented.");
                            }}
                            onSquareRightClick={function (square: Square): void {
                                throw new Error("Function not implemented.");
                            }}
                            onPromotionPieceSelect={function (
                            piece?: PromotionPieceOption,
                            promoteFromSquare?: Square,
                            promoteToSquare?: Square
                            ): boolean {
                                throw new Error("Function not implemented.");
                            }}
                            promotionToSquare={null}
                            showPromotionDialog={false}
                            customArrows={[]}
                            areArrowsAllowed={false}
                            customArrowColor={""}
                        />
                        <CustomChessArrows
                            arrows={customArrows}
                            boardSize={boardSize}
                            orientation={orientation}
                        />
                    </>
                    )}
                </motion.div>
            </div>

            <div className="w-full border border-[#221AE9] rounded-[8px]">
                <div className="flex items-center justify-between py-[4px] rounded-t-[7px] px-[16px] bg-gradient-to-tr from-[#2327EB] to-[#25CADC]">
                    <div className="flex items-center gap-[8px]">
                        <div className="flex gap-[6px] px-[8px] py-[3px] bg-white border border-[#FF7769] text-[#FF7769] rounded-[4px]">
                            <Image src="/images/analysis/icon_miss.png" alt="miss" width={18} height={18} className="w-[18px] h-[18px] object-contain" />
                            <span className="font-semibold text-[13px]">{mistake.type}</span>
                        </div>

                        <span className="font-bold text-white text-[14px]">Move { mistake.moveNumber }: { mistake.move }</span>
                    </div>

                    <div className="flex gap-[8px] items-center">
                        <span className={`${mistake.keyEvaluation < 0 ? "text-[#E22B32] border-[#E22B32]" : "text-[#00B427] border-[#00B427]"} border text-medium text-[14px] bg-white rounded-full py-[2px] px-[10px]`}>
                            { mistake.keyEvaluation }
                        </span>

                        <button type="button" className="relative w-[32px] h-[32px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] shadow-[0px_0px_1px_2px_rgba(230,247,254,.2)] rounded-[8px] before:content-[''] before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:absolute before:top-[1px] before:left-[1px] before:shadow-inset before:rounded-[6px] before:shadow-[0px_0px_0px_1px_rgba(255,255,255,1)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-[6px] after:shadow-[inset_0px_-2px_2px_0px_rgba(141,215,246,1)]">
                            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.4167 15.75L6.58333 11.5833L0.75 15.75V2.41667C0.75 1.97464 0.925595 1.55072 1.23816 1.23816C1.55072 0.925595 1.97464 0.75 2.41667 0.75H10.75C11.192 0.75 11.616 0.925595 11.9285 1.23816C12.2411 1.55072 12.4167 1.97464 12.4167 2.41667V15.75Z" stroke="#221AE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-[10px] pt-[8px] overflow-y-scroll max-h-[168px]">
                    <h3 className="flex items-center gap-[8px] mb-[4px]">
                        <Image src="/images/analysis/icon_analysis.svg" alt="analysis" width={28} height={28} className="w-[28px] h-[28px] object-contain" />
                        <span className="font-bold text-[18px] text-[#040404]">Analysis</span>
                    </h3>

                    <p className="text-[15px] leading-[130%] text-[#585858] mb-[8px]">
                        { mistake.analysis }
                    </p>

                    <div className="flex w-full items-center bg-[#1C17A6] gap-[16px] p-[8px] rounded-[8px]">
                        <Image src="/images/analysis/icon_union.svg" alt="analysis" width={44} height={44} className="w-[44px] h-[44px] object-contain" />
                        <div className="relative leading-[120%] flex items-center h-[44px] w-full rounded-[8px] text-[14px] text-white px-[10px] py-[8px] bg-gradient-to-br from-[#2327EB] to-[#25CADC] before:content-[''] before:w-[16px] before:h-[16px] before:absolute before:top-[50%] before:left-[-16px] before:-translate-y-[50%] before:bg-[url(/images/analysis/tail.svg)] before:bg-cover before:bg-no-repeat before:bg-center">
                            {mistake.solution}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalysisHelpfulSlide = (
    { analysisId, v3Result, onOpenChange }: { analysisId?: string; v3Result?: any; onOpenChange: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const { sessionId } = useProfileStore();

    const handleFeedback = async (helpful: boolean) => {
        onOpenChange();

        if (!analysisId || isSubmitting || feedbackSent) {
            return;
        }

        if (!sessionId) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { default: axios } = await import("axios");
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";

            const response = await axios.post(
                `${baseUrl}/v3/feedback/analysis/${analysisId}/feedback`,
                { helpful },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionId}`,
                    },
                }
            );

            setFeedbackSent(true);
        } catch (error: any) {
            // Silent error handling
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative bg-white border min-h-[498px] lg:min-h-[456px] xxl:min-h-[526px] flex flex-col justify-between items-center border-[#221AE9] rounded-[8px] p-[16px] shadow-[0px_4px_10px_0px_rgba(23,28,183,.25] overflow-hidden">
            <Image src={"/images/analysis/bg-big.svg"} alt="bg" width={640} height={640} className="w-full absolute top-[50%] translate-y-[-50%] lg:translate-y-0 lg:top-0 left-0 object-contain z-0" />

            <div className="relative mb-[-56px] lg:mb-0 w-full h-[calc(100vh-240px)] lg:h-auto flex items-center justify-center flex-col z-10">
                <Image src="/images/analysis/icon_helpful.svg" alt="analysis" width={240} height={240} className="w-[160px] lg:w-[240px] h-[160px] lg:h-[240px] object-contain" />
                <h3 className="font-bold text-[24px] text-[#040404]">
                    {feedbackSent ? "Thank you for your feedback!" : "Was this Analysis helpful?"}
                </h3>

                {!feedbackSent ? (
                    <div className="flex items-center gap-[16px] mt-[16px]">
                        <button
                            type="button"
                            onClick={() => handleFeedback(false)}
                            disabled={isSubmitting}
                            className={`btn-secondary w-[160px] h-[40px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFeedback(true)}
                            disabled={isSubmitting}
                            className={`btn-secondary w-[160px] h-[40px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Yes
                        </button>
                    </div>
                ) : (
                    <p className="text-[16px] text-[#585858] mt-[16px]">Your feedback has been recorded.</p>
                )}
            </div>

            <button type="button" onClick={onOpenChange} className="relative mb-[56px] lg:mb-0 w-[148px] h-[32px] flex justify-center items-center gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">
                Close
            </button>
        </div>
    );
}

const AnalysisEmptyState = ({ handleClose }: { handleClose: () => void }) => {
    return (
        <>
            <div className="relative bg-white border min-h-[498px] lg:min-h-[456px] xxl:min-h-[526px] flex flex-col justify-center items-center border-[#221AE9] rounded-[8px] p-[32px] shadow-[0px_4px_10px_0px_rgba(23,28,183,.25] overflow-hidden">
                <Image src="/images/analysis/icon_empty-state.svg" alt="bg" width={160} height={165} className="mb-[16px]" />
                <div className="relative mb-[24px]">
                    <h3 className="text-[16px] font-semibold mb-[8px]">No critical mistakes were detected in this game  — your play stayed solid throughout.</h3>
                    <p className="text-[15px] text-[#333]">Keep reviewing your games like this; maintaining a game with no serious errors is already excellent training. Check the Chess Master Analysis for an in-depth analysis.</p>
                </div>

                <Link href="/analysis" className="flex items-center justify-center btn-primary w-full h-[48px] rounded-full bg-primary py-2 px-6 text-[14px] --sm font-medium text-white mb-[16px]">
                    Visit Chess Master Analysis
                </Link>

                <button onClick={handleClose} type="button" className="btn-secondary w-full h-[48px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 ">
                    Close
                </button>
            </div>

            <div className="text-center text-[14px] font-medium text-[#121212] mt-4">
                - 1 of 1 -
            </div>
        </>
    );
} 