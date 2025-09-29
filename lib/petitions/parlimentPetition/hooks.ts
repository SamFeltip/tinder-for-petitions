// lib/petitions/hooks.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getOpenPetitions, getPetitionById } from "./votingItemProvider";
import { VotingItem } from "@/lib/petitions/voting";

export function useOpenPetitions() {
  return useQuery<VotingItem[]>({
    queryKey: ["petitions", "open"],
    queryFn: () => getOpenPetitions(),
    staleTime: 1000 * 60,
  });
}

export function usePetition(id: string) {
  return useQuery<VotingItem>({
    queryKey: ["petition", id],
    queryFn: () => getPetitionById(id),
    staleTime: 1000 * 60,
  });
}
