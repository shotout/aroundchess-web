'use client'

import Image from 'next/image'
import { motion, fadeInUp, staggerContainer } from '@/utils/motion'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900">
              <span className="block mb-2">Elevate Your</span>
              <span className="text-gradient">Chess Game</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Unlock your potential with AI-powered insights, personalized training, and real-time feedback on every move. Experience chess like never before.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto text-base px-6 py-3 rounded-full animate-pulse-slow" asChild>
                <Link href="/register">
                  Start Analyzing
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto text-base px-6 py-3 rounded-full">
                <Link href="/login">
                  Set Your Goals
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 relative mt-8 lg:mt-0"
            variants={fadeInUp}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl transform rotate-3"></div>
            <Image
              src="/images/chess-hero.jpg"
              alt="Chess game in progress with dramatic lighting showing the intensity and strategy of chess"
              width={600}
              height={600}
              className="w-full h-auto relative z-10 rounded-3xl shadow-2xl animate-float"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
    </section>
  )
}

