"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "fancy"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [isInitialized, setIsInitialized] = useState(false)
  const themes: Theme[] = ["light", "dark", "fancy"]

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("docuflow-theme") as Theme
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    // Apply theme to document and save to localStorage
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("docuflow-theme", theme)

    // Add transition for smooth theme switching
    document.documentElement.style.transition = "background-color 0.3s ease, color 0.3s ease"

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }))

    // Clean up transition after animation
    const cleanup = setTimeout(() => {
      document.documentElement.style.transition = ""
    }, 300)

    return () => clearTimeout(cleanup)
  }, [theme, isInitialized])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    console.log(`Theme changed to: ${newTheme}`)
  }

  return <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, themes }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
