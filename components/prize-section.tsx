"use client"

import { motion } from "framer-motion"
import { Trophy, Award, FileText } from "lucide-react"

export default function PrizeSection() {
  const prizes = [
    {
      title: "Cash Prizes",
      description: "Win from a ₹10,000 prize pool",
      color: "from-yellow-300 to-yellow-500",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-400",
      icon: <Trophy className="h-10 w-10 text-yellow-600" />,
      delay: 0,
    },
    {
      title: "Mementos",
      description: "Special mementos for top teams",
      color: "from-purple-300 to-purple-500",
      textColor: "text-purple-700",
      borderColor: "border-purple-400",
      icon: <Award className="h-10 w-10 text-purple-600" />,
      delay: 0.2,
    },
    {
      title: "Certificates",
      description: "Recognition for all participants",
      color: "from-blue-300 to-blue-500",
      textColor: "text-blue-700",
      borderColor: "border-blue-400",
      icon: <FileText className="h-10 w-10 text-blue-600" />,
      delay: 0.4,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {prizes.map((prize, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: prize.delay }}
        >
          <motion.div
            className={`w-32 h-32 rounded-full bg-gradient-to-b ${prize.color} flex items-center justify-center mb-6 shadow-lg border-4 ${prize.borderColor}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-center">{prize.icon}</div>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{prize.title}</h3>
          <p className="text-gray-600 text-center">{prize.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
