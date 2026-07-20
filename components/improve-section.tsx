"use client";

import Image from "next/image";
import { motion } from "@/utils/motion";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";

const improveData = [
  {
    label:
      "AroundChess <b class='font-semibold'>examines your weaknesses</b> by analyzing your past Chess.com Games.",
    image: "/images/homepage/flow-1-icon.png",
    number: "1",
  },
  {
    label:
      "Our AI-powered Engine creates a <b>Custom Training Plan</b> for you to overcome those weaknesses and to improve your Strategy.",
    image: "/images/homepage/flow-2-icon.png",
    number: "2",
  },
  {
    label:
      "<b>Improve your Chess Game</b> and receive constant details on your progress.",
    image: "/images/homepage/flow-3-icon.png",
    number: "3",
  },
];
export function ImproveSection() {
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
  const handleAnalyze = () => {
    // router.push("/analysis");
    // router.push("/register");
    if (isSignedIn) {
      router.push("/my-game-history");
    } else {
      router.push("/register");
    }
  };
  return (
    <section className="py-2 sm:py-1 lg:py-2 xl:py-4 bg-white flex justify-center items-center">
      <div className="container px-4 md:px-6 lg:px-12">
        <div className="flex flex-col xl:flex-row items-center ">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col bg-[#221AE9] rounded-lg">
              <div className="flex flex-row">
                <div className="flex flex-col w-4/6 sm:w-4/6 lg:w-2/6 bg-[#110D75] rounded-tl-lg px-2 sm:px-8 sm:pr-16 py-8">
                  <h2 className="font-bol text-md sm:text-xl lg:text-[32px] font-bold mb-1 sm:mb-2 text-white">
                    Improve your Chess Skills with AroundChess
                  </h2>
                  <p className="text-white font-normal text-[14px] --xs sm:text-[18px] text-white">
                    Discover how our custom Training Plans can help you to
                    improve your Chess Strategy.
                  </p>
                </div>
                <Image
                  src={
                    width > 572
                      ? "/images/homepage/improve-hero-banner.png"
                      : "/images/homepage/improve-hero-banner-mobile.png"
                  }
                  alt="improve-hero-banner"
                  width={900}
                  height={900}
                  className="w-2/6 object-cover md:w-2/6 sm:w-2/6 lg:w-4/6 sm:object-cover h-auto xl:h-[204px] rounded-tr-lg"
                  priority
                />
              </div>
              <div className="flex flex-col w-full sm:w-full rounded-b-lg px-[14px] sm:px-4 lg:px-12 py-2">
                <div className="flex w-full flex-col sm:flex-row sm:w-full">
                  {improveData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-[200px] md:w-1/3 flex flex-col ${
                          index == 1 ? `self-end` : `self-start`
                        } h-[100px] sm:h-[145px]`}
                      >
                        <div className="flex items-center justify-center">
                          <Image
                            className="w-[80px] h-[80px] sm:w-[101px] sm:h-[125px] md:w-[121px] md:h-[145px] absolute top-2 left-10 sm:top-0 sm:left-20 lg:left-36 inset-0 object-contain"
                            src={item.image}
                            width={900}
                            height={900}
                            alt=""
                            priority
                          />
                        </div>
                        <div className="flex flex-row justify-center mt-2 sm:mt-8">
                          <span className="text-[#ffffff70] sm:text-[#ffffff20] font-normal text-3xl sm:text-[80px]">
                            {item.number}
                          </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.label.replace(
                                /\*\*(.*?)\*\*/g,
                                "<b>$1</b>"
                              ),
                            }}
                            className="text-[#ffffff] font-normal text-[13px] text-center sm:text-left --10px sm:text-md md:text-[11px] lg:text-lg 2xl:text-xl sm:mt-0 pl-4 md:-ml-6 lg:ml-0"
                          ></span>
                        </div>
                      </div>
                    );
                  })}

                  <Image
                    className="sm:hidden w-[92px] h-[90px] absolute left-[56vw] md:left-44"
                    src={"/images/homepage/arrow-1.png"}
                    width={900}
                    height={900}
                    alt=""
                  />

                  <Image
                    className="sm:hidden w-[86px] h-[86px] md:w-[92px] md:h-[90px] absolute right-[62vw] mt-[30vw] md:mt-32"
                    src={"/images/homepage/arrow-2.png"}
                    width={875}
                    height={875}
                    alt=""
                  />
                </div>

                <div className="flex flex-col items-center justify-center pt-[16px] md:pt-6 sm:pt-2 sm:mt-12 xl:mt-0">
                  <Button
                    onClick={handleAnalyze}
                    className="btn-tertiary rounded-full w-fill px-10 sm:px-12 py-4 sm:py-4 font-medium text-[14px] --xs sm:text-[16px] text-[#221AE9] mb-3"
                  >
                    Analyze your most recent Game now
                  </Button>
                  {/* <span className="w-fill px-16 font-normal text-[14px] --xs sm:text-[14px] text-white my-3">
                    No Sign-Up required
                  </span> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
