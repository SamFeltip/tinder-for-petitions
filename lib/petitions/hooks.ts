// lib/petitions/hooks.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getOpenPetitions, getPetitionById } from "./parlimentPetitionProvider";
import { VotingItem } from "@/types/voting";

export function useOpenPetitions(page: number) {
  return useQuery<VotingItem[]>({
    queryKey: ["petitions", "open", page],
    queryFn: () => getOpenPetitions(page),
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
