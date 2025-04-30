"use client"
import { motion } from "framer-motion"

export default function HeroAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Brain outline */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* AI Robot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              {/* Robot head */}
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-40 md:h-40 bg-white rounded-t-3xl border-4 border-gray-200 shadow-lg flex items-center justify-center"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {/* Robot eyes */}
                <div className="flex space-x-4">
                  <motion.div
                    className="w-6 h-6 rounded-full bg-blue-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#3b82f6", "#8b5cf6", "#3b82f6"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="w-6 h-6 rounded-full bg-purple-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#8b5cf6", "#3b82f6", "#8b5cf6"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                </div>
              </motion.div>

              {/* Text bubbles */}
              <motion.div
                className="absolute top-2 right-0 transform translate-x-full bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [0, 0, 0, 20],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 2,
                  times: [0, 0.1, 0.9, 1],
                  ease: "easeInOut",
                }}
              >
                {"Prompt me!"}
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-0 transform -translate-x-full bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [0, 0, 0, -20],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 2,
                  delay: 3,
                  times: [0, 0.1, 0.9, 1],
                  ease: "easeInOut",
                }}
              >
                {"Let's win this!"}
              </motion.div>

              {/* Floating prompt symbols */}
              <motion.div
                className="absolute -top-4 -left-4 text-xl font-mono text-blue-600"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {"{ }"}
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 text-xl font-mono text-purple-600"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1,
                  ease: "easeInOut",
                }}
              >
                {"< >"}
              </motion.div>

              <motion.div
                className="absolute top-20 -right-8 text-xl font-mono text-pink-600"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 2,
                  ease: "easeInOut",
                }}
              >
                {"# !"}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
