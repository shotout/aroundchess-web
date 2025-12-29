'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sword, Brain, TrendingUp, Clock, Users, Zap, HelpCircle, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import Image from 'next/image'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const features = [
  { title: "Game analysis", description: "Detailed AI analysis of your chess games", trial: "Unlimited for 7 days", premium: "Unlimited", annual: "Unlimited", lifetime: "Unlimited" },
  { title: "Personalized study plan", description: "AI-generated learning path based on your performance", trial: "Daily for 7 days", premium: "Daily", annual: "Daily", lifetime: "Daily" },
  { title: "Daily training sessions", description: "AI-curated exercises to improve your skills", trial: "Unlimited for 7 days", premium: "Unlimited core + premium", annual: "Unlimited core + premium", lifetime: "Unlimited core + premium" },
  { title: "Opening repertoire suggestions", description: "AI-powered recommendations for chess openings", trial: "Advanced for 7 days", premium: "Advanced", annual: "Advanced+", lifetime: "Grandmaster-level" },
  { title: "AI-powered game reviews", description: "In-depth analysis using advanced AI algorithms", trial: "Unlimited for 7 days", premium: "Unlimited", annual: "Unlimited", lifetime: "Unlimited" },
  { title: "Multiple account tracking", description: "Analyze games from multiple Chess.com accounts", trial: "Yes for 7 days", premium: "Yes", annual: "Yes", lifetime: "Yes" },
  { title: "Weakness detection", description: "AI-driven identification of areas for improvement", trial: "Yes for 7 days", premium: "Yes", annual: "Advanced", lifetime: "Advanced+" },
  { title: "Progress reports", description: "Detailed AI analysis of your chess improvement", trial: "Weekly for 7 days", premium: "Monthly", annual: "Weekly", lifetime: "Daily" },
  { title: "AI-powered opponent simulation", description: "Practice against AI that mimics different playing styles", trial: "Basic for 7 days", premium: "Basic", annual: "Advanced", lifetime: "Grandmaster-level" },
  { title: "Historical game database access", description: "AI-curated access to a vast database of historical chess games", trial: "Limited for 7 days", premium: "Limited", annual: "Extended", lifetime: "Full" },
  { title: "Unlimited engine analysis", description: "No time limits on deep AI analysis of critical positions", trial: "Yes for 7 days", premium: "Yes", annual: "Yes", lifetime: "Yes" },
  { title: "Customizable AI training partner", description: "Practice against an AI tailored to your skill level", trial: "No", premium: "Basic", annual: "Advanced", lifetime: "Grandmaster-level" },
  { title: "Performance analytics dashboard", description: "Comprehensive AI-driven analytics on your chess performance", trial: "Basic for 7 days", premium: "Basic", annual: "Advanced", lifetime: "Advanced+" },
  { title: "Tactical pattern recognition", description: "AI-powered analysis of your tactical awareness", trial: "No", premium: "Basic", annual: "Advanced", lifetime: "Grandmaster-level" },
  { title: "Endgame mastery reports", description: "Detailed AI analysis of your endgame performance", trial: "No", premium: "Monthly", annual: "Weekly", lifetime: "On-demand" }
]

