"use client";

import { motion } from "@/utils/motion";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfileStore } from "@/app/store/profile";

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
      "Get insights into your Game’s <b>most Critical Threats</b> and find out how to avoid them in the next Game. ",

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
      "Discover an in-depth <b>analysis of each of your and your Opponent’s moves</b> and find suggestions for improvements. ",
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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();

  useEffect(() => {
    const checkSession = () => {
      if (sessionId != "") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? analysis.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === analysis.length - 1 ? 0 : prev + 1));
  };
  const handleAnalysis = () => {
    if (isSignedIn) {
      router.push("/analysis");
    } else {
      router.push("/register");
    }
  };
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
              <div className="border border-input md:border-none rounded-md py-2 px-2 sm:py-4 sm:px-4 mt-4">
                <div className="flex flex-col xl:flex-row w-full min-h-[72vh]">
                  <div className="flex items-center justify-center border border-input sm:border-none w-full xl:w-1/2 overflow-hidden rounded-[8px] bg-white">
                    <div className="relative bg-white rounded-[8px] p-[8px] border border-[#DEDEDE] ">
                      <AnimatePresence>
                        <motion.img
                          key={current}
                          src={analysis[current].image}
                          alt={analysis[current].title}
                          className="w-full object-contain"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="px-1 lg:px-4 w-full xl:w-1/2 md:mt-2">
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
                      className="block mt-1 text-xs sm:text-md lg:text-[18px] font-normal text-[#364152] lg:text-left leading-[1.2]"
                    ></span>
                    <div className="flex flex-col md:flex-row xl:flex-col md:gap-2">
                      <div className="border border-[#221AE9] border-l-4 bg-[#F6F9FF] rounded-md py-2 px-2 sm:px-4 mt-4">
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
                          className="flex flex-row md:flex-col xl:flex-row lg:items-center mt-2 text-[11px] sm:text-md lg:text-[14px] font-normal text-[#364152] lg:text-left"
                        ></span>
                      </div>

                      <div className="border border-[#FA402D] border-l-4 bg-[#FA402D08] rounded-md py-2 px-2 sm:px-4 mt-4">
                        <span className="text-[#FA402D] text-sm sm:text-md font-bold">
                          Problem
                        </span>
                        <span className="flex flex-row md:flex-col xl:flex-row lg:items-center mt-2 text-[11px] sm:text-md lg:text-[14px] font-normal text-[#364152] lg:text-left">
                          {analysis[current].problem}
                        </span>
                      </div>

                      <div className="border border-[#27C2A3] border-l-4 bg-[#27C2A308] rounded-md py-2 px-2 sm:px-4 mt-4">
                        <span className="text-[#27C2A3] text-sm sm:text-md font-bold">
                          Solution
                        </span>
                        <span className="flex flex-row md:flex-col xl:flex-row lg:items-center mt-2 text-[11px] sm:text-md lg:text-[14px] font-normal text-[#364152] lg:text-left">
                          {analysis[current].solution}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col w-full items-center justify-center pt-6 md:pt-2 lg:pt-6">
                      <button
                        onClick={handleAnalysis}
                        className="btn-primary rounded-full py-2 w-full md:w-full px-7 sm:px-16 font-normal text-sm sm:text-md"
                      >
                        Discover AroundChess's Analysis
                      </button>
                      {/* <Button
                        variant="link"
                        className="w-fill text-black px-7 sm:px-16 font-normal text-sm sm:text-md"
                      >
                        No Sign-Up required
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-4 md:pt-1">
                {/* Left Arrow */}
                <button
                  disabled={current == 0}
                  onClick={prevSlide}
                  className="p-2 text-[#221AE9] transition"
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
                        current === index ? "bg-[#221AE9]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {/* Right Arrow */}
                <button
                  disabled={current == analysis.length}
                  onClick={nextSlide}
                  className="p-2 text-[221AE9] transition"
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
