import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LessonType, getLessonBasePath } from "./ChessLessonTypes";
import Image from "next/image";
import Simple2DChess from "./components/Simple2DChess";
import DotSpinner from "../game-history/Spinner";
import TwoDChessboard from "../chessboard/2d/TwoDChessboard";
import { Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

interface ChessLessonCardProps {
  lesson: {
    id?: string;
    title: string;
    difficulty: string;
    moves: string | null;
    readStatus?: boolean;
    eloRange?: string[] | null;
  };
  slug: string;
  lessonType: LessonType;
  getFenFromMoves: (moves: string | null) => string;
  fetchDetails?: (id: string) => Promise<any | null>;
}

const ReadStatusIndicator = ({ readStatus }: { readStatus?: boolean }) => {
  // Always maintain the same container size to prevent layout shifts
  const containerClass =
    "absolute top-2 right-2 h-8 w-8 xl:h-12 xl:w-12 rounded-full flex items-center justify-center";

  if (readStatus === undefined) {
    return (
      <div className={`${containerClass} bg-gray-200 md:p-3`}>
        <DotSpinner />
      </div>
    );
  }

  // If not read
  if (!readStatus) {
    return (
      <div className={`${containerClass} bg-[#FFC000] p-1`}>
        <Image
          src={"/handbooks/not-finished.png"}
          alt="finish lesson icon"
          fill
          className="p-1"
        />
      </div>
    );
  }

  // If read
  return (
    <div className={`${containerClass} bg-[#00858E] p-1`}>
      <Image
        src={"/handbooks/finished.png"}
        alt="finish lesson icon"
        fill
        className="p-1"
      />
    </div>
  );
};

const ChessLessonCard = React.memo<ChessLessonCardProps>(
  ({ lesson, slug, lessonType, getFenFromMoves }) => {
    const basePath = getLessonBasePath(lessonType);
    const lessonTypeLabel =
      lessonType === "middlegame"
        ? "Strategy"
        : lessonType === "endgame"
        ? "Endgame"
        : "Opening";

    return (
      <Link href={`${basePath}/${slug}`}>
        <div className="opacity-100 scale-100 transition-all duration-200 hover:shadow-md">
          <Card className="border rounded-lg overflow-hidden shadow-sm h-full flex flex-col p-[8px] md:p-4">
            <div className="relative">
              <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full px-1 lg:p-2 2xl:p-5 before:content-[''] before:absolute before:top-0 before:right-0 before:w-full before:h-full before:cursor-pointer before:z-10">
                  <Simple2DChess
                    id={`board-${slug}`}
                    keys={`board-${slug}`}
                    position={getFenFromMoves(lesson.moves)?.trim()}
                    arePiecesDraggable={false}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <ReadStatusIndicator readStatus={lesson.readStatus} />
            </div>

            <div className="xl:px-1 2xl:px-4 flex flex-col flex-1 min-h-0">
              {/* Content area that grows */}
              <div className="flex-1">
                {/* Mobile layout */}
                <div className="flex flex-col lg:hidden">
                  {/* <h1 className="text-[14px] --xs border border-blue-base text-blue-base px-2 py-1 self-start">
                    {lesson.difficulty}
                  </h1> */}
                  <h3 className="flex items-center font-medium text-gray-900 text-[14px] --xs h-[42px] line-clamp-2 mb-[8px]">
                    {lesson.title}
                  </h3>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:flex justify-between">
                  <h1 className="font-semibold h-10 line-clamp-2">
                    {lesson.title}
                  </h1>
                </div>
              </div>

              {/* Button stays at bottom */}
              <div className="w-full flex items-center justify-center space-x-2 rounded-full h-10 px-2 py-2 cursor-pointer btn-primary">
                <BookOpen className="h-4 w-4" />
                <span className="text-[3.6vw] --10px md:text-[14px] --sm">Start Learning</span>
              </div>
            </div>
          </Card>
        </div>
      </Link>
    );
  }
);

ChessLessonCard.displayName = "ChessLessonCard";

export default React.memo(ChessLessonCard, (prevProps, nextProps) => {
  return (
    prevProps.slug === nextProps.slug &&
    prevProps.lesson.title === nextProps.lesson.title &&
    prevProps.lesson.difficulty === nextProps.lesson.difficulty &&
    prevProps.lesson.moves === nextProps.lesson.moves &&
    prevProps.lesson.readStatus === nextProps.lesson.readStatus &&
    prevProps.lessonType === nextProps.lessonType
  );
});
