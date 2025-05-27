"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ModalType = "terms" | "privacy" | "cookies" | null

interface LegalModalsContextType {
  activeModal: ModalType
  openModal: (modal: ModalType) => void
  closeModal: () => void
}

const LegalModalsContext = createContext<LegalModalsContextType | undefined>(undefined)

export function LegalModalsProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const openModal = (modal: ModalType) => {
    setActiveModal(modal)
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setActiveModal(null)
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = "auto"
  }

  return (
    <LegalModalsContext.Provider value={{ activeModal, openModal, closeModal }}>{children}</LegalModalsContext.Provider>
  )
}

export function useLegalModals() {
  const context = useContext(LegalModalsContext)
  if (context === undefined) {
    throw new Error("useLegalModals must be used within a LegalModalsProvider")
  }
  return context
}

// Add a default export
const LegalModalsProviderDefault = LegalModalsProvider
export default LegalModalsProviderDefault
