import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LessonType, getLessonBasePath } from "./ChessLessonTypes";
import Image from "next/image";
import Simple2DChess from "./components/Simple2DChess";

interface ChessLessonCardProps {
  lesson: {
    id?: string;
    title: string;
    difficulty: string;
    moves: string | null;
    readStatus?: boolean;
  };
  slug: string;
  lessonType: LessonType;
  getFenFromMoves: (moves: string | null) => string;
  fetchDetails?: (id: string) => Promise<any | null>;
}

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
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
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          <Card className="border rounded-lg overflow-hidden shadow-sm h-full flex flex-col p-4">
            <div className="relative">
              <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full px-1 lg:p-2 2xl:p-5">
                  <Simple2DChess
                    id={`board-${slug}`}
                    keys={`board-${slug}`}
                    position={getFenFromMoves(lesson.moves)}
                    arePiecesDraggable={false}
                  />
                </div>
              </div>
              {!lesson.readStatus ? (
                <div className="absolute top-2 right-2 h-8 w-8 xl:h-12 xl:w-12 bg-[#FFC000] p-1 rounded-full flex items-center justify-center">
                  <Image
                    src={"/handbooks/not-finished.png"}
                    alt="finish lesson icon"
                    fill
                    className="p-1"
                  />
                </div>
              ) : (
                <div className="absolute top-2 right-2 h-8 w-8 xl:h-12 xl:w-12 bg-[#00858E] p-1 rounded-full flex items-center justify-center">
                  <Image
                    src={"/handbooks/finished.png"}
                    alt="finish lesson icon"
                    fill
                    className="p-1"
                  />
                </div>
              )}
            </div>

            <div className="xl:px-4 flex flex-col gap-y-4 xl:gap-y-2 h-auto mx-1 lg:mx-2">
              <div className="flex flex-col lg:hidden gap-y-2">
                <h1 className="text-xs border border-blue-base text-blue-base px-2 py-1 self-start">
                  {lesson.difficulty}
                </h1>
                <h3 className="font-medium text-gray-900 text-xs line-clamp-2">
                  {lesson.title}
                </h3>
              </div>

              <div className="hidden lg:flex justify-between items-center">
                <div className="flex items-center flex-1">
                  <div className="font-medium text-gray-900 text-xs flex gap-x-2 px-2 py-1 items-center line-clamp-2 border border-blue-base">
                    <AlertCircle className="text-blue-base w-4 h-4" />
                    <h1>ELO Rating :</h1>
                    <h1 className="text-blue-base"> 0 - 800 </h1>
                  </div>
                </div>
                <h1 className="text-xs border border-blue-base text-blue-base px-2 py-1 flex-shrink-0">
                  {lesson.difficulty}
                </h1>
              </div>
              <h1 className="font-semibold hidden lg:block">{lesson.title}</h1>

              <div className="w-full flex items-center justify-center space-x-2 rounded-full h-10 px-4 py-2 cursor-pointer mt-auto btn-primary">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs md:text-sm">Start Learning</span>
              </div>
            </div>
          </Card>
        </motion.div>
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
