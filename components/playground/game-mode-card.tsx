import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Users2, Swords, Bot } from "lucide-react"

interface GameModeCardProps {
  href: string
  title: string
  description: string
  color: string
  mode: 'two-player' | 'online' | 'computer'
}

export function GameModeCard({ href, title, description, color, mode }: GameModeCardProps) {
  const Icon = mode === 'two-player' ? Users2 : mode === 'online' ? Swords : Bot

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-1 min-w-[250px]"
    >
      <Link
        href={href}
        className={cn(
          "block h-full rounded-xl p-6 text-white",
          "backdrop-blur-md backdrop-saturate-150",
          "border border-white/10",
          "transition-all duration-300",
          "hover:shadow-xl hover:shadow-white/5",
          color
        )}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-white/10">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  )
}