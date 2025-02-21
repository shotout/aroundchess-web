"use client";

import Image from "next/image";
import { motion } from "@/utils/motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

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
  return (
    <section className="py-2 sm:py-2 lg:py-2 xl:py-4 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="flex flex-col w-full items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl sm:text-2xl lg:text-2xl font-semibold mb-1 sm:mb-2 text-black text-center lg:text-left">
              Benefits of AroundChess
            </h2>
            <p className="text-lg sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center lg:text-left">
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
          <div className="flex flex-wrap w-full justify-around gap-10">
            {benefits.map((item, index) => {
              return (
                <div className="w-full 2xl:max-w-[460px] md:max-w-[372px] lg:max-w-[372px] flex flex-col border border-[#DEDEDE] rounded-lg p-8">
                  <Image
                    className="w-[50px] h-[48px] object-contain mb-4"
                    src={item.image}
                    width={900}
                    height={900}
                    alt=""
                    priority
                  />
                  <span className="text-black text-xl font-semibold">
                    {item.title}
                  </span>
                  <span className="text-black text-lg font-light">
                    {item.description}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
        <div className="flex flex-col items-center justify-center pt-6">
          <Button className="w-fill px-12 py-6 font-normal text-md">
            Analyze your most recent Game now
          </Button>
          <Button variant="link" className="w-fill px-16 font-normal text-md">
            No Sign-Up request
          </Button>
        </div>
      </div>
    </section>
  );
}
