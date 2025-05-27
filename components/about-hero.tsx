"use client"

import { motion } from "framer-motion"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange/5 to-teal/5 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="mb-6 text-2xl font-bold leading-tight tracking-tighter text-navy sm:text-3xl md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mr-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">❤️</span> The Heart Behind Dolo
            <br className="hidden sm:block" />
            <span className="italic text-pink">We're Not Basic. We don't Just Build Websites.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            We're a team of creators, builders, and quietly obsessive thinkers who see websites as more than code and
            pixels. To us, a website is an extension of your voice, your value, your story. It's how people experience
            your brand when you're not in the room.
          </motion.p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-orange/10"></div>
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-teal/10"></div>
      <div className="absolute bottom-40 right-40 h-48 w-48 rounded-full bg-pink/10"></div>
      <div className="absolute left-40 top-40 h-56 w-56 rounded-full bg-navy/10"></div>

      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-teal/5 to-pink/5 pointer-events-none"></div>
    </section>
  )
}
