import React from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ApiOpening } from "./lib/opening";
import { getFenFromMoves, getSlugFromId } from "./lib/openingMapper";
import Image from "next/image";

interface OpeningCardProps {
  opening: ApiOpening;
  slug: string;
}

const OpeningCard = React.memo(({ opening, slug }: OpeningCardProps) => {
  return (
    <Link href={`/opening-theory/${slug}`}>
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
                <Chessboard
                  id={`board-${slug}`}
                  key={`board-${slug}`}
                  position={getFenFromMoves(opening.variations[0]?.moves)}
                  arePiecesDraggable={false}
                  customDarkSquareStyle={{
                    backgroundColor: "#9E7555",
                  }}
                  customLightSquareStyle={{
                    backgroundColor: "#F0DFC7",
                  }}
                />
              </div>
            </div>
            <div className="absolute top-2 right-2 h-8 w-8 xl:h-12 xl:w-12 bg-[#00858E] p-1 rounded-full">
              <Image
                src={"/handbooks/finished.png"}
                alt="finish lesson icon"
                fill
                className="p-1"
              />
            </div>
          </div>

          <div className="xl:px-4 flex flex-col gap-y-4 h-auto">
            {/* Mobile and Tablet View (stack vertically) */}
            <div className="flex flex-col lg:hidden gap-y-2">
              <h1 className="text-xs border border-blue-base text-blue-base px-2 py-1 self-start">
                {opening.difficulty}
              </h1>
              <h3 className="font-medium text-gray-900 text-xs line-clamp-2">
                {opening.title}
              </h3>
            </div>

            {/* Desktop View (side by side) */}
            <div className="hidden lg:flex justify-between items-center">
              <div className="flex items-center gap-1 flex-1 mr-2">
                <h3 className="font-medium text-gray-900 text-xs line-clamp-2">
                  {opening.title}
                </h3>
              </div>
              <h1 className="text-xs border border-blue-base text-blue-base px-2 py-1 flex-shrink-0">
                {opening.difficulty}
              </h1>
            </div>

            <div className="w-full flex items-center justify-center space-x-2 rounded-full h-10 px-4 py-2 cursor-pointer mt-auto btn-primary">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs md:text-sm">Start Learning</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
});

OpeningCard.displayName = "OpeningCard";

export default OpeningCard;
