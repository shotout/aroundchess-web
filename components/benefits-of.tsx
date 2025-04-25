"use client";

import Image from "next/image";
import { motion } from "@/utils/motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const benefits = [
  {
    image: "/images/homepage/real-time-analysis-icon.png",
    title: "Real-time Analysis",
    description:
      "Get instant feedback on every move, powered by Stockfish engine.",
  },
  {
    image: "/images/homepage/personalized-training-icon.png",
    title: "Personalized Training",
    description:
      "Set your chess goals and receive tailored training plans to achieve them.",
  },
  {
    image: "/images/homepage/rapid-improvement-icon.png",
    title: "Rapid Improvement",
    description:
      "Track your progress and see your skills improve with data-driven insights.",
  },
  {
    image: "/images/homepage/time-management-icon.png",
    title: "Time Management",
    description:
      "Learn to manage your time effectively with specialized exercises.",
  },
  {
    image: "/images/homepage/comprehensive-library-icon.png",
    title: "Comprehensive Library",
    description: "Access a vast library of annotated games and chess puzzles.",
  },
  {
    image: "/images/homepage/goal-tracking-icon.png",
    title: "Goal Tracking",
    description:
      "Set and monitor your chess improvement goals with detailed progress reports.",
  },
];
export function BenefitsOf() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const handleAnalyze = () => {
    if (isSignedIn) {
      router.push("/analysis");
    } else {
      router.push("/register");
    }
  };
  return (
    <section className="py-2 sm:py-2 lg:py-2 xl:py-4 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="flex flex-col w-full items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-xl sm:text-2xl lg:text-2xl font-semibold mb-1 sm:mb-2 text-black text-center lg:text-left">
              Benefits of AroundChess
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-8 text-center lg:text-left">
              What benefits you will get from our advance AI?
            </p>
          </motion.div>
        </div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex w-full overflow-x-auto sm:flex-row sm:overflow-hidden sm:flex-wrap sm:justify-around md:gap-4 lg:gap-10">
            {benefits.map((item, index) => {
              return (
                <div
                  key={index}
                  className="min-w-[224px] h-[150px] mr-4 sm:mr-0 xl:max-w-[372px] md:max-w-[216px] sm:h-auto md:items-start flex flex-col border border-[#DEDEDE] rounded-lg p-4 sm:p-8 md:p-4"
                >
                  <Image
                    className="w-[32px] h-[32px] sm:w-[50px] sm:h-[48px] object-contain mb-4"
                    src={item.image}
                    width={900}
                    height={900}
                    alt=""
                    priority
                  />
                  <span className="text-black text-sm md:text-md md:text-center lg:text-xl font-semibold">
                    {item.title}
                  </span>
                  <span className="text-[#585858] text-xs md:mt-1 lg:mt-2 md:text-sm lg:text-lg font-light">
                    {item.description}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
        <div className="flex flex-col items-center justify-center pt-6">
          <Button
            onClick={handleAnalyze}
            className="w-fill btn-primary rounded-full px-12 py-6 font-normal text-sm sm:text-md"
          >
            Analyze your most recent Game now
          </Button>
          <span
            className="w-fill px-16 font-normal text-black text-sm sm:text-md my-3"
          >
            No Sign-Up required
          </span>
        </div>
      </div>
    </section>
  );
}
