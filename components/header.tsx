"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-sm backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/dolo-logo.svg" alt="Dolo" width={100} height={100} className="h-16 w-16 sm:h-20 sm:w-20" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <ul className="flex space-x-6 lg:space-x-8">
            <li>
              <Link href="/" className="text-sm font-medium text-navy transition-colors hover:text-orange">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm font-medium text-navy transition-colors hover:text-orange">
                About
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm font-medium text-navy transition-colors hover:text-orange">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/private-build" className="text-sm font-medium text-navy transition-colors hover:text-orange">
                Private Build
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm font-medium text-navy transition-colors hover:text-orange">
                Contact
              </Link>
            </li>
          </ul>
          <Link href="/start">
            <Button className="bg-orange text-white hover:bg-orange-600">Start My Website</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="absolute left-0 top-16 z-50 w-full bg-white p-4 shadow-lg md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block py-2 text-navy transition-colors hover:text-orange"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="block py-2 text-navy transition-colors hover:text-orange"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="block py-2 text-navy transition-colors hover:text-orange"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/private-build"
                    className="block py-2 text-navy transition-colors hover:text-orange"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Private Build
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block py-2 text-navy transition-colors hover:text-orange"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
                <li className="pt-2">
                  <Link href="/start" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-orange text-white hover:bg-orange-600">Start My Website</Button>
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
