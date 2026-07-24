"use client";

import Image from "next/image";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { TimerResetIcon } from "lucide-react";
import { WelcomeBack } from "./welcome-back";
import { HeroGamePreview } from "./v2/hero-game-preview";
import { HeroSubtitle } from "./v2/hero-subtitle";

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
    <section className="bg-[url('/images/homepage/v2/chess_background.png')] bg-center bg-no-repeat bg-cover bg-[#e0f6fd] flex flex-1 relative overflow-hidden py-4 lg:pb-[88px] lg:mb-[-32px] lg:pt-0 w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 z-10">
        <motion.div
          className="py-0 sm:pt-[22px]"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="flex justify-center sm:justify-end gap-[0px] sm:gap-[16px] mb-[14px]"
            variants={fadeInUp}
          >
            <Image
              src={"/download-app-store.png"}
              alt="herobanner"
              width={170}
              height={50}
              onClick={handleAppStore}
              className="cursor-pointer h-[34px] sm:h-[50px] object-contain z-2 relative overflow-hidden"
              priority
            />
            <Image
              src={"/download-play-store.png"}
              alt="herobanner"
              width={170}
              height={50}
              onClick={handlePlayStore}
              className="cursor-pointer h-[34px] sm:h-[50px] object-contain z-2 relative overflow-hidden -ml-3 sm:ml-0"
              priority
            />
          </motion.div>

          {/* The home hero always shows the pre-login chessboard preview, even
              for signed-in users (only the navbar reflects the session). */}
          <motion.div
            className="w-full text-center flex flex-col items-center"
            variants={fadeInUp}
          >
            <div className="w-full">
              <div className="sm:p-0">
                <h1 className="text-[18px] text-black sm:text-[clamp(22px,2.8vw,40px)] tracking-wide leading-[140%] text-center sm:whitespace-nowrap pt-2 ">
                  <span className="block sm:inline">Challenge <strong className="text-[#221AE9] font-bold">AI Opponents</strong>.</span>
                  <span className="block sm:inline"> Improve Every Game.</span>
                </h1>
              </div>

              <HeroSubtitle />

              <div className="w-full max-w-[900px] mx-auto">
                <HeroGamePreview recommendedListHeightClass="sm:flex-1 sm:min-h-0" />
              </div>
            </div>
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
