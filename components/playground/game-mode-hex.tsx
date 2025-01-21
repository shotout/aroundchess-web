import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Users2, Swords, Bot } from "lucide-react"

interface GameModeHexProps {
  href: string
  title: string
  description: string
  color: string
  mode: 'two-player' | 'online' | 'computer'
  delay?: number
}

export function GameModeHex({ href, title, description, color, mode, delay = 0 }: GameModeHexProps) {
  const Icon = mode === 'two-player' ? Users2 : mode === 'online' ? Swords : Bot

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <Link href={href}>
        {/* Background pattern */}
        <div className="absolute inset-0 w-[280px] sm:w-[260px] md:w-[280px] lg:w-[300px] h-[320px] sm:h-[300px] md:h-[320px] lg:h-[340px] mx-auto opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_2px,transparent_0)] bg-[length:24px_24px] clip-hex" />
        
        {/* Main hexagon container */}
        <div className={cn(
          "hex-container relative mx-auto",
          "w-[280px] sm:w-[260px] md:w-[280px] lg:w-[300px]",
          "h-[320px] sm:h-[300px] md:h-[320px] lg:h-[340px]",
          "before:content-[''] before:absolute before:w-full before:h-full",
          "before:bg-gradient-to-br before:clip-hex before:z-10",
          "after:content-[''] after:absolute after:w-[98%] after:h-[98%] after:top-[1%] after:left-[1%]",
          "after:bg-gradient-to-br after:clip-hex after:z-20",
          "transition-all duration-300",
          "group-hover:shadow-2xl group-hover:shadow-white/10",
          color
        )}>
          {/* Animated border */}
          <div className="absolute inset-[1px] clip-hex z-30 overflow-hidden">
            <div className="absolute inset-0 bg-[length:200%_200%] animate-subtle-shift"
                 style={{
                   backgroundImage: 'linear-gradient(115deg, transparent 0%, transparent 40%, rgba(255,255,255,0.15) 45%, transparent 50%, transparent 100%)'
                 }} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white z-40">
            <motion.div 
              className="mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm mx-auto
                            shadow-[0_0_15px_rgba(255,255,255,0.2)] 
                            group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]
                            transition-all duration-300">
                <Icon className="w-8 h-8" />
              </div>
            </motion.div>
            
            <h3 className="text-xl sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 
                         group-hover:text-white transition-colors
                         drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
              {title}
            </h3>
            
            <p className="text-xs sm:text-xs md:text-sm leading-relaxed
                       text-white/80 group-hover:text-white/90
                       transition-colors duration-300">
              {description}
            </p>

            {/* Hover indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2
                          opacity-0 group-hover:opacity-100
                          transform group-hover:translate-y-1
                          transition-all duration-300">
              <span className="text-sm font-medium text-white/90">Click to Play</span>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/30 rounded-full z-50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/30 rounded-full z-50" />
        </div>
      </Link>
    </motion.div>
  )
}
