"use client";

import { motion } from "@/utils/motion";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfileStore } from "@/app/store/profile";
import Image from "next/image";
import DotSpinner from "./game-history/Spinner";

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
      "Before you deep-dive into detailed metrics, AroundChess offers an <b>overview on Accuracy, Move Classifications, Critical Mistakes and much more</b> in our initial <b>AI-based Game Assessment</b>. ",
    idea: `<span>Create a <b style="color:#221AE9">"Strategic Feedback Chessboard"</b> that visually maps game assessments (e.g. move accuracy, tactical mistakes) directly onto the board using colour-coded overlays for post-game analysis.</span>`,
    problem:
      "Players often struggle to identify recurring mistakes or understand strategic weaknesses after a game ends, as traditional boards offer no way to review and annotate historical moves or evaluate decision patterns.",
    solution:
      "Implement an integrated analysis tool that connects to the chessboard, providing real-time feedback on moves and highlighting errors or missed opportunities with visual indicators. After the game, the tool generates a detailed report, offering insights into strategic weaknesses and suggesting improvements based on move assessments.",
  },
  {
    image: "/images/homepage/threats.png",
    title: "THREATS",
    description:
      "Get insights into your Game's <b>most Critical Threats</b> and find out how to avoid them in the next Game. ",
    idea: `<span>Identify and display <b style="color:#221AE9">Critical Threats</b> in during the analysis, providing insights into the potential dangers each player faces, such as imminent checkmate or piece captures.</span>`,
    problem:
      "Players often miss crucial threats to their pieces or king position during the game, leading to unexpected losses and missed opportunities.",
    solution:
      "Utilize an AI-powered analysis tool of AroundChess that continuously evaluates the board and highlights threats, suggesting defensive moves to counter these dangers and enhance strategic awareness.",
  },
  {
    image: "/images/homepage/threats.png",
    title: "MOVE QUALITY",
    description:
      "Discover an in-depth <b>analysis of each of your and your Opponent's moves</b> and find suggestions for improvements. ",
    idea: `<span>Provide a comprehensive <b style="color:#221AE9">Move Quality Analysis</b> that evaluates your moves to identify strengths and weaknesses, offering insights into the effectiveness of strategies employed during the game.</span>`,
    problem:
      "Players may struggle to assess the quality of their moves and those of their opponents, leading to repeated mistakes and missed opportunities for improvement.",
    solution:
      "Utilize an AI-driven analysis tool of AroundChess that grades each move based on strategic value and potential outcomes, highlighting strong moves and questionable ones. AroundChess analysis tool also provides alternative suggestions to enhance overall gameplay quality.",
  },
  {
    image: "/images/homepage/opening.png",
    title: "OPENING",
    description:
      "See how well you handled the opening, whether you followed good strategies, and where you can improve. Get tips on better moves and alternative lines to start your games stronger. ",
    idea: "Evaluate the effectiveness of your opening strategy, identifying strong moves and suggesting alternative lines to improve your game from the outset",
    problem:
      "Players often lack a clear understanding of opening principles, leading to weak positions and missed opportunities from the very start of the game.",
    solution:
      "With our AI-powered analysis tool that reviews the opening phase of your games, offering insights into optimal move choices and providing alternative lines to establish a stronger position early on.",
  },
  {
    image: "/images/homepage/endgame.png",
    title: "ENDGAME",
    description:
      "Check how you played the final phase of the game - did you convert your advantage or miss key moves? Learn how to finish games with confidence and improve your endgame skills. ",
    idea: `<span>Assess how effectively you navigated the <b style="color:#221AE9">endgame</b>, focusing on whether you capitalized on advantages and executed critical moves to secure victory.</span>`,
    problem:
      "Players often struggle to convert advantages in the endgame or miss key moves, leading to lost opportunities when the game reaches its final stages.",
    solution:
      "Use AroundChess AI-driven analysis tool that reviews the endgame phase, highlighting missed opportunities and offering strategies for converting advantages into wins, thereby enhancing endgame skills for future matches.",
  },
  {
    image: "/images/homepage/improvement-training.png",
    title: "IMPROVEMENT & TRAINING",
    description:
      "Find out if you have improved any of your past Strategy Flaws and discover your custom Training Plan based on your most recent Games. ",
    idea: `<span>Enhance your chess skills by understanding your <b style="color:#221AE9">areas for improvement</b> and receiving a tailored training plan that builds on your recent games.</span>`,
    problem:
      "Review past gameplay to identify recurring strategy flaws and track your progress over time, helping you recognize growth areas.",
    solution:
      "Use the analysis tool to generate a customized training plan that focuses on specific weaknesses, reinforcing crucial strategies, and improving overall performance through targeted practice.",
  },
];

