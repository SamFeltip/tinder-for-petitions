"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserProfile, VotingItem, Vote } from "@/types/voting"
import { Heart, X, TrendingUp, Filter } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserProfile
  likedItems: VotingItem[]
  dislikedItems: VotingItem[]
  allVotes: Vote[]
}

export function ProfileModal({ isOpen, onClose, user, likedItems, dislikedItems, allVotes }: ProfileModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const totalVotes = allVotes.length
  const likePercentage = totalVotes > 0 ? Math.round((likedItems.length / totalVotes) * 100) : 0

  // Get unique categories from liked items
  const categories = Array.from(new Set(likedItems.map((item) => item.category).filter(Boolean)))

  // Filter items by category
  const filteredLikedItems = selectedCategory
    ? likedItems.filter((item) => item.category === selectedCategory)
    : likedItems

  const getVoteStats = () => {
    const today = new Date()
    const todayVotes = allVotes.filter((vote) => {
      const voteDate = new Date(vote.timestamp)
      return voteDate.toDateString() === today.toDateString()
    })

    return {
      total: totalVotes,
      today: todayVotes.length,
      liked: likedItems.length,
      disliked: dislikedItems.length,
      likeRate: likePercentage,
    }
  }

  const stats = getVoteStats()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">Voting Profile</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="liked" className="gap-2">
              <Heart className="w-4 h-4" />
              Liked
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="disliked" className="gap-2">
              <X className="w-4 h-4" />
              Passed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liked" className="space-y-4">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="h-8"
                >
                  All ({likedItems.length})
                </Button>
                {categories.map((category) => {
                  const count = likedItems.filter((item) => item.category === category).length
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="h-8"
                    >
                      {category} ({count})
                    </Button>
                  )
                })}
              </div>
            )}

            <div className="overflow-y-auto max-h-80">
              {filteredLikedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    {selectedCategory ? `No ${selectedCategory.toLowerCase()} items liked yet` : "No liked items yet"}
                  </p>
                  <p className="text-sm">Start swiping to build your collection!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLikedItems.map((item) => (
                    <Card key={item.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="flex gap-3">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-balance">{item.title}</h4>
                          <p className="text-xs text-muted-foreground text-pretty line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          {item.category && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{stats.today}</div>
                <div className="text-sm text-muted-foreground">Today</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-success">{stats.liked}</div>
                <div className="text-sm text-muted-foreground">Liked</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{stats.disliked}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </Card>
            </div>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Like Rate</span>
                <span className="text-sm text-muted-foreground">{stats.likeRate}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.likeRate}%` }}
                />
              </div>
            </Card>

            {categories.length > 0 && (
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Favorite Categories
                </h4>
                <div className="space-y-2">
                  {categories
                    .map((category) => ({
                      category,
                      count: likedItems.filter((item) => item.category === category).length,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .map(({ category, count }) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="disliked" className="space-y-4">
            <div className="overflow-y-auto max-h-80">
              {dislikedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <X className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No passed items</p>
                  <p className="text-sm">Items you swipe left on will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dislikedItems.map((item) => (
                    <Card key={item.id} className="p-3 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex gap-3">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0 grayscale"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-balance">{item.title}</h4>
                          <p className="text-xs text-muted-foreground text-pretty line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
