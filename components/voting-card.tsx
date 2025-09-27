"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import type { VotingItem } from "@/types/voting"
import { cn } from "@/lib/utils"

interface VotingCardProps {
  item: VotingItem
  onVote: (itemId: string, vote: "like" | "dislike") => void
  isActive: boolean
  zIndex: number
}

export function VotingCard({ item, onVote, isActive, zIndex }: VotingCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const velocity = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTime = useRef(0)

  const handleStart = (clientX: number, clientY: number) => {
    if (!isActive || isAnimating) return
    setIsDragging(true)
    startPos.current = { x: clientX, y: clientY }
    lastPos.current = { x: clientX, y: clientY }
    lastTime.current = Date.now()
    velocity.current = { x: 0, y: 0 }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive) return

    const now = Date.now()
    const deltaTime = now - lastTime.current

    if (deltaTime > 0) {
      velocity.current = {
        x: (clientX - lastPos.current.x) / deltaTime,
        y: (clientY - lastPos.current.y) / deltaTime,
      }
    }

    lastPos.current = { x: clientX, y: clientY }
    lastTime.current = now

    const deltaX = clientX - startPos.current.x
    const deltaY = (clientY - startPos.current.y) * 0.3 // Reduce vertical movement
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleEnd = () => {
    if (!isDragging || !isActive) return
    setIsDragging(false)

    const threshold = 80
    const velocityThreshold = 0.5

    if (Math.abs(dragOffset.x) > threshold || Math.abs(velocity.current.x) > velocityThreshold) {
      handleSwipeWithTrajectory(dragOffset.x > 0 ? "like" : "dislike")
    } else {
      animateReturn()
    }
  }

  const animateReturn = () => {
    const startX = dragOffset.x
    const startY = dragOffset.y
    const duration = 300
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDragOffset({
        x: startX * (1 - easeOut),
        y: startY * (1 - easeOut),
      })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }

  const handleSwipeWithTrajectory = (vote: "like" | "dislike") => {
    if (isAnimating) return
    setIsAnimating(true)

    const direction = vote === "like" ? 1 : -1
    const finalX = direction * (window.innerWidth + 200)
    const finalY = dragOffset.y + velocity.current.y * 300
    const finalRotation = direction * (15 + Math.abs(velocity.current.x) * 20)

    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out"
      cardRef.current.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${finalRotation}deg) scale(0.8)`
      cardRef.current.style.opacity = "0"
    }

    setTimeout(() => {
      onVote(item.id, vote)
      setDragOffset({ x: 0, y: 0 })
      setIsAnimating(false)
      if (cardRef.current) {
        cardRef.current.style.transition = ""
        cardRef.current.style.transform = ""
        cardRef.current.style.opacity = ""
      }
    }, 600)
  }

  const handleSwipe = (vote: "like" | "dislike") => {
    handleSwipeWithTrajectory(vote)
  }

  const rotation = isDragging ? Math.max(-15, Math.min(15, dragOffset.x * 0.1)) : 0
  const scale = isDragging ? Math.max(0.95, 1 - Math.abs(dragOffset.x) / 1000) : isActive ? 1 : 0.95
  const opacity = isDragging ? Math.max(0.8, 1 - Math.abs(dragOffset.x) / 400) : isActive ? 1 : 0.8

  const showSticker = isDragging && Math.abs(dragOffset.x) > 30
  const stickerType = dragOffset.x > 0 ? "like" : "dislike"
  const stickerOpacity = Math.min(Math.abs(dragOffset.x) / 100, 1)

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex }}>
      <Card
        ref={cardRef}
        className={cn(
          "w-80 h-[500px] cursor-grab active:cursor-grabbing transition-all duration-200 overflow-hidden select-none p-0",
          isActive && "card-enter shadow-2xl",
          isDragging && "transition-none shadow-3xl",
          !isActive && "shadow-lg",
        )}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
          opacity,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {showSticker && (
            <div
              className={cn(
                "absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold text-2xl border-4 rotate-12 select-none pointer-events-none",
                stickerType === "like"
                  ? "bg-green-500 text-white border-green-400"
                  : "bg-red-500 text-white border-red-400",
              )}
              style={{ opacity: stickerOpacity }}
            >
              {stickerType === "like" ? "LIKE" : "NOPE"}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 via-black/40 via-black/20 to-transparent p-6 text-white">
            <h3 className="font-bold text-xl text-balance mb-2">{item.title}</h3>
            <p className="text-sm opacity-90 text-pretty leading-relaxed">{item.description}</p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-center gap-8 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover:scale-110 bg-background/80 backdrop-blur-sm"
          onClick={() => handleSwipe("dislike")}
          disabled={!isActive || isAnimating}
        >
          <X className="w-7 h-7" />
        </Button>

        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-success hover:bg-success/90 text-success-foreground transition-all duration-200 hover:scale-110 shadow-lg"
          onClick={() => handleSwipe("like")}
          disabled={!isActive || isAnimating}
        >
          <Check className="w-7 h-7" />
        </Button>
      </div>
    </div>
  )
}
