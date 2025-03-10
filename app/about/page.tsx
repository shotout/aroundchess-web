'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from '@/utils/motion'
import { fadeInUp, staggerContainer } from '@/utils/motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, CastleIcon as ChessKnight, Trophy, Users, Star } from 'lucide-react'
import Image from 'next/image'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export default function AboutPage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api || isPaused) {
      return
    }

    const timer = setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => clearInterval(timer)
  }, [api, isPaused])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <>
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 dot-pattern opacity-[0.4]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Revolutionizing <span className="text-gradient">Chess Training & Analysis</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
              Empowering chess players of all levels with cutting-edge AI technology to analyze, learn, and improve their game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose aroundchess?</h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <FeatureCard
              icon={<Brain className="w-10 h-10 text-primary" />}
              title="AI-Powered Insights"
              description="Get deep, move-by-move analysis powered by advanced AI algorithms."
            />
            <FeatureCard
              icon={<ChessKnight className="w-10 h-10 text-primary" />}
              title="Personalized Training"
              description="Receive tailored training plans based on your unique playing style and skill level."
            />
            <FeatureCard
              icon={<Trophy className="w-10 h-10 text-primary" />}
              title="Track Your Progress"
              description="Monitor your improvement with detailed statistics and performance metrics."
            />
          </motion.div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent"></div>
        <div className="absolute right-0 top-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Founded by chess enthusiasts and AI experts, we're on a mission to revolutionize chess training and analysis
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32">
            <motion.div
              className="space-y-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <ChessKnight className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-semibold">Our Mission</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed pl-12">
                    To democratize advanced chess analysis, making it accessible to players of all levels and helping them unlock their full potential on the board.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">The Beginning</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed pl-12">
                    Founded in 2024, aroundchess was born from a passion for combining cutting-edge technology with the timeless game of chess.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">Our Vision</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed pl-12">
                    To create the most comprehensive chess training platform, where every player can learn and improve with cutting-edge AI technology.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Trophy className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-semibold">Looking Forward</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed pl-12">
                    We're committed to continuous innovation, bringing the latest advancements in AI and chess technology to players worldwide. Our goal is to help every chess enthusiast reach their maximum potential.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      {/* Commented out temporarily
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <AchievementCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="1 Million+ Users"
              description="Trusted by chess players worldwide"
            />
            <AchievementCard
              icon={<Star className="w-8 h-8 text-primary" />}
              title="4.8/5 Star Rating"
              description="Consistently high user satisfaction"
            />
            <AchievementCard
              icon={<Trophy className="w-8 h-8 text-primary" />}
              title="Chess Tech Award 2023"
              description="Recognized for innovation in chess technology"
            />
          </div>
        </div>
      </section>
      */}

      {/* Testimonials Section */}
      <section className="py-20 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how aroundchess is transforming the way players learn and improve their chess game
            </p>
          </motion.div>
          <div 
            className="max-w-[var(--container-width)] mx-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
                containScroll: "trimSnaps"
              }}
              className="relative"
              setApi={setApi}
            >
              <CarouselContent className="-ml-4">
                <CarouselItem className="pl-4 basis-full md:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard
                      quote="The analyzer of Around Chess has completely transformed my game. The AI-powered insights are like having a grandmaster coach by my side 24/7."
                      author="Grandmaster David Thompson"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full md:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard
                      quote="As a beginner, I was intimidated by chess analysis. Around Chess makes it accessible and fun. I've seen tremendous improvement in my play."
                      author="Sarah Miller, Amateur Player"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full md:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard
                      quote="The personalized training plans have helped me focus on my weaknesses and improve systematically. A must-have tool for serious players."
                      author="Michael Chen, Club Player"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full md:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard
                      quote="The depth of analysis and the intuitive interface make this platform stand out. It's perfect for both casual players and professionals."
                      author="Elena Petrova, International Master"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full md:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard
                      quote="The analyzer of Around Chess has completely transformed my game. The AI-powered insights are like having a grandmaster coach by my side 24/7."
                      author="Grandmaster David Thompson"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full md:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard
                      quote="As a beginner, I was intimidated by chess analysis. Around Chess makes it accessible and fun. I've seen tremendous improvement in my play."
                      author="Sarah Miller, Amateur Player"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`w-2 h-2 rounded-full p-0 ${
                        index === current ? "bg-primary" : "bg-muted-foreground/20"
                      }`}
                      onClick={() => api?.scrollTo(index)}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="w-full py-8 sm:py-16 lg:py-24 bg-gradient">
        <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
          <motion.div
            className="bg-primary rounded-3xl overflow-hidden shadow-2xl relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Add decorative background elements */}
            <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>

            <div className="px-6 py-24 sm:px-12 sm:py-32 lg:px-16 relative z-10">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to Elevate Your Chess Game?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-200">
                  Join thousands of players who are already benefiting from our AI-powered analysis.
                </p>
                <motion.div
                  className="mt-10 flex items-center justify-center gap-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Link href="/register">Get Started Now →</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="flex flex-col items-center text-center p-6">
        <CardContent>
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

{/* Achievement Card Component - Temporarily commented out
function AchievementCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <motion.div
          className="mr-4"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
*/}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Card className="h-full flex-1">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>
        <p className="text-lg mb-6 italic leading-relaxed flex-1">{quote}</p>
        <div className="pt-4 border-t mt-auto">
          <p className="font-semibold">{author}</p>
        </div>
      </CardContent>
    </Card>
  )
}
