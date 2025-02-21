"use client";

import { motion } from "@/utils/motion";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const analysisFeatures = [
  "Stockfish-powered move evaluation",
  "Personalized weakness detection",
  "Opening repertoire builder",
  "Endgame training modules",
];
const analysis = [
  {
    image: "/images/homepage/assesment.png",
    title: "GAME ASSESMENT",
    description:
      "Before you deep-dive into detailed metrics, AroundChess offers an overview on Accuracy, Move Classifications, Critical Mistakes and much more in our initial AI-based Game Assessment. ",
  },
  {
    image: "/images/homepage/threats.png",
    title: "THREATS",
    description:
      "Get insights into your Game’s most Critical Threats and find out how to avoid them in the next Game. ",
  },
  {
    image: "/images/homepage/threats.png",
    title: "MOVE QUALITY",
    description:
      "Discover an in-depth analysis of each of your and your Opponent’s moves and find suggestions for improvements. ",
  },
  {
    image: "/images/homepage/move-quality.png",
    title: "MOVE QUALITY",
    description:
      "Discover an in-depth analysis of each of your and your Opponent’s moves and find suggestions for improvements. ",
  },
  {
    image: "/images/homepage/opening.png",
    title: "OPENING",
    description:
      "See how well you handled the opening, whether you followed good strategies, and where you can improve. Get tips on better moves and alternative lines to start your games stronger. ",
  },
  {
    image: "/images/homepage/endgame.png",
    title: "ENDGAME",
    description:
      "Check how you played the final phase of the game - did you convert your advantage or miss key moves? Learn how to finish games with confidence and improve your endgame skills. ",
  },
  {
    image: "/images/homepage/improvement-training.png",
    title: "IMPROVEMENT & TRAINING",
    description:
      "Find out if you have improved any of your past Strategy Flaws and discover your custom Training Plan based on your most recent Games. ",
  },
];
export function AnalysisSection() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? analysis.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === analysis.length - 1 ? 0 : prev + 1));
  };
  return (
    <section className="py-4 sm:py-4 lg:py-4 xl:py-4 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="lg:w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="border border-input rounded-md py-4 px-4">
              <div className="group gap-4 flex flex-1 flex-row list-none items-center justify-start space-x-1 xl:space-x-0.5">
                <span className="block text-md sm:text-md lg:text-md font-semibold text-black text-center lg:text-left">
                  Analysis Overview{" "}
                  <span className="text-xs sm:text-xs lg:text-xs text-center font-normal lg:text-left">
                    - How does AI-powered AroundChess Game Analysis work?
                  </span>
                </span>
              </div>
              <div className="border border-input rounded-md py-4 px-4 mt-4">
                <div className="flex flex-row">
                <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
                  <div className="relative max-w-[645px] h-[520px] sm:h-80 md:h-96">
                    <AnimatePresence>
                      <motion.img
                        key={current}
                        src={analysis[current].image}
                        alt={analysis[current].title}
                        className="w-[645px] h-[520px] object-contain rounded-sm"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                  </div>
                  </div>
                  <div className="px-4">
                    <span className="block text-md sm:text-md lg:text-md font-semibold text-black text-center lg:text-left">
                      {analysis[current].title}
                    </span>
                    <span className="block mt-1 text-md sm:text-md lg:text-md font-normal text-black text-center lg:text-left">
                      {analysis[current].description}
                    </span>

                    <div className="border border-[#3871EC] border-l-4 bg-[#F6F9FF] rounded-md py-2 px-4 mt-4">
                      <span className="text-[#3871EC] text-md font-bold">
                        Idea
                      </span>
                      <span className="block mt-2 text-md sm:text-md lg:text-md font-normal text-black text-center lg:text-left">
                        White want the knights:{" "}
                        <span className="text-md sm:text-md lg:text-md font-semibold text-black text-center lg:text-left">
                          21. xd5 xd5 xd5
                        </span>
                        <span className="block">
                          with a decisive advantage to White.
                        </span>
                      </span>
                    </div>

                    <div className="border border-[#FA402D] border-l-4 bg-[#FA402D08] rounded-md py-2 px-4 mt-2">
                      <span className="text-[#FA402D] text-md font-bold">
                        Problem
                      </span>
                      <span className="block mt-2 text-md sm:text-md lg:text-md font-normal text-black text-center lg:text-left">
                        White want the knights:{" "}
                        <span className="text-md sm:text-md lg:text-md font-semibold text-black text-center lg:text-left">
                          21. xd5 xd5 xd5
                        </span>
                        <span className="block">
                          with a decisive advantage to White.
                        </span>
                      </span>
                    </div>

                    <div className="border border-[#0C7C65] border-l-4 bg-[#0C7C6508] rounded-md py-2 px-4 mt-2">
                      <span className="text-[#0C7C65] text-md font-bold">
                        Solution
                      </span>
                      <span className="block mt-2 text-md sm:text-md lg:text-md font-normal text-black text-center lg:text-left">
                        White want the knights:{" "}
                        <span className="text-md sm:text-md lg:text-md font-semibold text-black text-center lg:text-left">
                          21. xd5 xd5 xd5
                        </span>
                        <span className="block">
                          with a decisive advantage to White.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center pt-6">
                  <Button className="w-fill px-16 font-normal text-md">
                    Analyze your most recent Game now
                  </Button>
                  <Button
                    variant="link"
                    className="w-fill px-16 font-normal text-md"
                  >
                    No Sign-Up request
                  </Button>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-4 pt-4">
                {/* Left Arrow */}
                <button
                  disabled={current == 0}
                  onClick={prevSlide}
                  className="p-2 text-primary transition"
                >
                  <ChevronLeft
                    size={28}
                    color={current != 0 ? "#3871EC" : "#3871EC50"}
                  />
                </button>
                {/* Dot Indicators */}
                <div className="flex gap-2">
                  {analysis.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        current === index ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {/* Right Arrow */}
                <button
                  disabled={current == analysis.length}
                  onClick={nextSlide}
                  className="p-2 text-primary transition"
                >
                  <ChevronRight
                    size={28}
                    color={current != analysis.length ? "#3871EC" : "#3871EC50"}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
