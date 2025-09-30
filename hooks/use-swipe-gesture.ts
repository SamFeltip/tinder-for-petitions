"use client";

import { useState, useRef, useCallback } from "react";

interface SwipeGestureOptions {
  onVote: (vote: "like" | "dislike") => void;
  threshold?: number;
  velocityThreshold?: number;
  isActive?: boolean;
}

export function useSwipeGesture({
  onVote,
  threshold = 80,
  velocityThreshold = 50,
  isActive = false,
}: SwipeGestureOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  const handleStart = (clientX: number, clientY: number) => {
    if (!isActive || isAnimating) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = Date.now();
    velocity.current = { x: 0, y: 0 };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive) return;

    const now = Date.now();
    const deltaTime = now - lastTime.current;

    if (deltaTime > 0) {
      velocity.current = {
        x: (clientX - lastPos.current.x) / deltaTime,
        y: (clientY - lastPos.current.y) / deltaTime,
      };
    }

    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = now;

    const deltaX = clientX - startPos.current.x;
    const deltaY = (clientY - startPos.current.y) * 0.3; // Reduce vertical movement
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);

    if (
      Math.abs(dragOffset.x) > threshold ||
      Math.abs(velocity.current.x) > velocityThreshold
    ) {
      handleSwipeWithTrajectory(dragOffset.x > 0 ? "like" : "dislike");
    } else {
      animateReturn();
    }
  };

  const animateReturn = () => {
    const startX = dragOffset.x;
    const startY = dragOffset.y;
    const duration = 300;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDragOffset({
        x: startX * (1 - easeOut),
        y: startY * (1 - easeOut),
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  };

  const handleSwipeWithTrajectory = (vote: "like" | "dislike") => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      onVote(vote);
      setDragOffset({ x: 0, y: 0 });
      setIsAnimating(false);
    }, 250);
  };

  const rotation = Math.max(-15, Math.min(15, dragOffset.x * 0.1));
  const scale = isActive
    ? Math.max(0.95, 1 - Math.abs(dragOffset.x) / 1000)
    : 0.95;
  const opacity = isActive
    ? Math.max(0.8, 1 - Math.abs(dragOffset.x) / 400)
    : 0.8;

  return {
    isDragging,
    isAnimating,
    dragOffset,
    animationRef,
    rotation,
    scale,
    opacity,
    mouseHandlers: {
      move: handleMouseMove,
      up: handleMouseUp,
      down: handleMouseDown,
      touchStart: handleTouchStart,
      touchMove: handleTouchMove,
      touchEnd: handleTouchEnd,
    },
  };
}
