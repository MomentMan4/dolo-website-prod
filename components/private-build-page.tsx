"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PrivateBuildForm } from "@/components/private-build-form"
import { Shield, Layers, CheckCircle, Zap, Lock, BarChart3, Globe, MessageSquare } from "lucide-react"

export function PrivateBuildPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const shimmer = {
    hidden: { backgroundPosition: "200% 0" },
    hover: {
      backgroundPosition: "0 0",
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror" as const,
        duration: 3,
        ease: "linear",
      },
    },
  }

  return (
    <>
      {/* Hero Section with Premium Development Service */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-teal-800 to-navy-900"></div>

        {/* Animated Background Elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-teal/20 blur-3xl"></div>
        <div className="absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-coral/20 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              className="mb-6 inline-block rounded-full bg-white/10 backdrop-blur-sm px-6 py-2 text-sm font-medium text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Premium Development Service
            </motion.div>

            <motion.h1
              className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Not Just a Website.
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-white to-teal-300 bg-clip-text text-transparent">
                Your Digital Infrastructure.
              </span>
            </motion.h1>

            <motion.p
              className="mb-4 text-lg text-white/90 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              For brands that need more than a homepage.
            </motion.p>

            <motion.p
              className="mb-10 text-lg text-white/80 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              For businesses building tools, systems, platforms, and experiences.
            </motion.p>

            {/* Shiny Limited Intake Box */}
            <motion.div
              className="mx-auto mb-10 max-w-2xl overflow-hidden rounded-xl relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover="hover"
            >
              {/* Background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy-100 via-teal-100 to-orange-100"></div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{ backgroundSize: "200% 100%" }}
                variants={shimmer}
                initial="hidden"
                animate="hover"
              ></motion.div>

              {/* Content */}
              <div className="relative p-8 z-10">
                <motion.div
                  className="flex items-center justify-center gap-3 text-navy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Shield className="h-7 w-7 text-navy" />
                  <h3 className="text-xl font-bold">Limited Intake</h3>
                </motion.div>
                <motion.p
                  className="mt-3 text-navy-800 text-lg font-medium"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Only 4 Private Build projects accepted per quarter.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center"
            >
              <Button
                className="bg-orange text-white hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange/20"
                size="lg"
                onClick={() => setIsFormOpen(true)}
              >
                Apply for Private Build
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Features Section with Rizz */}
      <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-orange/5 blur-3xl"></div>
        <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-teal/5 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-navy to-teal bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Layers className="h-8 w-8 text-navy" />
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">Enterprise-Grade Features</h2>
            </motion.div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Powerful capabilities that transform your digital presence
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ y: -10 }}
              >
                {/* Background gradient that appears on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-gray-50 opacity-0 transition-opacity group-hover:opacity-100"></div>

                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div
                    className={`absolute inset-0 rounded-full ${feature.bgColor} blur-md transform scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700`}
                  ></div>
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full ${feature.iconBg} text-white`}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-xl font-bold text-navy group-hover:text-navy-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section - Pixel Perfect Recreation */}
      <section className="bg-gray-50 py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-navy/5 blur-3xl"></div>
        <div className="absolute -right-40 bottom-40 h-80 w-80 rounded-full bg-orange/5 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-navy to-teal bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg
                className="h-8 w-8 text-teal"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" />
                <path
                  d="M7.5 7.5H16.5M7.5 12H16.5M7.5 16.5H16.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">Roadmap</h2>
            </motion.div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">What Working With Us Looks Like</p>
          </motion.div>

          <div className="relative mx-auto max-w-4xl">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-200"></div>

            {/* Timeline Steps */}
            {roadmapSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative mb-16 flex ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } items-center justify-center gap-8 md:gap-16`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Text Content */}
                <div className={`w-1/2 text-${index % 2 === 0 ? "right" : "left"} pr-4 md:pr-0`}>
                  <h3 className="mb-2 text-xl font-bold text-navy">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Circle with Number */}
                <div className="absolute left-1/2 -translate-x-1/2 transform">
                  <motion.div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${step.color} shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-lg font-bold">{index + 1}</span>
                  </motion.div>
                </div>

                {/* Empty div for spacing on the other side */}
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-700 to-teal-900"></div>

        {/* Animated Background Elements */}
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-orange/10 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-teal/10 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="mb-6 text-3xl font-bold text-white md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Build Something Exceptional?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                className="bg-orange text-white hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange/20"
                size="lg"
                onClick={() => setIsFormOpen(true)}
              >
                Apply for Private Build
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Modal */}
      <PrivateBuildForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  )
}

const features = [
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Custom Dashboards",
    description: "Data visualization and management interfaces tailored to your specific business needs and workflows.",
    iconBg: "bg-navy",
    bgColor: "bg-navy/20",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Payment Systems",
    description:
      "Secure, customized payment processing solutions with multiple gateway options and subscription management.",
    iconBg: "bg-orange",
    bgColor: "bg-orange/20",
  },
  {
    icon: <CheckCircle className="h-7 w-7" />,
    title: "Content Management",
    description:
      "Powerful yet intuitive content management systems that give you complete control over your digital content.",
    iconBg: "bg-teal",
    bgColor: "bg-teal/20",
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: "Community Platforms",
    description:
      "Engage your audience with forums, member areas, and interactive features that foster community growth.",
    iconBg: "bg-coral",
    bgColor: "bg-coral/20",
  },
  {
    icon: <Globe className="h-7 w-7" />,
    title: "API Integration",
    description:
      "Seamless connections with third-party services and platforms to extend functionality and automate workflows.",
    iconBg: "bg-navy",
    bgColor: "bg-navy/20",
  },
  {
    icon: <Lock className="h-7 w-7" />,
    title: "Advanced Security",
    description:
      "Enterprise-level security measures to protect sensitive data and ensure compliance with industry standards.",
    iconBg: "bg-orange",
    bgColor: "bg-orange/20",
  },
]

const roadmapSteps = [
  {
    title: "Discovery & Proposal",
    description: "We understand your goals, vision, and functionality requirements in a 1:1 strategy session.",
    color: "bg-navy",
  },
  {
    title: "Design Sprint",
    description: "We map out your site flow, components, and integrations, with rapid iteration.",
    color: "bg-orange",
  },
  {
    title: "Private & Dedicated Chat Access",
    description:
      "You get direct and dedicated access to our team via a secure client-only chat space. Upload assets, give approvals, and ask questions, all in one place.",
    color: "bg-teal",
  },
  {
    title: "Project Tracking",
    description: "Monitor your project's build progress in real-time with status updates at every milestone.",
    color: "bg-coral",
  },
  {
    title: "Production & Testing",
    description: "We build, test, refine, and stress-test your solution to ensure it's launch-ready.",
    color: "bg-navy",
  },
  {
    title: "Launch + Support",
    description: "We go live with 30-day post-launch support and options for long-term partnership.",
    color: "bg-orange",
  },
]
