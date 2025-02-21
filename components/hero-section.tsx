"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [username, setUsername] = useState<string>("");
  return (
    <section className="relative overflow-hidden bg-white pb-32 pt-24 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <motion.div
          className="flex flex-col lg:flex-row items-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 text-center lg:text-left"
            variants={fadeInUp}
          >
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-3xl tracking-tight text-black-900">
              <span className="block mb-2">
                Understand your{" "}
                <span className="text-gradient font-bold">Chess</span> Game with
                our
              </span>
              <span className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-3xl font-bold tracking-tight text-black-900">
                Advanced Game Analysis
              </span>
            </h1>
            <p className="mt-1 sm:mt-2 text-base sm:text-sm text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Experience an in-depth analysis of every move with our
              cutting-edge tools and AI-driven insights - simply by looking up
              your Chess.com account.
            </p>
            <div             
              className="mt-4 sm:mt-10 bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-70 border border-[#DEDEDE] rounded-md p-4 flex flex-col gap-2 justify-center lg:justify-start"
            >
              <p className="w-full block text-base sm:text-2xl md:text-3xl lg:text-2xl xl:text-xl text-gray-600">
                Analyze your most recent Game now:
              </p>
              <p className="block mb-3 text-base sm:text-lg md:text-lg lg:text-md xl:text-sm text-gray-600">
                Simply enter your Chess.com Username below and the AroundChess
                Engine will analyze your game.
              </p>
              <div className="flex flex-row">
                <Image
                  src="/icons/hero-section.png"
                  alt="chess"
                  width={100}
                  height={100}
                  className="w-3 h-4 relative z-10"
                  priority
                />
                <p className="block ml-1 text-base sm:text-lg md:text-lg lg:text-md xl:text-sm text-gray-600">
                  Chess.com Username
                </p>
              </div>

              <input
                type="text"
                id="username"
                value={username}
                placeholder="Enter your Chess.com Username"
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full p-3 rounded-sm border border-gray-300 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <Button
                size="sm"
                variant="default"
                className="mt-2 w-full text-xs px-2 py-1"
              >
                Analyze Now
              </Button>
            </div>
          </motion.div>
          {/* <motion.div
            className="lg:w-1/2 relative mt-8 lg:mt-0"
            variants={fadeInUp}
          > */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl transform rotate-3"></div> */}

          {/* </motion.div> */}
        </motion.div>
      </div>
      <div className="absolute top-80 left-20 w-[50px] sm:w-[50px] md:w-[100px] h-[50px] sm:h-[50px] md:h-[100px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-0 right-0 w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] bg-white-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[600px] sm:w-[500px] md:w-[600px] h-[500px] sm:h-[450px] md:h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

      <div className="absolute top-8 right-0 w-3/5 h-auto py-16 sm:py-16 lg:py-12">
        <Image
          src="/images/homepage/hero-banner.png"
          alt="Chess game in progress with dramatic lighting showing the intensity and strategy of chess"
          width={900}
          height={900}
          className="w-full h-auto bg-no-repeat relative overflow-hidden rounded-lg bg-cover bg-no-repeat"
          priority
        />
      </div>
    </section>
  );
}
