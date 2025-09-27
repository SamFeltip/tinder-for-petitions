"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard, Mouse, Smartphone, Heart, X, RotateCcw, User } from "lucide-react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            How to Use VoteSwipe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mouse className="w-4 h-4" />
              Mouse & Touch
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Drag card right</span>
                <Badge variant="outline" className="gap-1">
                  <Heart className="w-3 h-3" />
                  Like
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Drag card left</span>
                <Badge variant="outline" className="gap-1">
                  <X className="w-3 h-3" />
                  Pass
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Click buttons</span>
                <Badge variant="secondary">Vote</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> or{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">L</kbd> or{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
                </span>
                <Badge variant="outline" className="gap-1">
                  <Heart className="w-3 h-3" />
                  Like
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> or{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">D</kbd> or{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">X</kbd>
                </span>
                <Badge variant="outline" className="gap-1">
                  <X className="w-3 h-3" />
                  Pass
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">P</kbd>
                </span>
                <Badge variant="secondary" className="gap-1">
                  <User className="w-3 h-3" />
                  Profile
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">R</kbd>
                </span>
                <Badge variant="secondary" className="gap-1">
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Tips
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Swipe with momentum for faster voting</li>
              <li>• Check your profile to see voting stats</li>
              <li>• Filter liked items by category</li>
              <li>• Use keyboard shortcuts for rapid voting</li>
            </ul>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
