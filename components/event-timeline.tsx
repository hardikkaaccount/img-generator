"use client"

import { motion } from "framer-motion"
import { Clock, Flag, Award } from "lucide-react"

export default function EventTimeline() {
  const timelineItems = [
    {
      time: "9:00 AM",
      title: "Registration & Check-in",
      description: "Teams arrive and complete registration process",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "9:30 AM",
      title: "Opening Ceremony",
      description: "Welcome address and event introduction",
      icon: <Flag className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "10:00 AM",
      title: "Round 1: Best Image Generation",
      description: "Teams create prompts to generate stunning images",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "11:30 AM",
      title: "Round 2: Solve It With A Prompt",
      description: "Teams solve coding problems using AI prompts",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "1:00 PM",
      title: "Lunch Break",
      description: "Refreshments provided for all participants",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "2:00 PM",
      title: "Round 3: Clone This",
      description: "Teams create app clones using AI prompts",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "3:30 PM",
      title: "Judging & Evaluation",
      description: "Final evaluation of all submissions",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      time: "4:30 PM",
      title: "Award Ceremony",
      description: "Announcement of winners and prize distribution",
      icon: <Award className="h-6 w-6 text-blue-600" />,
    },
  ]

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform md:-translate-x-0.5"></div>

      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            className={`relative flex items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-white rounded-full border-4 border-blue-400 transform -translate-x-1/2 flex items-center justify-center z-10">
              {item.icon}
            </div>

            {/* Content */}
            <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <div className="font-bold text-blue-600 mb-1">{item.time}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
