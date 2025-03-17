"use client"

import { useEffect, useState } from "react"

export function SkipLink() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href="#main-content"
      className="fixed top-0 left-0 z-50 p-2 bg-primary text-primary-foreground transform -translate-y-full focus:translate-y-0 transition"
    >
      Skip to main content
    </a>
  )
}

