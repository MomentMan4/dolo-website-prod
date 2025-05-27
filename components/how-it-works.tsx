"use client"

import { motion } from "framer-motion"
import { CheckCircle, FileText, Clock, Zap, ArrowRight } from "lucide-react"
import { useState } from "react"
import { QuizTrigger } from "@/components/quiz-trigger"

export function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const steps = [
    {
      icon: <CheckCircle className="h-8 w-8 text-navy" />,
      title: "1. Choose Plan",
      description: "Select the website package that best fits your business needs and budget.",
    },
    {
      icon: <FileText className="h-8 w-8 text-orange" />,
      title: "2. Submit Brief",
      description: "Tell us about your business, goals, and design preferences through our simple form.",
    },
    {
      icon: <Clock className="h-8 w-8 text-teal" />,
      title: "3. Track Progress",
      description: "Monitor your project's development and provide feedback through our client portal.",
    },
    {
      icon: <Zap className="h-8 w-8 text-coral" />,
      title: "4. Go Live",
      description: "Launch your new website and start attracting customers to your business.",
    },
  ]

  // Animation for the text "concept to launch"
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  // Bounce animation for the pill
  const bouncePillAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  }

  // Pulse animation for the button
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: ["0 0 0 rgba(255, 107, 53, 0.4)", "0 0 20px rgba(255, 107, 53, 0.6)", "0 0 0 rgba(255, 107, 53, 0.4)"],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop" as const,
    },
  }

  const AnimatedText = ({ text }: { text: string }) => (
    <motion.span
      className="inline-block"
      variants={textVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} className="inline-block" variants={letterVariants}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )

  return (
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Our simple process gets you <AnimatedText text="from concept to launch" /> in just a few steps.
          </p>
        </motion.div>

        <motion.div
          className="mb-16 grid gap-8 md:grid-cols-4 md:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
              variants={item}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                {step.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-navy">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {/* Animated arrow between steps (hidden on mobile) */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute -right-12 top-1/2 hidden -translate-y-1/2 transform md:block"
                  animate={{
                    x: hoveredIndex === index ? [0, 10, 0] : 0,
                    opacity: hoveredIndex === index ? 1 : 0.5,
                  }}
                  transition={{
                    x: {
                      duration: 1,
                      repeat: hoveredIndex === index ? Number.POSITIVE_INFINITY : 0,
                      repeatType: "loop",
                    },
                    opacity: { duration: 0.3 },
                  }}
                >
                  <ArrowRight
                    className={`h-8 w-8 ${
                      index === 0 ? "text-orange" : index === 1 ? "text-teal" : index === 2 ? "text-coral" : "text-navy"
                    }`}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-16 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div className="mb-8 rounded-full bg-white px-8 py-4 shadow-lg" animate={bouncePillAnimation}>
            <p className="text-center text-lg font-medium">
              From concept to launch in as little as <span className="font-bold text-coral">10 days</span>
            </p>
          </motion.div>

          <div className="relative w-full max-w-3xl">
            {/* Reduced width by 0.5 and added whitespace before Day 10-14 */}
            <div className="mx-auto h-3.5 w-11/12 rounded-full bg-gradient-to-r from-navy via-teal to-coral">
              {/* Whitespace indicator before Day 10-14 */}
              <div className="absolute right-[22%] top-0 h-3.5 w-1 rounded-full bg-white"></div>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="text-center">
                <div className="font-medium text-navy">Day 1</div>
                <div className="text-sm text-gray-600">Planning</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-navy">Day 5</div>
                <div className="text-sm text-gray-600">Design</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-navy">Day 8</div>
                <div className="text-sm text-gray-600">Development</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-navy">Day 10-14</div>
                <div className="text-sm text-gray-600">Launch</div>
              </div>
            </div>
          </div>

          {/* Enhanced Find My Perfect Plan button */}
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div className="rounded-lg bg-gradient-to-r from-orange to-coral p-[3px]" animate={pulseAnimation}>
              <QuizTrigger className="text-lg font-medium" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
