"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { TimerResetIcon } from "lucide-react";
import { WelcomeBack } from "./welcome-back";
import { HeroGamePreview } from "./hero-game-preview";
import { HeroSubtitle } from "./hero-subtitle";

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

  const handleRegister = () => {
    router.push("/register");
  };

  const handleAppStore = () => {
    window.open("https://apps.apple.com/us/app/aroundchess/id6746404970");
  };

  const handlePlayStore = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.aroundchess"
    );
  };

  return (
    <section className="bg-[url('/images/homepage/v2/chess_background.png')] bg-center bg-no-repeat bg-contain sm:bg-cover bg-[#e0f6fd] flex flex-1 relative overflow-hidden py-4 lg:pb-[88px] lg:mb-[-32px] lg:pt-0 w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 z-10">
        <motion.div
          className="py-0 sm:pt-[22px]"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="hidden sm:flex justify-end gap-[16px] mb-[14px] sm:justify-end"
            variants={fadeInUp}
          >
            <Image
              src={"/download-app-store.png"}
              alt="herobanner"
              width={170}
              height={50}
              onClick={handleAppStore}
              className="cursor-pointer h-[50px] object-contain z-2 relative overflow-hidden"
              priority
            />
            <Image
              src={"/download-play-store.png"}
              alt="herobanner"
              width={170}
              height={50}
              onClick={handlePlayStore}
              className="cursor-pointer h-[50px] object-contain z-2 relative overflow-hidden"
              priority
            />
          </motion.div>

          <motion.div
            className={
              !isSignedIn
                ? "w-full text-center flex flex-col items-center"
                : ""}
            variants={fadeInUp}
          >
            {!isSignedIn ? (
              <div className="w-full">
                <div className="bg-[black] sm:bg-transparent rounded-lg p-[10px] pb-0 sm:p-0">
                  <h1 className="text-[18px] text-white sm:text-black sm:text-[clamp(22px,2.8vw,40px)] tracking-wide leading-[140%] text-center sm:whitespace-nowrap">
                    Challenge <strong className="text-[#221AE9] font-bold">AI Opponents</strong>. Improve Every Game.
                  </h1>
                </div>

                <HeroSubtitle />

                <div className="flex flex-col gap-2 sm:hidden w-full max-w-[900px] mx-auto">
                  <button
                    onClick={handleRegister}
                    className="w-full btn-primary rounded-full h-[44px] "
                  >
                    <span className="font-medium text-[14px] -- sm:text-[16px] text-[#e6f7fe]">
                      Create an Account
                    </span>
                  </button>
                  <span className="font-bold text-[14px] -- text-black">Or</span>
                  <motion.div
                    className="w-full flex-row justify-center flex gap-x-[16px] px-4 mb-[16px]"
                    variants={fadeInUp}
                  >
                    <Image
                      src={"/download-app-store.png"}
                      alt="herobanner"
                      width={1000}
                      height={1000}
                      onClick={handleAppStore}
                      className="cursor-pointer w-[135px] h-[40px] object-contain z-2 relative overflow-hidden"
                      priority
                    />
                    <Image
                      src={"/download-play-store.png"}
                      alt="herobanner"
                      width={1000}
                      height={1000}
                      onClick={handlePlayStore}
                      className="cursor-pointer w-[135px] h-[40px] object-contain z-2 relative overflow-hidden"
                      priority
                    />
                  </motion.div>
                </div>

                <div className="w-full max-w-[900px] mx-auto">
                  <HeroGamePreview />
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[black] sm:bg-transparent rounded-lg p-[10px] mb-[16px] sm:mb-[32px] sm:p-0">
                  <h1 className="text-[18px] text-white sm:text-black sm:text-[36px] tracking-wide leading-[140%]">
                    Understand your <strong className="text-primary font-semibold">Chess</strong> Game with our <strong className="font-bold">Advanced Game Analysis</strong>
                  </h1>
                  <p className="mt-1 sm:mt-2 text-[14px] --xs sm:text-[17.3px] text-white sm:text-black leading-[140%] font-light mx-auto lg:mx-0">
                    Experience an in-depth analysis of every move with our
                    cutting-edge tools and AI-driven insights - simply by looking up
                    your Chess.com account.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:hidden">
                  <motion.div
                    className="w-full flex-row justify-center flex gap-x-[16px] px-4 mb-[16px]"
                    variants={fadeInUp}
                  >
                    <Image
                      src={"/download-app-store.png"}
                      alt="herobanner"
                      width={1000}
                      height={1000}
                      onClick={handleAppStore}
                      className="cursor-pointer w-[135px] h-[40px] object-contain z-2 relative overflow-hidden"
                      priority
                    />
                    <Image
                      src={"/download-play-store.png"}
                      alt="herobanner"
                      width={1000}
                      height={1000}
                      onClick={handlePlayStore}
                      className="cursor-pointer w-[135px] h-[40px] object-contain z-2 relative overflow-hidden"
                      priority
                    />
                  </motion.div>
                </div>

                <WelcomeBack />
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
      {/* <div className="block z-2 absolute  w-[100%] h-[620px] lg:h-auto">
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
      </div> */}
    </section>
  );
}
