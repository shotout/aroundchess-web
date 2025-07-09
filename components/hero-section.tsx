"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FamousGameButton } from "./famous-game-button";
import { useProfileStore } from "@/app/store/profile";
import { TimerResetIcon } from "lucide-react";

export function HeroSection() {
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
  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPgn = () => {
    router.push("/my-game-history");
  };

  const renderInsertUsername = () => {
    return (
      <div className="max-w-[668px] bg-white z-100 sm:mx-7  sm:bg-white sm:bg-clip-padding sm:backdrop-filter sm:backdrop-blur-sm sm:bg-opacity-75 border border-[#DEDEDE] rounded-md p-4 flex flex-col gap-y-1 sm:justify-center lg:justify-start">
        <p className="w-full block text-xl text-start font-semibold sm:text-xl text-black">
          Welcome back to AroundChess!
        </p>

        <p className="block text-base text-start sm:text-lg text-black">
          Continue your chess journey with our advanced analysis tools
        </p>

        <div className="flex flex-row items-center mb-2">
          <p className="block text-sm sm:text-base text-black">
            review your analyzed game, track your progress, and discover new
            insights to improve your play.
          </p>
        </div>

        <button
          className="btn-primary flex items-center justify-center gap-x-2 w-full text-xs px-2 py-2 rounded-full"
          onClick={fetchPgn}
        >
          <TimerResetIcon className="w-4 h-4" />
          <h1 className="">View Game History</h1>
        </button>
      </div>
    );
  };

  return (
    <section className="flex flex-1 relative overflow-hidden py-4 sm:bg-white lg:pb-8 lg:pt-0 w-full">
      <div className="container mx-auto px-4 md:px-0 lg:px-8 z-10">
        <motion.div
          className="flex flex-col sm:flex-row items-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="sm:w-2/3 lg:pr-12 mb-4 lg:mb-0 text-center sm:text-left"
            variants={fadeInUp}
          >
            <div className="bg-[black] sm:bg-transparent rounded-lg p-4 sm:p-8">
              <h1 className="font-heading text-lg text-white sm:text-black sm:text-xl xl:text-4xl tracking-tight ">
                <span className="block sm:mb-0">
                  Understand your{" "}
                  <span className="text-primary font-bold">Chess</span> Game
                  with our
                </span>
                <span className="font-heading text-lg sm:text-xl xl:text-4xl font-bold tracking-wide text-black-900">
                  Advanced Game Analysis
                </span>
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-lg text-white sm:text-black font-light max-w-2xl mx-auto lg:mx-0">
                Experience an in-depth analysis of every move with our
                cutting-edge tools and AI-driven insights - simply by looking up
                your Chess.com account.
              </p>
            </div>
            {isSignedIn ? renderInsertUsername() : <FamousGameButton />}
          </motion.div>
        </motion.div>
      </div>
      <div className="block z-2 absolute  w-[100%] h-[620px] lg:h-auto">
        <Image
          src={
            width > 1024
              ? "/images/homepage/hero-banner-homepage.png"
              : width > 572
              ? "/images/homepage/hero-banner-homepage-tablet.png"
              : "/images/homepage/hero-banner-homepage-mobile.png"
          }
          alt="herobanner"
          width={1000}
          height={1000}
          className="w-[100%] h-[80vh] sm:h-[90vh] md:h-[80vh] lg:h-auto object-cover z-2 relative overflow-hidden"
          priority
        />
      </div>
    </section>
  );
}
