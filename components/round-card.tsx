"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RoundCardProps {
  number: number
  title: string
  description: string
  criteria: string[]
  color: "blue" | "purple" | "pink"
}

export default function RoundCard({ number, title, description, criteria, color }: RoundCardProps) {
  const colorMap = {
    blue: {
      bg: "bg-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-600",
      bgLight: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-600",
    },
    pink: {
      bg: "bg-pink-600",
      bgLight: "bg-pink-50",
      border: "border-pink-100",
      text: "text-pink-600",
    },
  }

  const selectedColor = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`border-2 ${selectedColor.border} overflow-hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className={`${selectedColor.bgLight} p-6 flex flex-col items-center justify-center`}>
            <div
              className={`w-16 h-16 ${selectedColor.bg} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4`}
            >
              {number}
            </div>
            <h3 className={`text-xl font-bold ${selectedColor.text} text-center`}>{title}</h3>
          </div>

          <div className="p-6 md:col-span-3">
            <p className="text-gray-600 mb-6">{description}</p>

            <h4 className="font-bold text-gray-900 mb-4">Judging Criteria:</h4>
            <ul className="space-y-2">
              {criteria.map((criterion, index) => (
                <li key={index} className="flex items-start">
                  <span className={`mr-2 mt-0.5 ${selectedColor.bg} rounded-full p-0.5`}>
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-gray-600">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
