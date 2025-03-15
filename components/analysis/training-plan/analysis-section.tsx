"use client";

import { motion } from "@/utils/motion";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <section className="py-2 sm:py-4 bg-white flex items-center justify-center">
      <div className="container w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="border border-input rounded-md py-4 px-4">
              <div className="group gap-4 flex flex-1 flex-row list-none items-center justify-start space-x-0 xl:space-x-0.5">
                <span className="block text-md sm:text-md lg:text-lg font-semibold text-black text-center sm:text-left">
                  Analysis Overview -{" "}
                  <span className="block lg:inline text-xs sm:text-xs lg:text-xs text-center font-normal lg:text-left">
                     How does AI-powered AroundChess Game Analysis work?
                  </span>
                </span>
              </div>
              <div className="border border-input md:border-none rounded-md py-2 px-2 sm:py-4 sm:px-4 mt-4">
                <div className="flex flex-col lg:flex-row w-full ">
                  <div className="flex items-center justify-center border border-input sm:border-none lg:w-1/2 max-w-3xl overflow-hidden rounded-lg bg-white">
                    <div className="relative w-[244px] h-[240px] lg:w-[685px] md:w-[320px] lg:h-[420px] md:h-[316px] bg-white">
                      <AnimatePresence>
                        <motion.img
                          key={current}
                          src={analysis[current].image}
                          alt={analysis[current].title}
                          className=" w-[244px] h-[240px] lg:w-[685px] md:w-[320px] lg:h-[420px] md:h-[316px] object-contain rounded-sm bg-white"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="px-1 lg:px-4 w-full lg:w-1/2 md:mt-2">
                    <span className="block text-sm sm:text-md lg:text-lg font-semibold text-black lg:text-left mt-4 sm:mt-0">
                      {analysis[current].title}
                    </span>
                    <span className="block mt-1 text-xs sm:text-md lg:text-lg font-normal text-black lg:text-left">
                      {analysis[current].description}
                    </span>
                    <div className="flex flex-col md:flex-row lg:flex-col md:gap-2">
                    <div className="border border-[#221AE9] border-l-4 bg-[#F6F9FF] rounded-md py-2 px-2 sm:px-4 mt-4">
                      <span className="text-[#221AE9] text-sm sm:text-md font-bold">
                        Idea
                      </span>
                      <span className="flex flex-row md:flex-col lg:flex-row lg:items-center mt-2 text-[11px] sm:text-md lg:text-lg font-normal text-black lg:text-left">
                        White want the knights:{" "}
                        <div className="flex flex-row items-center text-[10px] sm:text-md lg:text-lg font-semibold text-black sm:text-center lg:text-left">
                          &nbsp;
                          <Image
                            src="/icons/dot-icon.png"
                            alt="dot"
                            width={900}
                            height={900}
                            className="w-2 h-2"
                          />
                          &nbsp;21.&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                          &nbsp;xd5&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                          &nbsp;xd5&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                           &nbsp;xd5&nbsp;
                        </div>
                      </span>

                      <span className="block text-[11px] sm:text-md lg:text-lg">
                        with a decisive advantage to White.
                      </span>
                    </div>

                    <div className="border border-[#FA402D] border-l-4 bg-[#FA402D08] rounded-md py-2 px-2 sm:px-4 mt-4">
                      <span className="text-[#FA402D] text-sm sm:text-md font-bold">
                        Problem
                      </span>
                      <span className="flex flex-row md:flex-col lg:flex-row lg:items-center mt-2 text-[11px] sm:text-md lg:text-lg font-normal text-black lg:text-left">
                        White want the knights:{" "}
                        <div className="flex flex-row items-center text-[10px] sm:text-md lg:text-lg font-semibold text-black sm:text-center lg:text-left">
                          &nbsp;
                          <Image
                            src="/icons/dot-icon.png"
                            alt="dot"
                            width={900}
                            height={900}
                            className="w-2 h-2"
                          />
                          &nbsp;21.&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                          &nbsp;xd5&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                          &nbsp;xd5&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                           &nbsp;xd5&nbsp;
                        </div>
                      </span>

                      <span className="block text-[11px] sm:text-md lg:text-lg">
                        with a decisive advantage to White.
                      </span>
                    </div>

                    <div className="border border-[#0C7C65] border-l-4 bg-[#0C7C6508] rounded-md py-2 px-2 sm:px-4 mt-4">
                      <span className="text-[#0C7C65] text-sm sm:text-md font-bold">
                        Solution
                      </span>
                      <span className="flex flex-row md:flex-col lg:flex-row lg:items-center mt-2 text-[11px] sm:text-md lg:text-lg font-normal text-black lg:text-left">
                        White want the knights:{" "}
                        <div className="flex flex-row items-center text-[10px] sm:text-md lg:text-lg font-semibold text-black sm:text-center lg:text-left">
                          &nbsp;
                          <Image
                            src="/icons/dot-icon.png"
                            alt="dot"
                            width={900}
                            height={900}
                            className="w-2 h-2"
                          />
                          &nbsp;21.&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                          &nbsp;xd5&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                          &nbsp;xd5&nbsp;
                          <Image
                            src="/icons/Knight-icon.png"
                            alt="knight"
                            width={900}
                            height={900}
                            className="w-[14px] h-[14px]"
                          />
                           &nbsp;xd5&nbsp;
                        </div>
                      </span>

                      <span className="block text-[11px] sm:text-md lg:text-lg">
                        with a decisive advantage to White.
                      </span>
                    </div>
                  </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center pt-6 md:pt-2 lg:pt-6">
                  <Button className="w-fill md:w-full lg:w-2/6 px-7 sm:px-16 font-normal text-sm sm:text-md">
                    Analyze your most recent Game now
                  </Button>
                  <Button
                    variant="link"
                    className="w-fill text-black px-7 sm:px-16 font-normal text-sm sm:text-md"
                  >
                    No Sign-Up required
                  </Button>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-4 md:pt-1">
                {/* Left Arrow */}
                <button
                  disabled={current == 0}
                  onClick={prevSlide}
                  className="p-2 text-primary transition"
                >
                  <ChevronLeft
                    size={28}
                    color={current != 0 ? "#221AE9" : "#221AE950"}
                  />
                </button>
                {/* Dot Indicators */}
                <div className="flex gap-1.5 sm:gap-2">
                  {analysis.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      className={`${
                        current === index ? "w-5" : "w-3"
                      } h-3 rounded-full transition ${
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
                    color={current != analysis.length ? "#221AE9" : "#221AE950"}
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
