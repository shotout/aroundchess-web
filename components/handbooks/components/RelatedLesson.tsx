import React from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChessLesson, LessonType } from "../ChessLessonTypes";
import Simple2DChess from "./Simple2DChess";

interface RelatedLessonsProps {
  relatedLessons: ChessLesson[];
  lessonType: LessonType;
  handleLessonNavigation: (slug: string) => void;
  getFenFromMoves: (moves: string) => string;
  getSlugFromId: (id: string, lessonType: LessonType) => string;
}

const RelatedLessons: React.FC<RelatedLessonsProps> = ({
  relatedLessons,
  lessonType,
  handleLessonNavigation,
  getFenFromMoves,
  getSlugFromId,
}) => {
  const getLessonTypeLabel = (): string => {
    switch (lessonType) {
      case "opening":
        return "Opening";
      case "middlegame":
        return "Strategy";
      case "endgame":
        return "Endgame";
      default:
        return "Lesson";
    }
  };

  return (
    <div className="xl:col-span-3 2xl:col-span-3 3xl:col-span-2 xl:border xl:rounded-md xl:mb-6">
      <div className="xl:hidden -mx-4 md:-mx-6 w-screen">
        <div className="border-t w-full"></div>
      </div>

      <div className="xl:p-4 py-4">
        <div className="rounded-lg">
          <div className="">
            <h2 className="text-xl font-bold">Next Topics</h2>
            <p className="text-[14px] --sm text-gray-600 mt-1">
              Discover other lessons now!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4 mt-4">
            {relatedLessons.length > 0 ? (
              relatedLessons.map((topic, index) => {
                const topicSlug = getSlugFromId(topic.id, lessonType);
                const topicFen = getFenFromMoves(topic.moves as any);

                return (
                  <div key={index} className="cursor-pointer w-full xl:mx-auto">
                    <Card onClick={() => handleLessonNavigation(topicSlug)} className="border rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
                      <div className="relative p-3 flex flex-col">
                        {/* Chessboard */}
                        <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden mb-2 before:content-[''] before:absolute before:top-0 before:right-0 before:w-full before:h-full before:cursor-pointer before:z-10">
                          <div className="w-full h-full">
                            <Simple2DChess
                              id={`next-topic-${topicSlug}`}
                              position={topicFen}
                              arePiecesDraggable={false}
                            />
                          </div>
                        </div>

                        {/* Status badges - positioned absolutely over the chessboard */}
                        <span className="absolute top-5 left-5 bg-purple-500 text-white text-[14px] --xs px-2 xl:px-8 py-1 rounded-md">
                          {getLessonTypeLabel()}
                        </span>
                        {!topic.readStatus ? (
                          <div className="absolute top-5 right-5 h-8 w-8 xl:h-10 xl:w-10 bg-[#FFC000] p-1 rounded-full flex items-center justify-center">
                            <Image
                              src={"/handbooks/not-finished.png"}
                              alt="finish lesson icon"
                              fill
                              className="p-1"
                            />
                          </div>
                        ) : (
                          <div className="absolute top-5 right-5 h-8 w-8 xl:h-10 xl:w-10 bg-[#00858E] p-1 rounded-full flex items-center justify-center">
                            <Image
                              src={"/handbooks/finished.png"}
                              alt="finish lesson icon"
                              fill
                              className="p-1"
                            />
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="font-medium text-gray-900 text-[14px] --xs mb-3">
                          {topic.title}
                        </h3>

                        {/* Button */}
                        <div
                          onClick={() => handleLessonNavigation(topicSlug)}
                          className="w-full flex items-center justify-center space-x-2 rounded-full px-4 cursor-pointer btn-secondary"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span className="text-[14px] --xs md:text-[14px] --sm font-semibold">
                            Start Learning
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 md:col-span-3 xl:col-span-1 text-gray-600 p-4 border">
                <p>No related lessons available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:hidden -mx-4 md:-mx-6 w-screen">
        <div className="border-b w-full"></div>
      </div>
    </div>
  );
};

export default RelatedLessons;