export default function PricingPage() {
  const [showComparison, setShowComparison] = useState(false)
  const router = useRouter()

  const handleSubscription = async (planType: string) => {
    if (planType === 'trial') {
      router.push('/register')
      return
    }
    toast.info(`Subscription for ${planType} coming soon!`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="relative py-20 sm:py-32 overflow-hidden bg-white">
          <div className="absolute inset-0 dot-pattern opacity-[0.4]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Choose Your <span className="text-primary">Chess Journey</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
                Unlock advanced AI-powered chess analysis and improve your game with our flexible pricing plans.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-8 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* 7-Day Trial Card */}
              <PricingCard
                title="7-Day Trial"
                price="Free"
                description="Full access for 7 days"
                features={[
                  "All Premium features included for 7 days",
                  "Unlimited AI-powered game analyses",
                  "Daily AI-generated study plan",
                  "Advanced opening suggestions",
                  "Basic AI opponent simulation"
                ]}
                buttonText="Start 7-Day Trial"
                onSubscribe={() => handleSubscription('trial')}
              />

              {/* Premium Plan */}
              <PricingCard
                title="Premium"
                price="$5.99"
                description="Billed monthly, cancel anytime"
                features={[
                  "Unlimited AI game analysis",
                  "Daily AI-generated study plan",
                  "Unlimited AI training sessions",
                  "Advanced opening suggestions",
                  "Basic AI opponent simulation"
                ]}
                buttonText="Start Premium"
                onSubscribe={() => handleSubscription('premium')}
                highlighted={true}
              />

              {/* Annual Plan */}
              <PricingCard
                title="Annual Premium"
                price="$4.49"
                description="Per month/$53.88 annual billing"
                features={[
                  "All Premium features",
                  "Advanced AI opponent simulation",
                  "Advanced performance analytics",
                  "Weekly endgame mastery reports",
                  "Advanced tactical pattern recognition",
                  "Extended historical game database"
                ]}
                buttonText="Start Annual"
                onSubscribe={() => handleSubscription('annual')}
                badge="Most Popular"
              />

              {/* Lifetime Plan */}
              <PricingCard
                title="Lifetime"
                price="$125"
                description="One-time payment"
                features={[
                  "All Annual Premium features",
                  "Grandmaster-level AI training partner",
                  "Advanced+ performance analytics",
                  "On-demand endgame mastery reports",
                  "Grandmaster-level tactical recognition",
                  "Full historical game database access",
                  "Priority access to new AI features"
                ]}
                buttonText="Get Lifetime Access"
                onSubscribe={() => handleSubscription('lifetime')}
                badge="Best Value"
                highlighted={true}
              />
            </motion.div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-card hover:bg-muted"
                onClick={() => setShowComparison(!showComparison)}
              >
                {showComparison ? "Hide detailed comparison" : "Show detailed comparison"}
              </Button>
            </motion.div>

            {showComparison && (
              <motion.div
                className="mt-16 overflow-x-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-6 font-semibold text-lg">Feature</th>
                      <th className="py-4 px-6 font-semibold text-lg">7-Day Trial</th>
                      <th className="py-4 px-6 font-semibold text-lg">Premium</th>
                      <th className="py-4 px-6 font-semibold text-lg">Annual</th>
                      <th className="py-4 px-6 font-semibold text-lg">Lifetime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-6">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-2">
                                {feature.title}
                                <HelpCircle className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="py-4 px-6">{feature.trial === "No" ? <X className="text-destructive" /> : feature.trial}</td>
                        <td className="py-4 px-6">{feature.premium === "No" ? <X className="text-destructive" /> : feature.premium}</td>
                        <td className="py-4 px-6">{feature.annual === "No" ? <X className="text-destructive" /> : feature.annual}</td>
                        <td className="py-4 px-6">{feature.lifetime === "No" ? <X className="text-destructive" /> : feature.lifetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </section>

        <section className="w-full py-8 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
            <h2 className="text-3xl font-bold text-center mb-12">Analyze Your Game with Cutting-Edge AI</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Sword className="w-10 h-10" />}
                title="AI-Powered Analysis"
                description="Get deep insights into your games with our advanced AI analysis engine and data-driven suggestions."
              />
              <FeatureCard
                icon={<Brain className="w-10 h-10" />}
                title="Personalized AI Training"
                description="Receive AI-tailored lessons, exercises, and improvement plans based on your playing style and weaknesses."
              />
              <FeatureCard
                icon={<TrendingUp className="w-10 h-10" />}
                title="Comprehensive Analytics"
                description="Monitor your improvement with detailed AI-generated statistics, performance metrics, and personalized reports."
              />
              <FeatureCard
                icon={<Clock className="w-10 h-10" />}
                title="Time Management Insights"
                description="Learn to manage your time effectively with our AI-powered time usage analysis and training exercises."
              />
              <FeatureCard
                icon={<Users className="w-10 h-10" />}
                title="AI Opponent Simulation"
                description="Practice against AI opponents that mimic various playing styles and strengths to broaden your chess experience."
              />
              <FeatureCard
                icon={<Zap className="w-10 h-10" />}
                title="Historical Game Insights"
                description="Learn from the masters with AI-curated access to a vast database of historical chess games."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-8 md:py-16 lg:py-24 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is AroundChess?</AccordionTrigger>
                <AccordionContent>
                  aroundchess is an advanced AI-powered chess analysis tool that helps players of all levels improve their game. It provides detailed game analysis, personalized training plans, and advanced features to enhance your chess skills.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the 7-day free trial work?</AccordionTrigger>
                <AccordionContent>
                  The 7-day free trial gives you full access to all Premium features for a week. You can cancel anytime during the trial period without being charged. After the trial ends, you'll be automatically enrolled in the Premium plan unless you cancel.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I switch plans or cancel my subscription?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can switch between plans or cancel your subscription at any time. If you switch to a higher-tier plan, you'll have immediate access to the new features. If you cancel, you'll retain access until the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. We use industry-standard encryption and secure payment processors to ensure your payment information is always protected. We never store your full credit card details on our servers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
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
      </main>

      <SiteFooter />
    </div>
  )
}

function PricingCard({ title, price, description, features, buttonText, onSubscribe, highlighted = false, badge }: {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  onSubscribe: () => void
  highlighted?: boolean
  badge?: string
}) {
  return (
    <Card className={`relative flex flex-col min-h-[500px] ${
      highlighted ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white'
    }`}>
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-purple-900 rounded-full text-[14px] --sm font-semibold">
          {badge}
        </div>
      )}
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div>
          <div className="text-4xl font-bold">{price}</div>
          <p className={`text-[14px] --sm ${highlighted ? 'text-gray-200' : 'text-muted-foreground'}`}>{description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <Feature key={index} text={feature} highlighted={highlighted} />
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Button
          className={`w-full ${
            highlighted
              ? 'bg-white text-primary hover:bg-gray-100'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          size="lg"
          onClick={onSubscribe}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

function Feature({ text, highlighted }: { text: string; highlighted?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <Check className={`w-5 h-5 ${highlighted ? 'text-yellow-400' : 'text-primary'}`} />
      <span className="text-[14px] --sm">{text}</span>
    </li>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="glassmorphism p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}
