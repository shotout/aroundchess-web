"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { GameModeHex } from "@/components/playground/game-mode-hex"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { motion } from "framer-motion"
import "@/styles/globals/hex.css"

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const subtitleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut"
    }
  }
}

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <SiteHeader />
      
      {/* Main content with background */}
      <main className="relative flex-1">
        {/* Background container - only for main content */}
        <div className="absolute inset-0">
          <motion.div 
            className="relative w-full h-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src="/images/chess-3.jpg"
              alt="Chess background"
              fill
              className="object-cover blur-[1px] scale-105"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-black/70" />
          </motion.div>
        </div>

        {/* Content */}
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8 md:py-12 px-4">
            {/* Title section with animation */}
            <div className="relative z-10 text-center mb-8 md:mb-12">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white"
                initial="hidden"
                animate="visible"
                variants={titleVariants}
              >
                Chess Playground
              </motion.h1>
              <motion.p 
                className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4 sm:px-6"
                initial="hidden"
                animate="visible"
                variants={subtitleVariants}
              >
                Choose your preferred game mode and challenge yourself or others in the world of chess
              </motion.p>
            </div>

            {/* Game modes grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-6xl mb-8 md:mb-16 px-4 sm:px-6">
              <GameModeHex
                href="/playground/two-player"
                title="Two Player"
                description="Challenge a friend in a local game. Perfect for face-to-face matches and improving together."
                color="before:from-primary/80 before:to-primary/60 after:from-primary/60 after:to-primary/40"
                mode="two-player"
                delay={0}
              />
              
              <GameModeHex
                href="/playground/online-multiplayer"
                title="Online Multiplayer"
                description="Connect with players worldwide. Test your skills in ranked matches or casual games."
                color="before:from-green-500/80 before:to-green-600/60 after:from-green-500/60 after:to-green-600/40"
                mode="online"
                delay={0.1}
              />
              
              <GameModeHex
                href="/playground/computer"
                title="Play Against Computer"
                description="Practice with our AI at any skill level. From beginner-friendly to grandmaster strength."
                color="before:from-gray-500/80 before:to-gray-600/60 after:from-gray-500/60 after:to-gray-600/40"
                mode="computer"
                delay={0.2}
              />
            </div>

            {/* Decorative elements */}
            <div className="relative z-10 w-full max-w-6xl relative mb-6 md:mb-8">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>
        </MaxWidthWrapper>
      </main>

      {/* Footer */}
      <footer className="relative bg-background mt-auto border-t border-border">
        <SiteFooter />
      </footer>
    </div>
  )
}