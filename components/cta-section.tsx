'use client'

import { motion } from '@/utils/motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient">
      <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
        <motion.div
          className="bg-black rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="px-6 py-24 sm:px-12 sm:py-32 lg:px-16 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Boost Your Chess Skills?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Join thousands of players improving their game with our AI-powered chess analysis and personalized training.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex w-full max-w-md gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent border-gray-700 text-white placeholder:text-gray-400"
                  />
                  <Button asChild size="lg" variant="secondary" className="whitespace-nowrap">
                    <Link href="/pricing#top">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  No credit card required. 7-day free trial.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

