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

  // Custom styling for the button based on difficulty
  const getDifficultyColor = (
    difficulty: (typeof openings)[0]["difficulty"]
  ) => {
    switch (difficulty) {
      case "Beginner":
        return "text-blue-600";
      case "Intermediate":
        return "text-indigo-600";
      case "Advanced":
        return "text-purple-600";
      case "Expert":
        return "text-gray-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <main className="w-full p-4 md:p-6">
      <div className="mx-auto">
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
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:max-w-md">
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
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={
                    selectedDifficulty === difficulty ? "default" : "outline"
                  }
                  className={
                    selectedDifficulty === difficulty
                      ? "bg-blue-600 text-white"
                      : ""
                  }
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

        {/* Opening cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredOpenings.map((opening) => (
              <Link key={opening.id} href={`/opening-theory/${opening.slug}`}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border border-gray-200 rounded-md shadow-sm">
                    <div className="bg-white flex items-center justify-center p-4">
                      <Chessboard
                        id={`board-${opening.slug}`}
                        key={`board-${opening.slug}`}
                        position={opening.fen}
                        arePiecesDraggable={false}
                        customDarkSquareStyle={{ backgroundColor: "#5C9DFF" }}
                        customLightSquareStyle={{ backgroundColor: "#fff" }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {opening.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded bg-blue-50 ${getDifficultyColor(
                            opening.difficulty
                          )}`}
                        >
                          {opening.difficulty}
                        </span>
                      </div>
                      <div className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-md h-10 px-4 py-2 cursor-pointer">
                        <BookOpen className="h-4 w-4" />
                        <span>Start Learning</span>
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
