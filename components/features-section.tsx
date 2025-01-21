'use client'

import { motion } from '@/utils/motion'
import { Clock, Brain, TrendingUp, Timer, BookOpen, Target } from 'lucide-react'

const features = [
  { icon: Clock, title: 'Real-time Analysis', description: 'Get instant feedback on every move, powered by Stockfish engine.' },
  { icon: Brain, title: 'Personalized Training', description: 'Set your chess goals and receive tailored training plans to achieve them.' },
  { icon: TrendingUp, title: 'Rapid Improvement', description: 'Track your progress and see your skills improve with data-driven insights.' },
  { icon: Timer, title: 'Time Management', description: 'Learn to manage your time effectively with specialized exercises.' },
  { icon: BookOpen, title: 'Comprehensive Library', description: 'Access a vast library of annotated games and chess puzzles.' },
  { icon: Target, title: 'Goal Tracking', description: 'Set and monitor your chess improvement goals with detailed progress reports.' },
]

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-base font-semibold text-primary mb-2">Accelerate your progress</h2>
          <p className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Your Personal Chess Gym
          </p>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock your full potential with our comprehensive suite of chess training tools and features.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

