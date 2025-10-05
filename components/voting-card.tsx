"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { VotingItem } from "@/app/types/voting";
import { cn } from "@/lib/utils";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { env } from "process";

interface VotingCardProps {
  item: VotingItem;
  onVote: (itemId: string, vote: "like" | "dislike") => void;
  isActive: boolean;
  zIndex: number;
}

export function VotingCard({
  item,
  onVote,
  isActive,
  zIndex,
}: VotingCardProps) {
  const {
    isDragging,
    isAnimating,
    dragOffset,
    animationRef,
    rotation,
    scale,
    opacity,
    mouseHandlers,
  } = useSwipeGesture({
    onVote: (v: "like" | "dislike") => {
      onVote(item.id, v);
    },
    isActive,
  });

  const showSticker = isDragging && Math.abs(dragOffset.x) > 30;
  const stickerType = dragOffset.x > 0 ? "like" : "dislike";
  const stickerOpacity = Math.min(Math.abs(dragOffset.x) / 100, 1);

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex }}
    >
      <Card
        className={cn(
          "w-80 h-[500px] cursor-grab active:cursor-grabbing transition-all duration-200 overflow-hidden select-none p-0",
          isActive && "card-enter shadow-2xl",
          isDragging && "transition-none shadow-3xl",
          !isActive && "shadow-lg"
        )}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
          opacity,
        }}
        onMouseDown={mouseHandlers.down}
        onMouseMove={mouseHandlers.move}
        onMouseUp={mouseHandlers.up}
        onMouseLeave={mouseHandlers.up}
        onTouchStart={mouseHandlers.touchStart}
        onTouchMove={mouseHandlers.touchMove}
        onTouchEnd={mouseHandlers.touchEnd}
      >
        <div className="relative h-full">
          <img
            src={
              process.env.NEXT_PUBLIC_IMAGE_GENERATOR_URL
                ? `${process.env.NEXT_PUBLIC_IMAGE_GENERATOR_URL}?id=${item.id}`
                : "/placeholder.svg"
            }
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
                  : "bg-red-500 text-white border-red-400"
              )}
              style={{ opacity: stickerOpacity }}
            >
              {stickerType === "like" ? "LIKE" : "NOPE"}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80  to-transparent p-6 text-white">
            <h3 className="font-bold text-xl text-balance mb-2">
              {item.title}
            </h3>
            <p className="text-sm opacity-90 text-pretty leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-center gap-8 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover:scale-110 bg-background/80 backdrop-blur-sm"
          onClick={() => onVote(item.id, "dislike")}
          disabled={!isActive || isAnimating}
        >
          <X className="w-7 h-7" />
        </Button>

        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-success hover:bg-success/90 text-success-foreground transition-all duration-200 hover:scale-110 shadow-lg"
          onClick={() => onVote(item.id, "like")}
          disabled={!isActive || isAnimating}
        >
          <Check className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
