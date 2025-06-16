"use client";

import { motion } from "@/utils/motion";
import { Button } from "./ui/button";

export function FeaturesSection() {
  return (
    <section className="pt-8 pb-1 sm:pt-12 lg:pt-12 bg-white rounded-t-[32px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Button
            variant={"outlineprimary"}
            className="text-[#221AE9] mt-[32px] rounded-[16px] px-[12px] py-[8px] font-normal text-[20px]"
          >
            Boost your Chess Skills
          </Button>
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
