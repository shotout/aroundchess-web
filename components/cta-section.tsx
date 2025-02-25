"use client";

import { motion } from "@/utils/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-4 sm:py-16 lg:py-20 xl:py-24 bg-[linear-gradient(to_bottom,#ffffff_50%,#EFF5FF_50%)]">
      <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
        <motion.div
          className="bg-[#13264F] rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="px-4 py-8 md:px-8 lg:px-12 md:py-4 lg:py-8 lg:px-16 relative z-10">
            <div className="mx-auto max-w-2xl text-center mb-4 sm:mb-8">
              <Button
                variant="outline"
                className="text-white self-center text-sm sm:text-lg font-light px-4"
              >
                Sign Up
              </Button>
            </div>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-normal tracking-tight text-white md:text-md lg:text-4xl">
                Ready to Boost Your Chess Skills?
              </h2>
              <p className="mx-auto mt-2 sm:mt-3 max-w-xl md:max-w-3xl text-xs md:text-xs leading-2 text-gray-300">
                Join thousands of players improving their game with our
                AI-powered chess analysis and personalized training.
              </p>
              <div className="mt-2 sm:mt-6">
                <div className="flex flex-col w-3/3 mx-2 md:mx-1 lg:mx-12 justify-end gap-4">
                  <div className="flex w-full flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-2/3">
                      <p className="text-white text-left mb-2">Email</p>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-[#FFFFFF25] border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="whitespace-nowrap sm:mt-8"
                    >
                      <Link href="/pricing#top" className="text-[#3871EC]">
                        Start Free Trial
                        <ArrowRight color="#3871EC" className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    </div>
                  <p className="text-xs sm:text-sm text-gray-400">
                    No credit card required. 7-day free trial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
