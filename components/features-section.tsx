"use client";

import { motion } from "@/utils/motion";
import { Button } from "./ui/button";
import Image from "next/image";

export function FeaturesSection() {
  return (
    <section className="relative pt-2 pb-1 sm:pt-12 lg:pt-12 bg-white sm:rounded-t-[32px]">
      <div className="container relative mx-auto px-4 md:px-6 lg:px-12">
        <motion.div
          className="text-center mb-2 mt-4 "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex sm:flex-row flex-col-reverse sm:h-[96px] gap-2 justify-between items-center">
            <div className="hidden sm:flex w-[286px]" />
            <Button
              variant={"outlineprimary"}
              className="text-[#221AE9] rounded-[8px] sm:rounded-[16px] p-[4px] sm:px-[12px] sm:py-[8px] font-normal text-[11px] sm:text-[20px]"
            >
              Boost your Chess Skills
            </Button>
            <Image
              src={"/images/switzerland.png"}
              alt="made-in-switzerland"
              quality={100}
                width={600}
                height={600}
              className="w-[130px] h-[44px] sm:w-[286px] sm:h-[96px] object-contain"
            />
          </div>
          <p className="md:my-2 lg:my-4 text-xl md:text-xl lg:text-[40px] font-semibold text-black">
            Your Personal Chess Lab
          </p>
          <p className="xl:max-w-[496px] text-xs sm:text-md md:text-md lg:text-md xl:text-[20px] font-normal leading-[1.2] text-[#2e2e2e] max-w-2xl mx-auto">
            Unlock your full potential with our comprehensive suite of Chess
            Analysis Tools and AI-based Training.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
