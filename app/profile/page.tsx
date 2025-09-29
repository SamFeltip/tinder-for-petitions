"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Vote, UserProfile } from "@/lib/petitions/voting";
import { sampleItems, sampleUser } from "@/lib/sample-data";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(sampleUser);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load votes from localStorage on mount
  useEffect(() => {
    const savedVotes = localStorage.getItem("voteswipe-votes");
    console.debug({ savedVotes });
    if (savedVotes) {
      try {
        const parsedVotes = JSON.parse(savedVotes);
        setVotes(parsedVotes);
      } catch (error) {
        console.error("Failed to parse saved votes:", error);
      }
    }
  }, []);

  const likedItems = sampleItems.filter((item) =>
    votes.some((vote) => vote.itemId === item.id && vote.vote === "like")
  );

  // Get unique categories from liked items
  const categories = Array.from(
    new Set(
      likedItems
        .map((item) => item.category)
        .filter((item) => item !== undefined)
    )
  );

  // Filter items by category
  const filteredLikedItems = selectedCategory
    ? likedItems.filter((item) => item.category === selectedCategory)
    : likedItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">Your Liked Items</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-20">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-8"
            >
              All ({likedItems.length})
            </Button>
            {categories.map((category) => {
              const count = likedItems.filter(
                (item) => item.category === category
              ).length;
              return (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-8"
                >
                  {category} ({count})
                </Button>
              );
            })}
          </div>
        )}

        {/* Liked Items */}
        {filteredLikedItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">
              {selectedCategory
                ? `No ${selectedCategory.toLowerCase()} items liked yet`
                : "No liked items yet"}
            </h2>
            <p className="text-sm">Start swiping to build your collection!</p>
            <Button onClick={() => router.back()} className="mt-4">
              Start Voting
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLikedItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <h3 className="font-semibold text-balance mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