export function AnalysisSection() {
  const router = useRouter();
  const { sessionId } = useProfileStore();
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  // Memoize the sign-in status to prevent unnecessary re-renders
  const isSignedIn = useMemo(() => {
    return sessionId && sessionId.length > 0;
  }, [sessionId]);

  // Handle image loading for each slide
  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? analysis.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === analysis.length - 1 ? 0 : prev + 1));
  }, []);

  const handleAnalysis = useCallback(() => {
    if (isSignedIn) {
      router.push("/analysis");
    } else {
      router.push("/register");
    }
  }, [isSignedIn, router]);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  return (
    <section className="py-2 sm:py-4 bg-white flex items-center justify-center">
      <div className="container w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="border border-input rounded-md py-4 px-4">
              <div className="group gap-4 flex flex-1 flex-row list-none items-center justify-start space-x-0 xl:space-x-0.5">
                <span className="block text-md sm:text-md lg:text-[18px] font-semibold text-black text-center sm:text-left">
                  Analysis Overview -{" "}
                  <span className="block lg:inline text-xs sm:text-xs lg:text-xs text-center font-normal lg:text-left">
                    How does AI-powered AroundChess Game Analysis work?
                  </span>
                </span>
              </div>

              {/* Fixed height carousel container */}
              <div className="border border-input md:border-none rounded-md py-2 px-2 sm:py-4 sm:px-4 mt-4">
                <div className="flex flex-col xl:flex-row w-full min-h-[600px] sm:min-h-[500px] xl:min-h-auto">
                  {/* Image container with fixed dimensions */}
                  <div className="flex items-start border border-input sm:border-none w-full xl:w-1/2 overflow-hidden rounded-[8px] bg-white">
                    <div className="relative bg-white rounded-[8px] p-[8px] border border-[#DEDEDE] w-full flex xl:items-center">
                      <div className="relative h-[200px] sm:h-[250px] xl:h-[600px] w-full">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {!imagesLoaded[current] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                                <DotSpinner size={20} />
                              </div>
                            )}
                            <Image
                              src={analysis[current].image}
                              alt={analysis[current].title}
                              fill
                              className="object-contain"
                              onLoad={() => handleImageLoad(current)}
                              priority={current === 0}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Content container with fixed height */}
                  <div className="px-1 lg:px-4 w-full xl:w-1/2 md:mt-2 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={current}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="h-full flex flex-col"
                        >
                          <span className="block text-sm sm:text-md lg:text-[18px] font-bold text-black lg:text-left mt-4 sm:mt-0">
                            {analysis[current].title}
                          </span>

                          <span
                            dangerouslySetInnerHTML={{
                              __html: analysis[current].description.replace(
                                /\*\*(.*?)\*\*/g,
                                "<b>$1</b>"
                              ),
                            }}
                            className="block mt-1 text-xs sm:text-md lg:text-[16px] font-normal text-[#364152] lg:text-left leading-[1.2] line-clamp-3"
                          />

                          {/* Content sections with scroll if needed */}
                          <div className="flex-1 overflow-y-auto mt-4 space-y-3 max-h-[500px] sm:max-h-[200px] xl:max-h-[400px]">
                            <div className="border border-[#221AE9] border-l-4 bg-[#F6F9FF] rounded-md py-2 px-2 sm:px-4">
                              <span className="text-[#221AE9] text-sm sm:text-md font-bold">
                                Idea
                              </span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: analysis[current].idea.replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<b>$1</b>"
                                  ),
                                }}
                                className="block mt-2 text-[11px] sm:text-md lg:text-[14px] font-normal text-[#364152] lg:text-left leading-[1.3]"
                              />
                            </div>

                            <div className="border border-[#FA402D] border-l-4 bg-[#FA402D08] rounded-md py-2 px-2 sm:px-4">
                              <span className="text-[#FA402D] text-sm sm:text-md font-bold">
                                Problem
                              </span>
                              <span className="block mt-2 text-[11px] sm:text-md lg:text-[14px] font-normal text-[#364152] lg:text-left leading-[1.3]">
                                {analysis[current].problem}
                              </span>
                            </div>

                            <div className="border border-[#27C2A3] border-l-4 bg-[#27C2A308] rounded-md py-2 px-2 sm:px-4">
                              <span className="text-[#27C2A3] text-sm sm:text-md font-bold">
                                Solution
                              </span>
                              <span className="block mt-2 text-[11px] sm:text-md lg:text-[14px] font-normal text-[#364152] lg:text-left leading-[1.3]">
                                {analysis[current].solution}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Button container - always at bottom */}
                    <div className="flex flex-col w-full items-center justify-center pt-4">
                      <button
                        onClick={handleAnalysis}
                        className="btn-primary rounded-full py-2 w-full px-7 sm:px-16 font-normal text-sm sm:text-md hover:opacity-90 transition-opacity"
                      >
                        Discover AroundChess's Analysis
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-4 md:pt-1">
                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  disabled={current === 0}
                  className="p-2 transition-opacity hover:opacity-70 disabled:opacity-30"
                  aria-label="Previous slide"
                >
                  <ChevronLeft
                    size={28}
                    color={current !== 0 ? "#221AE9" : "#221AE950"}
                  />
                </button>

                {/* Dot Indicators */}
                <div className="flex gap-1.5 sm:gap-2">
                  {analysis.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`${
                        current === index ? "w-5" : "w-3"
                      } h-3 rounded-full transition-all duration-200 hover:opacity-70 ${
                        current === index ? "bg-[#221AE9]" : "bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  disabled={current === analysis.length - 1}
                  className="p-2 transition-opacity hover:opacity-70 disabled:opacity-30"
                  aria-label="Next slide"
                >
                  <ChevronRight
                    size={28}
                    color={
                      current !== analysis.length - 1 ? "#221AE9" : "#221AE950"
                    }
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
