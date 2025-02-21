'use client'

import { motion } from '@/utils/motion'
import { Clock, Brain, TrendingUp, Timer, BookOpen, Target } from 'lucide-react'
import { Button } from './ui/button'

export function FeaturesSection() {
  return (
    <section className="pt-8 pb-1 sm:pt-12 lg:pt-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Button variant={"outlineprimary"} className="text-primary">Boost your Chess Skills</Button>
          <p className="my-4 font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
          Your Personal Chess Lab
          </p>
          <p className="max-w-[496px] text-md sm:text-md md:text-md lg:text-md text-gray-600 max-w-2xl mx-auto">
          Unlock your full potential with our comprehensive suite of Chess Analysis Tools and AI-based Training.
          </p>
        </motion.div>
        
      </div>
    </section>
  )
}

