"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, BookOpen } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "framer-motion";
import { openings } from "./lib/openings";
import Link from "next/link";

type FilterType = "Beginner" | "Intermediate" | "Advanced" | "Expert" | null;

const OpeningTheoryPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<FilterType>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Apply filters
  const filteredOpenings = useMemo(() => {
    return openings.filter((opening) => {
      // Apply difficulty filter if selected
      const difficultyMatch = selectedDifficulty
        ? opening.difficulty === selectedDifficulty
        : true;

      // Apply search filter if there's a search term
      const searchMatch = searchTerm
        ? opening.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return difficultyMatch && searchMatch;
    });
  }, [selectedDifficulty, searchTerm]);

  const difficulties: FilterType[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  return (
    <main className="w-full p-4 md:p-6 lg:pt-32 xl:p-6">
      <div className="mx-auto px-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Opening Theory</h1>
          <p className="text-gray-600">
            Master the first phase of the game with our comprehensive opening
            lessons
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-2">
            {/* Search input - 60% width on tablet and desktop */}
            <div className="relative w-full md:w-[60%]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search topics..."
                className="pl-10 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Difficulty buttons container - 40% width on tablet and desktop */}
            <div className="w-full md:w-[40%] flex justify-between md:flex-row mt-2 md:mt-0">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={
                    selectedDifficulty === difficulty ? "default" : "outline"
                  }
                  className={`w-[23%] min-w-0 h-10 px-1 flex items-center justify-center text-[10px] sm:text-xs lg:text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                    selectedDifficulty === difficulty
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedDifficulty(
                      selectedDifficulty === difficulty ? null : difficulty
                    )
                  }
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Opening cards grid - adjusted for taller cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredOpenings.map((opening) => (
              <Link key={opening.id} href={`/opening-theory/${opening.slug}`}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Card className="border rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                    {/* Chess board visualization with tag */}
                    <div className="relative">
                      {/* Taller container with maintained aspect ratio */}
                      <div className="aspect-ratio-1 bg-white flex items-center justify-center overflow-hidden max-h-96">
                        {/* Increased size with larger max constraints */}
                        <div className="w-full h-full max-w-md max-h-md p-4 2xl:p-10">
                          <Chessboard
                            id={`board-${opening.slug}`}
                            key={`board-${opening.slug}`}
                            position={opening.fen}
                            arePiecesDraggable={false}
                            customDarkSquareStyle={{
                              backgroundColor: "#5C9DFF",
                            }}
                            customLightSquareStyle={{ backgroundColor: "#fff" }}
                          />
                        </div>
                      </div>
                      <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-md">
                        Opening
                      </span>
                      <span className="absolute top-2 right-2 bg-white p-1 rounded-md">
                        <BookOpen className="h-5 w-5 text-green-500" />
                      </span>
                    </div>

                    {/* Info container with additional padding for balance */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div className="flex flex-col gap-3 mb-5">
                        <span className="text-xs border border-blue-base text-blue-base inline-block px-2 py-1 w-fit">
                          {opening.difficulty}
                        </span>
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {opening.title}
                        </h3>
                      </div>
                      <div className="w-full btn-tertiary text-blue-base flex items-center justify-center gap-2 rounded-full h-10 px-4 py-2 cursor-pointer mt-auto">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-xs md:text-sm">
                          Start Learning
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default OpeningTheoryPage;
