"use client";

import Image from "next/image";
import { motion } from "@/utils/motion";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfileStore } from "@/app/store/profile";

const benefits = [
  {
    image: "/images/homepage/v2/icon_playground.png",
    title: "Challenge Dozens of AI Opponents",
    description:
      "Choose from more than 70 AI opponents with unique ELO Score, matched to every skill level.",
  },
  {
    image: "/images/homepage/v2/icon_discover.png",
    title: "Discover Mistakes. Improve. Repeat.",
    description: "Review every game, spot mistakes, and improve with AI insights.",
  },
  {
    image: "/images/homepage/v2/icon_climb.png",
    title: "Climb the Leaderboard",
    description:
      "Win matches, increase your ELO, and compete with players worldwide.",
  },
  {
    image: "/images/homepage/v2/icon_personalized.png",
    title: "Personalized Training Rapid Improvement",
    description:
      "Learn from your mistakes and become a stronger player with every game.",
  },
];

export function BenefitsOf() {
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
  
  const handlePlayNow = () => {
    if (isSignedIn) {
      router.push("/playground/play-vs-ai");
    } else {
      router.push("/register");
    }
  };
  
  return (
    <section className="py-2 sm:py-2 lg:py-2 xl:py-4 bg-white rounded-b-[32px]">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex flex-col xl:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="flex flex-col w-full items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-xl sm:text-2xl lg:text-[24px] font-semibold mb-1 sm:mb-2 text-black text-center lg:text-left">
              Benefits of AroundChess
            </h2>
            <p className="text-[14px] --sm font-normal sm:text-[18px] text-[#585858] mb-4 sm:mb-8 text-center lg:text-left">
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
          {/* Grid Layout: 1 column on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {benefits.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col border border-[#DEDEDE] rounded-lg p-4 sm:p-6 md:p-4 lg:p-6 h-full"
                >
                  <Image
                    className="w-[32px] h-[32px] sm:w-[50px] sm:h-[48px] object-contain mb-4"
                    src={item.image}
                    width={900}
                    height={900}
                    alt=""
                    priority
                  />
                  <span className="text-black text-[14px] --sm md:text-md sm:text-left lg:text-[20px] font-medium mb-2">
                    {item.title}
                  </span>
                  <span className="text-[#364152] text-[14px] --xs md:text-[14px] --sm lg:text-[18px] font-normal">
                    {item.description}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
        <div className="flex flex-col items-center justify-center pt-6">
          <Button
            onClick={handlePlayNow}
            className="w-fill btn-primary rounded-full px-12 py-6 font-normal text-[14px] --sm sm:text-[20px] xl:min-w-[467px] mb-3"
          >
            Play Now
          </Button>
        </div>
      </div>
    </section>
  );
}