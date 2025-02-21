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
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-[#EFF5FF] mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="lg:w-1/2 relative mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl transform -rotate-3"></div>
            <Image
              src="/images/play-anywhere.jpg"
              alt="Person using AroundChess mobile app to analyze a chess game while enjoying coffee"
              width={600}
              height={600}
              className="w-full max-h-[420px] relative z-10 rounded-3xl shadow-2xl"
            />
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading max-w-max border border-primary rounded-sm p-2 text-lg sm:text-lg lg:text-lg font-normal mb-4 sm:mb-6 text-gradient text-center lg:text-left">
              Powerful Analysis - based on AI, fine-tuned by Humans
            </h2>

            <h2 className="font-heading text-3xl sm:text-3xl lg:text-3xl font-bold mb-4 sm:mb-6 text-black text-center lg:text-left">
              Powerful Analysis at Your Fingertips
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center lg:text-left">
              Our advanced chess engine provides deep insights into every move.
              Improve your game with real-time feedback and personalized
              recommendations.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {analysisFeatures.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle color="#3871EC" className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
