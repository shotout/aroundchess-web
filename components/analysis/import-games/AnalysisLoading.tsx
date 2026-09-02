import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const messages = [
  "Analyzing pawn structure...",
  "Evaluating piece coordination...",
  "Checking tactical opportunities...",
  "Reviewing strategic decisions...",
  "Identifying critical moments...",
  "Calculating variations...",
  "Finding improvements...",
  "Preparing recommendations..."
]

export function AnalysisLoading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 text-center space-y-6"
    >
      <div className="flex justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-16 h-16"
        >
          {/* Chess piece animation */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full text-primary"
          >
            <path
              d="M12 2C11.1 2 10.4 2.7 10.4 3.6V4.7C10.4 5.6 11.1 6.3 12 6.3C12.9 6.3 13.6 5.6 13.6 4.7V3.6C13.6 2.7 12.9 2 12 2Z"
              fill="currentColor"
            />
            <path
              d="M17.4 7.2H6.6C5.7 7.2 5 7.9 5 8.8C5 9.7 5.7 10.4 6.6 10.4H7.2L8.4 19.6C8.5 20.9 9.6 22 11 22H13C14.3 22 15.5 21 15.6 19.6L16.8 10.4H17.4C18.3 10.4 19 9.7 19 8.8C19 7.9 18.3 7.2 17.4 7.2Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      </div>

      <div className="space-y-3">
        <motion.div
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <h3 className="text-xl font-semibold text-primary">
            Analyzing Your Game
          </h3>
        </motion.div>

        <motion.div
          animate={{
            opacity: [0, 1],
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
        >
          {messages.map((message, index) => (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.3,
                duration: 0.5,
              }}
              className="text-[14px] --sm text-muted-foreground"
            >
              {message}
            </motion.p>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-primary"
          animate={{
            width: ["0%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <Alert className="max-w-xl mx-auto bg-blue-50/20 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-[14px] --sm text-muted-foreground">
            Our analysis uses advanced chess engines for evaluation, which may result in slightly different assessments compared to other chess analysis tools. This helps provide a fresh perspective on your games while maintaining high accuracy.
          </AlertDescription>
        </Alert>
      </motion.div>
    </motion.div>
  )
} 