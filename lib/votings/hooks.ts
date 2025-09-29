import { useState, useEffect, useCallback } from "react";
import { Vote } from "@/app/types/voting";
import { addVote, getAllVotes } from "../indexedDb/handleVotes";

// --- React hook ---
export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);

  // Load from IndexedDB on mount
  useEffect(() => {
    getAllVotes().then(setVotes).catch(console.error);
  }, []);

  // Handle voting
  const handleVote = useCallback(
    async (itemId: string, vote: "like" | "dislike") => {
      const newVote: Vote = {
        itemId,
        vote,
        timestamp: new Date(),
      };

      // Optimistic update in React state
      setVotes((prev) => [...prev, newVote]);

      // Persist to IndexedDB
      try {
        await addVote(newVote);
      } catch (err) {
        console.error("Failed to save vote:", err);
      }
    },
    []
  );

  return { votes, handleVote };
}
