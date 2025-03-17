"use client"

import type React from "react"

import { useEffect } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Initialize i18n
  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }

    // Save language preference when it changes
    const handleLanguageChange = (lng: string) => {
      localStorage.setItem("language", lng)
    }

    i18n.on("languageChanged", handleLanguageChange)

    return () => {
      i18n.off("languageChanged", handleLanguageChange)
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

