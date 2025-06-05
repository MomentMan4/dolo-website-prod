"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  name: string
  label: string
  type?: "text" | "email" | "url" | "tel" | "password" | "textarea" | "select"
  required?: boolean
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  className?: string
  children?: React.ReactNode
  error?: string
}

export function FormField({
  id,
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  className,
  children,
  error,
}: FormFieldProps) {
  const baseInputClasses = cn(
    "mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1",
    required
      ? "border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
      : "border-gray-300 focus:border-gray-500 focus:ring-gray-500",
    error && "border-red-300 focus:border-red-500 focus:ring-red-500",
    className,
  )

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseInputClasses}
        />
      ) : type === "select" ? (
        <select id={id} name={name} value={value} onChange={onChange} required={required} className={baseInputClasses}>
          {children}
        </select>
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseInputClasses}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {required && !error && <p className="text-xs text-gray-500">This field is required</p>}
    </div>
  )
}
