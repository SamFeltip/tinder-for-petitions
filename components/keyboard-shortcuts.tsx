"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onLike: () => void
  onDislike: () => void
  onReset: () => void
  onProfile: () => void
  isActive: boolean
}

export function KeyboardShortcuts({ onLike, onDislike, onReset, onProfile, isActive }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isActive) return

      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key.toLowerCase()) {
        case "arrowright":
        case "l":
        case " ": // Spacebar
          event.preventDefault()
          onLike()
          break
        case "arrowleft":
        case "d":
        case "x":
          event.preventDefault()
          onDislike()
          break
        case "r":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onReset()
          }
          break
        case "p":
          event.preventDefault()
          onProfile()
          break
        case "escape":
          // Could be used to close modals or reset
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onLike, onDislike, onReset, onProfile, isActive])

  return null
}
