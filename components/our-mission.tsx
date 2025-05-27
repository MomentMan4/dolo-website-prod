"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Target, ArrowUpCircle, Repeat } from "lucide-react"

export function OurMission() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const missionSteps = [
    {
      title: "Build",
      description:
        "Because it all begins with a solid foundation, a website that's thoughtful, intuitive, and made to convert.",
      icon: Target,
      color: "bg-navy/10",
      iconColor: "text-navy",
    },
    {
      title: "Sustain",
      description:
        "Because a website isn't just a launch event, it's a living system. We build tools that evolve with you.",
      icon: Repeat,
      color: "bg-orange/10",
      iconColor: "text-orange",
    },
    {
      title: "Scale",
      description:
        "Because ambition deserves infrastructure. We help you grow through automation, integration, and smart design choices.",
      icon: ArrowUpCircle,
      color: "bg-coral/10",
      iconColor: "text-coral",
    },
  ]

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">Our Mission</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg">Build. Sustain. Scale.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:gap-12">
          {missionSteps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className={`mb-4 rounded-full ${step.color} p-4`}>
                <step.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${step.iconColor}`} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-navy sm:text-xl">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
