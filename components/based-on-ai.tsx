"use client";

import Image from "next/image";
import { motion } from "@/utils/motion";
import { CheckCircle } from "lucide-react";

const analysisFeatures = [
  "Stockfish-powered move evaluation",
  "Personalized weakness detection",
  "Opening repertoire builder",
  "Endgame training modules",
];

export function BasedOnAI() {
  return (
    <section className="py-2 sm:py-6 md:py-6 xl:py-8 bg-[#E6F7FE] sm:mt-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="md:w-1/2 relative mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 rounded-3xl transform -rotate-3"></div>
            <Image
              src="/images/homepage/image-banner.png"
              alt="Person using AroundChess mobile app to analyze a chess game while enjoying coffee"
              width={600}
              height={600}
              className="w-full max-h-[420px] relative z-10 rounded-3xl shadow-2xl object-contain"
            />
          </motion.div>
          <motion.div
            className="flex flex-col items-center md:flex-none md:items-start md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="max-w-max border border-[#221AE9] rounded-[16px] px-[12px] py-[8px] text-[14px] --xs md:text-[20px] font-normal mb-4 sm:mb-2 lg:mb-[32px] text-[#221AE9] text-center md:text-left">
              Powerful Analysis - based on AI, fine-tuned by Humans
            </h2>

            <h2 className="font-heading text-xl sm:text-[19px] lg:text-[40px] font-semibold mb-1 sm:mb-2 lg:mb-6 text-black text-center md:text-left">
              Powerful Analysis at Your Fingertips
            </h2>
            <p className="text-base md:text-md lg:text-[20px] font-normal text-[#2e2e2e] mb-6 md:mb-4 lg:mb-8 text-center md:text-left">
              Our advanced chess engine provides deep insights into every move.
              Improve your game with real-time feedback and personalized
              recommendations.
            </p>
            <ul className="w-full space-y-3 sm:space-y-4">
              {analysisFeatures.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle
                    color="#221AE9"
                    className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0"
                  />
                  <span className="text-[14px] --sm sm:text-[18px] font-normal text-[#2e2e2e]">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
