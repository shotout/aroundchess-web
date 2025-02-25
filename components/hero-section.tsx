"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [username, setUsername] = useState<string>("");
  const [width, setWidth] = useState(0);
    const handleResize = () => setWidth(window.innerWidth);
    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  return (
    <section className="flex flex-1 relative overflow-hidden bg-primary py-4 sm:bg-white sm:pb-32 sm:pt-24 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
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
            <div className="bg-[black] sm:bg-transparent rounded-lg p-4 sm:p-8">
            <h1 className="font-heading text-lg text-white sm:text-4xl md:text-5xl lg:text-4xl xl:text-3xl tracking-tight sm:text-black-900 ">
              <span className="block sm:mb-2">
                Understand your{" "}
                <span className="text-primary font-bold">Chess</span> Game with
                our
              </span>
              <span className="font-heading text-lg sm:text-4xl md:text-5xl lg:text-4xl xl:text-3xl font-bold tracking-tight text-black-900">
                Advanced Game Analysis
              </span>
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white font-light max-w-2xl mx-auto lg:mx-0">
              Experience an in-depth analysis of every move with our
              cutting-edge tools and AI-driven insights - simply by looking up
              your Chess.com account.
            </p>
            </div>
            <div             
              className="mt-48 bg-white sm:mt-10 sm:bg-gray-100 sm:bg-clip-padding sm:backdrop-filter sm:backdrop-blur-lg sm:bg-opacity-70 border border-[#DEDEDE] rounded-md p-4 flex flex-col gap-2 sm:justify-center lg:justify-start"
            >
              <p className="w-full block text-base text-start sm:text-center font-semibold sm:text-2xl md:text-3xl lg:text-2xl xl:text-xl text-gray-600">
                Analyze your most recent Game now:
              </p>
              <p className="block mb-3 text-xs text-start sm:text-center sm:text-lg md:text-lg lg:text-md xl:text-sm text-gray-600">
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
        </motion.div>
      </div>
      <div className="hidden sm:block absolute top-80 left-20 w-[50px] sm:w-[50px] md:w-[100px] h-[50px] sm:h-[50px] md:h-[100px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="hidden sm:block absolute top-0 right-0 w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] bg-white-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="hidden sm:block absolute bottom-0 right-0 w-[600px] sm:w-[500px] md:w-[600px] h-[500px] sm:h-[450px] md:h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>

      <div className="absolute top-32 sm:top-8 sm:right-0 sm:w-3/5 h-auto py-2 sm:py-16 lg:py-12">
        <Image
          src={width>572?"/images/homepage/hero-banner.png":"/images/homepage/hero-banner-mobile.png"}
          alt="herobanner"
          width={1000}
          height={1000}
          className="w-full h-auto bg-no-repeat relative overflow-hidden rounded-lg bg-cover bg-no-repeat"
          priority
        />
      </div>
    </section>
  );
}
