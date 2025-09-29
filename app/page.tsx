"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VotingCard } from "@/components/voting-card";
import { HelpModal } from "@/components/help-modal";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { sampleUser } from "@/lib/sample-data";
import type { Vote, UserProfile } from "@/app/types/voting";
import { HelpCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOpenPetitions } from "@/lib/petitions/parlimentPetition/hooks";
import { useVotes } from "@/lib/votings/hooks";

export default function VotingApp() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(sampleUser);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const { votes, handleVote } = useVotes();

  const [showWelcome, setShowWelcome] = useState(true);

  const { data: items, isLoading } = useOpenPetitions();

  const freshItems =
    items?.filter(
      (item) => votes.some((vote) => item.id == vote.itemId) == false
    ) ?? [];

  // Load votes from localStorage and show welcome message
  useEffect(() => {
    const hasVisited = localStorage.getItem("voteswipe-visited");
    if (!hasVisited) {
      localStorage.setItem("voteswipe-visited", "true");
    }
    setShowWelcome(!hasVisited);
  }, []);

  // Save votes to localStorage whenever votes change
  useEffect(() => {
    localStorage.setItem("voteswipe-votes", JSON.stringify(votes));
  }, [votes]);

  const setVote = (itemId: string, vote: "like" | "dislike") => {
    handleVote(itemId.toString(), vote);

    // Add some haptic feedback on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleLike = () => {
    if (currentItem && hasMoreItems) {
      setVote(currentItem.id, "like");
    }
  };

  const handleDislike = () => {
    if (currentItem && hasMoreItems) {
      setVote(currentItem.id, "dislike");
    }
  };

  const handleReset = () => {
    setUser((prev) => ({
      ...prev,
      votes: [],
    }));
    localStorage.removeItem("voteswipe-votes");
  };

  const likedItems = items?.filter((item) =>
    votes.some((vote) => vote.itemId === item.id && vote.vote === "like")
  );

  const hasMoreItems = freshItems.length > 0;
  const currentItem = hasMoreItems ? freshItems[0] : null;
  const nextItem = freshItems.length > 1 ? freshItems[1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="relative flex-1 overflow-hidden h-screen">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <KeyboardShortcuts
        onLike={handleLike}
        onDislike={handleDislike}
        onReset={handleReset}
        onProfile={() => router.push("/profile")}
        isActive={hasMoreItems}
      />

      <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/profile")}
            className="p-0 w-12 h-12 rounded-full relative bg-background/80 backdrop-blur-sm hover:bg-background/90 cursor-pointer"
            title="View Profile"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      {/* Main voting area */}
      <main className="relative flex-1 overflow-hidden h-screen px-4 sm:px-6">
        {hasMoreItems ? (
          <div className="relative w-full h-full">
            {/* Next card (behind) */}
            {nextItem && (
              <VotingCard
                key={nextItem.id}
                item={nextItem}
                onVote={setVote}
                isActive={false}
                zIndex={1}
              />
            )}

            {/* Current card (front) */}
            {currentItem && (
              <VotingCard
                key={currentItem.id}
                item={currentItem}
                onVote={setVote}
                isActive={true}
                zIndex={2}
              />
            )}

            {/* Floating help hint for new users */}
            {showWelcome && (
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 px-4">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg text-center">
                  Swipe or use buttons to vote!
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="text-6xl animate-bounce">🎉</div>
              <div>
                <h2 className="text-3xl font-bold mb-2">All done!</h2>
                <p className="text-muted-foreground text-lg">
                  You've voted on all {items?.length} items
                </p>
              </div>

              <div className="text-center p-6 bg-success/10 rounded-lg border border-success/20">
                <div className="text-3xl font-bold text-success">
                  {likedItems?.length}
                </div>
                <div className="text-sm text-success/80">Items Liked</div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/profile")}
                  className="gap-2 w-full"
                >
                  <Sparkles className="w-4 h-4" />
                  View Your Collection
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2 w-full bg-transparent"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6 z-30 hidden sm:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHelpOpen(true)}
          className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-lg"
          title="Help & Shortcuts"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
