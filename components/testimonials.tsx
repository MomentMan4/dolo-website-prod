"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        '"After launching my book, I needed a landing page that could market it effectively and track sales. Dolo came through with the perfect solution: clean, compelling, and exactly what I had in mind."',
      author: "Toni A.",
    },
    {
      quote:
        '"I needed a website for my business, but I wanted something that stood out, not the typical design you see in my industry. I simply pitched the idea to the Dolo team, and they delivered an absolutely stunning site."',
      author: "Femi, Protego Integrated Services Limited",
    },
    {
      quote:
        '"We needed a fully scaled website to launch a new service but didn\'t have the capacity to build it in-house. A referral led us to the Dolo team, and they nailed it. From payment integration to a serviceable admin dashboard, everything was delivered with precision. They did a thorough and fantastic job."',
      author: "TEFY Academy",
    },
  ]

  return (
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">
            Why People Trust Dolo
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-xl bg-gray-50 p-6 shadow-md md:p-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: index * 0.1,
              }}
            >
              <div className="mb-4">
                <Quote className="h-8 w-8 text-orange opacity-50" />
              </div>
              <p className="mb-6 flex-grow text-gray-600">{testimonial.quote}</p>
              <p className="font-bold text-navy">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
