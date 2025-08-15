"use client"

import Link from "next/link"
import Image from "next/image"
import { useLegalModals } from "./legal-modals-context"

export function Footer() {
  const { openModal } = useLegalModals()

  return (
    <footer className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/dolo-logo.svg"
                alt="Dolo"
                width={128}
                height={128}
                className="h-32 w-32"
                quality={90}
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-gray-600">Your brand deserves a website that works twice as hard as you do.</p>
          </div>

          <div className="mt-4 sm:mt-0">
            <h3 className="mb-4 text-sm font-bold uppercase text-navy">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 transition-colors hover:text-orange" prefetch={true}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 transition-colors hover:text-orange" prefetch={true}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 transition-colors hover:text-orange" prefetch={true}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 transition-colors hover:text-orange" prefetch={true}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-600 transition-colors hover:text-orange" prefetch={true}>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-4 sm:mt-0">
            <h3 className="mb-4 text-sm font-bold uppercase text-navy">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/private-build"
                  className="text-gray-600 transition-colors hover:text-orange"
                  prefetch={true}
                >
                  Explore Private Build
                </Link>
              </li>
              <li>
                <Link href="/start" className="text-gray-600 transition-colors hover:text-orange" prefetch={true}>
                  Start My Website
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-4 sm:mt-0">
            <h3 className="mb-4 text-sm font-bold uppercase text-navy">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => openModal("cookies")}
                  className="text-gray-600 transition-colors hover:text-orange"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal("privacy")}
                  className="text-gray-600 transition-colors hover:text-orange"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal("terms")}
                  className="text-gray-600 transition-colors hover:text-orange"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Dolo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
