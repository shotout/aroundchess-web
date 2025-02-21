"use client";

import Image from "next/image";
import { motion } from "@/utils/motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

const improveData = [
  {
    label:
      "AroundChess examines your weaknesses by analyzing your past Chess.com Games.",
    image: "/images/homepage/flow-1-icon.png",
    number: "1",
  },
  {
    label:
      "Our AI-powered Engine creates a Custom Training Plan for you to overcome those weaknesses and to improve your Strategy.",
    image: "/images/homepage/flow-2-icon.png",
    number: "2",
  },
  {
    label:
      "Improve your Chess Game and receive constant details on your progress.",
    image: "/images/homepage/flow-3-icon.png",
    number: "3",
  },
];
export function ImproveSection() {
  return (
    <section className="py-2 sm:py-1 lg:py-2 xl:py-4 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center ">
          <motion.div
            className="lg:w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col bg-[#3871EC] rounded-lg">
              <div className="flex flex-row">
                <div className="flex flex-col lg:w-2/5 bg-[#2657C0] rounded-tl-lg px-12 pr-16 py-8">
                  <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white text-center lg:text-left">
                    Improve your Chess Skills with AroundChess
                  </h2>
                  <p className="text-white sm:text-md text-gray-600 text-center lg:text-left">
                    Discover how our custom Training Plans can help you to
                    improve your Chess Strategy.
                  </p>
                </div>
                <Image
                  src="/images/homepage/improve-hero-banner.png"
                  alt="improve-hero-banner"
                  width={900}
                  height={900}
                  className="w-3/5 h-auto rounded-tr-lg"
                  priority
                />
              </div>
              <div className="flex flex-col w-full lg:w-full rounded-b-lg px-12 py-2">
                <div className="flex flex-row w-full lg:w-full">
                  {improveData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative w-1/3 flex flex-col h-[145px]"
                      >
                        <div className="flex items-center justif-center">
                          <Image
                            className="w-[121px] h-[145px] absolute left-40 inset-0 object-contain"
                            src={item.image}
                            width={900}
                            height={900}
                            alt=""
                            priority
                          />
                        </div>
                        <div className="flex flex-row">
                          <span className="text-[#ffffff20] font-semibold text-[80px]">
                            {item.number}
                          </span>
                          <span className="text-[#ffffff] font-normal text-md  mt-10 px-4">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col items-center justify-center pt-6">
                  <Button className="w-fill px-12 py-6 font-normal text-md bg-white text-primary">
                    Analyze your most recent Game now
                  </Button>
                  <Button
                    variant="link"
                    className="w-fill px-16 font-normal text-md text-white"
                  >
                    No Sign-Up request
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
