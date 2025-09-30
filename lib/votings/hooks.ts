import { useState, useEffect, useCallback } from "react";
import { Vote } from "@/app/types/voting";
import { addVote, getAllVotes } from "../indexedDb/handleVotes";
import { useQuery } from "@tanstack/react-query";

export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["votes"],
    queryFn: () =>
      getAllVotes()
        .then((votes) => {
          setVotes(votes);
          console.log(`found ${votes.length} votes.`);
          return votes;
        })
        .catch(console.error),
  });

  // Load from IndexedDB on mount
  useEffect(() => {
    console.log("getting all votes...");
  }, []);

  /**
   * Handle voting
   */
  const handleVote = useCallback(
    async (itemId: string, vote: "like" | "dislike") => {
      addVote({
        itemId,
        vote,
        timestamp: new Date(),
      })
        .then((newVote) => {
          setVotes((prev) => [...prev, newVote]);
          return votes;
        })
        .catch(console.error);
    },
    []
  );

  return { votes, isLoading, handleVote };
}
