"use client"

import { useState, useRef, useCallback } from "react"

interface SwipeGestureOptions {
  threshold?: number
  velocityThreshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeStart?: () => void
  onSwipeEnd?: () => void
}

export function useSwipeGesture({
  threshold = 80,
  velocityThreshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeStart,
  onSwipeEnd,
}: SwipeGestureOptions = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })
  const startTime = useRef(0)

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true)
      startPos.current = { x: clientX, y: clientY }
      startTime.current = Date.now()
      onSwipeStart?.()
    },
    [onSwipeStart],
  )

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return

      const deltaX = clientX - startPos.current.x
      const deltaY = (clientY - startPos.current.y) * 0.3
      setDragOffset({ x: deltaX, y: deltaY })
    },
    [isDragging],
  )

  const handleEnd = useCallback(() => {
    if (!isDragging) return

    setIsDragging(false)
    const velocity = Math.abs(dragOffset.x) / (Date.now() - startTime.current)

    if (Math.abs(dragOffset.x) > threshold || velocity > velocityThreshold) {
      if (dragOffset.x > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }

    setDragOffset({ x: 0, y: 0 })
    onSwipeEnd?.()
  }, [isDragging, dragOffset.x, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeEnd])

  const reset = useCallback(() => {
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }, [])

  return {
    isDragging,
    dragOffset,
    handleStart,
    handleMove,
    handleEnd,
    reset,
  }
}
